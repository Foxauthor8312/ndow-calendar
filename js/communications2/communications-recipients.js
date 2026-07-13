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


/*===========================================================================
    INITIALIZE
===========================================================================*/

export function initializeRecipients(){

    renderRecipients();

}


/*===========================================================================
    RENDER
===========================================================================*/

export function renderRecipients(){

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

}


/*===========================================================================
    RECIPIENT LIST
===========================================================================*/

function renderRecipientList(){

    const state =

        getState();

    const list =

        document.getElementById(

            'recipientList'

        );

    if(!list){

        return;

    }

    list.innerHTML = '';

    state.roster.forEach(

        student=>{

            const checked =

                state.selectedRecipients.some(

                    recipient=>

                        recipient.customer_id ===

                        student.customer_id

                )

                ? 'checked'

                : '';

            list.insertAdjacentHTML(

                'beforeend',

`

<label
    class="comm-recipient">

<input
    type="checkbox"
    ${checked}
    onchange="toggleRecipient(${student.customer_id})"
>

<div>

<div>

${student.student_name}

</div>

<div
    style="
        font-size:12px;
        color:#6b7280;
    ">

${student.student_email}

</div>

</div>

</label>

`

            );

        }

    );

}


/*===========================================================================
    TOGGLE
===========================================================================*/

window.toggleRecipient =

function(customerId){

    const state =

        getState();

    const exists =

        state.selectedRecipients.find(

            recipient=>

                recipient.customer_id ===

                customerId

        );

    if(exists){

        setSelectedRecipients(

            state.selectedRecipients.filter(

                recipient=>

                    recipient.customer_id !==

                    customerId

            )

        );

    }

    else{

        const student =

            state.roster.find(

                recipient=>

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

    updateRecipientCount();

    renderRecipientList();

};


/*===========================================================================
    SELECT ALL
===========================================================================*/

window.selectAllRecipients =

function(){

    const state =

        getState();

    setSelectedRecipients(

        [...state.roster]

    );

    updateRecipientCount();

    renderRecipientList();

};


/*===========================================================================
    CLEAR
===========================================================================*/

window.clearRecipients =

function(){

    setSelectedRecipients([]);

    updateRecipientCount();

    renderRecipientList();

};


/*===========================================================================
    COUNT
===========================================================================*/

function updateRecipientCount(){

    const state =

        getState();

    const label =

        document.getElementById(

            'recipientCount'

        );

    if(label){

        label.textContent =

            `${state.selectedRecipients.length} Selected`;

    }

}
