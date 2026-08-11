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
 Enable Editor
==============================================================================
*/

function enableRoadmapDesigner(){

    technicalReferenceState.editor.enabled =
        true;

    console.log(
        'Engineering Mode Enabled'
    );

}

/*
==============================================================================
 Render Roadmap Regions
------------------------------------------------------------------------------
 Creates the roadmap regions defined in technical-reference-hotspots.js.
==============================================================================
*/

function renderRoadmapRegions(){

    const container =
        document.getElementById(
            'ekcRoadmapContainer'
        );

    if(!container){
        return;
    }

 const roadmapImage =
    container.querySelector(
        'img'
    );
    
    if(!roadmapImage){
        return;
    }
    
    const imageWidth =
        roadmapImage.clientWidth;
    
    const imageHeight =
        roadmapImage.clientHeight;

    roadmapHotspots.forEach(region=>{

        const hotspot =
            document.createElement(
                'div'
            );

        hotspot.className =
            'roadmap-region';

        hotspot.dataset.documentKey =
            region.documentKey;

        hotspot.style.position =
            'absolute';

        hotspot.style.left =
            percentToPixels(
                region.leftPercent,
                imageWidth
            ) + 'px';
        
        hotspot.style.top =
            percentToPixels(
                region.topPercent,
                imageHeight
            ) + 'px';
        
        hotspot.style.width =
            percentToPixels(
                region.widthPercent,
                imageWidth
            ) + 'px';
        
        hotspot.style.height =
            percentToPixels(
                region.heightPercent,
                imageHeight
            ) + 'px';

        hotspot.style.background =
            'rgba(255,0,0,.20)';

        hotspot.style.border =
            '2px dashed #FF0000';

        hotspot.style.cursor =
            'pointer';

   hotspot.onclick = ()=>{

    if(
        technicalReferenceState.editor.enabled
    ){

        selectRoadmapRegion(
            region,
            hotspot
        );

        return;

    }

    loadTechnicalReference(
        region.documentKey
    );

};

        container.appendChild(
            hotspot
        );

    });

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

    technicalReferenceState.editor.selectedRegion =
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
        technicalReferenceState.editor.selectedRegion
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
        line-height:1.4;
        color:#334155;
    "
>
    L:${region.leftPercent}%&nbsp;&nbsp;
    T:${region.topPercent}%
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
 Disable Editor
==============================================================================
*/

function disableRoadmapDesigner(){

    console.log(
        'Engineering Mode Disabled'
    );

}
