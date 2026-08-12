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

 designer : {

    enabled : false,

    drawing : false,

    startX : 0,
    startY : 0,

    currentSelection : null

}
};

window.technicalReferenceState =
    technicalReferenceState;
