/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-compose.js
 Layer       : Frontend Controller

 Purpose:
    Builds the communications compose workspace.

 Responsibilities:
    • Render compose workspace
    • Template selection
    • Subject generation
    • Preview generation
    • Initialize recipients
    • Initialize preview

 Used By:
    • communications-workspace.js
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

    renderDynamicPanel();

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

    ){

        panel.innerHTML =

            renderAttendance();

    }

    else{

        panel.innerHTML = `

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

            👥 Recipients

        </span>

        <span
            id="recipientCountHeader"
            style="
                font-size:13px;
                font-weight:600;
                color:#19304B;
            "
        >

        </span>

    </div>

    <div
        id="communicationsRecipients">

    </div>

</div>

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

function updateTemplate(){

    const state =

        getState();

    const type =

        document.getElementById(

            'communicationTemplate'

        ).value;

     if(type === 'attendance'){

    renderAttendance();

    return;

}

    const email =

        buildTemplate(

            type,

            state.currentEvent,

            state.location

        );

    state.currentTemplate =

        type;

    state.preview =

        email;

    document.getElementById(

        'communicationSubject'

    ).value =

        email.subject;

    renderPreview();

    renderDynamicPanel();
    
    if(window.renderRecipients){
    
        window.renderRecipients();
    
    }

 }
/*==============================================================================
    GLOBALS
==============================================================================*/

window.changeCommunicationTemplate =

    updateTemplate;
