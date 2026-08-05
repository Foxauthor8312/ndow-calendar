/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference UI
------------------------------------------------------------------------------
 Module      : technical-reference-ui.js
 Layer       : Frontend UI

 Purpose:
    Builds the Technical Reference Workspace.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Build Workspace
==============================================================================
*/

function buildTechnicalReferenceWorkspace(){

    const root =
        document.getElementById(
            'technicalReferenceRoot'
        );

    if(!root){
        return;
    }

    root.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        height:100vh;
        background:#F8FAFC;
    "
>

    <!-- Header -->

    <div
        style="
            height:72px;
            background:#19304B;
            color:white;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:0 24px;
            border-bottom:1px solid #10263d;
        "
    >

        <div>

            <div
                style="
                    font-size:26px;
                    font-weight:700;
                "
            >

                NDOW Technical Reference

            </div>

            <div
                style="
                    font-size:13px;
                    opacity:.85;
                "
            >

                System Architecture • Developer Guide • Engineering Reference

            </div>

        </div>

        <button
            onclick="closeTechnicalReference()"
            style="
                background:white;
                color:#19304B;
                border:none;
                border-radius:6px;
                padding:8px 18px;
                cursor:pointer;
                font-weight:600;
            "
        >

            Close

        </button>

    </div>

    <!-- Body -->

    <div
        style="
            display:grid;
            grid-template-columns:320px 1fr;
            flex:1;
            overflow:hidden;
        "
    >

        <!-- Navigation -->

        <div
            style="
                background:#F4F8FB;
                border-right:1px solid #DBE3EC;
                padding:20px;
                overflow:auto;
            "
        >

            <input
                id="technicalReferenceSearch"
                type="search"
                placeholder="Search Technical Reference..."
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:10px;
                    margin-bottom:18px;
                    border:1px solid #CBD5E1;
                    border-radius:6px;
                "
            >

            <div
                style="
                    font-size:12px;
                    font-weight:700;
                    color:#64748B;
                    margin-bottom:10px;
                    letter-spacing:.05em;
                "
            >

                CONTENTS

            </div>

            <div
                id="technicalReferenceNavigation"
            >

            </div>

        </div>

        <!-- Content -->

        <div
            id="technicalReferenceContent"
            style="
                padding:34px;
                overflow:auto;
                background:white;
            "
        >

            <h1
                style="
                    color:#19304B;
                    margin-top:0;
                "
            >

                Welcome

            </h1>

            <p>

                Welcome to the NDOW Technical Reference.

            </p>

            <p>

                Select a topic from the navigation panel to begin.

            </p>

        </div>

    </div>

</div>

`;

}

/*
==============================================================================
 Render Navigation
==============================================================================
*/

function renderTechnicalNavigation(
    topics
){

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!nav){
        return;
    }

    nav.innerHTML = '';

    topics.forEach(topic=>{

        const item =
            document.createElement(
                'div'
            );

        item.className =
            'technical-reference-nav-item';

        item.textContent =
            topic.title;

        item.style.padding =
            '8px 4px';

        item.style.cursor =
            'pointer';

item.onclick = () => {

    document
        .querySelectorAll(
            '.technical-reference-nav-item'
        )
        .forEach(item => {

            item.style.fontWeight =
                '400';

            item.style.color =
                '#19304B';

            item.style.background =
                'transparent';

        });

    item.style.fontWeight =
        '600';

    item.style.background =
        '#E8F1FA';

    item.style.borderRadius =
        '6px';

    showTechnicalTopic(
        topic
    );

};

        nav.appendChild(
            item
        );

    });

}

/*
==============================================================================
 Show Topic
==============================================================================
*/

function showTechnicalTopic(topic){

    const panel =
        document.getElementById(
            'technicalReferenceContent'
        );

    if(!panel){
        return;
    }

    panel.innerHTML = `

<div
    style="
        max-width:900px;
        margin:auto;
    "
>

    <div
        style="
            font-size:34px;
            font-weight:700;
            color:#19304B;
            margin-bottom:10px;
        "
    >

        ${topic.title}

    </div>

    <div
        style="
            width:80px;
            height:3px;
            background:#589FD6;
            margin-bottom:26px;
        "
    ></div>

    <div
        style="
            line-height:1.7;
            font-size:16px;
            color:#334155;
        "
    >

        ${topic.content}

    </div>

</div>

`;

    panel.scrollTop = 0;

}
/*
==============================================================================
 Public
==============================================================================
*/

window.buildTechnicalReferenceWorkspace =
    buildTechnicalReferenceWorkspace;

window.renderTechnicalNavigation =
    renderTechnicalNavigation;

window.showTechnicalTopic =
    showTechnicalTopic;
