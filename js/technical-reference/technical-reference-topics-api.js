/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-topics-api.js
 Layer       : Frontend API

 Purpose:
    Loads Knowledge Topics.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Load Knowledge Topics
==============================================================================
*/

async function loadKnowledgeTopics(){

    const response =
        await fetch(

            `${API_BASE}/api/knowledge/topics`

        );

    const data =
        await response.json();

    return data.topics;

}
