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

<h2 style="margin-top:0;">
    ✓ Attendance
</h2>

<div style="
    font-size:22px;
    font-weight:700;
    color:#19304B;
    margin-bottom:8px;
">
    Attendance Roster
</div>

<div style="
    color:#4b5563;
    margin-bottom:20px;
">
    Check each student who attended.
</div>

<div
    id="attendance-list"
    style="
        border:1px solid #d1d5db;
        border-radius:8px;
        background:white;
        padding:16px;
        max-height:520px;
        overflow-y:auto;
    ">
</div>

<hr style="margin:24px 0;">

<div style="
    display:flex;
    justify-content:flex-end;
">

<button
    type="button"
    onclick="saveAttendance()"
    style="
        padding:10px 20px;
        background:#19304B;
        color:white;
        border:none;
        border-radius:6px;
        cursor:pointer;
    "
>
    Save Attendance
</button>

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

    roster.forEach(student=>{

        list.insertAdjacentHTML(

            'beforeend',

            `

<label style="
display:flex;
align-items:center;
padding:8px 0;
border-bottom:1px solid #eee;
">

<input
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

<div style="
font-weight:600;
">

${
    student.student_name ||
    student.name
}

</div>

<div style="
font-size:12px;
color:#6b7280;
">

${
    student.student_email ||
    student.email
}

</div>

</div>

</label>

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

window.saveAttendance =
    saveAttendance;

window.updateAttendance =
    updateAttendance;
