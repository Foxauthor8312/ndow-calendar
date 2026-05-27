const fs = require('fs');

const normalizeEvent =
  require('./lib/normalize-event');

const dedupeEvents =
  require('./lib/dedupe-events');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

let parsedEvents = [];

try {

  parsedEvents =
    JSON.parse(raw);

} catch(err){

  console.log(
    'FAILED TO PARSE all-events.txt'
  );

  console.log(err);

  process.exit(1);

}

const normalizedEvents =
  parsedEvents.map(
    normalizeEvent
  );

const dedupedEvents =
  dedupeEvents(
    normalizedEvents
  );

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
