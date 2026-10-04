/*
=========================================================
USER PREFERENCES API
=========================================================
*/


/*
=========================================================
GET USER PREFERENCES
=========================================================
*/

async function fetchUserPreferences(){

  const apiUrl =
    'https://ndow-calendar-server.onrender.com/api/user-preferences';


  const token =
    localStorage.getItem('token');


  if(!token){

    throw new Error(
      'No authenticated session found.'
    );

  }


  const response =
    await fetch(
      apiUrl,
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

  const apiUrl =
    'https://ndow-calendar-server.onrender.com/api/user-preferences';


  const token =
    localStorage.getItem('token');


  if(!token){

    throw new Error(
      'No authenticated session found.'
    );

  }


  const response =
    await fetch(
      apiUrl,
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
