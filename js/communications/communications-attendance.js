/*
==========================================================
 NDOW Volunteer Portal
 Communications Attendance
==========================================================

Responsibilities

    • Load event roster
    • Display attendance checklist
    • Update attended flags
    • Save attendance

==========================================================
*/

import {
    loadEventRoster
}
from
'./event-communications-api.js';

let currentEvent = null;
let roster = [];

async function openAttendance(event){

    currentEvent = event;

    roster =
        await loadEventRoster(
            event.id
        );

    // Default new records to attended

    roster.forEach(student => {

        if(
            student.attended === null ||
            student.attended === undefined
        ){
            student.attended = true;
        }

    });

    renderAttendance();

}

function renderAttendance(){

    const container =
        document.getElementById(
            'communicationsContent'
        );

    const attended =
        roster.filter(
            s => s.attended
        ).length;

    container.innerHTML = `

<h2 style="margin-top:0;">
    ✓ Attendance
</h2>

<p>
Mark the students who attended today's class.
</p>

<div style="
    margin-bottom:18px;
    font-weight:600;
    color:#19304B;
">
    Attended:
    ${attended}
    /
    ${roster.length}
</div>

<div
    id="attendanceList"
    style="
        border:1px solid #d1d5db;
        border-radius:8px;
        background:white;
        padding:14px;
        max-height:420px;
        overflow-y:auto;
    ">
</div>

<div style="
    margin-top:18px;
    display:flex;
    justify-content:space-between;
">

    <div>

        <button
            onclick="checkAllAttendance()">
            Check All
        </button>

        <button
            onclick="clearAllAttendance()">
            Clear All
        </button>

    </div>

    <button
        onclick="saveAttendance()">
        Save Attendance
    </button>

</div>

`;

    renderAttendanceList();

}

function renderAttendanceList(){

    const list =
        document.getElementById(
            'attendanceList'
        );

    list.innerHTML = '';

    roster.forEach(student => {

        list.insertAdjacentHTML(

            'beforeend',

            `

<label style="
display:block;
padding:6px 0;
">

<input
type="checkbox"
${student.attended ? 'checked' : ''}
onchange="
toggleAttendance(
'${student.customer_id}',
this.checked
)
">

${student.name}

</label>

`

        );

    });

}

function toggleAttendance(
    customerId,
    checked
){

    const student =
        roster.find(

            s =>
            s.customer_id ==
            customerId

        );

    if(student){

        student.attended =
            checked;

    }

    renderAttendance();

}

function checkAllAttendance(){

    roster.forEach(

        s =>
        s.attended = true

    );

    renderAttendance();

}

function clearAllAttendance(){

    roster.forEach(

        s =>
        s.attended = false

    );

    renderAttendance();

}

async function saveAttendance(){

    console.log(
        'Attendance',
        roster
    );

    alert(
        'Attendance saving will be connected next.'
    );

}

window.openAttendance =
    openAttendance;

window.checkAllAttendance =
    checkAllAttendance;

window.clearAllAttendance =
    clearAllAttendance;

window.toggleAttendance =
    toggleAttendance;

window.saveAttendance =
    saveAttendance;
