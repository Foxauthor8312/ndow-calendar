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
const API =
    'https://ndow-calendar-server.onrender.com/api';

let selectedRecipients = [];

let roster = [];

async function openEventCommunication(event){

    console.log('Opening event:', event);

    console.log('Event ID:', event.id);

    document.getElementById(
        'eventCommunicationModal'
    ).style.display = 'flex';

    await loadEventRoster(event.id);

    console.log('Roster after load:', roster);

    renderCommunicationModal();

}

function closeEventCommunication(){

    document.getElementById(
        'eventCommunicationModal'
    ).style.display = 'none';

}

async function loadEventRoster(eventId){

    try{

        const token =
            localStorage.getItem('token');

        console.log(
            'Request URL:',
            `${API}/event-communications/event-roster/${eventId}`
        );

        const response =
            await fetch(

                `${API}/event-communications/event-roster/${eventId}`,

                {

                    headers:{

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

        if(!response.ok){

            throw new Error(
                'Unable to load event roster.'
            );

        }

        const result =
            await response.json();

        console.log(
            'Roster response:',
            result
        );

        roster =
            Array.isArray(result)
                ? result
                : result.roster || [];

        selectedRecipients =
            [...roster];

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );

        if(!response.ok){

            throw new Error(
                'Unable to load event roster.'
            );

        }

const result =
    await response.json();

     console.log(
    'Roster response:',
    result
);

roster =
    Array.isArray(result)
        ? result
        : result.roster || [];

selectedRecipients =
    [...roster];

 
    }

    catch(err){

        console.error(err);

        alert(
            err.message
        );

    }

}

function renderRecipientList(){

    const list =
        document.getElementById(
            'recipient-list'
        );

    list.innerHTML = '';

    roster.forEach(student => {

        const checked =
            selectedRecipients.some(

                r =>
                    r.customer_id ===
                    student.customer_id

            ) ? 'checked' : '';

        list.insertAdjacentHTML(

            'beforeend',

            `
<label style="
display:block;
margin-bottom:8px;
">

<input
type="checkbox"
${checked}
onchange="toggleRecipient(${student.customer_id})"
>

${student.student_name}

<span style="
color:#6b7280;
font-size:12px;
">

(${student.student_email})

</span>

</label>
`

        );

    });

}

async function sendCommunication(){

    try{

        const token =
            localStorage.getItem('token');

        const subject =
            document.getElementById(
                'email-subject'
            ).value.trim();

        const message =
            document.getElementById(
                'email-message'
            ).value.trim();

        if (!subject) {
            alert('Please enter a subject.');
            return;
        }

        if (!message) {
            alert('Please enter a message.');
            return;
        }

        if (selectedRecipients.length === 0) {
            alert('Please select at least one recipient.');
            return;
        }

        const response =
            await fetch(

`${API}/event-communications/send`,

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json',

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    eventId:
                        selectedEvent.id,

                    eventName:
                        selectedEvent.title,

                    eventDate:
                        selectedEvent.date,

                    eventLocation:
                        selectedEvent.location,

                    subject,

                    message,

                    recipients:
                        selectedRecipients

                })

            }

        );

        const result =
            await response.json();

        if (!response.ok)
            throw new Error(result.message);

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
function renderCommunicationModal(){

    const container =
        document.getElementById(
            'eventCommunicationContent'
        );

    container.innerHTML = `

<div style="
    margin-bottom:20px;
">

    <div style="
        font-size:24px;
        font-weight:700;
        color:#19304B;
        margin-bottom:8px;
    ">
        ${selectedEvent.title}
    </div>

    <div style="
        color:#4b5563;
        line-height:1.6;
    ">
        ${selectedEvent.date}<br>
        ${selectedEvent.location}
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

value="Reminder - ${selectedEvent.title}"

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

Thank you for registering for this Nevada Department of Wildlife event.

Please review the attached event information before attending.

We look forward to seeing you.

</textarea>

<hr style="margin:24px 0;">

<h3 style="margin-bottom:12px;">

Recipients (${roster.length})

</h3>

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

</div>

`;

 renderRecipientList();

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

    document.getElementById(
        'selected-count'
    ).textContent =
        selectedRecipients.length;

}
