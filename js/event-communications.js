/*
==============================================================================
 NDOW Volunteer Portal
 Event Communications
------------------------------------------------------------------------------
 Module      : event-communications.js
 Layer       : Frontend Compatibility Bridge

 Purpose:
    Provides a compatibility bridge between the Event Details panel and the
    Communications Workspace.

 Responsibilities:
    • Launch Communications Workspace
    • Maintain backwards compatibility during migration

 Notes:
    All communications functionality now resides in:

        /js/communications2/

==============================================================================
*/

'use strict';

import {

    openWorkspace,

    closeWorkspace

}

from

'./communications2/communications-workspace.js';


/*==============================================================================
    OPEN
==============================================================================*/

window.openEventCommunication =

async function(event){

    if(!event){

        return;

    }

    await openWorkspace(

        event

    );

};


/*==============================================================================
    CLOSE
==============================================================================*/

window.closeEventCommunication =

function(){

    closeWorkspace();

};
