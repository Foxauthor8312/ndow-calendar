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
=========================================================
GET CURRENT PREFERENCES
=========================================================
*/

function getUserPreferences(){

  return {
    ...userPreferences
  };

}


/*
=========================================================
SET PREFERENCES
=========================================================
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
=========================================================
LOAD SAVED PREFERENCES
=========================================================
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
=========================================================
SAVE CURRENT PREFERENCES
=========================================================
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
=========================================================
UPDATE ONE PREFERENCE
=========================================================
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
=========================================================
UPDATE MULTIPLE PREFERENCES
=========================================================
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
=========================================================
CAPTURE CURRENT CALENDAR FILTERS
=========================================================
*/

function captureCalendarPreferences(){

  const region =
    document.getElementById(
      'regionFilter'
    )?.value || 'ALL';


  const needHoursOnly =
    document.getElementById(
      'needHoursOnly'
    )?.checked === true;


  const myEventsOnly =
    document.getElementById(
      'myEventsOnly'
    )?.checked === true;


  const filters =
    Array.isArray(activeFilters)
      ? [...activeFilters]
      : [];


  userPreferences.region =
    region;

  userPreferences.need_hours_only =
    needHoursOnly;

  userPreferences.my_events_only =
    myEventsOnly;

  userPreferences.active_filters =
    filters;


  /*
  -----------------------------------------------
  Calendar position
  -----------------------------------------------
  */

  if(
    currentDate instanceof Date
  ){

    userPreferences.calendar_year =
      currentDate.getFullYear();

    userPreferences.calendar_month =
      currentDate.getMonth();

  }

}


/*
=========================================================
SAVE CURRENT CALENDAR FILTERS
=========================================================
*/

async function saveCalendarPreferences(){

  captureCalendarPreferences();

  await persistUserPreferences();

}


/*
=========================================================
APPLY SAVED CALENDAR FILTERS
=========================================================
*/

function applyCalendarPreferences(){

  /*
  -----------------------------------------------
  Region
  -----------------------------------------------
  */

  const regionFilter =
    document.getElementById(
      'regionFilter'
    );


  if(regionFilter){

    regionFilter.value =
      userPreferences.region || 'ALL';

  }


  /*
  -----------------------------------------------
  Existing region state
  -----------------------------------------------
  */

  activeRegion =
    userPreferences.region || 'ALL';


  /*
  -----------------------------------------------
  Need Hours
  -----------------------------------------------
  */

  const needHours =
    document.getElementById(
      'needHoursOnly'
    );


  if(needHours){

    needHours.checked =
      userPreferences.need_hours_only === true;

  }


  /*
  -----------------------------------------------
  My Events
  -----------------------------------------------
  */

  const myEvents =
    document.getElementById(
      'myEventsOnly'
    );


  if(myEvents){

    myEvents.checked =
      userPreferences.my_events_only === true;

  }


  /*
  -----------------------------------------------
  Existing category filters
  -----------------------------------------------
  */

  activeFilters =
    Array.isArray(
      userPreferences.active_filters
    )
      ? [...userPreferences.active_filters]
      : [];


  /*
  -----------------------------------------------
  Restore calendar position
  -----------------------------------------------
  */

  if(
    Number.isInteger(
      userPreferences.calendar_year
    ) &&
    Number.isInteger(
      userPreferences.calendar_month
    )
  ){

    currentDate =
      new Date(
        userPreferences.calendar_year,
        userPreferences.calendar_month,
        1
      );

  }


  /*
  -----------------------------------------------
  Restore legend appearance
  -----------------------------------------------
  */

  document
    .querySelectorAll(
      '.legend-item'
    )
    .forEach(item => {

      item.classList.remove(
        'active-filter'
      );


      const label =
        item.innerText.trim();


      if(
        activeFilters.includes(label)
      ){

        item.classList.add(
          'active-filter'
        );

      }

    });

}


/*
=========================================================
RESET LOCAL PREFERENCE STATE
=========================================================
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
=========================================================
PUBLIC ACCESS
=========================================================
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

window.captureCalendarPreferences =
  captureCalendarPreferences;

window.saveCalendarPreferences =
  saveCalendarPreferences;

window.applyCalendarPreferences =
  applyCalendarPreferences;

window.resetUserPreferences =
  resetUserPreferences;
