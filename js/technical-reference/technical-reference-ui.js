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

<!-- Content -->

<div
    id="technicalReferenceContent"
    style="
        padding:34px;
        overflow:auto;
        background:white;
    "
>

    <div
        style="
            max-width:900px;
            margin:0 auto;
            font-family:'IBM Plex Sans',sans-serif;
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
                margin:0 0 20px 0;
                font-size:26px;
                font-weight:600;
                color:#19304B;
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

            Welcome to the Engineering Knowledge Center (EKC), a
            centralized engineering reference system designed to preserve,
            organize, and connect engineering knowledge.

        </p>

        <p
            style="
                font-size:14px;
                line-height:1.8;
                color:#334155;
            "
        >

            Unlike a traditional technical manual, the EKC is organized
            around engineering concepts, system architecture, operational
            workflows, engineering decisions, and the relationships between
            them. Whether you are learning the system for the first time,
            troubleshooting a problem, or expanding an existing feature, the
            Engineering Knowledge Center provides a structured path to the
            information you need.

        </p>

        <div
            style="
                margin-top:36px;
                margin-bottom:30px;
            "
        >

            <div
                style="
                    font-size:20px;
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:18px;
                "
            >

                The Four Engineering Centers

            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:repeat(2,minmax(280px,1fr));
                    gap:18px;
                "
            >

                <div style="padding:18px;border:1px solid #DBE3EC;border-left:6px solid #19304B;border-radius:8px;">
                    <div style="font-size:17px;font-weight:600;color:#19304B;">Foundations</div>
                    <div style="margin-top:8px;font-size:14px;color:#475569;line-height:1.6;">
                        Learn the concepts, terminology, and engineering principles that support everything else.
                    </div>
                </div>

                <div style="padding:18px;border:1px solid #DBE3EC;border-left:6px solid #589FD6;border-radius:8px;">
                    <div style="font-size:17px;font-weight:600;color:#19304B;">Architecture</div>
                    <div style="margin-top:8px;font-size:14px;color:#475569;line-height:1.6;">
                        Understand how the system is designed and how its components work together.
                    </div>
                </div>

                <div style="padding:18px;border:1px solid #DBE3EC;border-left:6px solid #F29647;border-radius:8px;">
                    <div style="font-size:17px;font-weight:600;color:#19304B;">Portal Systems</div>
                    <div style="margin-top:8px;font-size:14px;color:#475569;line-height:1.6;">
                        Explore application features, workflows, and operational modules.
                    </div>
                </div>

                <div style="padding:18px;border:1px solid #DBE3EC;border-left:6px solid #7A9E7F;border-radius:8px;">
                    <div style="font-size:17px;font-weight:600;color:#19304B;">Engineering & Operations</div>
                    <div style="margin-top:8px;font-size:14px;color:#475569;line-height:1.6;">
                        Development, deployment, troubleshooting, and long-term maintenance.
                    </div>
                </div>

            </div>

        </div>

        <div
            style="
                background:#F8FAFC;
                border:1px solid #DBE3EC;
                border-radius:10px;
                padding:22px;
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
                    margin-bottom:20px;
                "
            >

                Use the navigation panel to browse Engineering Centers,
                search for topics, and follow Knowledge Connections
                throughout the system.

            </p>

            <button
                style="
                    background:#19304B;
                    color:white;
                    border:none;
                    border-radius:8px;
                    padding:12px 22px;
                    cursor:pointer;
                    font-weight:600;
                "
                onclick="alert('Engineering Roadmap coming next...')"
            >

                View Engineering Roadmap

            </button>

        </div>

        <div
            style="
                margin-top:40px;
                text-align:center;
                font-size:14px;
                color:#64748B;
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

</div>

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


