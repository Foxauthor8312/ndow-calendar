/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-hotspot-modal.js
 Layer       : Frontend Modal

 Purpose:
    Displays the Roadmap Region editor.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Open Roadmap Region Modal
==============================================================================
*/

function openRoadmapRegionModal(){

    const selection =
        technicalReferenceState
            .designer
            .currentSelection;

    if(!selection){
        return;
    }

    const html = `

<div
    id="roadmapRegionOverlay"
    style="
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:100000;
    "
>

    <div
        style="
            width:420px;
            background:#FFFFFF;
            border-radius:12px;
            padding:24px;
            box-shadow:0 20px 50px rgba(0,0,0,.25);
        "
    >

        <div
            style="
                font-size:20px;
                font-weight:700;
                color:#19304B;
                margin-bottom:20px;
            "
        >
            Create Roadmap Region
        </div>

        <div style="margin-bottom:14px;">

            <label
                style="
                    font-size:13px;
                    font-weight:600;
                    color:#334155;
                "
            >
                Topic
            </label>

            <select
                id="roadmapTopic"
                style="
                    width:100%;
                    margin-top:6px;
                    padding:8px;
                    border:1px solid #DBE3EC;
                    border-radius:6px;
                "
            >

                <option value="">
                    Select Topic...
                </option>

            </select>

        </div>

        <div
            style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:12px;
                font-size:13px;
                color:#334155;
            "
        >

            <div>
                Left<br>
                <strong>
                    ${selection.leftPercent.toFixed(3)}%
                </strong>
            </div>

            <div>
                Top<br>
                <strong>
                    ${selection.topPercent.toFixed(3)}%
                </strong>
            </div>

            <div>
                Width<br>
                <strong>
                    ${selection.widthPercent.toFixed(3)}%
                </strong>
            </div>

            <div>
                Height<br>
                <strong>
                    ${selection.heightPercent.toFixed(3)}%
                </strong>
            </div>

        </div>

        <div
            style="
                display:flex;
                justify-content:flex-end;
                gap:10px;
                margin-top:24px;
            "
        >

            <button
                type="button"
                onclick="closeRoadmapRegionModal();"
            >
                Cancel
            </button>

            <button
                type="button"
                onclick="saveRoadmapRegion();"
            >
                Save
            </button>

        </div>

    </div>

</div>

`;

    document
        .body
        .insertAdjacentHTML(
            'beforeend',
            html
        );

    loadRoadmapTopicOptions();

}

/*
==============================================================================
 Load Topic Options
==============================================================================
*/

async function loadRoadmapTopicOptions(){

    const select =
        document.getElementById(
            'roadmapTopic'
        );

    if(!select){
        return;
    }

    try{

        const response =
            await fetch(
                `${API_BASE}/api/knowledge/topics`
            );

        const data =
            await response.json();

        if(
            !data ||
            !data.success ||
            !Array.isArray(data.topics)
        ){
            return;
        }

        data.topics.forEach(topic=>{

            const option =
                document.createElement(
                    'option'
                );

            option.value =
                topic.id;

            option.textContent =
                topic.title ||
                topic.topic;

            select.appendChild(
                option
            );

        });

    }

    catch(error){

        console.error(
            'Unable to load roadmap topics:',
            error
        );

    }

}

/*
==============================================================================
 Save Roadmap Region
==============================================================================
*/

function saveRoadmapRegion(){

    const selection =
        technicalReferenceState
            .designer
            .currentSelection;

    if(!selection){
        return;
    }

    const topicSelect =
        document.getElementById(
            'roadmapTopic'
        );

    if(!topicSelect){
        return;
    }

    const topicId =
        topicSelect.value;

    if(!topicId){

        alert(
            'Please select a topic.'
        );

        return;

    }

    console.log(
        'Roadmap Region Ready:',
        {
            topicId,
            ...selection
        }
    );

}

/*
==============================================================================
 Close Roadmap Region Modal
==============================================================================
*/

function closeRoadmapRegionModal(){

    document
        .getElementById(
            'roadmapRegionOverlay'
        )
        ?.remove();

}
