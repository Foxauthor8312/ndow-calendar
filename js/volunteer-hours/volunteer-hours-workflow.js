//==================================================
// Volunteer Hours Workflow
//==================================================

let pendingHours = [];


//--------------------------------------------------
// Build Pending Hours List
//--------------------------------------------------

export async function buildPendingHours(events) {

    pendingHours = [];

    const token =
        localStorage.getItem('token');

    const response =
        await fetch(

'https://ndow-calendar-server.onrender.com/api/hours/my-hours',

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    if (!response.ok) {

        throw new Error(
            'Unable to load volunteer hours.'
        );

    }

    const submittedHours =
        await response.json();

    const submittedEventIds =
        new Set(
            submittedHours.map(
                row => Number(row.event_id)
            )
        );

    console.log(
        'Submitted Hours:',
        submittedEventIds.size
    );

    // Build pending list (comparison logic comes next)

}


//--------------------------------------------------
// Refresh Pending Hours
//--------------------------------------------------

export async function refreshPendingHours() {

    return buildPendingHours();

}


//--------------------------------------------------
// Get Pending Hours
//--------------------------------------------------

export function getPendingHours() {

    return pendingHours;

}


//--------------------------------------------------
// Get Pending Hours Count
//--------------------------------------------------

export function getPendingHoursCount() {

    return pendingHours.length;

}
