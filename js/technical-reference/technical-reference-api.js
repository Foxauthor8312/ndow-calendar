/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference API
------------------------------------------------------------------------------
 Module      : technical-reference-api.js
 Layer       : Frontend API

 Purpose:
    Technical Reference API interface.

 Responsibilities:
    • Load technical reference topics
    • Load individual topic

 Used By:
    • technical-reference.js
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

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await fetch(

                `${TECHNICAL_REFERENCE_API.BASE}${TECHNICAL_REFERENCE_API.TOPICS}`,

                {

                    headers:{

                        Authorization:
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json'

                    }

                }

            );

        const data =
            await response.json();

        if(!response.ok || !data.success){

            return [];

        }

        return data.topics || [];

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
