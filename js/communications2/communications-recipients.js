/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-recipients.js
 Layer       : Frontend

 Purpose:
    Manages communication recipients.

 Responsibilities:
    • Render recipient list
    • Select All
    • Clear All
    • Toggle recipient
    • Recipient count

 Used By:
    • communications-compose.js
==============================================================================
*/

'use strict';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';

import {

    getState,
    setSelectedRecipients

}

from

'./communications-state.js';

import {

    addManualStudent

}

from

'../event-roster.js';


/*===========================================================================
    INITIALIZE
===========================================================================*/

export function initializeRecipients(){

    renderRecipients();

}


/*===========================================================================
    VISIBLE RECIPIENTS
===========================================================================*/

export function getVisibleRecipients(){

    const state =

        getState();

    let recipients =

        [...state.roster];

    const selector =

        document.getElementById(

            'communicationTemplate'

        );

    const currentFunction =

        selector

            ? selector.value

            : COMMUNICATION_TYPES.REMINDER;

    switch(currentFunction){

        case COMMUNICATION_TYPES.SURVEY:

            recipients =

                recipients.filter(

                    student =>

                        student.attended === true

                );

            break;

        case COMMUNICATION_TYPES.NO_SHOW:

            recipients =

                recipients.filter(

                    student =>

                        student.attended === false

                );

            break;

    }

    return recipients;

}


/*===========================================================================
    RENDER
===========================================================================*/

function renderRecipients(){

    const state =

        getState();

    const container =

        document.getElementById(

            'communicationsRecipients'

        );

    if(!container){

        return;

    }

    container.innerHTML = `

<div
    class="comm-recipient-toolbar">

    <button
        type="button"
        onclick="selectAllRecipients()">

        Select All

    </button>

    <button
        type="button"
        onclick="clearRecipients()">

        Clear All

    </button>

    <button
        type="button"
        onclick="openAddStudentModal()">

        + Add Student

    </button>

    <button
    type="button"
    onclick="openSurveyResults()">

    View Survey Results

</button>

    <span
        id="recipientCount"
        style="
            float:right;
            font-weight:600;
        ">

        ${state.selectedRecipients.length}
        Selected

    </span>

</div>

<div
    id="recipientList"
    class="comm-recipient-list">

</div>

`;

    renderRecipientList();

    updateRecipientCount();

}

/*===========================================================================
    RECIPIENT LIST
===========================================================================*/

function renderRecipientList(){

    const state =

        getState();

    const recipients =

        getVisibleRecipients();

    /*
    --------------------------------------------------------------------------
    Synchronize the selected recipients with the currently visible list.
    --------------------------------------------------------------------------
    */

  const visibleIds =

    new Set(

        recipients.map(

            student =>

                student.customer_id ??
                student.student_email

        )

    );

    const selected =

    state.selectedRecipients.filter(

        recipient =>

            visibleIds.has(

                recipient.customer_id ??
                recipient.student_email

            )

    );

    if(

        selected.length !==

        state.selectedRecipients.length

    ){

        setSelectedRecipients(

            selected

        );

    }

    const list =

        document.getElementById(

            'recipientList'

        );

    if(!list){

        return;

    }

    list.innerHTML = '';

    recipients.forEach(

        student => {

            const checked =

                selected.some(

  recipient =>

    (
        recipient.customer_id ??
        recipient.student_email
    ) ===
    (
        student.customer_id ??
        student.student_email
    )

                )

                ? 'checked'
                : '';

            list.insertAdjacentHTML(

                'beforeend',

`

<div
    class="comm-recipient-row"
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
        ${checked}
        onchange="toggleRecipient(
       '${student.customer_id ?? student.student_email}'
   )"
    >

    <div
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:20px;
        "
    >

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

            );

        }

    );

    updateRecipientCount();

}

/*===========================================================================
    TOGGLE
===========================================================================*/

window.toggleRecipient =

function(recipientId){

    const state =

        getState();

    const recipients =

        getVisibleRecipients();

    const exists =

        state.selectedRecipients.find(

            recipient =>

                (
                    recipient.customer_id ??
                    recipient.student_email
                ) ===
                recipientId

        );

    if(exists){

        setSelectedRecipients(

            state.selectedRecipients.filter(

                recipient =>

                    (
                        recipient.customer_id ??
                        recipient.student_email
                    ) !==
                    recipientId

            )

        );

    }

    else{

        const student =

            recipients.find(

                recipient =>

                    (
                        recipient.customer_id ??
                        recipient.student_email
                    ) ===
                    recipientId

            );

        if(student){

            setSelectedRecipients([

                ...state.selectedRecipients,

                student

            ]);

        }

    }

    renderRecipientList();

};


/*===========================================================================
    SELECT ALL
===========================================================================*/

window.selectAllRecipients =

function(){

    const recipients =

        getVisibleRecipients();

    setSelectedRecipients(

        [...recipients]

    );

    renderRecipientList();

};


/*===========================================================================
    CLEAR
===========================================================================*/

window.clearRecipients =

function(){

    setSelectedRecipients([]);

    renderRecipientList();

};

/*===========================================================================
    COUNT
===========================================================================*/

function updateRecipientCount(){

    const state =

        getState();

    const recipients =

        getVisibleRecipients();

    const label =

        document.getElementById(

            'recipientCount'

        );

    if(label){

        label.textContent =

            `${state.selectedRecipients.length} Selected`;

    }

    const header =

        document.getElementById(

            'recipientCountHeader'

        );

    if(header){

        const selector =

            document.getElementById(

                'communicationTemplate'

            );

        const currentFunction =

            selector

                ? selector.value

                : COMMUNICATION_TYPES.REMINDER;

        switch(currentFunction){

            case COMMUNICATION_TYPES.SURVEY:

                header.textContent =

                    `Survey Recipients (${recipients.length})`;

                break;

            case COMMUNICATION_TYPES.NO_SHOW:

                header.textContent =

                    `No-Show Recipients (${recipients.length})`;

                break;

            case COMMUNICATION_TYPES.CUSTOM:

                header.textContent =

                    `Custom Recipients (${recipients.length})`;

                break;

            default:

                header.textContent =

                    `Recipients (${recipients.length})`;

        }

    }

}
/*===========================================================================
    ADD MANUAL STUDENT
===========================================================================*/

window.openAddStudentModal =

function(){

    const state =

        getState();

    if(!state.currentEvent){

        alert(
            'No event is currently selected.'
        );

        return;

    }

    if(
        document.getElementById(
            'addManualStudentModal'
        )
    ){

        return;

    }

    const modal =

        document.createElement('div');

    modal.id =
        'addManualStudentModal';

    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:100000;
    `;

    modal.innerHTML = `

<div
    style="
        width:420px;
        max-width:90vw;
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        box-shadow:0 10px 30px rgba(0,0,0,.18);
        padding:24px;
    "
>

    <div
        style="
            font-size:18px;
            font-weight:700;
            color:#19304B;
            margin-bottom:18px;
        "
    >
        Add Student
    </div>

    <label class="comm-label">
        Student Name
    </label>

    <input
        id="manualStudentName"
        class="comm-input"
        type="text"
        placeholder="First and last name"
        style="
            width:100%;
            margin-bottom:14px;
        "
    >

    <label class="comm-label">
        Email Address
    </label>

    <input
        id="manualStudentEmail"
        class="comm-input"
        type="email"
        placeholder="student@example.com"
        style="
            width:100%;
        "
    >

    <div
        style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
            margin-top:20px;
        "
    >

        <button
            type="button"
            class="comm-button"
            onclick="closeAddStudentModal()"
        >
            Cancel
        </button>

        <button
            type="button"
            class="comm-button comm-button-primary"
            onclick="saveManualStudent()"
        >
            Add Student
        </button>

    </div>

</div>

`;

    document.body.appendChild(modal);

    document
        .getElementById(
            'manualStudentName'
        )
        ?.focus();

};


/*===========================================================================
    CLOSE ADD STUDENT MODAL
===========================================================================*/

window.closeAddStudentModal =

function(){

    const modal =

        document.getElementById(
            'addManualStudentModal'
        );

    if(modal){

        modal.remove();

    }

};


/*===========================================================================
    SAVE MANUAL STUDENT
===========================================================================*/

window.saveManualStudent =

async function(){

    const state =

        getState();

    const nameInput =

        document.getElementById(
            'manualStudentName'
        );

    const emailInput =

        document.getElementById(
            'manualStudentEmail'
        );

    const studentName =
        nameInput?.value.trim();

    const studentEmail =
        emailInput?.value.trim();

    if(!studentName){

        alert(
            'Student name is required.'
        );

        nameInput?.focus();

        return;

    }

    if(!studentEmail){

        alert(
            'Student email is required.'
        );

        emailInput?.focus();

        return;

    }

    try{

        const student =

            await addManualStudent(

                state.currentEvent.id,

                studentName,

                studentEmail

            );

        state.roster = [

            ...state.roster,

            student

        ];

        closeAddStudentModal();

        renderRecipientList();

        updateRecipientCount();

    }

    catch(error){

        console.error(

            'Unable to add manual student:',

            error

        );

        alert(

            error.message ||
            'Unable to add student.'

        );

    }

};


/*===========================================================================
    VIEW SURVEY RESULTS
===========================================================================*/

window.openSurveyResults =

async function(){

    const state =
        getState();

    if(!state.currentEvent){

        alert(
            'No event is currently selected.'
        );

        return;

    }

    try{

        const token =
            localStorage.getItem('token');

        const response =
            await fetch(
                `https://ndow-calendar-server.onrender.com/api/event-communications/reviews/${state.currentEvent.id}`,
                {
                    headers: {

                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                              }
                            : {})

                    }
                }
            );

        const data =
            await response.json();

        if(!response.ok || !data.success){

            throw new Error(
                data.message ||
                'Unable to load survey results.'
            );

        }

        console.log(
            'Survey Results:',
            data
        );

        alert(
            `${data.count} completed survey${data.count === 1 ? '' : 's'} found.`
        );

    }

    catch(error){

        console.error(
            'Survey Results Error:',
            error
        );

        alert(
            error.message ||
            'Unable to load survey results.'
        );

    }

};

/*===========================================================================
    GLOBALS
===========================================================================*/

window.renderRecipients =

    renderRecipients;
