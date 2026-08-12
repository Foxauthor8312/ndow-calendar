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
 Drawing Rectangle
==============================================================================
*/

let drawingRectangle = null;

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

    container.addEventListener(
        'mousemove',
        continueRoadmapDrawing
    );

    container.addEventListener(
        'mouseup',
        endRoadmapDrawing
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

/*
==============================================================================
 Continue Drawing
==============================================================================
*/

function continueRoadmapDrawing(
    event
){

    if(
        !technicalReferenceState.designer.drawing
    ){
        return;
    }

    const container =
        document.getElementById(
            'ekcRoadmapContainer'
        );

    if(!drawingRectangle){

        drawingRectangle =
            document.createElement(
                'div'
            );

        drawingRectangle.style.position =
            'absolute';

        drawingRectangle.style.border =
            '2px dashed #00AEEF';

        drawingRectangle.style.background =
            'rgba(0,174,239,.20)';

        drawingRectangle.style.pointerEvents =
            'none';

        container.appendChild(
            drawingRectangle
        );

    }

    const left =
        Math.min(
            technicalReferenceState.designer.startX,
            event.offsetX
        );

    const top =
        Math.min(
            technicalReferenceState.designer.startY,
            event.offsetY
        );

    const width =
        Math.abs(
            event.offsetX -
            technicalReferenceState.designer.startX
        );

    const height =
        Math.abs(
            event.offsetY -
            technicalReferenceState.designer.startY
        );

    drawingRectangle.style.left =
        left + 'px';

    drawingRectangle.style.top =
        top + 'px';

    drawingRectangle.style.width =
        width + 'px';

    drawingRectangle.style.height =
        height + 'px';

}

/*
==============================================================================
 Finish Drawing
==============================================================================
*/

function endRoadmapDrawing(){

    if(
        !technicalReferenceState.designer.drawing
    ){
        return;
    }

    technicalReferenceState.designer.drawing =
        false;

    console.log(
        'Draw Complete'
    );

}
