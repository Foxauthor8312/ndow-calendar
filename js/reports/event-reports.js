/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-reports.js
 Layer       : Reports Controller

 Purpose:
    Coordinates generation and preview of Event Reports.

 Responsibilities:
    • Load event data
    • Load roster
    • Generate reports
    • Display report preview
    • Print reports

 Used By:
    • Communications Workspace

 Public Functions:
    • openAttendanceRoster()
==============================================================================
*/

'use strict';

import { renderEventAttendanceRoster }
from './event-attendance-roster.js';

import { loadEventRoster }
from '../communications2/communications-api.js';

/**
 * ============================================================================
 * Attendance Roster
 * ============================================================================
 */

export async function openAttendanceRoster(event){

    try{

        if(!event){

            throw new Error(
                'No event supplied.'
            );

        }

        console.log(
            'Generating Attendance Roster...',
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

        showReportPreview(

            html,

            `Attendance Roster - Event ${event.id}`

        );

    }

    catch(error){

        console.error(
            'Attendance Report Error:',
            error
        );

        alert(
            'Unable to generate Attendance Roster.'
        );

    }

}

/**
 * ============================================================================
 * Report Preview Window
 * ============================================================================
 */

function showReportPreview(

    html,

    title

){

    const preview =

        window.open(

            '',

            '_blank',

            'width=1100,height=900,resizable=yes,scrollbars=yes'

        );

    if(!preview){

        alert(
            'Please allow popups to preview reports.'
        );

        return;

    }

    preview.document.write(`

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
    background:#E8EDF3;
    font-family:Arial,Helvetica,sans-serif;

}

.toolbar{

    position:sticky;
    top:0;

    display:flex;
    gap:10px;

    padding:12px 16px;

    background:#19304B;

    box-shadow:
        0 2px 8px rgba(0,0,0,.20);

    z-index:1000;

}

.toolbar button{

    border:none;

    border-radius:6px;

    padding:10px 18px;

    cursor:pointer;

    font-size:14px;

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
        0 3px 16px rgba(0,0,0,.20);

}

@media print{

    .toolbar{

        display:none;

    }

    body{

        background:white;

    }

    .page{

        padding:0;

    }

    .report{

        box-shadow:none;

    }

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

    preview.document.close();

}

