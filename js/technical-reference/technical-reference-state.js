/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference State
==============================================================================
*/

'use strict';

const technicalReferenceState = {

    initialized : false,

    topics : [],

    currentTopic : null,

    currentIndex : -1,

    editor : {

        enabled : false,

        selectedRegion : null,

        dragging : false,

        resizing : false

    }

};

window.technicalReferenceState =
    technicalReferenceState;
