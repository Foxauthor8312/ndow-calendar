/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference.js
 Layer       : Frontend Controller

 Purpose:
    Initializes and manages the Engineering Knowledge Center Workspace.

 Responsibilities:
    • Open workspace
    • Close workspace
    • Initialize workspace
    • Load navigation
    • Load topics
    • Search topics
==============================================================================
*/

'use strict';

/*
==============================================================================
 Initialize Workspace
==============================================================================
*/

async function initializeTechnicalReference(){

    /*
    --------------------------------------------------------------------------
    Load topics from database
    --------------------------------------------------------------------------
    */

    if(
        !technicalReferenceState.initialized
    ){

        technicalReferenceState.topics =
            await loadTechnicalTopics();

        technicalReferenceState.initialized =
            true;

    }

    /*
    --------------------------------------------------------------------------
    Render database-driven navigation
    --------------------------------------------------------------------------
    */

    renderTechnicalNavigation(

        technicalReferenceState.topics

    );

}


/*
==============================================================================
 Open Workspace
==============================================================================
*/

async function openTechnicalReference(){

    const workspace =
        document.getElementById(
            'technicalReferenceWorkspace'
        );

    if(!workspace){
        return;
    }

    if(typeof closeDashboard === 'function'){
        closeDashboard();
    }

    workspace.classList.remove(
        'hidden'
    );

    workspace.style.display =
        'flex';

    /*
    --------------------------------------------------------------------------
    Build Engineering Knowledge Center Workspace
    --------------------------------------------------------------------------
    */

    buildTechnicalReferenceWorkspace();

    /*
    --------------------------------------------------------------------------
    Load Knowledge Center Navigation
    --------------------------------------------------------------------------
    */

    await initializeTechnicalReference();

}

/*
==============================================================================
 Close Workspace
==============================================================================
*/

function closeTechnicalReference(){

    const workspace =
        document.getElementById(
            'technicalReferenceWorkspace'
        );

    if(!workspace){
        return;
    }

    workspace.classList.add(
        'hidden'
    );

    workspace.style.display =
        'none';

}

/*
==============================================================================
 Load Topic
==============================================================================
*/

async function loadTechnicalReference(
    topicKey
){

    const topic =
        await loadTechnicalTopic(
            topicKey
        );

    if(!topic){
        return;
    }

    technicalReferenceState.currentTopic =
        topic;

    showTechnicalTopic(
        topic
    );

    setActiveTechnicalTopic(
        topicKey
    );

}

/*
==============================================================================
 Search
==============================================================================
*/

async function searchTechnicalReferenceTopics(){

    const search =
        document.getElementById(
            'technicalReferenceSearch'
        );

    if(!search){
        return;
    }

    const results =
        await searchTechnicalReference(

            search.value

        );

    renderTechnicalSearch(
        results
    );

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.openTechnicalReference =
    openTechnicalReference;

window.closeTechnicalReference =
    closeTechnicalReference;

window.loadTechnicalReference =
    loadTechnicalReference;

window.searchTechnicalReferenceTopics =
    searchTechnicalReferenceTopics;
