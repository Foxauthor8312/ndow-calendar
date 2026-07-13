/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-attendance.js
 Layer       : Frontend

 Purpose:
    Attendance management for Communications Workspace.

 Responsibilities:
    • Render attendance card
    • Toggle attendance
    • Select/Clear attendance
    • Save attendance

 Used By:
    • communications-compose.js
==============================================================================
*/

'use strict';

import {

    getState

}

from

'./communications-state.js';

import {

    saveAttendance

}

from

'./communications-api.js';


/*==============================================================================
    RENDER
==============================================================================*/

export function renderAttendance(){

    const state =

        getState();

    return `

<div class="comm-card">

    <div
        class="comm-card-header"
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
        "
    >

        <span>

            ✔ Attendance

        </span>

        <span
            style="
                font-size:13px;
                font-weight:600;
                color:#19304B;
            "
        >

            ${state.roster.length} Students

        </span>

    </div>

    <div
        id="attendanceList"
        style="
            max-height:280px;
            overflow-y:auto;
        "
    >

        ${buildAttendanceRows()}

    </div>

    <div
        style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
            margin-top:16px;
        "
    >

        <button
            class="comm-button"
            type="button"
            onclick="selectAllAttendance()"
        >

            Select All

        </button>

        <button
            class="comm-button"
            type="button"
            onclick="clearAttendance()"
        >

            Clear All

        </button>

        <button
            class="comm-button comm-button-primary"
            type="button"
            onclick="saveAttendanceChanges()"
        >

            Save Attendance

        </button>

    </div>

</div>

`;

}


/*==============================================================================
    ROWS
==============================================================================*/

function buildAttendanceRows(){

    const state =

        getState();

    return state.roster.map(

        student=>`

<div
    style="
        display:grid;
        grid-template-columns:26px 1fr;
        gap:12px;
        align-items:center;
        padding:10px 8px;
        border-bottom:1px solid #ECEFF3;
    "
>

    <input
        type="checkbox"
        ${student.attended ? 'checked' : ''}
        onchange="toggleAttendance(${student.customer_id},this.checked)"
    >

    <div>

        <div
            style="
                font-weight:600;
                color:#19304B;
            "
        >

            ${student.student_name}

        </div>

        <div
            style="
                font-size:13px;
                color:#6B7280;
            "
        >

            ${student.student_email}

        </div>

    </div>

</div>

`

    ).join('');

}


/*==============================================================================
    REFRESH
==============================================================================*/

function refreshAttendance(){

    const list =

        document.getElementById(

            'attendanceList'

        );

    if(list){

        list.innerHTML =

            buildAttendanceRows();

    }

}


/*==============================================================================
    TOGGLE
==============================================================================*/

window.toggleAttendance =

function(customerId,attended){

    const state =

        getState();

    const student =

        state.roster.find(

            s=>

                s.customer_id ===

                customerId

        );

    if(student){

        student.attended =

            attended;

    }

};


/*==============================================================================
    SELECT ALL
==============================================================================*/

window.selectAllAttendance =

function(){

    const state =

        getState();

    state.roster.forEach(

        student=>{

            student.attended = true;

        }

    );

    refreshAttendance();

};


/*==============================================================================
    CLEAR
==============================================================================*/

window.clearAttendance =

function(){

    const state =

        getState();

    state.roster.forEach(

        student=>{

            student.attended = false;

        }

    );

    refreshAttendance();

};


/*==============================================================================
    SAVE
==============================================================================*/

window.saveAttendanceChanges =

async function(){

    const state =

        getState();

    try{

        const result =

            await saveAttendance(

                state.currentEvent.id,

                state.roster

            );

        alert(

            result.message ||

            'Attendance saved.'

        );

    }

    catch(err){

        console.error(

            err

        );

        alert(

            err.message

        );

    }

};
