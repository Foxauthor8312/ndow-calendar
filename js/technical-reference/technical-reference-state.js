/*
==============================================================================
 NDOW Volunteer Portal
 Technical Reference State
------------------------------------------------------------------------------
 Module      : technical-reference-state.js
 Layer       : Frontend State

 Purpose:
    Stores Technical Reference workspace state.
==============================================================================
*/

'use strict';

/*
==============================================================================
 State
==============================================================================
*/

let technicalReferenceInitialized = false;

let technicalReferenceCategories = [];

let technicalReferenceTopics = [];

let currentTechnicalCategory = null;

let currentTechnicalTopic = null;

let technicalReferenceSearch = '';

/*
==============================================================================
 Public State
==============================================================================
*/

window.technicalReferenceState = {

    get initialized(){

        return technicalReferenceInitialized;

    },

    set initialized(value){

        technicalReferenceInitialized = value;

    },

    get categories(){

        return technicalReferenceCategories;

    },

    set categories(value){

        technicalReferenceCategories = value;

    },

    get topics(){

        return technicalReferenceTopics;

    },

    set topics(value){

        technicalReferenceTopics = value;

    },

    get currentCategory(){

        return currentTechnicalCategory;

    },

    set currentCategory(value){

        currentTechnicalCategory = value;

    },

    get currentTopic(){

        return currentTechnicalTopic;

    },

    set currentTopic(value){

        currentTechnicalTopic = value;

    },

    get search(){

        return technicalReferenceSearch;

    },

    set search(value){

        technicalReferenceSearch = value;

    }

};
