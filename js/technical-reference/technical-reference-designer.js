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
        margin-bottom:14px;
    "
>
    ${region.documentKey}
</div>

<table
    style="
        width:100%;
        border-collapse:collapse;
        font-size:13px;
    "
>

<tr>
    <td style="padding:2px 0;">Left</td>
    <td align="right">
        <input
            id="designerLeft"
            type="number"
            step="0.001"
            value="${region.leftPercent}"
            style="width:72px;"
        >
    </td>
</tr>

<tr>
    <td style="padding:2px 0;">Top</td>
    <td align="right">
        <input
            id="designerTop"
            type="number"
            step="0.001"
            value="${region.topPercent}"
            style="width:72px;"
        >
    </td>
</tr>

<tr>
    <td style="padding:2px 0;">Width</td>
    <td align="right">
        <input
            id="designerWidth"
            type="number"
            step="0.001"
            value="${region.widthPercent}"
            style="width:72px;"
        >
    </td>
</tr>

<tr>
    <td style="padding:2px 0;">Height</td>
    <td align="right">
        <input
            id="designerHeight"
            type="number"
            step="0.001"
            value="${region.heightPercent}"
            style="width:72px;"
        >
    </td>
</tr>

</table>

<div
    style="
        margin-top:14px;
        text-align:right;
    "
>

<button
    onclick="applyDesignerCoordinates();"
>
    Apply
</button>

</div>

`;

}

/*
==============================================================================
 Apply Designer Coordinates
==============================================================================
*/

function applyDesignerCoordinates(){

    const region =
        technicalReferenceState.designer.selectedRegion;

    if(!region){
        return;
    }

    region.leftPercent =
        parseFloat(
            document.getElementById(
                'designerLeft'
            ).value
        );

    region.topPercent =
        parseFloat(
            document.getElementById(
                'designerTop'
            ).value
        );

    region.widthPercent =
        parseFloat(
            document.getElementById(
                'designerWidth'
            ).value
        );

    region.heightPercent =
        parseFloat(
            document.getElementById(
                'designerHeight'
            ).value
        );

    renderRoadmapHotspots();

    renderSelectedRegion();

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
