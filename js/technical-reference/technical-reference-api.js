/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference API
------------------------------------------------------------------------------
 Module      : technical-reference-api.js
 Layer       : Frontend API

 Purpose:
    Communicates with the Technical Reference API.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Load Categories
==============================================================================
*/

async function loadTechnicalCategories(){

    try{

        const response =
            await fetch(

                `${API_BASE}/api/help/topics?help_type=technical`,

                {
                    headers: authHeaders()
                }

            );

        const data =
            await response.json();

        if(!data.success){

            return [];

        }

        return data.topics;

    }

    catch(error){

        console.error(
            'Unable to load technical categories:',
            error
        );

        return [];

    }

}

/*
==============================================================================
 Load Topic
==============================================================================
*/

async function loadTechnicalTopic(topicKey){

    try{

        const response =
            await fetch(

                `${API_BASE}/api/help/topic/${topicKey}`,

                {
                    headers: authHeaders()
                }

            );

        const data =
            await response.json();

        if(!data.success){

            return null;

        }

        return data.topic;

    }

    catch(error){

        console.error(
            'Unable to load technical topic:',
            error
        );

        return null;

    }

}

/*
==============================================================================
 Search Technical Reference
==============================================================================
*/

async function searchTechnicalReference(searchText){

    try{

        const response =
            await fetch(

                `${API_BASE}/api/help/search?q=${
                    encodeURIComponent(searchText)
                }&help_type=technical`,

                {
                    headers: authHeaders()
                }

            );

        const data =
            await response.json();

        if(!data.success){

            return [];

        }

        return data.results;

    }

    catch(error){

        console.error(
            'Technical Reference search failed:',
            error
        );

        return [];

    }

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.loadTechnicalCategories =
    loadTechnicalCategories;

window.loadTechnicalTopic =
    loadTechnicalTopic;

window.searchTechnicalReference =
    searchTechnicalReference;
