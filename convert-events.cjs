const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

let parsedEvents = [];

//
// STRUCTURED PARSE FIRST
//

try {

  parsedEvents = JSON.parse(raw);

  console.log(
    'Structured events loaded:',
    parsedEvents.length
  );

} catch(err) {

  console.log(
    'Structured parse failed.'
  );

  console.log(
    'Falling back to legacy parser...'
  );

  parsedEvents =
    parseLegacyBlocks(raw);

}

//
// NORMALIZE
//

const normalizedEvents =
  parsedEvents
    .map(normalizeEvent)
    .filter(Boolean);

console.log(
  'EVENT COUNT BEFORE DEDUPE:',
  normalizedEvents.length
);

//
// DEDUPE
//

const dedupedEvents =
  Object.values(

    normalizedEvents.reduce(
      (acc, event) => {

        if(!event.id){

          console.log(
            'DEDUPE SKIP - NO ID:',
            event
          );

          return acc;

        }

        if(acc[event.id]){

          console.log(
            'DUPLICATE EVENT ID:',
            {
              id:event.id,
              title:event.title
            }
          );

        }

        acc[event.id] = event;

        return acc;

      },
      {}
    )

  );

console.log(
  'FINAL DEDUPED COUNT:',
  dedupedEvents.length
);

//
// OUTPUT
//

fs.writeFileSync(
  './events.json',

  JSON.stringify(
    {
      lastUpdated:
        new Date().toISOString(),

      metrics: {

        finalEvents:
          dedupedEvents.length

      },

      events:
        dedupedEvents

    },

    null,
    2
  )
);

console.log(
  'Created events.json with',
  dedupedEvents.length,
  'events'
);

//
// NORMALIZATION
//

function normalizeEvent(event){

  if(!event){

    return null;

  }

  const sourceId =
    event.id ||
    event.sourceId ||
    extractSourceId(event.url);

  const text =
    event.text || '';

  return {

    id:
      sourceId,

    sourceId,

    sourceUrl:
      event.sourceUrl ||
      event.url ||
      '',

    title:
      event.title ||
      extractTitle(text),

    category:
      event.category ||
      'Event',

    date:
      event.date ||
      extractDate(text),

    time:
      event.time ||
      extractTime(text),

    location:
      event.location ||
      extractLocation(text),

    description:
      event.description ||
      text,

    url:
      event.url || '',

    //
    // PRESERVE INSTRUCTORS
    //

    instructors:
      normalizeInstructors(
        event.instructors
      ),

    //
    // PRESERVE ENRICHMENT
    //

    enrichment:
      event.enrichment || {},

    //
    // PRESERVE RAW TEXT
    //

    rawText:
      text,

    //
    // FUTURE SAFE
    //

    metadata:
      event.metadata || {}

  };

}

//
// INSTRUCTORS
//

function normalizeInstructors(instructors){

  if(
    !Array.isArray(instructors)
  ){

    return [];

  }

  return instructors.map(i => ({

    name:
      i.name || '',

    role:
      i.role || '',

    email:
      i.email || '',

    bio:
      i.bio || '',

    image:
      i.image || '',

    specialties:
      Array.isArray(
        i.specialties
      )
        ? i.specialties
        : [],

    links:
      i.links || {},

    enrichment:
      i.enrichment || {}

  }));

}

//
// LEGACY PARSER
//

function parseLegacyBlocks(raw){

  const blocks = raw.split(
    '===================='
  );

  console.log(
    'RAW BLOCK COUNT:',
    blocks.length
  );

  const events = [];

  blocks.forEach((block, index) => {

    const lines =
      block
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

    if(lines.length < 3){

      console.log(
        'SKIPPED - TOO FEW LINES:',
        index
      );

      return;

    }

    const title =
      lines.find(line =>

        !line.includes('Date') &&
        !line.includes('URL:') &&
        !line.includes('NV') &&
        line.length > 5

      ) || '';

    let location = '';
    let dateLine = '';

    lines.forEach((line, idx) => {

      if(
        line.includes('NV')
      ){
        location = line;
      }

      if(
        line
          .toLowerCase()
          .includes('date')
      ){

        dateLine =
          lines[idx + 1] || '';

      }

    });

    if(!dateLine){

      console.log(
        'SKIPPED - NO DATE:',
        {
          title
        }
      );

      return;

    }

    const cleanDate =
      dateLine
        .replace('PST', '')
        .replace('PDT', '')
        .replace('MDT', '')
        .trim();

    const urlLine =
      lines.find(
        line =>
          line.startsWith('URL:')
      );

    const url =
      urlLine
        ? urlLine
            .replace('URL:', '')
            .trim()
        : '';

    const sourceId =
      extractSourceId(url);

    events.push({

      id:
        sourceId,

      sourceId,

      sourceUrl:
        url,

      title,

      category:
        'Event',

      date:
        cleanDate,

      location,

      description:
        title + ' - ' + location,

      url,

      instructors: [],

      enrichment: {},

      rawText:
        block

    });

  });

  return events;

}

//
// HELPERS
//

function extractSourceId(url){

  if(!url){

    return (
      'fallback_' +
      Math.random()
        .toString(36)
        .slice(2)
    );

  }

  return (
    url.match(
      /\/(\d+)(?:\/)?$/
    )?.[1]
    ||
    (
      'fallback_' +
      Math.random()
        .toString(36)
        .slice(2)
    )
  );

}

function extractTitle(text){

  if(!text){

    return '';

  }

  const lines =
    text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

  return (
    lines.find(line =>

      !line.includes('Date') &&
      !line.includes('NV') &&
      line.length > 5

    ) || ''
  );

}

function extractDate(text){

  if(!text){

    return '';

  }

  const lines =
    text
      .split('\n')
      .map(l => l.trim());

  for(let i = 0; i < lines.length; i++){

    const line =
      lines[i];

    if(
      line
        .toLowerCase()
        .includes('date')
    ){

      return (
        lines[i + 1] || ''
      );

    }

  }

  return '';

}

function extractTime(text){

  const date =
    extractDate(text);

  if(!date){

    return '';

  }

  return date
    .replace(/^.*?\d{4}/, '')
    .trim();

}

function extractLocation(text){

  if(!text){

    return '';

  }

  const lines =
    text
      .split('\n')
      .map(l => l.trim());

  return (
    lines.find(
      line =>
        line.includes('NV')
    ) || ''
  );

}
