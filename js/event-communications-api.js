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

    const result =
        await response.json();

    if(!response.ok){

        throw new Error(
            result.message
        );

    }

    return result;

}
