module.exports =
function normalizeInstructors(
  instructors
){

  if(!Array.isArray(instructors)){

    return [];

  }

  return instructors.map(i => ({

    name:
      i.name || '',

    role:
      i.role || '',

    email:
      i.email || '',

    customerId:
      i.customerId || '',

    bio:
      i.bio || '',

    image:
      i.image || '',

    specialties:
      Array.isArray(
        i.specialties
      )
        ? i.specialties
        : [],

    links:
      i.links || {},

    enrichment:
      i.enrichment || {}

  }));

};
