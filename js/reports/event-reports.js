/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-reports.js
 Layer       : Reports Controller

 Purpose:
    Coordinates generation of event reports.

 Responsibilities:
    • Validate event
    • Load roster
    • Generate report
    • Display report preview

 Used By:
    • Event Details
==============================================================================

 Future Reports
 ------------------------------------------------------------------------------
 • Attendance Roster
 • Instructor Time Report
 • Equipment Checklist
 • Student Sign-In Sheet
 • Event Summary
==============================================================================
*/

'use strict';

import {
    renderEventAttendanceRoster
}
from './event-attendance-roster.js';

import {
    loadEventRoster
}
from '../event-roster.js';


/*=============================================================================
    Public API
=============================================================================*/

/**
 * Generate and display the Event Attendance Roster.
 */
export async function openAttendanceRoster(event){

    try{

        if(!event){

            throw new Error(
                'No event supplied.'
            );

        }

        console.log(
            'Generating Attendance Roster',
            event.id
        );

        const roster =
            await loadEventRoster(
                event.id
            );

        const instructors =
            Array.isArray(
                event.instructors
            )
            ? event.instructors
            : [];

        const html =
            renderEventAttendanceRoster(

                event,

                instructors,

                roster

            );

        openReportPreview(
            html,
            `Attendance Roster - Event ${event.id}`
        );

    }

    catch(error){

        console.error(
            'Attendance Report',
            error
        );

        alert(
            'Unable to generate the attendance roster.'
        );

    }

}


/*=============================================================================
    Preview Window
=============================================================================*/

function openReportPreview(
    html,
    title='Report'
){

    const win =
        window.open(
            '',
            '_blank',
            'width=1100,height=900'
        );

    if(!win){

        alert(
            'Popup blocker prevented the report preview.'
        );

        return;

    }

    win.document.open();

    win.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8">

<title>${title}</title>

<style>

html,
body{

    margin:0;
    padding:0;
    background:#E5E7EB;
    font-family:Arial,sans-serif;

}

.toolbar{

    position:sticky;
    top:0;

    display:flex;
    gap:10px;

    padding:12px;

    background:#19304B;

    border-bottom:1px solid #102335;

    z-index:1000;

}

.toolbar button{

    padding:10px 18px;

    border:none;

    border-radius:6px;

    cursor:pointer;

    font-weight:600;

}

.print{

    background:#589FD6;
    color:white;

}

.close{

    background:#DC2626;
    color:white;

}

.page{

    display:flex;
    justify-content:center;

    padding:24px;

}

.report{

    background:white;

    box-shadow:
        0 3px 15px rgba(0,0,0,.20);

}

</style>

</head>

<body>

<div class="toolbar">

<button
class="print"
onclick="window.print();">

Print

</button>

<button
class="close"
onclick="window.close();">

Close

</button>

</div>

<div class="page">

<div class="report">

${html}

</div>

</div>

</body>

</html>

`);

    win.document.close();

}
