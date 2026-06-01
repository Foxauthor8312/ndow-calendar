console.log(
  'NORMALIZE LOADED'
);
const normalizeInstructors =
  require('./normalize-instructors');

const extractSourceId =
  require('./extract-source-id');

module.exports =
function normalizeEvent(event){

  const sourceId =
    event.id ||
    event.sourceId ||
    extractSourceId(
      event.url

      
    );

  const rawTitle =
    String(
      event.title || ''
    ).trim();

  const rawTime =
    String(
      event.time || ''
    ).trim();

  const rawLocation =
    String(
      event.location || ''
    ).trim();

  const fallbackDate =
    event.startDate ||
    event.start ||
    event.eventDate ||
    event.datetime ||
    '';

  const rawDate =
    String(
      event.date ||
      fallbackDate ||
      ''
    ).trim();

  let normalizedDate = '';

  if (rawDate) {

    const parsed =
      new Date(rawDate);

    if (
      !isNaN(parsed)
    ) {

      normalizedDate =
        parsed
          .toISOString()
          .split('T')[0];

    }

  }

  let cleanTitle =
    rawTitle;

  if (
    !normalizedDate &&
    rawTitle
  ) {

    const flattenedTitle =
      rawTitle
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const dateLineMatch =
      flattenedTitle.match(
        /Date\s*&\s*Times:\s*([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/i
      );

    if (dateLineMatch) {

      const parsed =
        new Date(
          dateLineMatch[1]
        );

      if (
        !isNaN(parsed)
      ) {

        normalizedDate =
          parsed
            .toISOString()
            .split('T')[0];

      }

    }

  }

 let extractedLocation =
  rawLocation;

let extractedTime =
  rawTime;

let instructors =
  normalizeInstructors(
    event.instructors
  );

if(rawTitle){

  if(!extractedLocation){

  const locationStart =
    rawTitle.indexOf('Location:');

  if(locationStart >= 0){

    let locationSection =
      rawTitle.substring(
        locationStart + 9
      );

    const taughtByPos =
      locationSection.indexOf(
        'Taught by:'
      );

    const datePos =
      locationSection.indexOf(
        'Date & Times:'
      );

    let endPos = -1;

    if(
      taughtByPos >= 0 &&
      datePos >= 0
    ){

      endPos =
        Math.min(
          taughtByPos,
          datePos
        );

    } else if(
      taughtByPos >= 0
    ){

      endPos =
        taughtByPos;

    } else if(
      datePos >= 0
    ){

      endPos =
        datePos;

    }

    if(endPos >= 0){

      locationSection =
        locationSection.substring(
          0,
          endPos
        );

    }

    extractedLocation =
      locationSection
        .replace(/\n+/g,' ')
        .replace(/\s+/g,' ')
        .trim();

  }

}

  if(!extractedTime){

    const timeMatch =
      rawTitle.match(
        /Date\s*&\s*Times:\s*([\s\S]*?)\s*View$/i
      );

    if(timeMatch){

      extractedTime =
        timeMatch[1]
          .replace(/\n+/g,' ')
          .replace(/\s+/g,' ')
          .trim();

    }

  }

  if(
    instructors.length === 0
  ){

    const taughtByMatch =
  rawTitle.match(
    /Taught by:\s*([\s\S]*?)(?:\s*Date\s*&\s*Times:|$)/i
  );

    if(
      taughtByMatch &&
      taughtByMatch[1]
    ){

      instructors = [
        {
          name:
            taughtByMatch[1]
              .replace(/\n+/g,' ')
              .replace(/\s+/g,' ')
              .trim(),

          role:'PRIMARY',
          email:''
        }

        
      ];

    }

  }

}

cleanTitle =
  cleanTitle
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

console.log(
  'NORMALIZED RESULT:',
  {
    id: sourceId,
    date: normalizedDate,
    location: extractedLocation,
    time: extractedTime,
    instructors:
      instructors.length
  }
);
  
  return {

    id:
      sourceId,

    sourceId,

    sourceUrl:
      event.sourceUrl ||
      event.url ||
      '',

    title:
      cleanTitle,

    category:
      event.category ||
      'Event',

    date:
      normalizedDate,

    time:
     extractedTime,

    location:
     extractedLocation,

    description:
  event.description ||
  (
    cleanTitle +
    ' - ' +
    extractedLocation
  ),

    url:
      event.url || '',

    instructors:
     instructors,

    enrichment:
      event.enrichment || {},

    metadata:
      event.metadata || {}

  };

};
