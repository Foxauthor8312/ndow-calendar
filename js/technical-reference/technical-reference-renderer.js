
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-renderer.js
 Layer       : Frontend Renderer

 Purpose:
    Renders roadmap hotspots from the hotspot configuration.
==============================================================================
*/

'use strict';
/*
==============================================================================
 Render Roadmap Regions
------------------------------------------------------------------------------
 Creates the roadmap regions defined in technical-reference-hotspots.js.
==============================================================================
*/

function renderRoadmapHotspots(){

    const container =
        document.getElementById(
            'ekcRoadmapContainer'
        );

    if(!container){
        return;
    }

 container
    .querySelectorAll(
        '.roadmap-region'
    )
    .forEach(item=>item.remove());

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

hotspot.id =
    region.id;

hotspot.className =
    'roadmap-region';

hotspot.dataset.documentKey =
    region.documentKey;

hotspot.dataset.regionId =
    region.id;

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
        technicalReferenceState.designer.enabled
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
