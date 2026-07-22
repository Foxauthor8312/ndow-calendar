/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-compose.js
 Layer       : Frontend Controller

 Purpose:
    Builds the Communications Workspace compose panel.

==============================================================================
*/

'use strict';

import {

    previewCommunication,

    sendCommunication as sendCommunicationRequest

}

from

'./communications-api.js';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';

import {

    getState

}

from

'./communications-state.js';

import {

    buildTemplate

}

from

'./communications-templates.js';

import {

    renderPreview

}

from

'./communications-preview.js';

import {

    renderAttendance

}

from

'./communications-attendance.js';


/*==============================================================================
    OPEN
==============================================================================*/

export function openCompose(){

    renderCompose();

}


/*==============================================================================
    RENDER
==============================================================================*/

function renderCompose(){

    const container =

        document.getElementById(

            'communicationsContent'

        );

    if(!container){

        return;

    }

    container.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        gap:20px;
    "
>

<div class="comm-card">

    <div class="comm-card-header">

        ✉ Compose Communication

    </div>

    <div class="comm-card-body">

        <label class="comm-label">

            Function

        </label>

        <select
            id="communicationTemplate"
            class="comm-select"
            style="width:100%;"
        >

            <option value="${COMMUNICATION_TYPES.REMINDER}">
                Reminder Email
            </option>

            <option value="attendance">
                Attendance
            </option>

            <option value="${COMMUNICATION_TYPES.SURVEY}">
                Survey Email
            </option>

            <option value="${COMMUNICATION_TYPES.NO_SHOW}">
                We Missed You Email
            </option>

            <option value="${COMMUNICATION_TYPES.CUSTOM}">
                Custom Email
            </option>

        </select>

        <br><br>

        <label class="comm-label">

            Subject

        </label>

        <input
            id="communicationSubject"
            class="comm-input"
            type="text"
            style="width:100%;"
        >

    </div>

</div>

<div id="communicationsDynamicPanel">

</div>

<div class="comm-card">

    <div class="comm-card-header">

        ✈ Send Options

    </div>

    <div class="comm-card-body">

        <label>

            <input
                id="sendCopy"
                type="checkbox"
            >

            Send me a copy

        </label>

        <br><br>

        <label class="comm-label">

            Additional Recipient

        </label>

        <input
            id="additionalRecipient"
            class="comm-input"
            type="email"
            placeholder="name@example.com"
            style="width:100%;"
        >

        <div
            class="comm-flex-end"
            style="
                margin-top:22px;
            "
        >

            <button
                class="comm-button"
                onclick="closeCommunicationsWorkspace()"
            >

                Cancel

            </button>

            <button
                class="comm-button comm-button-primary"
                onclick="sendCommunication()"
            >

                Send Email

            </button>

        </div>

    </div>

</div>

</div>

`;

    initializeCompose();
 }

 /*==============================================================================
    DYNAMIC PANEL
==============================================================================*/

function renderDynamicPanel(){

    const panel =

        document.getElementById(

            'communicationsDynamicPanel'

        );

    if(!panel){

        return;

    }

    const type =

        document.getElementById(

            'communicationTemplate'

        ).value;

    if(

        type === 'attendance'

    ){

        panel.innerHTML =

            renderAttendance();

    }

    else{

        panel.innerHTML = `

<div class="comm-card">

 `;

        if(window.renderRecipients){

            window.renderRecipients();

        }

    }

}


/*==============================================================================
    INITIALIZE
==============================================================================*/

function initializeCompose(){

    const selector =

        document.getElementById(

            'communicationTemplate'

        );

    selector.addEventListener(

        'change',

        updateTemplate

    );

    updateTemplate();

}

 /*==============================================================================
    TEMPLATE
==============================================================================*/

async function updateTemplate(){

    const state =

        getState();

    const selector =

        document.getElementById(

            'communicationTemplate'

        );

    if(!selector){

        return;

    }

    const type =

        selector.value;

    state.currentTemplate =

        type;

    /*----------------------------------------------------------
        Attendance Mode
    ----------------------------------------------------------*/

    if(type === 'attendance'){

        renderDynamicPanel();

        return;

    }

    /*----------------------------------------------------------
        Build Email
    ----------------------------------------------------------*/

let email;

try{

    email =

        await previewCommunication({

            eventId:

                state.currentEvent.id,

            eventName:

                state.currentEvent.title,

            eventDate:

                state.currentEvent.date,

            eventLocation:

                state.currentEvent.location,

            eventProgram:

                state.currentEvent.program,

            specialDirections:

                state.location?.directions || '',

            communicationType:

                type,

            message:'',

            recipients:[{

                student_name:'Preview User',

                student_email:'preview@example.com'

            }]

        });

}

catch(err){

    console.error(err);

    alert(

        'Unable to generate email preview.'

    );

    return;

}

state.preview = {

    html:

        email.html,

    subject:

        email.subject

};
const subject =

    document.getElementById(

        'communicationSubject'

    );

if(subject){

    subject.value =

        email.subject;

}

renderPreview();

renderDynamicPanel();

if(window.renderRecipients){

    window.renderRecipients();

}

}

/*==============================================================================
    SEND
==============================================================================*/

/*==============================================================================
    SEND
==============================================================================*/

async function sendCommunication(){

    const state =

        getState();

    try{

        const result =

            await sendCommunicationRequest({

                eventId:

                    state.currentEvent.id,

                eventName:

                    state.currentEvent.title,

                eventDate:

                    state.currentEvent.date,

                eventLocation:

                    state.currentEvent.location,

                eventProgram:

                    state.currentEvent.program,

                communicationType:

                    state.currentTemplate,

                subject:

                    state.preview.subject,

                message:

                    state.preview.html,

                recipients:

                    state.selectedRecipients

            });

        alert(

            `${result.recipients} email(s) sent successfully.`

        );

    }

    catch(err){

        console.error(err);

        alert(

            err.message

        );

    }

}

/*==============================================================================
    GLOBALS
==============================================================================*/

window.changeCommunicationTemplate =
    updateTemplate;

window.sendCommunication =
    sendCommunication;

}

