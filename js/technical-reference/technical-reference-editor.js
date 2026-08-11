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

function enableHotspotEditor(){

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
            region.left + 'px';

        hotspot.style.top =
            region.top + 'px';

        hotspot.style.width =
            region.width + 'px';

        hotspot.style.height =
            region.height + 'px';

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

}

/*
==============================================================================
 Disable Editor
==============================================================================
*/

function disableHotspotEditor(){

    console.log(
        'Engineering Mode Disabled'
    );

}
