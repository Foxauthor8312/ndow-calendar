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

  return {

    id:
      sourceId,

    sourceId,

    sourceUrl:
      event.sourceUrl ||
      event.url ||
      '',

    title:
      event.title || '',

    category:
      event.category ||
      'Event',

    date:
      event.date || '',

    time:
      event.time || '',

    location:
      event.location || '',

    description:
      event.description ||
      event.text ||
      '',

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
