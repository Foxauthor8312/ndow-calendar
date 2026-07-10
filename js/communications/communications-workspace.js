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

<div class="comm-sidebar-section">

    <div class="comm-event-title">
        ${event.title}
    </div>

    <div class="comm-id">
        Event #${event.id}
    </div>

    <div class="comm-program">
        ${event.program || ''}
    </div>

</div>

<div class="comm-sidebar-section">

    <div class="comm-label">
        Status
    </div>

    <div class="comm-value">
        ${event.status || 'Registration Open'}
    </div>

    <div class="comm-label">
        Date / Time
    </div>

    <div class="comm-value">
        ${event.time || event.date || ''}
    </div>

    <div class="comm-label">
        Location
    </div>

    <div class="comm-value">
        ${event.location || ''}
    </div>

</div>

<hr class="comm-divider">

<div class="comm-sidebar-heading">
    Communications
</div>

<button
    class="comm-nav active"
    onclick="
        setActiveCommNav(this);
        loadCompose();
    "
>
    Reminder
</button>

<button
    class="comm-nav"
    onclick="
        setActiveCommNav(this);
        comingSoon('History');
    "
>
    History
</button>

<button
    class="comm-nav"
    onclick="
        setActiveCommNav(this);
        comingSoon('Templates');
    "
>
    Announcements
</button>

<hr class="comm-divider">

<div class="comm-sidebar-heading">
    Follow-Up
</div>

<button
    class="comm-nav"
    onclick="
        setActiveCommNav(this);
        loadAttendance();
    "
>
    Attendance
</button>

<button
    class="comm-nav"
    onclick="
        setActiveCommNav(this);
        loadReview();
    "
>
    Survey
</button>

<button
    class="comm-nav"
    onclick="
        setActiveCommNav(this);
        comingSoon('Automation');
    "
>
    Automation
</button>

<hr class="comm-divider">

<div id="communicationsStatusSummary">

    <div class="comm-status">

        <span class="comm-status-label">
            Registered
        </span>

        <span class="comm-status-value comm-count">
            —
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Reminder
        </span>

        <span class="comm-status-value">
            Not Sent
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Attendance
        </span>

        <span class="comm-status-value">
            Pending
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Survey
        </span>

        <span class="comm-status-value">
            Pending
        </span>

    </div>

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


