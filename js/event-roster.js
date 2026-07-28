/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-roster.js
 Layer       : Shared Data Service

 Purpose:
    Loads event roster information from the server.

 Responsibilities:
    • Retrieve student roster
    • Return roster data
    • No UI rendering

 Used By:
    • Communications Workspace
    • Event Reports
    • Future Attendance Tools
==============================================================================
*/

'use strict';

/**
 * ============================================================================
 * Load Event Roster
 * ============================================================================
 */

export async function loadEventRoster(eventId){

    try{

        const response =
            await fetch(
                `/api/event-roster/${eventId}`
            );

        if(!response.ok){

            throw new Error(
                `Roster request failed (${response.status})`
            );

        }

        return await response.json();

    }

    catch(error){

        console.error(
            'Failed to load event roster:',
            error
        );

        return [];

    }

}

/**
 * ============================================================================
 * Legacy Renderer
 *
 * Temporary compatibility wrapper.
 * Can be removed after Communications migrates.
 * ============================================================================
 */

export async function displayEventRoster(
    eventId
){

    const students =
        await loadEventRoster(
            eventId
        );

    renderEventRoster(
        students
    );

}

/**
 * ============================================================================
 * Default Renderer
 * ============================================================================
 */

function renderEventRoster(
    students = []
){

    console.log(
        'Roster:',
        students
    );

}
