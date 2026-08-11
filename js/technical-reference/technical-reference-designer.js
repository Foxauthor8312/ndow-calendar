/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-editor.js
 Layer       : Frontend Engineering Tools

 Purpose:
    Provides roadmap editing tools for Engineering Mode.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Enable Roadmap Designer
==============================================================================
*/

function enableRoadmapDesigner(){

    technicalReferenceState.designer.enabled =
        true;

    console.log(
        'Roadmap Designer Enabled'
    );

}


/*
==============================================================================
 Select Roadmap Region
==============================================================================
*/

function selectRoadmapRegion(
    region,
    hotspot
){

    technicalReferenceState.designer.selectedRegion =
        region;

    document
        .querySelectorAll(
            '.roadmap-region'
        )
        .forEach(item=>{

            item.style.border =
                '2px dashed #FF0000';

            item.style.background =
                'rgba(255,0,0,.20)';

        });

    hotspot.style.border =
        '2px solid #00AEEF';

    hotspot.style.background =
        'rgba(0,174,239,.25)';

    console.log(
        technicalReferenceState.designer.selectedRegion
    );

    renderSelectedRegion();

}

/*
==============================================================================
 Render Selected Region
==============================================================================
*/

function renderSelectedRegion(){

    const header =
        document.getElementById(
            'technicalReferenceNavigationHeader'
        );

    const nav =
        document.getElementById(
            'technicalReferenceNavigation'
        );

    if(
        !header ||
        !nav
    ){
        return;
    }

    const region =
        technicalReferenceState.designer.selectedRegion;

    header.textContent =
        'Engineering Roadmap';

    if(!region){

        nav.innerHTML = `

<hr style="margin:18px 0;">

<div
    style="
        font-size:15px;
        font-weight:600;
        color:#19304B;
        margin-bottom:10px;
    "
>
    Roadmap Designer
</div>

<div
    style="
        font-size:13px;
        color:#64748B;
    "
>
    No region selected.
</div>

`;

        return;

    }

    nav.innerHTML = `

<hr style="margin:18px 0;">

<div
    style="
        font-size:15px;
        font-weight:600;
        color:#19304B;
        margin-bottom:10px;
    "
>
    Roadmap Designer
</div>

<div
    style="
        font-size:14px;
        font-weight:600;
        color:#19304B;
    "
>
    ${region.title}
</div>

<div
    style="
        font-size:12px;
        color:#64748B;
        margin-bottom:10px;
    "
>
    ${region.documentKey}
</div>

<div
    style="
        font-size:13px;
        line-height:1.8;
        color:#334155;
    "
>

    Left

    <input
        id="designerLeft"
        type="number"
        step="0.001"
        value="${region.leftPercent}"
        style="
            width:70px;
            margin-left:8px;
            margin-right:18px;
        "
    >

    Top

    ${region.topPercent}%

</div>

<div
    style="
        font-size:13px;
        line-height:1.4;
        color:#334155;
        margin-bottom:10px;
    "
>
    W:${region.widthPercent}%&nbsp;&nbsp;
    H:${region.heightPercent}%
</div>

`;

}

/*
==============================================================================
 Disable Roadmap Designer
==============================================================================
*/

function disableRoadmapDesigner(){

    technicalReferenceState.designer.enabled =
        false;

    technicalReferenceState.designer.selectedRegion =
        null;

    console.log(
        'Roadmap Designer Disabled'
    );

}
