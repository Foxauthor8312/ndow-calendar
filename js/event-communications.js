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

    document.getElementById(
        'eventCommunicationModal'
    ).style.display = 'flex';

    await loadEventRoster(event.id);

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

        const response =
            await fetch(

`${API}/event-roster/${eventId}`,

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

console.log(result);

roster =
    Array.isArray(result)
        ? result
        : result.roster || [];

selectedRecipients =
    [...roster];

        console.log(
            'Roster loaded:',
            roster
        );

    }

    catch(err){

        console.error(err);

        alert(
            err.message
        );

    }

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

<div style="margin-bottom:20px;">

    <div style="
        font-size:20px;
        font-weight:700;
        color:#19304B;
        margin-bottom:6px;
    ">
        ${selectedEvent.title}
    </div>

    <div style="
        color:#4b5563;
        line-height:1.5;
    ">
        ${selectedEvent.date}<br>
        ${selectedEvent.location}
    </div>

</div>

<div style="margin-bottom:18px;">

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
        value="Reminder: ${selectedEvent.title}"
        style="
            width:100%;
            padding:10px;
            border:1px solid #d1d5db;
            border-radius:8px;
        "
    >

</div>

<div>

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
            padding:10px;
            border:1px solid #d1d5db;
            border-radius:8px;
        "
>Hello {{student_name}},

This is a reminder that you are registered for:

${selectedEvent.title}

Date:
${selectedEvent.date}

Location:
${selectedEvent.location}

We look forward to seeing you!

Nevada Department of Wildlife
Volunteer Program</textarea>

</div>

`;

}
