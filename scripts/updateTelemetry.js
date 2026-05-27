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

const events =
  parsed.map((event, index) => {

    const sourceId =

      event.id ||

      event.sourceId ||

      event.url?.match(
        /\/(\d+)(?:\/)?$/
      )?.[1]

      ||

      `fallback_${index}`;

    return {

      id:
        sourceId,

      sourceId:
        sourceId,

      sourceUrl:
        event.sourceUrl ||
        event.url ||
        '',

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
        event.url || '',

      instructors:
        Array.isArray(
          event.instructors
        )
          ? event.instructors
          : [],

      enrichment:
        event.enrichment || {},

      metadata:
        event.metadata || {},

      region:
        event.region || '',

      county:
        event.county || '',

      city:
        event.city || '',

      zip:
        event.zip || ''

    };

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

      acc[event.id] =
        event;

      return acc;

    }, {})

  );

console.log(
  'FINAL DEDUPED COUNT:',
  dedupedEvents.length
);

console.log(
  'FINAL EVENTS SAMPLE:',
  dedupedEvents.slice(0,3)
);

console.log(
  'FINAL EVENT COUNT:',
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
