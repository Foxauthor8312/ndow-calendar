/*
==========================================================
 NDOW Volunteer Portal
 Communications API
==========================================================
*/

export async function saveAttendance(
    eventId,
    roster
){

    const response =
        await fetch(

            `${API_BASE}/attendance/${eventId}`,

            {

                method:'POST',

                headers:{

                    ...authHeaders(),

                    'Content-Type':
                        'application/json'

                },

                body:JSON.stringify({

                    roster

                })

            }

        );

    const result =
        await response.json();

    if(!response.ok){

        throw new Error(

            result.error ||

            'Unable to save attendance.'

        );

    }

    return result;

}
