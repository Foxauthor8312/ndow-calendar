/*
==============================================================================
 NDOW Volunteer Portal
 Attendance Roster Renderer
------------------------------------------------------------------------------
 Module      : attendance-roster.js
 Layer       : Document Renderer

 Purpose:
    Generates the printable Event Attendance Roster.

 Responsibilities:
    • Render report header
    • Render event information
    • Render instructor section
    • Render student roster
    • Render attendance summary
    • Render footer
    • Render continuation pages

 Used By:
    • Communications / Document Workspace
==============================================================================*/

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
