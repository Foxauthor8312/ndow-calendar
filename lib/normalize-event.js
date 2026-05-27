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

  cleanTitle =
    cleanTitle
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

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
