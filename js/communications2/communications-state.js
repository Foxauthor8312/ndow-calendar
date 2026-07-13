/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-state.js
 Layer       : Frontend State

 Purpose:
    Maintains the current state of the Communications Workspace.

 Responsibilities:
    • Current event
    • Current template
    • Current recipients
    • Current location
    • Current communication history
    • Preview content

 Used By:
    • communications-workspace.js
    • communications-compose.js
    • communications-preview.js
    • communications-recipients.js
    • communications-history.js
==============================================================================
*/

'use strict';

/*===========================================================================
    APPLICATION STATE
===========================================================================*/

const state = {

    initialized : false,

    loading : false,

    dirty : false

};


/*===========================================================================
    CURRENT EVENT
===========================================================================*/

state.currentEvent = null;


/*===========================================================================
    TEMPLATE
===========================================================================*/

state.currentTemplate = null;


/*===========================================================================
    RECIPIENTS
===========================================================================*/

state.roster = [];

state.selectedRecipients = [];


/*===========================================================================
    LOCATION
===========================================================================*/

state.location = null;


/*===========================================================================
    HISTORY
===========================================================================*/

state.history = [];


/*===========================================================================
    PREVIEW
===========================================================================*/

state.preview = {

    subject : '',

    html : ''

};


/*===========================================================================
    ATTENDANCE
===========================================================================*/

state.attendance = {

    loaded : false,

    roster : []

};


/*===========================================================================
    FEEDBACK
===========================================================================*/

state.feedback = {

    enabled : false,

    surveyUrl : ''

};


/*===========================================================================
    METHODS
===========================================================================*/

export function getState() {

    return state;

}


export function resetState() {

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

}


export function setCurrentEvent(event) {

    state.currentEvent = event;

}


export function setTemplate(template) {

    state.currentTemplate = template;

}


export function setRoster(roster) {

    state.roster = roster || [];

    state.selectedRecipients = [...state.roster];

}


export function setSelectedRecipients(recipients) {

    state.selectedRecipients = recipients || [];

}


export function setLocation(location) {

    state.location = location;

}


export function setHistory(history) {

    state.history = history || [];

}


export function setPreview(subject, html) {

    state.preview.subject = subject;

    state.preview.html = html;

}
