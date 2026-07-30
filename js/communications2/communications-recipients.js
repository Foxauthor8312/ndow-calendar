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

    getState,

    setSelectedRecipients

}

from

'./communications-state.js';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';


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

                    student.customer_id

            )

        );

    const selected =

        state.selectedRecipients.filter(

            recipient =>

                visibleIds.has(

                    recipient.customer_id

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

                        recipient.customer_id ===

                        student.customer_id

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
        onchange="toggleRecipient(${student.customer_id})"
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

function(customerId){

    const state =

        getState();

    const recipients =

        getVisibleRecipients();

    const exists =

        state.selectedRecipients.find(

            recipient =>

                recipient.customer_id ===

                customerId

        );

    if(exists){

        setSelectedRecipients(

            state.selectedRecipients.filter(

                recipient =>

                    recipient.customer_id !==

                    customerId

            )

        );

    }

    else{

        const student =

            recipients.find(

                recipient =>

                    recipient.customer_id ===

                    customerId

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
    GLOBALS
===========================================================================*/

window.renderRecipients =

    renderRecipients;
