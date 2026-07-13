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

<div class="comm-card">

    <div class="comm-card-header">

        Compose Communication

    </div>

    <div class="comm-card-body">

        <label class="comm-label">

            Template

        </label>

        <select
            id="communicationTemplate"
            class="comm-select"
        >

            <option value="${COMMUNICATION_TYPES.REMINDER}">

                Reminder

            </option>

            <option value="${COMMUNICATION_TYPES.SURVEY}">

                Survey

            </option>

            <option value="${COMMUNICATION_TYPES.NO_SHOW}">

                We Missed You

            </option>

            <option value="${COMMUNICATION_TYPES.CUSTOM}">

                Custom

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
        >

    </div>

</div>

<div class="comm-card">

    <div class="comm-card-header">

        Email Preview

    </div>

    <div
        id="communicationsPreview"
        class="comm-preview">

    </div>

</div>

<div class="comm-card">

    <div class="comm-card-header">

        Recipients

    </div>

    <div
        id="communicationsRecipients">

    </div>

</div>

<div class="comm-card">

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
    >

</div>

<div class="comm-flex-end">

    <button
        class="comm-button"
        onclick="closeCommunicationsWorkspace()">

        Cancel

    </button>

    <button
        class="comm-button comm-button-primary"
        onclick="sendCommunication()">

        Send Email

    </button>

</div>

`;

    initializeCompose();

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

}


/*==============================================================================
    GLOBALS
==============================================================================*/

window.changeCommunicationTemplate =

    updateTemplate;
