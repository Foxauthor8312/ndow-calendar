/*
==============================================================================
 NDOW Volunteer Portal
 Event Attendance Roster
------------------------------------------------------------------------------
 Module      : event-attendance-roster.js
 Layer       : Report Renderer

 Purpose:
    Generates the printable Event Attendance Roster.

 Responsibilities:
    • Render report header
    • Render event information
    • Render instructor section
    • Render student roster
    • Render attendance summary
    • Render report footer
    • Render continuation page

 Used By:
    • Event Reports
==============================================================================*/

'use strict';

/**
 * ============================================================================
 * Public Entry Point
 * ============================================================================
 */
export function renderEventAttendanceRoster(
    event,
    instructors = [],
    roster = []
){

    return renderReport(
        event,
        instructors,
        roster
    );

}


/**
 * ============================================================================
 * Main Report
 * ============================================================================
 */
function renderReport(
    event,
    instructors,
    roster
){

    return `

<style>

@page{
    size:Letter portrait;
    margin:.50in;
}

body{
    margin:0;
    font-family:Arial,Helvetica,sans-serif;
    color:#19304B;
    background:white;
    font-size:12px;
}

.event-report{
    width:100%;
}

.page-break{
    page-break-before:always;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,
td{
    border:1px solid #C7D3DF;
    padding:6px;
    vertical-align:top;
}

th{
    background:#F4F7FA;
}

.section-title{
    margin:18px 0 8px;
    font-size:15px;
    font-weight:bold;
    color:#19304B;
}

.value{
    font-weight:600;
}

</style>

<div class="event-report">

    ${renderHeader()}

    ${renderEventInformation(event)}

    ${renderInstructorSection(instructors)}

    ${renderStudentRoster(roster)}

    ${renderAttendanceSummary(roster)}

    ${renderFooter(event)}

</div>

<div class="page-break"></div>

<div class="event-report">

    ${renderContinuationHeader()}

    ${renderNotesPage(event)}

    ${renderFooter(event)}

</div>

`;

}

/**
 * ============================================================================
 * Report Header
 * ============================================================================
 */
function renderHeader(){

    return `

<div style="
    display:flex;
    align-items:center;
    margin-bottom:20px;
">

    <div style="
        width:90px;
    ">

        <img
            src="ndow-logo.png"
            alt="NDOW"
            style="
                width:80px;
                height:auto;
            "
        >

    </div>

    <div style="
        flex:1;
        text-align:center;
    ">

        <div style="
            font-size:20px;
            font-weight:bold;
            color:#19304B;
        ">
            Nevada Department of Wildlife
        </div>

        <div style="
            font-size:14px;
            margin-top:4px;
        ">
            Volunteer Instructor Program
        </div>

        <div style="
            margin-top:12px;
            font-size:24px;
            font-weight:bold;
            letter-spacing:1px;
        ">
            EVENT ATTENDANCE ROSTER
        </div>

    </div>

</div>

`;

}

/**
 * ============================================================================
 * Continuation Header (Page 2)
 * ============================================================================
 */
function renderContinuationHeader(){

    return `

<div style="
    border-top:1px solid #19304B;
    padding-bottom:10px;
    margin-bottom:20px;
">

    <div style="
        font-size:22px;
        font-weight:bold;
        color:#19304B;
    ">
        EVENT ATTENDANCE ROSTER
    </div>

    <div style="
        font-size:13px;
        color:#666;
    ">
        Instructor Notes and Signature
    </div>

</div>

`;

}

/**
 * ============================================================================
 * Event Information
 * ============================================================================
 */
function renderEventInformation(event){

    return `

<div class="section-title">

    Event Information

</div>

<table>

<tr>

    <th style="width:18%;">
        Event ID
    </th>

    <td style="width:32%;">
        <span class="value">
            ${event?.id ?? ''}
        </span>
    </td>

    <th style="width:18%;">
        Program
    </th>

    <td style="width:32%;">
        ${event?.program ?? ''}
    </td>

</tr>

<tr>

    <th>
        Event
    </th>

    <td colspan="3">

        ${event?.title ?? ''}

    </td>

</tr>

<tr>

    <th>
        Date
    </th>

    <td>

        ${event?.date ?? ''}

    </td>

    <th>
        Time
    </th>

    <td>

        ${event?.time ?? ''}

    </td>

</tr>

<tr>

    <th>
        County
    </th>

    <td>

        ${event?.county ?? ''}

    </td>

    <th>
        Region
    </th>

    <td>

        ${event?.region ?? ''}

    </td>

</tr>

<tr>

    <th>
        Location
    </th>

    <td colspan="3">

        ${event?.location ?? ''}

    </td>

</tr>

</table>

`;

}

/**
 * ============================================================================
 * Instructor Section
 * ============================================================================
 */
function renderInstructorSection(instructors = []){

    const primary =

        instructors.find(i => {

            const role =

                (i.role || '').toLowerCase();

            return role.includes('lead') ||
                   role.includes('primary');

        });

    const assistants =

        instructors.filter(i => {

            const role =

                (i.role || '').toLowerCase();

            return !(
                role.includes('lead') ||
                role.includes('primary')
            );

        });

    return `

<div class="section-title">

    Instructor Information

</div>

<table>

<tr>

    <th style="width:22%;">
        Primary Instructor
    </th>

    <td>

        ${primary?.name ?? '&nbsp;'}

    </td>

</tr>

<tr>

    <th>
        Assistant Instructor(s)
    </th>

    <td>

        ${
            assistants.length
                ? assistants
                    .map(i => i.name)
                    .join('<br>')
                : '&nbsp;'
        }

    </td>

</tr>

</table>

`;

}

/**
 * ============================================================================
 * Student Roster
 * ============================================================================
 */
function renderStudentRoster(roster = []){

    return `

<div class="section-title">

    Student Attendance

</div>

<table>

<thead>

<tr>

    <th style="width:45px;">
        Attend
    </th>

    <th style="width:40px;">
        #
    </th>

    <th>
        Student Name
    </th>

    <th style="width:240px;">
       Email
   </th>

    <th style="width:140px;">
        Status
    </th>

</tr>

</thead>

<tbody>

${roster
    .map(renderStudentRow)
    .join('')}

</tbody>

</table>

`;

}

/**
 * ============================================================================
 * Student Row
 * ============================================================================
 */
function renderStudentRow(
    student,
    index
){

    return `

<tr>

    <td
        style="
            text-align:center;
            font-size:18px;
        "
    >

        □

    </td>

    <td
        style="
            text-align:center;
        "
    >

        ${index + 1}

    </td>

    <td>

        ${student.student_name ??
  student.name ??
  ''}

    </td>

    <td>

        ${student.phone ??
  student.student_phone ??
  student.student_email ??
  ''}

    </td>

    <td>

      ${
    student.registration_status ??
    student.status ??
    (
        student.attended === true
            ? 'Attended'
            : student.attended === false
                ? 'Absent'
                : 'Registered'
    )
}

    </td>

</tr>

`;

}

/**
 * ============================================================================
 * Attendance Summary
 * ============================================================================
 */
function renderAttendanceSummary(roster = []){

    const registered = roster.length;

    return `

<div class="section-title">

    Attendance Summary

</div>

<table>

<tr>

    <th style="width:25%;">
        Registered
    </th>

    <th style="width:25%;">
        Attended
    </th>

    <th style="width:25%;">
        No Shows
    </th>

    <th style="width:25%;">
        Walk-ins
    </th>

</tr>

<tr
    style="
        text-align:center;
        font-size:18px;
        height:42px;
    "
>

    <td>
        <strong>${registered}</strong>
    </td>

    <td>

    </td>

    <td>

    </td>

    <td>

    </td>

</tr>

</table>

`;

}

/**
 * ============================================================================
 * Report Footer
 * ============================================================================
 */
function renderFooter(event){

    const generated =
        new Date().toLocaleString();

    return `

<div
    style="
        margin-top:16px;
        padding-top:6px;
        border-top:1px solid #19304B;
        font-size:10px;
        color:#555;
        display:flex;
        justify-content:space-between;
        align-items:center;
    "
>

    <div>

        <strong>Generated:</strong>

        ${generated}

        <br>

        NDOW Volunteer Instructor Event Calendar

    </div>

    <div
        style="
            text-align:right;
        "
    >

        <strong>Event ID:</strong>

        ${event?.id ?? ''}

    </div>

</div>

`;

}

/**
 * ============================================================================
 * Notes Page
 * ============================================================================
 */
function renderNotesPage(event){

    let lines = '';

    for(let i = 0; i < 16; i++){

        lines += `

<div
    style="
        border-bottom:1px solid #D9D9D9;
        height:28px;
    "
></div>

`;

    }

    return `

<div class="section-title">

    Instructor Notes

</div>

${lines}

<div
    style="
        margin-top:35px;
    "
>

<table>

<tr>

    <th style="width:180px;">
        Instructor Signature
    </th>

    <td></td>

    <th style="width:90px;">
        Date
    </th>

    <td style="width:180px;"></td>

</tr>

</table>

</div>

<div
    style="
        margin-top:25px;
        border:1px solid #C7D3DF;
        padding:12px;
        background:#F8FAFC;
        font-size:11px;
        line-height:1.6;
    "
>

<strong>Instructor Instructions</strong>

<ul
    style="
        margin:8px 0 0 18px;
    "
>

<li>Verify attendance before beginning instruction.</li>

<li>Mark each student present or absent.</li>

<li>Record any significant issues in the notes section.</li>

<li>Return completed roster according to NDOW procedures.</li>

</ul>

</div>

`;

}

