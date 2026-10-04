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

  const regionFilter =
    document.getElementById(
      'regionFilter'
    );


  if(regionFilter){

    regionFilter.value =
      userPreferences.region || 'ALL';

  }


  activeRegion =
    userPreferences.region || 'ALL';


  const needHours =
    document.getElementById(
      'needHoursOnly'
    );


  if(needHours){

    needHours.checked =
      userPreferences.need_hours_only === true;

  }


  const myEvents =
    document.getElementById(
      'myEventsOnly'
    );


  if(myEvents){

    myEvents.checked =
      userPreferences.my_events_only === true;

  }


  activeFilters =
    Array.isArray(
      userPreferences.active_filters
    )
      ? [...userPreferences.active_filters]
      : [];


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
CHECKBOX PREFERENCE LISTENERS
=========================================================
*/

function initializeUserPreferenceListeners(){

  const needHours =
    document.getElementById(
      'needHoursOnly'
    );


  const myEvents =
    document.getElementById(
      'myEventsOnly'
    );


  if(needHours){

    needHours.addEventListener(
      'change',
      () => {

        saveCalendarPreferences();

      }
    );

  }


  if(myEvents){

    myEvents.addEventListener(
      'change',
      () => {

        saveCalendarPreferences();

      }
    );

  }

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

window.captureCalendarPreferences =
  captureCalendarPreferences;

window.saveCalendarPreferences =
  saveCalendarPreferences;

window.applyCalendarPreferences =
  applyCalendarPreferences;

window.initializeUserPreferenceListeners =
  initializeUserPreferenceListeners;

window.resetUserPreferences =
  resetUserPreferences;
