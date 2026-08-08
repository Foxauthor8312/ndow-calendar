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

    <!-- Header -->

    <div
        style="
            background:#19304B;
            color:white;
            padding:18px 24px;
            border-bottom:1px solid #16304A;
        "
    >

        <div
            style="
                font-size:22px;
                font-weight:600;
            "
        >

            Engineering Knowledge Center

        </div>

        <div
            style="
                margin-top:4px;
                font-size:13px;
                opacity:.85;
            "
        >

            Engineering Reference System

        </div>

    </div>

    <!-- Body -->

    <div
        style="
            flex:1;
            display:flex;
            overflow:hidden;
        "
    >

        <!-- Navigation -->

        <div
            style="
                width:300px;
                background:white;
                border-right:1px solid #DBE3EC;
                display:flex;
                flex-direction:column;
            "
        >

            <div
                style="
                    padding:18px;
                    border-bottom:1px solid #DBE3EC;
                "
            >

                <input
                    id="technicalReferenceSearch"
                    type="text"
                    placeholder="Search Knowledge..."
                    style="
                        width:100%;
                        padding:10px;
                        border:1px solid #DBE3EC;
                        border-radius:6px;
                        font-size:14px;
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

        <!-- Content -->

        <div
            id="technicalReferenceContent"
            style="
                flex:1;
                overflow:auto;
                padding:36px;
                background:white;
            "
        >

            <div
                style="
                    max-width:900px;
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
                    "
                >

                    ENGINEERING KNOWLEDGE CENTER

                </div>

                <h1
                    style="
                        font-size:26px;
                        font-weight:600;
                        color:#19304B;
                        margin:12px 0 20px;
                    "
                >

                    Welcome

                </h1>

                <p
                    style="
                        font-size:14px;
                        line-height:1.8;
                        color:#334155;
                    "
                >

                    Welcome to the Engineering Knowledge Center (EKC),
                    a centralized engineering reference system designed
                    to preserve, organize, and connect engineering
                    knowledge.

                </p>

                <p
                    style="
                        font-size:14px;
                        line-height:1.8;
                        color:#334155;
                    "
                >

                    Select an Engineering Center or topic from the
                    navigation panel to begin exploring.

                </p>

                <button
                    style="
                        margin-top:30px;
                        background:#19304B;
                        color:white;
                        border:none;
                        border-radius:8px;
                        padding:12px 24px;
                        cursor:pointer;
                        font-weight:600;
                    "
                    onclick="alert('Roadmap coming next...');"
                >

                    View Engineering Roadmap

                </button>

            </div>

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

function renderTechnicalNavigation(topics){

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(!nav){
        return;
    }

    nav.innerHTML = '';

    // Group by Category

    const categories = {};

    topics.forEach(topic=>{

        if(!categories[topic.category]){

            categories[topic.category] = [];

        }

        categories[topic.category].push(topic);

    });

    Object.keys(categories).forEach(category=>{

        // Category Header
        
        const heading =
            document.createElement(
                'div'
            );
        
        heading.innerHTML = `
        
        <span>
        
            ▼
        
        </span>
        
        <span
            style="
                margin-left:8px;
            "
        >
        
            ${category}
        
        </span>
        
        `;
        
        heading.dataset.category =
            category;

        heading.style.fontSize =
            '12px';

        heading.style.fontWeight =
            '700';

        heading.style.color =
            '#64748B';

        heading.style.marginTop =
            '18px';

        heading.style.marginBottom =
            '8px';

        heading.style.textTransform =
            'uppercase';

        heading.style.letterSpacing =
            '.04em';
        heading.style.cursor =
            'pointer';

        heading.style.display =
            'flex';
        
        heading.style.alignItems =
            'center';
        
                nav.appendChild(
                    heading
        );

        // Topics
      const group =
           document.createElement(
               'div'
           );
       
       group.dataset.category =
           category;
       
       group.style.marginBottom =
           '10px';
       
       nav.appendChild(
           heading
       );
       
       nav.appendChild(
           group
       );

     
       
       // Topics
       
       categories[category].forEach(topic=>{

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'technical-reference-nav-item';

            item.textContent =
                topic.title;

            item.style.padding =
                '8px 10px';

            item.style.marginBottom =
                '2px';

            item.style.cursor =
                'pointer';

            item.style.borderRadius =
                '6px';

            item.style.transition =
                '.15s';

            item.onclick = ()=>{

                document
                    .querySelectorAll(
                        '.technical-reference-nav-item'
                    )
                    .forEach(link=>{

                        link.style.fontWeight =
                            '400';

                        link.style.background =
                            'transparent';

                    });

                item.style.fontWeight =
                    '600';

                item.style.background =
                    '#E8F1FA';

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

    panel.innerHTML = `

<div
    style="
        max-width:900px;
        margin:auto;
    "
>

    <div
        style="
            font-size:12px;
            color:#64748B;
            font-weight:600;
            text-transform:uppercase;
            letter-spacing:.08em;
            margin-bottom:10px;
        "
    >

        ${topic.category}

    </div>

    <div
        style="
            font-size:36px;
            font-weight:700;
            color:#19304B;
            margin-bottom:8px;
        "
    >

        ${topic.title}

    </div>

    <div
        style="
            width:90px;
            height:3px;
            background:#589FD6;
            margin-bottom:28px;
        "
    ></div>

    <div
        style="
            line-height:1.75;
            font-size:16px;
            color:#334155;
        "
    >

        ${topic.content}

    </div>

    <div
        style="
            margin-top:50px;
            padding-top:18px;
            border-top:1px solid #DBE3EC;
            display:flex;
            justify-content:space-between;
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

            t => t.topic_key === topic.topic_key

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


