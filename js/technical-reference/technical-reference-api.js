/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference API
------------------------------------------------------------------------------
 Module      : technical-reference-api.js
 Layer       : Frontend API
==============================================================================
*/

'use strict';

/*
==============================================================================
 Load Technical Topics
==============================================================================
*/

async function loadTechnicalTopics(){

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
            'Unable to load Technical Reference.',
            error
        );

        return [];

    }

}

/*
==============================================================================
 Load Single Topic
==============================================================================
*/

async function loadTechnicalTopic(topicKey){

    const topics =
        await loadTechnicalTopics();

    return topics.find(

        topic =>

            topic.topic_key === topicKey

    );

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.loadTechnicalTopics =
    loadTechnicalTopics;

window.loadTechnicalTopic =
    loadTechnicalTopic;
