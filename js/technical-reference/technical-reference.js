/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference
------------------------------------------------------------------------------
 Module      : technical-reference.js
 Layer       : Frontend Controller

 Purpose:
    Initializes and manages the Technical Reference Workspace.

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

    if(
        technicalReferenceState.initialized
    ){
        return;
    }

technicalReferenceState.topics =
    await loadTechnicalTopics();

renderTechnicalNavigation(

    technicalReferenceState.topics

);

    technicalReferenceState.initialized =
        true;

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

buildTechnicalReferenceWorkspace();

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

    renderTechnicalTopic(
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
