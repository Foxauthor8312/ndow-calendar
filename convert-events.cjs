const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

const blocks = raw.split(
  '===================='
);

const events = [];

blocks.forEach(block => {

  const lines = block
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if(lines.length < 3) return;

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
    lines
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
  parsedDate < new Date('2026-01-01')
){

  console.log(
    'SKIPPED - OLD/INVALID DATE:',
    cleanDate,
    title
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

if(
  title.includes('Boulder')
  ||
  title.includes('Free Fishing')
){

  console.log(
    'CONVERTER DEBUG =====',
    {
      title,
      cleanDate,
      parsedDate,
      location,
      url,
      lines
    }
  );

}
const sourceId =
  url?.match(/\/(\d+)(?:\/)?$/)?.[1] || null;

if (!sourceId) {

  console.log(
    'SKIPPED EVENT (NO SOURCE ID):',
    title,
    url
  );

  return;
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

const dedupedEvents =
  Object.values(

    events.reduce((acc, event) => {

      if (!event.id) {
        return acc;
      }

      acc[event.id] = event;

      return acc;

    }, {})

  );


fs.writeFileSync(
  './events.json',
  JSON.stringify(
    {
      lastUpdated:
        new Date().toISOString(),
      events: dedupedEvents
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
