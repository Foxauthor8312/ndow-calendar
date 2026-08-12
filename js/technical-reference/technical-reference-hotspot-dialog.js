/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-hotspot-dialog.js
 Layer       : Frontend Dialog

 Purpose:
    Create and edit roadmap hotspots.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Open Hotspot Dialog
==============================================================================
*/

function openHotspotDialog(){

    const selection =
        technicalReferenceState.designer.currentSelection;

    if(!selection){
        return;
    }

    alert(

`Create Hotspot

Left: ${selection.leftPercent}

Top: ${selection.topPercent}

Width: ${selection.widthPercent}

Height: ${selection.heightPercent}`

    );

}
