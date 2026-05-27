const fs = require('fs');

const normalizeEvent =
  require('./lib/normalize-event');

const dedupeEvents =
  require('./lib/dedupe-events');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

const parsedEvents =
  JSON.parse(raw);

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
