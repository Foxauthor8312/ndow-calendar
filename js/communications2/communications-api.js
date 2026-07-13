/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-api.js
 Layer       : Frontend API

 Purpose:
    Communications API interface.

 Responsibilities:
    • Load event roster
    • Load communication history
    • Load communication location
    • Send communications
    • Save attendance

 Used By:
    • communications-workspace.js
    • communications-attendance.js
==============================================================================
*/

'use strict';

import {

    API_BASE

}

from

'./communications-config.js';


/*===========================================================================
    HEADERS
===========================================================================*/

function headers(){

    return {

        ...authHeaders(),

        'Content-Type' : 'application/json'

    };

}


/*===========================================================================
    LOAD ROSTER
===========================================================================*/

export async function loadRoster(eventId){

    const response =

        await fetch(

            `${API_BASE}/communications/event/${eventId}/roster`,

            {

                headers:

                    headers()

            }

        );

    const result =

        await response.json();

    if(!response.ok){

        throw new Error(

            result.error ||

            'Unable to load roster.'

        );

    }

    return result.roster || [];

}


/*===========================================================================
    LOAD HISTORY
===========================================================================*/

export async function loadHistory(eventId){

    const response =

        await fetch(

            `${API_BASE}/communications/event/${eventId}/history`,

            {

                headers:

                    headers()

            }

        );

    const result =

        await response.json();

    if(!response.ok){

        throw new Error(

            result.error ||

            'Unable to load communication history.'

        );

    }

    return result.history || [];

}


/*===========================================================================
    SEND EMAIL
===========================================================================*/

export async function sendCommunication(payload){

    const response =

        await fetch(

            `${API_BASE}/communications/send`,

            {

                method : 'POST',

                headers : headers(),

                body : JSON.stringify(

                    payload

                )

            }

        );

    const result =

        await response.json();

    if(!response.ok){

        throw new Error(

            result.error ||

            'Unable to send communication.'

        );

    }

    return result;

}


/*===========================================================================
    SAVE ATTENDANCE
===========================================================================*/

export async function saveAttendance(

    eventId,

    roster

){

    const response =

        await fetch(

            `${API_BASE}/attendance/${eventId}`,

            {

                method : 'POST',

                headers : headers(),

                body : JSON.stringify({

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
