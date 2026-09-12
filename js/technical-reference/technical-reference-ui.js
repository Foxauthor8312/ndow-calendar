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

 Data Source:
    knowledge_centers
        ↓
    knowledge_categories
        ↓
    knowledge_topics

 The navigation is database-driven.
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
        'Engineering Knowledge Center';

    nav.innerHTML = '';

    /*
    --------------------------------------------------------------------------
    Engineering Center Colors
    --------------------------------------------------------------------------
    */

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

    /*
    --------------------------------------------------------------------------
    Helper: Create Expand / Collapse Header
    --------------------------------------------------------------------------
    */

    function createSectionHeader(
        label,
        color,
        level = 0
    ){

        const header =
            document.createElement(
                'div'
            );

        header.style.marginTop =
            level === 0
                ? '16px'
                : '8px';

        header.style.marginBottom =
            '4px';

        header.style.padding =
            level === 0
                ? '10px 12px'
                : '7px 10px';

        header.style.borderLeft =
            `4px solid ${color}`;

        header.style.background =
            level === 0
                ? '#F8FAFC'
                : '#FFFFFF';

        header.style.borderRadius =
            '6px';

        header.style.fontSize =
            level === 0
                ? '13px'
                : '12px';

        header.style.fontWeight =
            '700';

        header.style.color =
            '#19304B';

        header.style.cursor =
            'pointer';

        header.innerHTML = `

<span class="technical-arrow">
    ▼
</span>

<span style="margin-left:8px;">
    ${label}
</span>

`;

        return header;

    }

    /*
    --------------------------------------------------------------------------
    START HERE
    --------------------------------------------------------------------------
    */

    const startHeader =
        createSectionHeader(
            'START HERE',
            '#19304B',
            0
        );

    nav.appendChild(
        startHeader
    );

    const startGroup =
        document.createElement(
            'div'
        );

    startGroup.style.marginBottom =
        '10px';

    nav.appendChild(
        startGroup
    );

    let startExpanded = true;

    startHeader.onclick = ()=>{

        startExpanded =
            !startExpanded;

        startGroup.style.display =
            startExpanded
                ? 'block'
                : 'none';

        startHeader.querySelector(
            '.technical-arrow'
        ).textContent =
            startExpanded
                ? '▼'
                : '►';

    };

    /*
    --------------------------------------------------------------------------
    Project History / Engineering Decisions
    --------------------------------------------------------------------------
    */

    const startItem =
        document.createElement(
            'div'
        );

    startItem.className =
        'technical-reference-nav-item';

    startItem.textContent =
        'Project History & Engineering Decisions';

    startItem.style.padding =
        '7px 12px 7px 28px';

    startItem.style.marginBottom =
        '2px';

    startItem.style.borderRadius =
        '6px';

    startItem.style.cursor =
        'pointer';

    startItem.style.fontSize =
        '13px';

    startItem.style.transition =
        '.15s';

    startItem.onmouseenter = ()=>{

        if(startItem.dataset.active === 'true'){
            return;
        }

        startItem.style.background =
            '#F1F5F9';

    };

    startItem.onmouseleave = ()=>{

        if(startItem.dataset.active === 'true'){
            return;
        }

        startItem.style.background =
            'transparent';

    };

    startItem.onclick = ()=>{

        document
            .querySelectorAll(
                '.technical-reference-nav-item'
            )
            .forEach(item=>{

                item.dataset.active =
                    'false';

                item.style.background =
                    'transparent';

                item.style.fontWeight =
                    '400';

            });

        startItem.dataset.active =
            'true';

        startItem.style.background =
            '#E8F1FA';

        startItem.style.fontWeight =
            '600';

        showTechnicalTopic({

            topic:
                'Project History & Engineering Decisions',

            summary:
                'Project history and engineering decisions.',

            definition:
                '',

            engineering_center:
                'Foundations',

            category:
                'Project History & Decisions'

        });

    };

    startGroup.appendChild(
        startItem
    );

    /*
    --------------------------------------------------------------------------
    Build Center / Category / Topic Hierarchy
    --------------------------------------------------------------------------
    */

    const centerMap =
        new Map();

    /*
    --------------------------------------------------------------------------
    Group topics by Engineering Center
    --------------------------------------------------------------------------
    */

    (topics || []).forEach(topic=>{

        const category =
            topic.knowledge_categories;

        if(!category){
            return;
        }

        const center =
            category.knowledge_centers;

        if(!center){
            return;
        }

        if(!centerMap.has(center.id)){

            centerMap.set(
                center.id,
                {
                    center,
                    categories:new Map()
                }
            );

        }

        const centerData =
            centerMap.get(
                center.id
            );

        if(
            !centerData.categories.has(
                category.id
            )
        ){

            centerData.categories.set(

                category.id,

                {
                    category,
                    topics:[]
                }

            );

        }

        centerData.categories
            .get(
                category.id
            )
            .topics
            .push(
                topic
            );

    });

    /*
    --------------------------------------------------------------------------
    Sort Engineering Centers
    --------------------------------------------------------------------------
    */

    const centers =
        Array.from(
            centerMap.values()
        )
        .sort(
            (a,b)=>
                (a.center.sort_order || 0)
                -
                (b.center.sort_order || 0)
        );

    /*
    --------------------------------------------------------------------------
    Render Engineering Centers
    --------------------------------------------------------------------------
    */

    centers.forEach(
        centerData=>{

            const center =
                centerData.center;

            const color =
                centerColors[
                    center.name
                ] ||
                '#19304B';

            const centerHeader =
                createSectionHeader(
                    center.name,
                    color,
                    0
                );

            nav.appendChild(
                centerHeader
            );

            const centerGroup =
                document.createElement(
                    'div'
                );

            centerGroup.style.marginBottom =
                '12px';

            nav.appendChild(
                centerGroup
            );

            let centerExpanded =
                true;

            centerHeader.onclick = ()=>{

                centerExpanded =
                    !centerExpanded;

                centerGroup.style.display =
                    centerExpanded
                        ? 'block'
                        : 'none';

                centerHeader.querySelector(
                    '.technical-arrow'
                ).textContent =
                    centerExpanded
                        ? '▼'
                        : '►';

            };

            /*
            ------------------------------------------------------------------
            Sort Categories
            ------------------------------------------------------------------
            */

            const categories =
                Array.from(
                    centerData.categories.values()
                )
                .sort(
                    (a,b)=>
                        (a.category.sort_order || 0)
                        -
                        (b.category.sort_order || 0)
                );

            /*
            ------------------------------------------------------------------
            Render Categories
            ------------------------------------------------------------------
            */

            categories.forEach(
                categoryData=>{

                    const category =
                        categoryData.category;

                    const categoryHeader =
                        createSectionHeader(
                            category.name,
                            color,
                            1
                        );

                    categoryHeader.style.marginLeft =
                        '10px';

                    categoryHeader.style.borderLeft =
                        `3px solid ${color}`;

                    centerGroup.appendChild(
                        categoryHeader
                    );

                    const categoryGroup =
                        document.createElement(
                            'div'
                        );

                    categoryGroup.style.marginBottom =
                        '6px';

                    centerGroup.appendChild(
                        categoryGroup
                    );

                    let categoryExpanded =
                        true;

                    categoryHeader.onclick = ()=>{

                        categoryExpanded =
                            !categoryExpanded;

                        categoryGroup.style.display =
                            categoryExpanded
                                ? 'block'
                                : 'none';

                        categoryHeader.querySelector(
                            '.technical-arrow'
                        ).textContent =
                            categoryExpanded
                                ? '▼'
                                : '►';

                    };

                    /*
                    --------------------------------------------------------------
                    Sort Topics
                    --------------------------------------------------------------
                    */

                    const categoryTopics =
                        categoryData.topics
                            .slice()
                            .sort(
                                (a,b)=>
                                    (a.sort_order || 0)
                                    -
                                    (b.sort_order || 0)
                            );

                    /*
                    --------------------------------------------------------------
                    Render Topics
                    --------------------------------------------------------------
                    */

                    categoryTopics.forEach(
                       topic=>{
                   
                           /*
                           ----------------------------------------------------------------------
                           START HERE Topic
                           ----------------------------------------------------------------------
                           Project History & Engineering Decisions is presented in the
                           START HERE learning path and should not appear a second time
                           in the normal Foundations navigation.
                           ----------------------------------------------------------------------
                           */
                   
                           if(
                               topic.topic ===
                               'Project History & Engineering Decisions'
                           ){
                               return;
                           }
                   
                           const item =
                               document.createElement(
                                   'div'
                               );

                            item.className =
                                'technical-reference-nav-item';

                            item.textContent =
                                topic.topic;

                            item.style.padding =
                                '6px 12px 6px 44px';

                            item.style.marginBottom =
                                '1px';

                            item.style.borderRadius =
                                '6px';

                            item.style.cursor =
                                'pointer';

                            item.style.fontSize =
                                '13px';

                            item.style.color =
                                '#334155';

                            item.style.transition =
                                '.15s';

                            item.onmouseenter = ()=>{

                                if(
                                    item.dataset.active ===
                                    'true'
                                ){
                                    return;
                                }

                                item.style.background =
                                    '#F1F5F9';

                            };

                            item.onmouseleave = ()=>{

                                if(
                                    item.dataset.active ===
                                    'true'
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
                                    .forEach(
                                        link=>{

                                            link.dataset.active =
                                                'false';

                                            link.style.background =
                                                'transparent';

                                            link.style.fontWeight =
                                                '400';

                                        }
                                    );

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

                            categoryGroup.appendChild(
                                item
                            );

                        }
                    );

                }
            );

        }
    );

}


/*
==============================================================================
 Show Topic
------------------------------------------------------------------------------
 Displays the selected Engineering Knowledge Center article.
==============================================================================
*/

/*
==============================================================================
 Show Knowledge Topic
------------------------------------------------------------------------------
 Displays a Knowledge Center topic using the database topic model.

 The Knowledge Center provides orientation and source references.
 The Technical Reference Manual remains the authoritative source.
==============================================================================
*/

function showTechnicalTopic(topic){

    const panel =
        document.getElementById(
            'technicalReferenceContent'
        );

    if(!panel || !topic){
        return;
    }

    /*
    --------------------------------------------------------------------------
    Engineering Center
    --------------------------------------------------------------------------
    */

    const category =
        topic.knowledge_categories ||
        {};

    const center =
        category.knowledge_centers ||
        {};

    const centerName =
        center.name ||
        topic.engineering_center ||
        'Engineering Knowledge Center';

    const categoryName =
        category.name ||
        topic.category ||
        '';


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

    const color =
        centerColors[
            centerName
        ] ||
        '#19304B';


    /*
    --------------------------------------------------------------------------
    Topic Data
    --------------------------------------------------------------------------
    */

    const title =
        topic.topic ||
        topic.title ||
        'Untitled Topic';

    const summary =
        topic.summary ||
        '';

    const definition =
        topic.definition ||
        '';

    const status =
        topic.status ||
        'Draft';

    const priority =
        topic.priority !== undefined
            ? topic.priority
            : '-';


    /*
    --------------------------------------------------------------------------
    Primary Technical Reference
    --------------------------------------------------------------------------
    */

    const references =
        Array.isArray(
            topic.knowledge_references
        )
            ? topic.knowledge_references
            : [];

    const primaryReference =
        references.find(
            reference =>
                reference.reference_type ===
                'primary'
        ) ||
        references[0] ||
        null;

const referencedDocument =
    primaryReference &&
    primaryReference.knowledge_documents
        ? primaryReference.knowledge_documents
        : null;


    /*
    --------------------------------------------------------------------------
    Render
    --------------------------------------------------------------------------
    */

    panel.innerHTML = `

<div
    style="
        max-width:1100px;
        margin:auto;
    "
>

    <!-- ==========================================================
         Engineering Center
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
        ${centerName}
    </div>


    <!-- ==========================================================
         Topic Title
    =========================================================== -->

    <div
        style="
            font-size:26px;
            font-weight:600;
            color:#19304B;
            margin-bottom:12px;
            line-height:1.35;
        "
    >
        ${title}
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
         Topic Metadata
    =========================================================== -->

    <div
        style="
            display:grid;
            grid-template-columns:
                repeat(4,minmax(0,1fr));

            gap:16px;

            margin-bottom:30px;

            background:#F8FAFC;

            border:1px solid #DBE3EC;

            border-radius:10px;

            padding:18px;

            box-shadow:
                0 4px 12px
                rgba(25,48,75,.05);
        "
    >

        <div>

            <div
                style="
                    font-size:11px;
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
                ${centerName}
            </div>

        </div>


        <div>

            <div
                style="
                    font-size:11px;
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
                ${categoryName || '-'}
            </div>

        </div>


        <div>

            <div
                style="
                    font-size:11px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Status
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                "
            >
                ${status}
            </div>

        </div>


        <div>

            <div
                style="
                    font-size:11px;
                    font-weight:600;
                    color:#64748B;
                    text-transform:uppercase;
                "
            >
                Priority
            </div>

            <div
                style="
                    margin-top:4px;
                    font-size:14px;
                    color:#19304B;
                "
            >
                ${priority}
            </div>

        </div>

    </div>


    <!-- ==========================================================
         Summary
    =========================================================== -->

    ${
        summary
            ? `

    <div
        style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
            margin-bottom:22px;
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
            Summary
        </div>

        <div
            style="
                font-size:15px;
                line-height:1.8;
                color:#334155;
            "
        >
            ${summary}
        </div>

    </div>

            `
            : ''
    }


    <!-- ==========================================================
         Definition
    =========================================================== -->

    ${
        definition
            ? `

    <div
        style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
            margin-bottom:22px;
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
            Definition
        </div>

        <div
            style="
                font-size:15px;
                line-height:1.8;
                color:#334155;
            "
        >
            ${definition}
        </div>

    </div>

            `
            : ''
    }


    <!-- ==========================================================
         Technical Reference
    =========================================================== -->

    <div
        style="
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
            margin-bottom:30px;
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:600;
                color:#19304B;
                margin-bottom:14px;
            "
        >
            Technical Reference
        </div>


           ${
            primaryReference && referencedDocument
                ? `

        <div
            style="
                font-size:15px;
                color:#334155;
                line-height:1.8;
            "
        >

            <div
                style="
                    font-weight:600;
                    color:#19304B;
                    margin-bottom:6px;
                "
            >
                ${referencedDocument.title || 'Technical Reference Manual'}
            </div>

            <div>
                Chapter ${primaryReference.chapter || '-'}
                ${
                    primaryReference.section
                        ? ` · Section ${primaryReference.section}`
                        : ''
                }
                ${
                    primaryReference.subsection
                        ? ` · ${primaryReference.subsection}`
                        : ''
                }
            </div>

            ${
                referencedDocument.version
                    ? `
            <div
                style="
                    margin-top:4px;
                    font-size:13px;
                    color:#64748B;
                "
            >
                Version ${referencedDocument.version}
            </div>
                    `
                    : ''
            }

            ${
                referencedDocument.document_key
                    ? `
            <div
                style="
                    margin-top:16px;
                "
            >
                <button
                    type="button"
                    class="technical-nav-button primary"
                    style="
                        width:auto;
                        margin:0;
                        padding:8px 16px;
                        font-size:13px;
                    "
                   onclick="
                       openTechnicalReferenceDocument(
                           '${referencedDocument.document_key}'
                       );
                   "
                >
                    Open Reference →
                </button>
            </div>
                    `
                    : ''
            }

        </div>

                `
                : `

        <div
            style="
                font-size:14px;
                color:#64748B;
                line-height:1.7;
            "
        >
            No authoritative Technical Reference
            has been linked to this topic yet.
        </div>

                `
        }


    <!-- ==========================================================
         Knowledge Connections
    =========================================================== -->

    <div
        style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
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

            ${
                references.length
                    ? `${references.length}
                       Technical Reference
                       connection${
                           references.length === 1
                               ? ''
                               : 's'
                       }`
                    : 'No additional connections recorded.'
            }

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


    /*
    --------------------------------------------------------------------------
    Current Topic Index
    --------------------------------------------------------------------------
    */

    technicalReferenceState.currentTopic =
        topic;

    technicalReferenceState.currentIndex =
        technicalReferenceState.topics.findIndex(

            item =>
                item.id ===
                topic.id

        );


    /*
    --------------------------------------------------------------------------
    Navigation Buttons
    --------------------------------------------------------------------------
    */

    const previousButton =
        document.getElementById(
            'technicalPreviousButton'
        );

    const nextButton =
        document.getElementById(
            'technicalNextButton'
        );

    if(previousButton){

        previousButton.onclick =
            showPreviousTopic;

        previousButton.disabled =
            technicalReferenceState.currentIndex <= 0;

    }

    if(nextButton){

        nextButton.onclick =
            showNextTopic;

        nextButton.disabled =
            technicalReferenceState.currentIndex < 0 ||
            technicalReferenceState.currentIndex >=
                technicalReferenceState.topics.length - 1;

    }

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
 Open Technical Reference Document
------------------------------------------------------------------------------
 Loads the authoritative Technical Reference Manual document by document_key
 and displays it inside the Engineering Knowledge Center.
==============================================================================
*/

async function openTechnicalReferenceDocument(
    documentKey
){

    if(!documentKey){
        return;
    }

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
        max-width:1100px;
        margin:auto;
    "
>

    <div
        style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:24px;
        "
    >

        <div
            style="
                font-size:14px;
                color:#64748B;
                margin-bottom:18px;
            "
        >
            Loading Technical Reference...
        </div>

    </div>

</div>

`;

    try{

        const documentData =
            await loadTechnicalTopic(
                documentKey
            );

        if(
            !documentData
        ){
            throw new Error(
                'Technical Reference document was not returned.'
            );
        }

        const documentTitle =
            documentData.title ||
            'Technical Reference Manual';

        const documentBody =
            documentData.body ||
            '';

        panel.innerHTML = `

<div
    style="
        max-width:1100px;
        margin:auto;
    "
>

    <div
        style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:20px;
            margin-bottom:24px;
        "
    >

        <button
            type="button"
            class="technical-nav-button secondary"
            style="
                width:auto;
                margin:0;
                padding:8px 16px;
                font-size:13px;
            "
            onclick="
                showTechnicalTopic(
                    technicalReferenceState.currentTopic
                );
            "
        >
            ← Back to Topic
        </button>

        ${
            documentData.version
                ? `
        <div
            style="
                font-size:13px;
                color:#64748B;
            "
        >
            Version ${documentData.version}
        </div>
                `
                : ''
        }

    </div>


    <div
        style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:10px;
            padding:30px;
            box-shadow:
                0 4px 12px
                rgba(25,48,75,.05);
        "
    >

        <div
            style="
                font-size:28px;
                font-weight:600;
                color:#19304B;
                line-height:1.35;
                margin-bottom:24px;
                padding-bottom:18px;
                border-bottom:1px solid #DBE3EC;
            "
        >
            ${documentTitle}
        </div>


    <div
    style="
        font-size:15px;
        line-height:1.8;
        color:#334155;
        white-space:pre-wrap;
    "
>
    ${documentBody}
</div>

    </div>

</div>

`;

        panel.scrollTop = 0;

    }
    catch(error){

        console.error(
            'Technical Reference document load failed:',
            error
        );

        panel.innerHTML = `

<div
    style="
        max-width:1100px;
        margin:auto;
    "
>

    <div
        style="
            background:#FFFFFF;
            border:1px solid #DC2626;
            border-radius:10px;
            padding:24px;
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:600;
                color:#DC2626;
                margin-bottom:10px;
            "
        >
            Technical Reference Unavailable
        </div>

        <div
            style="
                font-size:14px;
                color:#64748B;
                line-height:1.7;
            "
        >
            The authoritative Technical Reference document
            could not be loaded.
        </div>

        <button
            type="button"
            class="technical-nav-button secondary"
            style="
                width:auto;
                margin-top:18px;
            "
            onclick="
                showTechnicalTopic(
                    technicalReferenceState.currentTopic
                );
            "
        >
            ← Back to Topic
        </button>

    </div>

</div>

`;

    }

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

window.openTechnicalReferenceDocument =
    openTechnicalReferenceDocument;


