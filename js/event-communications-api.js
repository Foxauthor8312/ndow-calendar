/*
==============================================================================
 NDOW Volunteer Portal
 Event Communications API
------------------------------------------------------------------------------
 Handles all server communication for the Event Communications module.
==============================================================================
*/

const API =
    'https://ndow-calendar-server.onrender.com/api';

/*
==============================================================================
 Load Event Roster
==============================================================================
*/

export async function loadEventRoster(eventId){

    const token =
        localStorage.getItem('token');

    const response =
        await fetch(

            `${API}/event-communications/event-roster/${eventId}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );

    const result =
        await response.json();

    if(!response.ok){

        throw new Error(
            result.message ||
            'Unable to load roster.'
        );

    }

    return result.data || [];

}

/*
==============================================================================
 Send Communication
==============================================================================
*/

export async function sendCommunicationRequest(payload){

    const token =
        localStorage.getItem('token');

    const response =
        await fetch(

            `${API}/event-communications/send`,

            {

                method:'POST',

                headers:{

                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${token}`

                },

                body:
                    JSON.stringify(payload)

            }

        );

    const text =
        await response.text();

    console.log(
        'Send response:',
        text
    );

    if(!response.ok){

        throw new Error(
            text
        );

    }

    return JSON.parse(text);

}

/*
==============================================================================
 Save Attendance
==============================================================================
*/

export async function saveAttendanceRequest(
    eventId,
    roster
){

    const token =
        localStorage.getItem('token');

    const response =
        await fetch(

            `${API}/event-communications/attendance/${eventId}`,

            {

                method:'POST',

                headers:{

                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${token}`

                },

                body:
                    JSON.stringify({

                        roster

                    })

            }

        );

    const result =
        await response.json();

    if(!response.ok){

        throw new Error(

            result.message ||

            'Unable to save attendance.'

        );

    }

    return result;

}
