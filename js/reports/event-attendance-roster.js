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
==============================================================================
*/

'use strict';

/**
 * Render Event Attendance Roster
 *
 * @param {Object} event
 * @param {Array} instructors
 * @param {Array} roster
 * @returns {String}
 */
export function renderAttendanceRoster(
    event,
    instructors = [],
    roster = []
){

    return `

        <div class="attendance-roster">

            ${renderHeader()}

            ${renderEventInformation(event)}

            ${renderInstructorSection(instructors)}

            ${renderStudentRoster(roster)}

            ${renderAttendanceSummary(roster)}

            ${renderFooter(event)}

        </div>

    `;

}
