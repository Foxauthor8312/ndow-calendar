
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
 Preserve Original Workspace
==============================================================================
*/

let technicalReferenceOriginalContent = null;

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

    /*
    --------------------------------------------------------------------------
    Preserve original workspace only once.
    --------------------------------------------------------------------------
    */

    if(technicalReferenceOriginalContent === null){

        technicalReferenceOriginalContent =
            workspace.innerHTML;

    }

    /*
    --------------------------------------------------------------------------
    Temporary Engineering Knowledge Center Preview
    --------------------------------------------------------------------------
    */

    workspace.innerHTML = `
        <div style="
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background:#F8FAFC;
            overflow:auto;
            padding:40px;
        ">

            <div style="
                font-family:'IBM Plex Sans',sans-serif;
                font-size:28px;
                font-weight:600;
                color:#19304B;
                margin-bottom:24px;
            ">
                Engineering Knowledge Center
            </div>

            <img
                src="images/login/EKC-panel.png"
                alt="Engineering Knowledge Center"
                style="
                  max-width:95%;
                  max-height:85vh;
                  width:auto;
                  height:auto;
                  display:block;
                  border-radius:12px;
                  box-shadow:0 10px 30px rgba(0,0,0,.15);
              "
            >

        </div>
    `;

    return;

    /*
    --------------------------------------------------------------------------
    Existing implementation
    --------------------------------------------------------------------------

    buildTechnicalReferenceWorkspace();

    await initializeTechnicalReference();
    */

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

    /*
    --------------------------------------------------------------------------
    Restore original workspace for future use.
    --------------------------------------------------------------------------
    */

    if(technicalReferenceOriginalContent !== null){

        workspace.innerHTML =
            technicalReferenceOriginalContent;

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
