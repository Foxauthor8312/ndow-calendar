/*
==========================================================
 NDOW Volunteer Portal
 Communications Workspace
==========================================================
*/


window.openCommunicationsWorkspace =
function(event){

    const workspace =
        document.getElementById(
            'communicationsWorkspace'
        );

     // Ensure the workspace is attached to <body>
    if (workspace.parentElement !== document.body) {

        document.body.appendChild(workspace);

    }

 console.log('Workspace:', workspace);

console.log(
    'Subtitle:',
    document.getElementById(
        'communicationsHeaderSubtitle'
    )
);

console.log(
    'Sidebar:',
    document.getElementById(
        'communicationsSidebar'
    )
);

console.log(
    'Content:',
    document.getElementById(
        'communicationsContent'
    )
);

    if(!workspace || !event){
        return;
    }

    // Remember the current event

    window.currentCommunicationEvent =
        event;
 
    window.inCommunicationsWorkspace =
    true;

    // Hide the Event Details modal

    const modal =
        document.getElementById(
            'eventModal'
        );

    if(modal){
        modal.style.display = 'none';
    }

    // Show Communications Workspace

    workspace.style.display =
        'block';
    workspace.style.zIndex = '99999';

    // Header

    document.getElementById(
        'communicationsHeaderSubtitle'
    ).textContent =
        event.title;

    // Sidebar

   document.getElementById(
    'communicationsSidebar'
).innerHTML = `

    <div style="
        font-size:13px;
        color:#6b7280;
        font-weight:700;
        margin-bottom:6px;
    ">
        Event #${event.id}
    </div>

    <div style="
        font-size:22px;
        font-weight:700;
        color:#19304B;
        line-height:1.3;
        margin-bottom:8px;
    ">
        ${event.title}
    </div>

    <div style="
        color:#2563eb;
        font-weight:600;
        margin-bottom:14px;
    ">
        ${event.program || ''}
    </div>

    <div style="
        font-size:14px;
        margin-bottom:8px;
    ">
        ${event.status || 'Registration Open'}
    </div>

    <div style="
        font-size:14px;
        margin-bottom:8px;
    ">
        ${event.time || event.date || ''}
    </div>

    <div style="
        font-size:14px;
        margin-bottom:18px;
        line-height:1.4;
    ">
        ${event.location || ''}
    </div>

    <hr style="margin:18px 0;">

    <div style="
        font-size:11px;
        font-weight:700;
        color:#6b7280;
        letter-spacing:.08em;
        margin-bottom:8px;
    ">
        COMMUNICATIONS
    </div>

    <button
        class="comm-nav active"
        onclick="loadCompose()"
    >
        📧 Reminder
    </button>

    <button
        class="comm-nav"
        onclick="comingSoon('History')"
    >
        📜 History
    </button>

    <button
        class="comm-nav"
        onclick="comingSoon('Templates')"
    >
        📄 Announcements
    </button>

    <hr style="margin:18px 0;">

    <div style="
        font-size:11px;
        font-weight:700;
        color:#6b7280;
        letter-spacing:.08em;
        margin-bottom:8px;
    ">
        EVENT FOLLOW-UP
    </div>

     <button
       class="comm-nav"
       onclick="loadAttendance()"
   >
       ✓ Attendance
   </button>

    <button
        class="comm-nav"
        onclick="loadReview()"
    >
        💬 Survey
    </button>

    <button
        class="comm-nav"
        onclick="comingSoon('Automation')"
    >
        ⚙ Automation
    </button>

    <hr style="margin:18px 0;">

    <div
        id="communicationsStatusSummary"
        style="
            font-size:13px;
            color:#6b7280;
            line-height:1.8;
        "
    >
        <div>Recipients: —</div>
        <div>Reminder: Not Sent</div>
        <div>Attendance: Pending</div>
        <div>Survey: Pending</div>
    </div>

`;

loadCompose();

};

window.closeCommunicationsWorkspace =
function(){

    window.inCommunicationsWorkspace =
        false;

    document.getElementById(
        'communicationsWorkspace'
    ).style.display =
        'none';

};

window.loadCompose =
function(){

    if(
        typeof openEventCommunication ===
        'function'
    ){

        openEventCommunication(
            window.currentCommunicationEvent
        );

    }
    else{

        document.getElementById(
            'communicationsContent'
        ).innerHTML = `
            <h2>
                Compose Email
            </h2>

            <p>
                Communications module
                has not loaded.
            </p>
        `;

    }

};

window.loadAttendance =
function(){

    if(
        typeof openAttendance ===
        'function'
    ){

        openAttendance(
            window.currentCommunicationEvent
        );

    }

};

window.comingSoon =
function(name){

    document.getElementById(
        'communicationsContent'
    ).innerHTML = `

        <h2>${name}</h2>

        <p>
            This module will be
            implemented in a future
            release.
        </p>

    `;

};

window.loadAttendance =
function(){

    if(
        typeof openAttendance ===
        'function'
    ){

        openAttendance(
            window.currentCommunicationEvent
        );

    }

};
