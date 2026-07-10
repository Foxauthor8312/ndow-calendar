/*
==============================================================================
 NDOW Volunteer Portal
 Event Communications
------------------------------------------------------------------------------
 Module      : event-communications.js
 Layer       : Frontend

 Responsibilities

    • Load event roster
    • Display recipients
    • Send communications
    • Preview communications

==============================================================================
*/

import {

    loadEventRoster,

    sendCommunicationRequest,

    saveAttendanceRequest

}

from

'./event-communications-api.js';

import {

    renderRecipientList,

    updateRecipientCount

}

from

'./event-communications-ui.js';

let currentEvent = null;

let selectedRecipients = [];

let roster = [];

let communicationMode = 'compose';

async function openEventCommunication(event){

    currentEvent = event;

    roster = await loadEventRoster(event.id);

    console.log("Roster:", roster);

    selectedRecipients = [...roster];

    console.log("Recipients:", selectedRecipients.length);

    renderCommunicationModal();

}

window.loadReview = function(){

    renderCommunicationModal({

        mode: 'review'

    });

};

function closeEventCommunication(){

    closeCommunicationsWorkspace();

}

async function sendCommunication(){

    try{

        const subject =
            document
                .getElementById(
                    'email-subject'
                )
                .value
                .trim();

        const message =
            document
                .getElementById(
                    'email-message'
                )
                .value
                .trim();

        let finalMessage = message;

        if(
            communicationMode === 'review'
        ){
        
            finalMessage =
              message.replace(

                '[Survey Link]',
            
                'https://YOUR-SURVEY-LINK'
            
            );
        
        }

        const ccEmail =
            document
                .getElementById(
                    'cc-email'
                )
                .value
                .trim();

         const ccMe =

       document
           .getElementById(
               'send-copy'
           )
           .checked;

        if(!subject){

            alert(
                'Please enter a subject.'
            );

            return;

        }

        if(!message){

            alert(
                'Please enter a message.'
            );

            return;

        }

        if(
            selectedRecipients.length === 0
        ){

            alert(
                'Please select at least one recipient.'
            );

            return;

        }

        const result =
            await sendCommunicationRequest({

                eventId:
                    currentEvent.id,

                eventName:
                    currentEvent.title,

                eventDate:
                    currentEvent.date,

                eventLocation:
                    currentEvent.location,

                subject,

               message: finalMessage,

            ccMe,

                ccEmail,

                recipients:
                    selectedRecipients

            });

        alert(

            `${result.recipients} email(s) sent successfully.`

        );

        closeEventCommunication();

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

function renderCommunicationModal(options = {}){
 const reviewMode =
    options.mode === 'review';

 communicationMode =
    reviewMode
        ? 'review'
        : 'compose';

    const container =
    document.getElementById(
        'communicationsContent'
    );

container.innerHTML = `

<div class="comm-card">

    <h2 class="comm-card-title">

        ${reviewMode
            ? 'Survey'
            : 'Reminder'}

    </h2>

    <div class="comm-card-subtitle">

        <strong>

            ${currentEvent.title}

        </strong>

        <br><br>

        ${new Date(
            currentEvent.date
        ).toLocaleDateString(

            'en-US',

            {
                weekday:'long',
                year:'numeric',
                month:'long',
                day:'numeric'
            }

        )}

        <br>

        ${currentEvent.location}

    </div>

</div>

<div class="comm-card">

    <label class="comm-label">

        Template

    </label>

    <select
        id="email-template"
        class="comm-select"
    >

        <option>

            ${
                reviewMode
                    ? 'Survey'
                    : 'General Reminder'
            }

        </option>

    </select>

    <br><br>

    <label class="comm-label">

        Subject

    </label>

    <input

        id="email-subject"

        class="comm-input"

        type="text"

        value="${
            reviewMode
                ? `Thank You for Attending ${currentEvent.title}`
                : `Reminder - ${currentEvent.title}`
        }"

    >

    <br><br>

    <label class="comm-label">

        Message

    </label>

    <textarea

        id="email-message"

        class="comm-textarea"

>${reviewMode
? `Thank you for attending "${currentEvent.title}."

We appreciate your participation and hope you enjoyed the class.

Your feedback helps us improve future Nevada Department of Wildlife programs.

Please take a few moments to complete our class review using the link below.

[Survey Link]

Thank you,

Nevada Department of Wildlife`
: `Thank you for registering for this Nevada Department of Wildlife event.

Please review the attached event information before attending.

We look forward to seeing you.
`}</textarea>

</div>

<div class="comm-card">

<div class="comm-flex-between">

<h3>

${reviewMode
    ? `Attendees (${roster.length})`
    : `Recipients (${roster.length})`}

</h3>

<div>

<button

class="comm-button"

type="button"

onclick="selectAllRecipients()"

>

Select All

</button>

<button

class="comm-button"

type="button"

onclick="clearRecipients()"

>

Clear All

</button>

</div>

</div>

<div

id="recipient-list"

class="comm-table"

style="
    max-height:220px;
    overflow-y:auto;
"

></div>

<div class="comm-mt">

Selected:

<span

id="selected-count"

class="comm-count"

>

${selectedRecipients.length}

</span>

</div>

</div>

<div class="comm-card">

<label>

<input

id="send-copy"

type="checkbox"

>

Send me a copy

</label>

<br><br>

<label class="comm-label">

Additional Recipient

</label>

<input

id="cc-email"

type="email"

class="comm-input"

placeholder="name@example.com"

>

</div>

<div class="comm-flex-end">

<button

class="comm-button"

type="button"

onclick="closeEventCommunication()"

>

Cancel

</button>

<button

class="comm-button comm-button-primary"

type="button"

onclick="sendCommunication()"

>

${reviewMode
    ? 'Send Survey'
    : 'Send Reminder'}

</button>

</div>

`;

 renderRecipientList(

    roster,

    selectedRecipients

);

 }

function toggleRecipient(customerId){

    const exists =
        selectedRecipients.find(

            r =>

            r.customer_id === customerId

        );

    if(exists){

        selectedRecipients =

            selectedRecipients.filter(

                r =>

                r.customer_id !== customerId

            );

    }

    else{

        const student =

            roster.find(

                r =>

                r.customer_id === customerId

            );

        if(student){

            selectedRecipients.push(
                student
            );

        }

    }

updateRecipientCount(

    selectedRecipients.length

);

}

function selectAllRecipients(){

    selectedRecipients =
        [...roster];

    renderRecipientList(

        roster,

        selectedRecipients

    );

    updateRecipientCount(

        selectedRecipients.length

    );

}

function clearRecipients(){

    selectedRecipients = [];

    renderRecipientList(

        roster,

        selectedRecipients

    );

    updateRecipientCount(

        selectedRecipients.length

    );

}

window.openEventCommunication =
    openEventCommunication;

window.closeEventCommunication =
    closeEventCommunication;

window.sendCommunication =
    sendCommunication;

window.toggleRecipient =
    toggleRecipient;

window.selectAllRecipients =
    selectAllRecipients;

window.clearRecipients =
    clearRecipients;

window.loadEventRoster =
    loadEventRoster;

window.saveAttendanceRequest =
    saveAttendanceRequest;
