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
            margin-bottom:8px;
        ">
            Event #${event.id}
        </div>

        <div style="
            font-size:22px;
            font-weight:700;
            color:#19304B;
            margin-bottom:8px;
            line-height:1.3;
        ">
            ${event.title}
        </div>

        <div style="
            color:#2563eb;
            font-weight:600;
            margin-bottom:12px;
        ">
            ${event.program || ''}
        </div>

        <div style="margin-bottom:8px;">
            <strong>Status:</strong><br>
            ${event.status || 'Registration Open'}
        </div>

        <div style="margin-bottom:8px;">
            <strong>Date & Time:</strong><br>
            ${event.time || event.date || ''}
        </div>

        <div style="margin-bottom:20px;">
            <strong>Location:</strong><br>
            ${event.location || ''}
        </div>

        <hr>

        <button
            class="comm-nav"
            onclick="loadCompose()"
        >
            📧 Compose Email
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
            📄 Templates
        </button>

        <button
            class="comm-nav"
            onclick="comingSoon('Attendance')"
        >
            ✓ Attendance
        </button>

        <button
            class="comm-nav"
            onclick="comingSoon('Thank You & Feedback')"
        >
            💬 Thank You & Feedback
        </button>

        <button
            class="comm-nav"
            onclick="comingSoon('Automation')"
        >
            ⚙ Automation
        </button>

    `;

    loadCompose();

};

window.closeCommunicationsWorkspace =
function(){

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
