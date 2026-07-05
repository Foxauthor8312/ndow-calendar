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

let currentCommunicationEvent = null;

let communicationRoster = [];

let selectedRecipients = [];

async function openEventCommunication(event){

    currentCommunicationEvent = event;

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

//==================================================
// Load Event Roster
//==================================================

async function loadEventRoster(eventId) {

    try {

        const response =
            await fetch(

                `${API_BASE}/api/event-roster/${eventId}`,

                {

                    headers: {

                        Authorization:

                            `Bearer ${authToken}`

                    }

                }

            );

        if (!response.ok)
            throw new Error(
                'Unable to load roster.'
            );

        roster =
            await response.json();

        selectedRecipients =
            [...roster];

        renderRecipientList();

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

//==================================================
// Recipient List
//==================================================

function renderRecipientList() {

    const list =
        document.getElementById(
            'recipient-list'
        );

    list.innerHTML = '';

    roster.forEach(student => {

        const checked =
            selectedRecipients.find(

                r =>

                r.customer_id ===

                student.customer_id

            )

            ? 'checked'

            : '';

        list.insertAdjacentHTML(

            'beforeend',

            `
<label class="recipient">

<input
type="checkbox"

${checked}

onchange="toggleRecipient(${student.customer_id})">

${student.student_name}

</label>
`

        );

    });

}

function toggleRecipient(customerId) {

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

        selectedRecipients.push(student);

    }

}//==================================================
// Send Communication
//==================================================

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

            alert(
                'Please enter a subject.'
            );

            return;

        }

        if (!message) {

            alert(
                'Please enter a message.'
            );

            return;

        }

        if (selectedRecipients.length === 0) {

            alert(
                'Please select at least one recipient.'
            );

            return;

        }

await fetch(

        const result =
            await response.json();

        if (!response.ok)
            throw new Error(
                result.message
            );

        alert(

            `${result.recipients} email(s) sent successfully.`

        );

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}

