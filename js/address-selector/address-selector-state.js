/*
==============================================================================
 NDOW Volunteer Portal
 Address Selector
------------------------------------------------------------------------------
 Module      : address-selector.js
 Layer       : Frontend Controller

 Purpose:
    Initializes the MapQuest Address Selector.

 Responsibilities:
    • Initialize MapQuest Place Search
    • Handle address selection
    • Launch coordinate finder

 Used By:
    • Address Library
    • Route Manager
    • Event Locations
==============================================================================
*/

'use strict';

import {

    buildSuggestionTemplate

} from './address-selector-utils.js';

import {

    populateAddressForm

} from './address-selector-ui.js';

let addressSearchWidget = null;

/*
==============================================================================
 Initialize Address Search
==============================================================================
*/

export function initializeAddressSearch(){

    const input =
        document.getElementById(
            'addressSearch'
        );

    if (!input){
        return;
    }

    if (addressSearchWidget){
        return;
    }

    addressSearchWidget = placeSearch({

        key: publicConfig.mapquestApiKey,

        container: input,

        collection: [

            'address',

            'poi'

        ],

        limit: 8,

        templates: {

            suggestion:
                buildSuggestionTemplate

        }

    });

    addressSearchWidget.on(

        'change',

        handleAddressSelected

    );

}

/*
==============================================================================
 Address Selected
==============================================================================
*/

function handleAddressSelected(event){

    populateAddressForm(

        event.result

    );

}

/*
==============================================================================
 Open Coordinate Finder
==============================================================================
*/

export function openCoordinateFinder(){

    window.open(

        'https://developer.mapquest.com/documentation/tools/latitude-longitude-finder/',

        '_blank',

        'noopener,noreferrer'

    );

}
