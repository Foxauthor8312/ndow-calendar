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
        technicalReferenceState.designer.currentSelection;

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
        background:#FFF;
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

    <label>Topic</label>

    <select
        id="roadmapTopic"
        style="
            width:100%;
            margin-top:6px;
            padding:8px;
        "
    >
        <option>Select Topic...</option>
    </select>

</div>

<div
    style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        font-size:13px;
    "
>

<div>
Left<br>
<b>${selection.leftPercent.toFixed(3)}%</b>
</div>

<div>
Top<br>
<b>${selection.topPercent.toFixed(3)}%</b>
</div>

<div>
Width<br>
<b>${selection.widthPercent.toFixed(3)}%</b>
</div>

<div>
Height<br>
<b>${selection.heightPercent.toFixed(3)}%</b>
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
    onclick="closeRoadmapRegionModal();"
>
Cancel
</button>

<button
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

/*
==============================================================================
 Save Roadmap Region
==============================================================================
*/

function saveRoadmapRegion(){

    const selection =
        technicalReferenceState.designer.currentSelection;

    if(!selection){
        return;
    }

    roadmapHotspots.push({

        id :
            crypto.randomUUID(),

        title :
            'New Region',

        documentKey :
            '',

        visible :
            true,

        leftPercent :
            selection.leftPercent,

        topPercent :
            selection.topPercent,

        widthPercent :
            selection.widthPercent,

        heightPercent :
            selection.heightPercent

    });

    closeRoadmapRegionModal();

    disableRoadmapDesigner();

    renderRoadmapHotspots();

}
