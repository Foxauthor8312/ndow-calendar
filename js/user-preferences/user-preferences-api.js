/*
=========================================================
USER PREFERENCES API
=========================================================
*/

const USER_PREFERENCES_API =
  `${API_BASE_URL}/api/user-preferences`;


/*
---------------------------------------------------------
LOAD USER PREFERENCES
---------------------------------------------------------
*/

async function fetchUserPreferences(){

  const response =
    await fetch(
      USER_PREFERENCES_API,
      {
        method: 'GET',
        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );


  if(!response.ok){

    throw new Error(
      `Unable to load user preferences (${response.status})`
    );

  }


  return await response.json();

}


/*
---------------------------------------------------------
SAVE USER PREFERENCES
---------------------------------------------------------
*/

async function saveUserPreferences(
  preferences
){

  const response =
    await fetch(
      USER_PREFERENCES_API,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        },

        body:
          JSON.stringify(
            preferences
          )
      }
    );


  if(!response.ok){

    throw new Error(
      `Unable to save user preferences (${response.status})`
    );

  }


  return await response.json();

}
