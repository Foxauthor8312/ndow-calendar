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
------------------------------------------------------------------------------
 Replaces the existing buildTechnicalReferenceWorkspace() function.
==============================================================================
*/

function buildTechnicalReferenceWorkspace(){

    const workspace =
        document.getElementById(
            'technicalReferenceWorkspace'
        );

    if(!workspace){
        return;
    }

    workspace.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        height:100%;
        background:#F8FAFC;
        font-family:'IBM Plex Sans',sans-serif;
    "
>

    <!-- ==========================================================
         Header
    =========================================================== -->

    <div
        style="
            background:#19304B;
            color:white;
            padding:14px 24px;
            border-bottom:1px solid #16304A;
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:600;
            "
        >

            Engineering Knowledge Center

        </div>

        <div
            style="
                margin-top:2px;
                font-size:12px;
                opacity:.82;
            "
        >

            Preserving Engineering Knowledge

        </div>

    </div>

    <!-- ==========================================================
         Main Layout
    =========================================================== -->

    <div
        style="
            flex:1;
            display:flex;
            overflow:hidden;
        "
    >

        <!-- ======================================================
             Navigation
        ======================================================= -->

        <div
            style="
                width:350px;
                background:white;
                border-right:1px solid #DBE3EC;
                display:flex;
                flex-direction:column;
            "
        >

            <div
                style="
                    padding:16px;
                    border-bottom:1px solid #DBE3EC;
                "
            >

                <input
                    id="technicalReferenceSearch"
                    type="text"
                    placeholder="Search Engineering Knowledge..."
                    style="
                        width:100%;
                        padding:10px;
                        border:1px solid #DBE3EC;
                        border-radius:6px;
                        font-size:14px;
                        outline:none;
                    "
                >

            </div>

            <div
                id="technicalReferenceNavigation"
                style="
                    flex:1;
                    overflow:auto;
                    padding:18px;
                "
            ></div>

        </div>

        <!-- ======================================================
             Dynamic Content
        ======================================================= -->

        <div
            id="technicalReferenceContent"
            style="
                flex:1;
                overflow:auto;
                background:white;
                padding:28px 36px;
            "
        ></div>

    </div>

</div>

`;

    /*
    ==============================================================
    Initial Screen
    ==============================================================
    */

    renderOrientation();

}

/*
==============================================================================
 Render Orientation
------------------------------------------------------------------------------
 Purpose:
    Displays the Engineering Knowledge Center welcome page.
==============================================================================
*/

function renderOrientation(){

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
        max-width:980px;
        margin:auto;
    "
>

    <div
        style="
            font-size:14px;
            font-weight:600;
            color:#589FD6;
            text-transform:uppercase;
            letter-spacing:.08em;
            margin-bottom:8px;
        "
    >

        ENGINEERING KNOWLEDGE CENTER

    </div>

    <h1
        style="
            margin:0;
            font-size:28px;
            font-weight:600;
            color:#19304B;
        "
    >

        Welcome

    </h1>

    <div
        style="
            width:90px;
            height:3px;
            background:#589FD6;
            margin:18px 0 26px;
        "
    ></div>

    <p
        style="
            font-size:14px;
            line-height:1.8;
            color:#334155;
            margin-bottom:18px;
        "
    >

        Welcome to the Engineering Knowledge Center (EKC), a centralized
        engineering reference system designed to preserve, organize,
        and connect engineering knowledge throughout the life of the project.

    </p>

    <p
        style="
            font-size:14px;
            line-height:1.8;
            color:#334155;
            margin-bottom:34px;
        "
    >

        Unlike a traditional technical manual, the Engineering Knowledge
        Center is organized around engineering concepts, system
        architecture, operational workflows, engineering decisions,
        and the relationships between them.

    </p>

    <div
        style="
            font-size:20px;
            font-weight:600;
            color:#19304B;
            margin-bottom:20px;
        "
    >

        The Four Engineering Centers

    </div>

    <div
        style="
            display:grid;
            grid-template-columns:repeat(2,minmax(320px,1fr));
            gap:18px;
            margin-bottom:34px;
        "
    >

        <div
            style="
                border:1px solid #DBE3EC;
                border-left:6px solid #19304B;
                border-radius:8px;
                padding:18px;
            "
        >

            <div
                style="
                    font-size:17px;
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:10px;
                "
            >
                Foundations
            </div>

            <div
                style="
                    font-size:14px;
                    line-height:1.7;
                    color:#475569;
                "
            >
                Engineering concepts, terminology,
                technologies, and principles that
                support every other Engineering Center.
            </div>

        </div>

        <div
            style="
                border:1px solid #DBE3EC;
                border-left:6px solid #589FD6;
                border-radius:8px;
                padding:18px;
            "
        >

            <div
                style="
                    font-size:17px;
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:10px;
                "
            >
                Architecture
            </div>

            <div
                style="
                    font-size:14px;
                    line-height:1.7;
                    color:#475569;
                "
            >
                System architecture,
                infrastructure,
                engineering decisions,
                databases,
                and REST APIs.
            </div>

        </div>

        <div
            style="
                border:1px solid #DBE3EC;
                border-left:6px solid #F29647;
                border-radius:8px;
                padding:18px;
            "
        >

            <div
                style="
                    font-size:17px;
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:10px;
                "
            >
                Portal Systems
            </div>

            <div
                style="
                    font-size:14px;
                    line-height:1.7;
                    color:#475569;
                "
            >
                Learn the operational
                systems, workflows,
                and application modules
                that make up the portal.
            </div>

        </div>

        <div
            style="
                border:1px solid #DBE3EC;
                border-left:6px solid #7A9E7F;
                border-radius:8px;
                padding:18px;
            "
        >

            <div
                style="
                    font-size:17px;
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:10px;
                "
            >
                Engineering & Operations
            </div>

            <div
                style="
                    font-size:14px;
                    line-height:1.7;
                    color:#475569;
                "
            >
                Development,
                deployment,
                administration,
                troubleshooting,
                and long-term support.
            </div>

        </div>

    </div>

    <div
        style="
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:600;
                color:#19304B;
                margin-bottom:12px;
            "
        >

            Begin Exploring

        </div>

        <p
            style="
                font-size:14px;
                line-height:1.8;
                color:#475569;
                margin-bottom:22px;
            "
        >

            Browse the Engineering Centers,
            search for topics,
            or follow Knowledge Connections
            throughout the Engineering Knowledge Center.

        </p>

        <button
            style="
                background:#19304B;
                color:white;
                border:none;
                border-radius:8px;
                padding:12px 24px;
                cursor:pointer;
                font-size:14px;
                font-weight:600;
            "
            onclick="alert('Engineering Roadmap - Phase 2');"
        >

            Explore the Engineering Roadmap →

        </button>

    </div>

    <div
        style="
            margin-top:40px;
            text-align:center;
            color:#64748B;
            font-size:14px;
            font-style:italic;
            line-height:1.8;
        "
    >

        Build carefully.<br>
        Document thoroughly.<br>
        Preserve knowledge.<br>
        Strengthen the whole.<br>
        Leave the system better than you found it.

    </div>

</div>

`;

}
/*
==============================================================================
 Render Navigation
==============================================================================
*/

function renderTechnicalNavigation(topics){

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!nav){
        return;
    }

    nav.innerHTML = '';

    const centers = {

        'Foundations':{
            color:'#19304B'
        },

        'Architecture':{
            color:'#589FD6'
        },

        'Portal Systems':{
            color:'#F29647'
        },

        'Engineering & Operations':{
            color:'#7A9E7F'
        }

    };

    Object.keys(centers).forEach(center=>{

        const centerTopics =

            topics.filter(

                topic =>

                    topic.engineering_center === center

            );

        if(centerTopics.length === 0){
            return;
        }

        /*
        --------------------------------------------------------------
        Engineering Center Header
        --------------------------------------------------------------
        */

        const header =
            document.createElement(
                'div'
            );

        header.style.marginTop =
            '18px';

        header.style.marginBottom =
            '10px';

        header.style.padding =
            '10px 12px';

        header.style.borderLeft =
            `5px solid ${centers[center].color}`;

        header.style.background =
            '#F8FAFC';

        header.style.borderRadius =
            '6px';

        header.style.fontSize =
            '13px';

        header.style.fontWeight =
            '700';

        header.style.color =
            '#19304B';

        header.style.cursor =
            'pointer';

        header.innerHTML = `
            <span
                class="technical-arrow"
            >
                ▼
            </span>

            <span
                style="
                    margin-left:8px;
                "
            >
                ${center}
            </span>
        `;

        nav.appendChild(
            header
        );

        /*
        --------------------------------------------------------------
        Topic Group
        --------------------------------------------------------------
        */

        const group =
            document.createElement(
                'div'
            );

        group.style.marginBottom =
            '14px';

        nav.appendChild(
            group
        );

        /*
        --------------------------------------------------------------
        Expand / Collapse
        --------------------------------------------------------------
        */

        let expanded = true;

        header.onclick = ()=>{

            expanded =
                !expanded;

            group.style.display =
                expanded
                    ? 'block'
                    : 'none';

            header.querySelector(
                '.technical-arrow'
            ).textContent =
                expanded
                    ? '▼'
                    : '►';

        };

        /*
        --------------------------------------------------------------
        Topics
        --------------------------------------------------------------
        */

        centerTopics.forEach(topic=>{

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'technical-reference-nav-item';

            item.textContent =
                topic.title;

            item.style.padding =
                '8px 12px';

            item.style.marginBottom =
                '2px';

            item.style.borderRadius =
                '6px';

            item.style.cursor =
                'pointer';

            item.style.fontSize =
                '14px';

            item.style.transition =
                '.15s';

            item.onmouseenter = ()=>{

                if(
                    item.dataset.active === 'true'
                ){
                    return;
                }

                item.style.background =
                    '#F1F5F9';

            };

            item.onmouseleave = ()=>{

                if(
                    item.dataset.active === 'true'
                ){
                    return;
                }

                item.style.background =
                    'transparent';

            };

            item.onclick = ()=>{

                document
                    .querySelectorAll(
                        '.technical-reference-nav-item'
                    )
                    .forEach(link=>{

                        link.dataset.active =
                            'false';

                        link.style.background =
                            'transparent';

                        link.style.fontWeight =
                            '400';

                    });

                item.dataset.active =
                    'true';

                item.style.background =
                    '#E8F1FA';

                item.style.fontWeight =
                    '600';

                showTechnicalTopic(
                    topic
                );

            };

            group.appendChild(
                item
            );

        });

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

    const centerColors = {

        'Foundations' :
            '#19304B',

        'Architecture' :
            '#589FD6',

        'Portal Systems' :
            '#F29647',

        'Engineering & Operations' :
            '#7A9E7F'

    };

    const center =

        topic.engineering_center ||
        'Foundations';

    const color =

        centerColors[center] ||
        '#19304B';

    panel.innerHTML = `

<div
    style="
        max-width:980px;
        margin:auto;
    "
>

    <!-- ==========================================================
         Engineering Center Banner
    =========================================================== -->

    <div
        style="
            display:inline-block;
            background:${color};
            color:white;
            padding:6px 14px;
            border-radius:6px;
            font-size:13px;
            font-weight:600;
            letter-spacing:.04em;
            margin-bottom:18px;
        "
    >

        ${center}

    </div>

    <!-- ==========================================================
         Article Title
    =========================================================== -->

    <div
        style="
            font-size:26px;
            font-weight:600;
            color:#19304B;
            margin-bottom:12px;
        "
    >

        ${topic.title}

    </div>

    <div
        style="
            width:90px;
            height:3px;
            background:${color};
            margin-bottom:28px;
        "
    ></div>

    <!-- ==========================================================
         Metadata Card
    =========================================================== -->

    <div
        style="
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:18px;
            margin-bottom:32px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:8px;
            padding:18px;
        "
    >

        <div>

            <div
                style="
                    font-size:12px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Engineering Center
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                    font-weight:600;
                "
            >
                ${center}
            </div>

        </div>

        <div>

            <div
                style="
                    font-size:12px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Category
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                "
            >
                ${topic.category || '-'}
            </div>

        </div>

        <div>

            <div
                style="
                    font-size:12px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Difficulty
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                "
            >
                ${topic.difficulty || 'Standard'}
            </div>

        </div>

        <div>

            <div
                style="
                    font-size:12px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Reading Time
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                "
            >
                ${topic.reading_time || '5 min'}
            </div>

        </div>

    </div>

    <!-- ==========================================================
         Article
    =========================================================== -->

    <div
        style="
            font-size:14px;
            line-height:1.85;
            color:#334155;
            margin-bottom:40px;
        "
    >

        ${topic.content}

    </div>

    <!-- ==========================================================
         Knowledge Connections
    =========================================================== -->

    <div
        style="
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:8px;
            padding:22px;
            margin-bottom:36px;
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:600;
                color:#19304B;
                margin-bottom:12px;
            "
        >

            Knowledge Connections

        </div>

        <div
            style="
                font-size:14px;
                color:#64748B;
                line-height:1.8;
            "
        >

            Related Articles<br>
            Source Files<br>
            Database Tables<br>
            REST APIs<br>
            Engineering Notes

        </div>

    </div>

    <!-- ==========================================================
         Navigation
    =========================================================== -->

    <div
        style="
            display:flex;
            justify-content:space-between;
            border-top:1px solid #DBE3EC;
            padding-top:24px;
        "
    >

        <button
            id="technicalPreviousButton"
            class="secondary-button"
        >
            ← Previous
        </button>

        <button
            id="technicalNextButton"
            class="secondary-button"
        >
            Next →
        </button>

    </div>

</div>

`;

    panel.scrollTop = 0;

    technicalReferenceState.currentIndex =
        technicalReferenceState.topics.findIndex(

            t =>

                t.topic_key ===
                topic.topic_key

        );

    document
        .getElementById(
            'technicalPreviousButton'
        )
        .onclick =
            showPreviousTopic;

    document
        .getElementById(
            'technicalNextButton'
        )
        .onclick =
            showNextTopic;

}

/*
==============================================================================
 Previous Topic
==============================================================================
*/

function showPreviousTopic(){

    if(
        technicalReferenceState.currentIndex <= 0
    ){
        return;
    }

    technicalReferenceState.currentIndex--;

    showTechnicalTopic(

        technicalReferenceState.topics[
            technicalReferenceState.currentIndex
        ]

    );

}

/*
==============================================================================
 Next Topic
==============================================================================
*/

function showNextTopic(){

    if(

        technicalReferenceState.currentIndex >=

        technicalReferenceState.topics.length - 1

    ){
        return;
    }

    technicalReferenceState.currentIndex++;

    showTechnicalTopic(

        technicalReferenceState.topics[
            technicalReferenceState.currentIndex
        ]

    );

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


