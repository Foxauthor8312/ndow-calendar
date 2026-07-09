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

    sendCommunicationRequest

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
        
                    '[Jotform Review Link]',
        
                    'https://YOUR-JOTFORM-LINK'
        
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

<div style="
    margin-bottom:20px;
">
<h2 style="
    margin-top:0;
    margin-bottom:18px;
">

<h2>

${reviewMode
    ? '💬 Survey'
    : '📧 Reminder'}

</h2>

    <div style="
        font-size:20px;
        font-weight:700;
        color:#19304B;
        margin-bottom:8px;
    ">
        ${currentEvent.title}
    </div>

    <div style="
        color:#4b5563;
        line-height:1.6;
    ">
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
        ${currentEvent.location}
    </div>

</div>

<hr>

<div style="margin-top:24px;">

<label style="
display:block;
font-weight:700;
margin-bottom:6px;
">

Subject

</label>

<input

id="email-subject"

type="text"

style="
width:100%;
padding:10px;
border:1px solid #d1d5db;
border-radius:8px;
margin-bottom:18px;
"

value="${
    reviewMode
        ? `Thank You for Attending ${currentEvent.title}`
        : `Reminder - ${currentEvent.title}`
}"

>

<label style="
display:block;
font-weight:700;
margin-bottom:6px;
">

Message

</label>

<textarea

id="email-message"

style="
width:100%;
height:180px;
padding:12px;
border:1px solid #d1d5db;
border-radius:8px;
resize:vertical;
"

>

${reviewMode
? `Thank you for attending "${currentEvent.title}."

We appreciate your participation and hope you enjoyed the class.

Your feedback helps us improve future Nevada Department of Wildlife programs.

Please take a few moments to complete our class review using the link below.

[Jotform Review Link]

Thank you,

Nevada Department of Wildlife`
: `Thank you for registering for this Nevada Department of Wildlife event.

Please review the attached event information before attending.

We look forward to seeing you.
`}

</textarea>

<hr style="margin:24px 0;">

<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:12px;
">

<h3 style="
margin:0;
">

<h3 style="
margin:0;
">

${reviewMode
    ? `Attendees (${roster.length})`
    : `Recipients (${roster.length})`}

</h3>

</h3>

<div>

<button

type="button"

onclick="selectAllRecipients()"

style="
margin-right:8px;
padding:4px 10px;
font-size:12px;
cursor:pointer;
"

>

Select Attendees

</button>

<button

type="button"

onclick="clearRecipients()"

style="
padding:4px 10px;
font-size:12px;
cursor:pointer;
"

>

Clear All

</button>

</div>

</div>

<div
    id="recipient-list"
    style="
        max-height:220px;
        overflow-y:auto;
        border:1px solid #d1d5db;
        border-radius:8px;
        padding:12px;
        background:#fafafa;
    "
></div>

<div style="
    margin-top:10px;
    font-size:13px;
    color:#6b7280;
">

Selected:
<span id="selected-count">
${selectedRecipients.length}
</span>

</div>

<hr style="margin:24px 0;">

<div style="
margin-bottom:18px;
padding:14px;
border:1px solid #d1d5db;
border-radius:8px;
background:#fafafa;
">

<label style="
display:flex;
align-items:center;
gap:10px;
cursor:pointer;
font-weight:600;
">

<input

id="send-copy"

type="checkbox"

>

Send me a copy

</label>

<div style="
margin:8px 0 18px 28px;
font-size:13px;
color:#6b7280;
">

A copy will be sent to your instructor email address.

</div>

<label style="
display:block;
font-weight:700;
margin-bottom:6px;
">

Additional Recipient (Staff Copy)

</label>

<input

id="cc-email"

type="email"

placeholder="name@example.com"

style="
width:100%;
padding:10px;
border:1px solid #d1d5db;
border-radius:8px;
"

>

</div>

<div style="
display:flex;
justify-content:flex-end;
gap:12px;
margin-top:24px;
">

<button

id="cancel-communication"

type="button"

style="
padding:10px 20px;
"

onclick="closeEventCommunication()"

>

Cancel

</button>

<button

id="send-communication"

type="button"

style="
padding:10px 20px;
background:#19304B;
color:white;
border:none;
border-radius:6px;
cursor:pointer;
"

onclick="sendCommunication()"

>

${reviewMode
    ? 'Send Review'
    : 'Send Email'}

</button>

</div>

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
