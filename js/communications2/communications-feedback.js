/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-feedback.js
 Layer       : Frontend

 Purpose:
    Handles post-event survey communications.

 Responsibilities:
    • Configure survey communication
    • Set survey URL
    • Build survey preview
    • Enable survey workflow

 Used By:
    • communications-compose.js
==============================================================================
*/

'use strict';

import {

    getState

}

from

'./communications-state.js';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';

import {

    buildTemplate

}

from

'./communications-templates.js';

import {

    renderPreview

}

from

'./communications-preview.js';


/*===========================================================================
    LOAD SURVEY
===========================================================================*/

export function openSurvey(){

    const state =

        getState();

    state.currentTemplate =

        COMMUNICATION_TYPES.SURVEY;

    const email =

        buildTemplate(

            COMMUNICATION_TYPES.SURVEY,

            state.currentEvent,

            state.location,

            {

                surveyUrl :

                    state.feedback.surveyUrl

            }

        );

    state.preview = email;

    renderPreview();

}


/*===========================================================================
    SURVEY URL
===========================================================================*/

export function setSurveyUrl(url){

    const state =

        getState();

    state.feedback.surveyUrl =

        url;

}


/*===========================================================================
    ENABLE
===========================================================================*/

export function enableSurvey(){

    const state =

        getState();

    state.feedback.enabled = true;

}


/*===========================================================================
    DISABLE
===========================================================================*/

export function disableSurvey(){

    const state =

        getState();

    state.feedback.enabled = false;

}
