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

        'communicationsLeftPane'

    );

    if(!container){

        return;

    }

container.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        height:100%;
        gap:14px;
    "
>

    <div
        id="communicationsEventHeader"
        style="
            border-bottom:1px solid #DBE3EC;
            padding-bottom:12px;
        "
    ></div>

    <div>

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

    </div>

    <div>

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

    <div
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
        "
    >

        <strong>Recipients</strong>

        <span id="recipientCount"></span>

    </div>

    <div
        id="communicationsRecipients"
        style="
            flex:1;
            overflow:auto;
            border:1px solid #DBE3EC;
            border-radius:6px;
            padding:8px;
        "
    >
        Loading...
    </div>

    <div id="communicationsDynamicPanel"></div>

    <div
        style="
            border-top:1px solid #DBE3EC;
            padding-top:12px;
        "
    >

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

        <br><br>
        
        <label class="comm-label">
            Additional Notes
        </label>
        
        <textarea
            id="communicationNotes"
            class="comm-input"
            rows="5"
            placeholder="Optional information to include in this email..."
            style="
                width:100%;
                resize:vertical;
            "
        ></textarea>

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
            onclick="closeCommunicationsWorkspace()"
        >
            Cancel
        </button>
        
        <button
            class="comm-button"
            onclick="updatePreview()"
        >
            Update Preview
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

`;



    initializeCompose();

    renderEventHeader();
 }


function renderEventHeader(){

    const state = getState();

    const panel =
        document.getElementById(
            'communicationsEventHeader'
        );

    if(!panel || !state.currentEvent){
        return;
    }

    panel.innerHTML = `
        <div style="font-size:18px;font-weight:700;color:#19304B;">
            ${state.currentEvent.title}
        </div>

        <div style="margin-top:4px;color:#666;">
            ${state.currentEvent.date || ''}
        </div>

        <div style="margin-top:2px;color:#666;">
            ${state.currentEvent.location || ''}
        </div>

        <div style="margin-top:2px;color:#589FD6;font-size:13px;">
            ${state.currentEvent.program || ''}
        </div>
    `;

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

            message:
             document.getElementById(
                 'communicationNotes'
             )?.value || '',

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
                    document.getElementById(
                        'communicationNotes'
                    )?.value || '',

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


