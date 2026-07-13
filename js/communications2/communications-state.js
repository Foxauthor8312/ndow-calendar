/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-state.js
 Layer       : Frontend State

 Purpose:
    Central application state for the Communications Workspace.

 Responsibilities:
    • Current event
    • Template selection
    • Roster
    • Selected recipients
    • Location information
    • Communication history
    • Email preview
    • UI state

 Used By:
    • All Communications modules
==============================================================================
*/

'use strict';

/*==============================================================================
    APPLICATION STATE
==============================================================================*/

const state = {

    initialized : false,

    loading : false,

    dirty : false,

    currentEvent : null,

    currentTemplate : null,

    roster : [],

    selectedRecipients : [],

    location : null,

    history : [],

    preview : {

        subject : '',

        html : ''

    },

    attendance : {

        loaded : false,

        roster : []

    },

    feedback : {

        enabled : false,

        surveyUrl : ''

    },

    ui : {

        activeView : 'compose',

        loading : false,

        initialized : false,

        sending : false

    }

};


/*==============================================================================
    STATE
==============================================================================*/

export function getState(){

    return state;

}


/*==============================================================================
    RESET
==============================================================================*/

export function resetState(){

    state.initialized = false;

    state.loading = false;

    state.dirty = false;

    state.currentEvent = null;

    state.currentTemplate = null;

    state.roster = [];

    state.selectedRecipients = [];

    state.location = null;

    state.history = [];

    state.preview.subject = '';

    state.preview.html = '';

    state.attendance.loaded = false;

    state.attendance.roster = [];

    state.feedback.enabled = false;

    state.feedback.surveyUrl = '';

    state.ui.activeView = 'compose';

    state.ui.loading = false;

    state.ui.initialized = false;

    state.ui.sending = false;

}


/*==============================================================================
    EVENT
==============================================================================*/

export function setCurrentEvent(event){

    state.currentEvent = event;

}


/*==============================================================================
    TEMPLATE
==============================================================================*/

export function setCurrentTemplate(template){

    state.currentTemplate = template;

}


/*==============================================================================
    ROSTER
==============================================================================*/

export function setRoster(roster){

    state.roster = roster || [];

    state.selectedRecipients = [...state.roster];

}


/*==============================================================================
    RECIPIENTS
==============================================================================*/

export function setSelectedRecipients(recipients){

    state.selectedRecipients = recipients || [];

}


/*==============================================================================
    LOCATION
==============================================================================*/

export function setLocation(location){

    state.location = location;

}


/*==============================================================================
    HISTORY
==============================================================================*/

export function setHistory(history){

    state.history = history || [];

}


/*==============================================================================
    PREVIEW
==============================================================================*/

export function setPreview(subject, html){

    state.preview.subject = subject;

    state.preview.html = html;

}


/*==============================================================================
    UI
==============================================================================*/

export function setLoading(value){

    state.ui.loading = value;

}


export function setSending(value){

    state.ui.sending = value;

}


export function setInitialized(value){

    state.ui.initialized = value;

}
