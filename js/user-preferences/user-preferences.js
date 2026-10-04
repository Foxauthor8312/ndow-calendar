/*
=========================================================
USER PREFERENCES MANAGER
=========================================================
*/

let userPreferences = {

  region: 'ALL',

  need_hours_only: false,

  my_events_only: false,

  active_filters: [],

  calendar_year: null,

  calendar_month: null

};


/*
---------------------------------------------------------
GET CURRENT PREFERENCES
---------------------------------------------------------
*/

function getUserPreferences(){

  return {
    ...userPreferences
  };

}


/*
---------------------------------------------------------
SET PREFERENCES
---------------------------------------------------------
*/

function setUserPreferences(
  preferences
){

  if(!preferences){
    return;
  }


  userPreferences = {

    region:
      typeof preferences.region === 'string'
        ? preferences.region
        : 'ALL',

    need_hours_only:
      preferences.need_hours_only === true,

    my_events_only:
      preferences.my_events_only === true,

    active_filters:
      Array.isArray(
        preferences.active_filters
      )
        ? [...preferences.active_filters]
        : [],

    calendar_year:
      Number.isInteger(
        preferences.calendar_year
      )
        ? preferences.calendar_year
        : null,

    calendar_month:
      Number.isInteger(
        preferences.calendar_month
      )
        ? preferences.calendar_month
        : null

  };

}


/*
---------------------------------------------------------
LOAD SAVED PREFERENCES
---------------------------------------------------------
*/

async function loadUserPreferences(){

  try{

    const result =
      await fetchUserPreferences();


    if(
      result &&
      result.success &&
      result.preferences
    ){

      setUserPreferences(
        result.preferences
      );

      console.log(
        'User preferences loaded:',
        userPreferences
      );

      return userPreferences;

    }


    console.log(
      'No saved user preferences found.'
    );

  }
  catch(error){

    console.error(
      'Unable to load user preferences:',
      error
    );

  }


  return userPreferences;

}


/*
---------------------------------------------------------
SAVE CURRENT PREFERENCES
---------------------------------------------------------
*/

async function persistUserPreferences(){

  try{

    const result =
      await saveUserPreferences(
        getUserPreferences()
      );


    if(
      result &&
      result.success
    ){

      console.log(
        'User preferences saved.'
      );

    }

  }
  catch(error){

    console.error(
      'Unable to save user preferences:',
      error
    );

  }

}


/*
---------------------------------------------------------
UPDATE ONE PREFERENCE
---------------------------------------------------------
*/

async function updateUserPreference(
  key,
  value
){

  if(
    !Object.prototype.hasOwnProperty.call(
      userPreferences,
      key
    )
  ){

    console.warn(
      `Unknown user preference: ${key}`
    );

    return;

  }


  userPreferences[key] =
    value;


  await persistUserPreferences();

}


/*
---------------------------------------------------------
UPDATE MULTIPLE PREFERENCES
---------------------------------------------------------
*/

async function updateUserPreferences(
  updates
){

  if(
    !updates ||
    typeof updates !== 'object'
  ){

    return;

  }


  Object.keys(updates)
    .forEach(
      key => {

        if(
          Object.prototype.hasOwnProperty.call(
            userPreferences,
            key
          )
        ){

          userPreferences[key] =
            updates[key];

        }

      }
    );


  await persistUserPreferences();

}


/*
---------------------------------------------------------
RESET LOCAL PREFERENCE STATE
---------------------------------------------------------
*/

function resetUserPreferences(){

  userPreferences = {

    region: 'ALL',

    need_hours_only: false,

    my_events_only: false,

    active_filters: [],

    calendar_year: null,

    calendar_month: null

  };

}


/*
---------------------------------------------------------
PUBLIC ACCESS
---------------------------------------------------------
*/

window.getUserPreferences =
  getUserPreferences;

window.setUserPreferences =
  setUserPreferences;

window.loadUserPreferences =
  loadUserPreferences;

window.persistUserPreferences =
  persistUserPreferences;

window.updateUserPreference =
  updateUserPreference;

window.updateUserPreferences =
  updateUserPreferences;

window.resetUserPreferences =
  resetUserPreferences;
