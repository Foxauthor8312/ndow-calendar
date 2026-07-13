/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-workspace.js
 Layer       : Frontend Controller

 Purpose:
    Main controller for the Communications Workspace.

 Responsibilities:
    • Open workspace
    • Close workspace
    • Initialize communications modules
    • Load event information
    • Load roster
    • Load location
    • Load history

 Used By:
    • Event Details
==============================================================================
*/

'use strict';

import {

    getState,

    resetState,

    setCurrentEvent,

    setRoster,

    setLocation,

    setHistory

}

from

'./communications-state.js';

import {

    openCompose

}

from

'./communications-compose.js';

import {

    loadCommunicationLocation

}

from

'./communications-locations.js';

import {

    loadRoster,

    loadHistory

}

from

'./communications-api.js';


/*===========================================================================
    OPEN
===========================================================================*/

export async function openWorkspace(event){

    if(!event){

        return;

    }

    console.log(

        '[Communications] Opening Workspace',

        event

    );

    resetState();

    setCurrentEvent(

        event

    );

    showWorkspace();

    updateHeader(

        event

    );

    renderSidebar(

        event

    );

    await initializeWorkspace();

}


/*===========================================================================
    INITIALIZE
===========================================================================*/

async function initializeWorkspace(){

    const state =

        getState();

    try{

        const roster =

            await loadRoster(

                state.currentEvent.id

            );

        setRoster(

            roster

        );

    }

    catch(error){

        console.error(

            'Roster',

            error

        );

    }

    try{

        const location =

            await loadCommunicationLocation(

                state.currentEvent

            );

        setLocation(

            location

        );

    }

    catch(error){

        console.error(

            'Location',

            error

        );

    }

    try{

        const history =

            await loadHistory(

                state.currentEvent.id

            );

        setHistory(

            history

        );

    }

    catch(error){

        console.error(

            'History',

            error

        );

    }

    openCompose();

}


/*===========================================================================
    SHOW
===========================================================================*/

function showWorkspace(){

    const workspace =

        document.getElementById(

            'communicationsWorkspace'

        );

    if(

        workspace.parentElement !==

        document.body

    ){

        document.body.appendChild(

            workspace

        );

    }

    const modal =

        document.getElementById(

            'eventModal'

        );

    if(modal){

        modal.style.display =

            'none';

    }

    workspace.style.display =

        'block';

    workspace.style.zIndex =

        '99999';

}


/*===========================================================================
    CLOSE
===========================================================================*/

export function closeWorkspace(){

    resetState();

    const workspace =

        document.getElementById(

            'communicationsWorkspace'

        );

    if(workspace){

        workspace.style.display =

            'none';

    }

}


/*===========================================================================
    HEADER
===========================================================================*/

function updateHeader(event){

    const subtitle =

        document.getElementById(

            'communicationsHeaderSubtitle'

        );

    if(subtitle){

        subtitle.textContent =

            event.title;

    }

}


/*===========================================================================
    SIDEBAR
===========================================================================*/

function renderSidebar(event){

    const sidebar =

        document.getElementById(

            'communicationsSidebar'

        );

    if(!sidebar){

        return;

    }

    sidebar.innerHTML = `

<div class="comm-sidebar-section">

    <div class="comm-event-title">

        ${event.title}

    </div>

    <div class="comm-id">

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

<div class="comm-sidebar-heading">

    Communication History

</div>

<div id="communicationsHistory">

    Loading...

</div>

`;

}


/*===========================================================================
    GLOBALS
===========================================================================*/

window.openCommunicationsWorkspace =

    openWorkspace;

window.closeCommunicationsWorkspace =

    closeWorkspace;
