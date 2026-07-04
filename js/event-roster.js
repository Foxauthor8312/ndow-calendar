/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-roster.js
 Description : Event roster display module.
==============================================================================
*/

'use strict';

async function loadEventRoster(eventId) {

    try {

        const response =
            await fetch(
                `/api/event-roster/${eventId}`
            );

        const students =
            await response.json();

        renderEventRoster(
            students
        );

    }

    catch (error) {

        console.error(
            error
        );

    }

}

function renderEventRoster(
    students
) {

    console.log(
        students
    );

}
