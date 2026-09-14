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

    try {

        const response =
            await fetch(
                `/api/event-roster/${eventId}`
            );

        if (!response.ok) {

            throw new Error(
                `Roster request failed (${response.status})`
            );

        }

        return await response.json();

    }

    catch (error) {

        console.error(
            'Roster Load Error:',
            error
        );

        return [];

    }

}

/**
 * ============================================================================
 * Add Manual Student
 * ============================================================================
 */

export async function addManualStudent(
    eventId,
    studentName,
    studentEmail
){

    try {

        const token =
            localStorage.getItem('token');

        const response =
            await fetch(
                `/api/event-communications/event-roster/${eventId}/student`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                              }
                            : {})
                    },

                    body: JSON.stringify({

                        studentName:
                            studentName.trim(),

                        studentEmail:
                            studentEmail.trim()

                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                `Unable to add student (${response.status})`
            );

        }

        return data.student;

    }

    catch (error) {

        console.error(
            'Manual Student Add Error:',
            error
        );

        throw error;

    }

}
