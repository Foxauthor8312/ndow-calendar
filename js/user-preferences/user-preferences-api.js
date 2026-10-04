/*
=========================================================
USER PREFERENCES API
=========================================================
*/

const USER_PREFERENCES_API =
  'https://ndow-calendar-server.onrender.com/api/user-preferences';


/*
=========================================================
GET USER PREFERENCES
=========================================================
*/

async function fetchUserPreferences(){

  const token =
    localStorage.getItem('token');


  if(!token){

    throw new Error(
      'No authenticated session found.'
    );

  }


  const response =
    await fetch(
      USER_PREFERENCES_API,
      {
        method: 'GET',

        headers: {

          'Content-Type':
            'application/json',

          'Authorization':
            `Bearer ${token}`

        }
      }
    );


  const result =
    await response.json();


  if(!response.ok){

    console.error(
      'Load preferences failed:',
      result
    );

    throw new Error(
      result.message ||
      `Unable to load user preferences (${response.status})`
    );

  }


  return result;

}


/*
=========================================================
SAVE USER PREFERENCES
=========================================================
*/

async function saveUserPreferences(
  preferences
){

  const token =
    localStorage.getItem('token');


  if(!token){

    throw new Error(
      'No authenticated session found.'
    );

  }


  const response =
    await fetch(
      USER_PREFERENCES_API,
      {
        method: 'PUT',

        headers: {

          'Content-Type':
            'application/json',

          'Authorization':
            `Bearer ${token}`

        },

        body:
          JSON.stringify(
            preferences
          )

      }
    );


  const result =
    await response.json();


  if(!response.ok){

    console.error(
      'Save preferences failed:',
      result
    );

    throw new Error(
      result.message ||
      `Unable to save user preferences (${response.status})`
    );

  }


  console.log(
    'User preferences API save:',
    result
  );


  return result;

}
