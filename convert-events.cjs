const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

const blocks = raw.split(
  '===================='
);

console.log(
  'RAW BLOCK COUNT:',
  blocks.length
);

const events = [];

blocks.forEach((block, index) => {

  const lines = block
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

  lines.forEach((line, index) => {

    if(
      line.includes('NV')
    ){
      location = line;
    }

    if(
      line.toLowerCase().includes('date')
    ){
      dateLine =
        lines[index + 1] || '';
    }

  });

  if(!dateLine){

    console.log(
      'SKIPPED - NO DATE:',
      {
        title,
        lines
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

  const parsedDate =
    new Date(cleanDate);

  if(
    isNaN(parsedDate.getTime())
  ){

    console.log(
      'SKIPPED - INVALID DATE:',
      {
        title,
        cleanDate
      }
    );

    return;

  }

  if(
    parsedDate < new Date('2026-01-01')
  ){

    console.log(
      'SKIPPED - OLD DATE:',
      {
        title,
        cleanDate
      }
    );

    return;

  }

  const urlLine = lines.find(
    line => line.startsWith('URL:')
  );

  const url =
    urlLine
      ? urlLine.replace('URL:', '').trim()
      : '';

  if(!url){

    console.log(
      'SKIPPED EVENT (NO URL):',
      title
    );

    return;

  }

  const sourceId =
    url?.match(/\/(\d+)(?:\/)?$/)?.[1]
    ||
    `fallback_${events.length}`;

  if(
    sourceId.startsWith(
      'fallback_'
    )
  ){

    console.log(
      'FALLBACK SOURCE ID USED:',
      {
        title,
        url
      }
    );

  }

  events.push({

    id: sourceId,

    sourceId,

    sourceUrl: url,

    title,

    category: 'Event',

    date:
      cleanDate.split(' ')[0] + ' ' +
      cleanDate.split(' ')[1] + ' ' +
      cleanDate.split(' ')[2],

    time:
      cleanDate.replace(
        /^.*?\d{4}/,
        ''
      ).trim(),

    location,

    description:
      title + ' - ' + location,

    url

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
            id:event.id,
            title:event.title
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
