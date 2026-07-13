/*
==========================================================
 NDOW Volunteer Portal
 Communications Workspace
----------------------------------------------------------
 Purpose:
    Main Communications Workspace controller.

 Responsibilities:
    • Open/Close workspace
    • Store current event
    • Render Event Context sidebar
    • Launch Compose workspace

 NOTE:
    All communication functions (preview, templates,
    recipients, sending, etc.) are handled by their
    individual modules.
==========================================================
*/

'use strict';

/*=========================================================
  OPEN WORKSPACE
=========================================================*/

window.openCommunicationsWorkspace = function (event) {

    if (!event) return;

    console.log(
        '[Communications] Opening workspace',
        event
    );

    window.currentCommunicationEvent = event;
    window.inCommunicationsWorkspace = true;

    const workspace =
        document.getElementById(
            'communicationsWorkspace'
        );

    if (!workspace) {
        console.error(
            'Communications workspace not found.'
        );
        return;
    }

    if (
        workspace.parentElement !==
        document.body
    ) {
        document.body.appendChild(
            workspace
        );
    }

    const eventModal =
        document.getElementById(
            'eventModal'
        );

    if (eventModal) {
        eventModal.style.display = 'none';
    }

    workspace.style.display = 'block';
    workspace.style.zIndex = '99999';

    renderCommunicationsSidebar(event);

    document.getElementById(
        'communicationsHeaderSubtitle'
    ).textContent =
        `${event.title}`;

    loadCompose();

};


/*=========================================================
  CLOSE WORKSPACE
=========================================================*/

window.closeCommunicationsWorkspace = function () {

    window.inCommunicationsWorkspace = false;

    const workspace =
        document.getElementById(
            'communicationsWorkspace'
        );

    if (workspace) {
        workspace.style.display = 'none';
    }

};


/*=========================================================
  SIDEBAR
=========================================================*/

function renderCommunicationsSidebar(event) {

    const sidebar =
        document.getElementById(
            'communicationsSidebar'
        );

    if (!sidebar) return;

    sidebar.innerHTML = `

<div class="comm-sidebar-section">

    <div
        style="
            font-size:22px;
            font-weight:700;
            color:#19304B;
            margin-bottom:6px;
        ">
        Event
    </div>

    <div
        class="comm-event-title">
        ${event.title}
    </div>

    <div
        class="comm-id">
        Event #${event.id}
    </div>

</div>


<div class="comm-sidebar-section">

    <div class="comm-label">
        Program
    </div>

    <div class="comm-value">
        ${event.program || '-'}
    </div>

    <div class="comm-label">
        Status
    </div>

    <div class="comm-value">
        ${event.status || 'Registration Open'}
    </div>

    <div class="comm-label">
        Date
    </div>

    <div class="comm-value">
        ${event.date || ''}
    </div>

    <div class="comm-label">
        Time
    </div>

    <div class="comm-value">
        ${event.time || ''}
    </div>

    <div class="comm-label">
        Location
    </div>

    <div class="comm-value">
        ${event.location || ''}
    </div>

</div>

<hr class="comm-divider">

<div
    class="comm-sidebar-heading">

    Communication Status

</div>

<div id="communicationsStatusSummary">

    <div class="comm-status">

        <span class="comm-status-label">
            Registered
        </span>

        <span
            id="registeredStudentCount"
            class="comm-status-value">
            —
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Reminder
        </span>

        <span
            id="reminderStatus"
            class="comm-status-value">
            Not Sent
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Attendance
        </span>

        <span
            id="attendanceStatus"
            class="comm-status-value">
            Pending
        </span>

    </div>

    <div class="comm-status">

        <span class="comm-status-label">
            Survey
        </span>

        <span
            id="surveyStatus"
            class="comm-status-value">
            Pending
        </span>

    </div>

</div>

<hr class="comm-divider">

<div
    class="comm-sidebar-heading">

    Communication History

</div>

<div
    id="communicationsHistoryContainer"
    style="
        font-size:13px;
        color:#666;
        line-height:1.6;
    ">

    Loading history...

</div>

`;

}


/*=========================================================
  COMPOSE
=========================================================*/

window.loadCompose = function () {

    if (
        typeof openEventCommunication ===
        'function'
    ) {

        openEventCommunication(
            window.currentCommunicationEvent
        );

        return;

    }

    document.getElementById(
        'communicationsContent'
    ).innerHTML = `

        <div
            style="
                padding:40px;
            ">

            <h2>
                Event Communications
            </h2>

            <p>

                Communications module
                is not available.

            </p>

        </div>

    `;

};
