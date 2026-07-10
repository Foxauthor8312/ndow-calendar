/*
==========================================================
 NDOW Volunteer Portal
 Communications Attendance
==========================================================
*/

let roster = [];

async function openAttendance(event){

roster =
    await window.loadEventRoster(
        event.id
    );

    renderAttendance();

}

function renderAttendance(){

    const container =
        document.getElementById(
            'communicationsContent'
        );

    container.innerHTML = `

<div class="comm-card">

    <h2 class="comm-card-title">
        Attendance Roster
    </h2>

    <div class="comm-card-subtitle">
        Mark each participant who attended this event.
    </div>

    <div
        id="attendance-list"
        class="comm-table"
        style="
            max-height:520px;
            overflow-y:auto;
        "
    ></div>

    <div class="comm-flex-end comm-mt">

        <button
            type="button"
            class="comm-button"
            onclick="selectAllAttendance()"
        >
            Select All
        </button>

        <button
            type="button"
            class="comm-button"
            onclick="clearAttendance()"
        >
            Clear All
        </button>

        <button
            type="button"
            class="comm-button comm-button-primary"
            onclick="saveAttendance()"
        >
            Save Attendance
        </button>

    </div>

</div>

`;

    renderAttendanceList();

}

function renderAttendanceList(){

    const list =
        document.getElementById(
            'attendance-list'
        );

    list.innerHTML = '';

    roster.forEach(student => {

        list.insertAdjacentHTML(

            'beforeend',

            `

<div class="comm-row">

    <input
        class="comm-checkbox"
        type="checkbox"
        ${student.attended ? 'checked' : ''}
        onchange="
            updateAttendance(
                ${student.customer_id},
                this.checked
            )
        "
    >

    <div>

        <div class="comm-student">

            ${
                student.student_name ||
                student.name
            }

        </div>

        <div class="comm-email">

            ${
                student.student_email ||
                student.email
            }

        </div>

    </div>

</div>

`

        );

    });

}

function updateAttendance(
    customerId,
    attended
){

    const student =
        roster.find(

            s =>
                s.customer_id ===
                customerId

        );

    if(student){

        student.attended =
            attended;

    }

}

function selectAllAttendance(){

    roster.forEach(

        student =>

            student.attended = true

    );

    renderAttendanceList();

}

function clearAttendance(){

    roster.forEach(

        student =>

            student.attended = false

    );

    renderAttendanceList();

}

async function saveAttendance(){

    try{

        const result =

            await window.saveAttendanceRequest(

                window.currentCommunicationEvent.id,

                roster

            );

        alert(

            result.message ||

            'Attendance saved.'

        );

    }

    catch(err){

        console.error(err);

        alert(err.message);

    }

}



window.openAttendance =
    openAttendance;

window.selectAllAttendance =
    selectAllAttendance;

window.clearAttendance =
    clearAttendance;

window.saveAttendance =
    saveAttendance;

window.updateAttendance =
    updateAttendance;
