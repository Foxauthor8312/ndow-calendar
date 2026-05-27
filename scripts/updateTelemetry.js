const fs = require('fs');

const raw = fs.readFileSync(
  'all-events.txt',
  'utf8'
);

EVENT COUNT BEFORE DEDUPE
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

      metrics:{

        rawBlocks:
          parsed.length,

        skippedOldEvents:
          3,

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
