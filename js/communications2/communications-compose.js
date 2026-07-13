/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-compose.js
 Layer       : Frontend

 Purpose:
    Renders the Event Communications workspace.

 Responsibilities:
    • Render compose workspace
    • Communication type selection
    • Display subject
    • Display preview
    • Display recipients
    • Footer controls

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


/*===========================================================================
    OPEN
===========================================================================*/

export function openCompose(){

    renderCompose();

}


/*===========================================================================
    RENDER
===========================================================================*/

export function renderCompose(){

    const container =

        document.getElementById(

            'communicationsContent'

        );

    if(!container){

        return;

    }

    const state =

        getState();

    container.innerHTML = `

<div class="comm-workspace">

    <div class="comm-card">

        <div class="comm-card-header">

            Communication

        </div>

        <div class="comm-card-body">

            <label>

                Template

            </label>

            <select
                id="communicationTemplate"
                onchange="changeCommunicationTemplate()"
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

            <label
                style="margin-top:18px;">

                Subject

            </label>

            <input
                id="communicationSubject"
                type="text"
                readonly
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

            Loading recipients...

        </div>

    </div>


    <div class="comm-footer">

        <label>

            <input
                id="sendCopy"
                type="checkbox"
            >

            Send me a copy

        </label>

        <div>

            <button
                onclick="closeCommunicationsWorkspace()">

                Cancel

            </button>

            <button
                class="primary-button"
                onclick="sendCommunication()">

                Send Email

            </button>

        </div>

    </div>

</div>

`;

    updateTemplate();

}


/*===========================================================================
    TEMPLATE
===========================================================================*/

window.changeCommunicationTemplate =

function(){

    updateTemplate();

};


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
