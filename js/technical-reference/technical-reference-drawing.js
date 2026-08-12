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

/*
==============================================================================
 Begin Drawing
==============================================================================
*/

function beginRoadmapDrawing(
    event
){

    if(
        !technicalReferenceState.designer.enabled
    ){
        return;
    }

    technicalReferenceState.designer.drawing =
        true;

    technicalReferenceState.designer.startX =
        event.offsetX;

    technicalReferenceState.designer.startY =
        event.offsetY;

    console.log(
        'Draw Start:',
        event.offsetX,
        event.offsetY
    );

}
