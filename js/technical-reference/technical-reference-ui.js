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
 Initializes the Engineering Knowledge Center workspace.
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

    injectTechnicalReferenceStyles();

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
     Navigation Panel
======================================================= -->

<div
    id="technicalReferenceSidebar"
    style="
        width:300px;
        background:#FFFFFF;
        border-right:1px solid #DBE3EC;
        display:flex;
        flex-direction:column;
    "
>

    <!-- ==================================================
         Navigation Header
    =================================================== -->

    <div
        id="technicalReferenceNavigationHeader"
        style="
            padding:14px 18px;
            border-bottom:1px solid #DBE3EC;
            font-size:14px;
            font-weight:600;
            color:#19304B;
            background:#F8FAFC;
        "
    >
        Navigation
    </div>

    <!-- ==================================================
         Dynamic Navigation
    =================================================== -->

    <div
        id="technicalReferenceNavigation"
        style="
            flex:1;
            overflow:auto;
            padding:14px;
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
                padding:30px;
                background:
                linear-gradient(
                    180deg,
                    #F5F9FC 0%,
                    #E4EEF7 40%,
                    #D2E1EF 100%
                );
            "
        ></div>

    </div>

</div>

`;

    renderOrientation();

}

function injectTechnicalReferenceStyles(){

    if(
        document.getElementById(
            'technicalReferenceStyles'
        )
    ){
        return;
    }

    const style =
        document.createElement(
            'style'
        );

    style.id =
        'technicalReferenceStyles';

    style.textContent = `

.technical-nav-button{

    width:100%;
    margin-bottom:10px;

    padding:10px 14px;

    border:none;
    border-radius:6px;

    font-family:'IBM Plex Sans',sans-serif;
    font-size:14px;
    font-weight:600;

    cursor:pointer;

    transition:.15s;

}

.technical-nav-button.primary{

    background:#19304B;
    color:#FFFFFF;

}

.technical-nav-button.secondary{

    background:#64748B;
    color:#FFFFFF;

}

.technical-nav-button:hover{

    opacity:.92;

}

`;

    document.head.appendChild(
        style
    );

}


/*
==============================================================================
 Presentation Navigation
------------------------------------------------------------------------------
 Displays navigation controls while viewing the EKC presentation pages.
==============================================================================
*/

function renderPresentationNavigation(
    title,
    buttons
){

    const header =
        document.getElementById(
            'technicalReferenceNavigationHeader'
        );

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!header || !nav){
        return;
    }

    header.textContent =
        title;

    nav.innerHTML =
        buttons;

}

/*
==============================================================================
 Render Orientation
------------------------------------------------------------------------------
 Displays the Engineering Knowledge Center Preamble.
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

    renderPresentationNavigation(

        'Engineering Knowledge Center',

        `

<button
    class="technical-nav-button secondary"
    onclick="
        closeTechnicalReference();
        if(typeof openDashboard==='function'){
            openDashboard();
        }
    "
>
    ✕ Close
</button>

<button
    class="technical-nav-button primary"
    onclick="showEngineeringRoadmap();"
>
    Continue →
</button>

`

    );

    panel.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        height:100%;
        padding:24px;
    "
>

    <img
    src="images/login/EKC-preamble.png"
    alt="Engineering Knowledge Center Preamble"
    style="
        width:100%;
        max-width:1850px;
        height:auto;
        border-radius:10px;
        box-shadow:
            0 20px 45px rgba(25,48,75,.20);
    "
>

</div>

`;

}


/*
==============================================================================
 Show Engineering Roadmap
------------------------------------------------------------------------------
 Purpose:
    Displays the Engineering Knowledge Center Roadmap.
==============================================================================
*/

function showEngineeringRoadmap(){

    const panel =
        document.getElementById(
            'technicalReferenceContent'
        );

    if(!panel){
        return;
    }

renderPresentationNavigation(

    'Engineering Roadmap',

    `

<button
    class="technical-nav-button secondary"
    onclick="
        closeTechnicalReference();
        if(typeof openDashboard==='function'){
            openDashboard();
        }
    "
>
    ✕ Close
</button>

<button
    class="technical-nav-button secondary"
    onclick="renderOrientation();"
>
    ← Back
</button>


`

);
    panel.innerHTML = `

<div
    style="
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        height:100%;
        padding:24px;
    "
>

    <div
        style="
            width:100%;
            max-width:1850px;
            background:rgba(255,255,255,.82);
            border:1px solid #DBE3EC;
            border-radius:18px;
            padding:24px;
            box-shadow:
                0 10px 35px rgba(25,48,75,.08);
        "
    >

<div
    style="
        position:relative;
        display:inline-block;
        width:100%;
        max-width:1850px;
    "
>

 <div
    id="ekcRoadmapContainer"
    style="
        position:relative;
        display:inline-block;
        width:100%;
        max-width:1850px;
    "
>

    <img
        src="images/login/EKC-panel.png"
        alt="Engineering Knowledge Center Roadmap"
        style="
            width:100%;
            height:auto;
            display:block;
            border-radius:10px;
            box-shadow:0 20px 45px rgba(25,48,75,.20);
        "
    >

  </div>

`;

enableRoadmapDesigner();

renderRoadmapHotspots();

initializeRoadmapDrawing();

}

/*
==============================================================================
 Render Navigation
------------------------------------------------------------------------------
 Displays the Engineering Center navigation tree.
==============================================================================
*/

function renderTechnicalNavigation(topics){

    const header =
        document.getElementById(
            'technicalReferenceNavigationHeader'
        );

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!header || !nav){
        return;
    }

    /*
    --------------------------------------------------------------------------
    Switch from Presentation Mode to Knowledge Center Mode.
    --------------------------------------------------------------------------
    */

    header.textContent =
        'Engineering Centers';

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
        ----------------------------------------------------------------------
        Engineering Center Header
        ----------------------------------------------------------------------
        */

        const centerHeader =
            document.createElement(
                'div'
            );

        centerHeader.style.marginTop =
            '16px';

        centerHeader.style.marginBottom =
            '8px';

        centerHeader.style.padding =
            '10px 12px';

        centerHeader.style.borderLeft =
            `4px solid ${centers[center].color}`;

        centerHeader.style.background =
            '#F8FAFC';

        centerHeader.style.borderRadius =
            '6px';

        centerHeader.style.fontSize =
            '13px';

        centerHeader.style.fontWeight =
            '700';

        centerHeader.style.color =
            '#19304B';

        centerHeader.style.cursor =
            'pointer';

        centerHeader.innerHTML = `

<span class="technical-arrow">▼</span>

<span style="margin-left:8px;">
    ${center}
</span>

`;

        nav.appendChild(
            centerHeader
        );

        /*
        ----------------------------------------------------------------------
        Topic Container
        ----------------------------------------------------------------------
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
        ----------------------------------------------------------------------
        Expand / Collapse
        ----------------------------------------------------------------------
        */

        let expanded = true;

        centerHeader.onclick = ()=>{

            expanded =
                !expanded;

            group.style.display =
                expanded
                    ? 'block'
                    : 'none';

            centerHeader.querySelector(
                '.technical-arrow'
            ).textContent =
                expanded
                    ? '▼'
                    : '►';

        };

        /*
        ----------------------------------------------------------------------
        Topics
        ----------------------------------------------------------------------
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
                '7px 12px';

            item.style.marginBottom =
                '2px';

            item.style.borderRadius =
                '6px';

            item.style.cursor =
                'pointer';

            item.style.fontSize =
                '13px';

            item.style.transition =
                '.15s';

            item.onmouseenter = ()=>{

                if(item.dataset.active==='true'){
                    return;
                }

                item.style.background =
                    '#F1F5F9';

            };

            item.onmouseleave = ()=>{

                if(item.dataset.active==='true'){
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
------------------------------------------------------------------------------
 Displays the selected Engineering Knowledge Center article.
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

        'Foundations' : '#19304B',
        'Architecture' : '#589FD6',
        'Portal Systems' : '#F29647',
        'Engineering & Operations' : '#7A9E7F'

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
        max-width:1100px;
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
            font-size:12px;
            font-weight:600;
            letter-spacing:.05em;
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
            font-size:24px;
            font-weight:600;
            color:#19304B;
            margin-bottom:12px;
            line-height:1.35;
        "
    >

        ${topic.title}

    </div>

    <div
        style="
            width:90px;
            height:3px;
            background:${color};
            margin-bottom:26px;
        "
    ></div>

    <!-- ==========================================================
         Metadata
    =========================================================== -->

    <div
        style="
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:16px;
            margin-bottom:30px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:18px;
            box-shadow:
                0 4px 12px rgba(25,48,75,.05);
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
            font-size:15px;
            line-height:1.9;
            color:#334155;
            margin-bottom:40px;
        "
    >

          ${topic.body || ''}

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


