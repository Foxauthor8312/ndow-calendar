const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

const parsed =
  JSON.parse(raw);

console.log(
  'RAW EVENT COUNT:',
  parsed.length
);

const events = [];

parsed.forEach(event => {

  if(
    !event.url
  ){

    console.log(
      'SKIPPED EVENT (NO URL):',
      event.title
    );

    return;

  }

  const cleanDate =
  (event.date || '').trim();

if(!cleanDate){

  console.log(
    'SKIPPED - NO DATE:',
    event.title
  );

  return;

}

  if(
    parsedDate < new Date('2026-01-01')
  ){

    console.log(
      'SKIPPED - OLD DATE:',
      {
        title: event.title,
        cleanDate
      }
    );

    return;

  }

  const sourceId =
    event.url?.match(
      /\/(\d+)(?:\/)?$/
    )?.[1]
    ||
    `fallback_${events.length}`;

  events.push({

    id: sourceId,

    sourceId,

    sourceUrl:
      event.url,

    title:
      event.title || '',

    category:
      event.category || 'Event',

    date:
      event.date || '',

    time:
      event.time || '',

    location:
      event.location || '',

    description:
      event.description || '',

    url:
      event.url,

    instructors:
      event.instructors || [],

    enrichment:
      event.enrichment || {}

  });

});

console.log(
  'EVENT COUNT BEFORE DEDUPE:',
  events.length
);

const dedupedEvents =
  Object.values(

    events.reduce((acc, event) => {

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
            id: event.id,
            title: event.title
          }
        );

      }

      acc[event.id] = event;

      return acc;

    }, {})

  );

console.log(
  'FINAL DEDUPED COUNT:',
  dedupedEvents.length
);

fs.writeFileSync(
  './events.json',

  JSON.stringify(
    {
      lastUpdated:
        new Date().toISOString(),

      metrics: {

        rawBlocks:
          parsed.length,

        skippedOldEvents:
          0,

        invalidEvents:
          0,

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
