/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-drawing.js
 Layer       : Frontend Drawing

 Purpose:
    Draw new roadmap hotspots using the mouse.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Initialize Drawing
==============================================================================
*/

function initializeRoadmapDrawing(){

    const container =
        document.getElementById(
            'ekcRoadmapContainer'
        );

    if(!container){
        return;
    }

    container.addEventListener(
        'mousedown',
        beginRoadmapDrawing
    );

}
