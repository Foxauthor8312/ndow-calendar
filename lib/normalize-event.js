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
    (
      event.title ||
      ''
    ).trim();

  const rawDate =
    (
      event.date ||
      ''
    ).trim();

  const rawTime =
    (
      event.time ||
      ''
    ).trim();

  const rawLocation =
    (
      event.location ||
      ''
    ).trim();

const fallbackDate =
  event.startDate ||
  event.start ||
  event.eventDate ||
  event.datetime ||
  '';

const rawDate =
  (
    event.date ||
    fallbackDate ||
    ''
  )
    .trim();

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
    rawTitle.includes('Date:') ||
    rawTitle.includes('Time:') ||
    rawTitle.includes('Location:')
  ) {

    const firstLine =
      rawTitle
        .split('\n')
        .map(l => l.trim())
        .find(l =>
          l &&
          !l.includes('Date:') &&
          !l.includes('Time:') &&
          !l.includes('Location:')
        );

    cleanTitle =
      firstLine ||
      rawTitle;
  }

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
      rawTime,

    location:
      rawLocation,

    description:
      event.description ||
      (
        cleanTitle +
        ' - ' +
        rawLocation
      ),

    url:
      event.url || '',

    instructors:
      normalizeInstructors(
        event.instructors
      ),

    enrichment:
      event.enrichment || {},

    metadata:
      event.metadata || {}

  };

};
