/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-reports.js
 Layer       : Reports Controller

 Purpose:
    Coordinates generation and preview of Event Reports.

 Responsibilities:
    • Load roster
    • Generate Attendance Roster
    • Open report preview
    • Print report

 Used By:
    • Event Details Modal

 Public Functions:
    • openAttendanceRoster(event)
==============================================================================
*/

'use strict';


/*=============================================================================
    Attendance Roster
=============================================================================*/

async function openAttendanceRoster(event){

    try{

        if(!event){

            throw new Error(
                'No event supplied.'
            );

        }

        console.log(
            'Generating Attendance Roster:',
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
            'Unable to generate attendance roster.'
        );

    }

}


/*=============================================================================
    Report Preview
=============================================================================*/

function showReportPreview(

    html,

    title

){

    const reportWindow =

        window.open(

            '',

            '_blank',

            'width=1100,height=900,resizable=yes,scrollbars=yes'

        );

    if(!reportWindow){

        alert(
            'Please allow popups to preview reports.'
        );

        return;

    }

    reportWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8">

<title>${title}</title>

<style>

body{

    margin:0;

    background:#E5E7EB;

    font-family:Arial,sans-serif;

}

.toolbar{

    position:sticky;

    top:0;

    background:#19304B;

    padding:12px;

    display:flex;

    gap:10px;

    z-index:999;

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

        0 2px 14px rgba(0,0,0,.20);

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

onclick="window.print()">

Print

</button>

<button

class="close"

onclick="window.close()">

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

    reportWindow.document.close();

}


/*=============================================================================
    Public Interface
=============================================================================*/

window.openAttendanceRoster =

    openAttendanceRoster;
