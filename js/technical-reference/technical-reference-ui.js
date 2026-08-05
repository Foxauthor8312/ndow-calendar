/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference UI
------------------------------------------------------------------------------
 Module      : technical-reference-ui.js
 Layer       : Frontend UI

 Purpose:
    User interface functions for the Technical Reference workspace.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Render Navigation
==============================================================================
*/

function renderTechnicalNavigation(topics){

    const container =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!container){
        return;
    }

    container.innerHTML = '';

    topics.forEach(topic => {

        const item =
            document.createElement(
                'div'
            );

        item.className =
            'technical-reference-nav-item';

        item.textContent =
            topic.title;

        item.onclick = () => {

            loadTechnicalReference(
                topic.topic_key
            );

        };

        container.appendChild(
            item
        );

    });

}

/*
==============================================================================
 Render Topic
==============================================================================
*/

function renderTechnicalTopic(topic){

    const container =
        document.getElementById(
            'technicalReferenceContent'
        );

    if(!container){
        return;
    }

    if(!topic){

        container.innerHTML =
            '<p>No topic selected.</p>';

        return;

    }

    container.innerHTML = `

        <h2>

            ${topic.title}

        </h2>

        <div>

            ${topic.content}

        </div>

    `;

}

/*
==============================================================================
 Render Search Results
==============================================================================
*/

function renderTechnicalSearch(results){

    renderTechnicalNavigation(
        results
    );

}

/*
==============================================================================
 Set Active Navigation Item
==============================================================================
*/

function setActiveTechnicalTopic(topicKey){

    document
        .querySelectorAll(
            '.technical-reference-nav-item'
        )
        .forEach(item => {

            item.classList.remove(
                'active'
            );

        });

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.renderTechnicalNavigation =
    renderTechnicalNavigation;

window.renderTechnicalTopic =
    renderTechnicalTopic;

window.renderTechnicalSearch =
    renderTechnicalSearch;

window.setActiveTechnicalTopic =
    setActiveTechnicalTopic;
