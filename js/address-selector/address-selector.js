/*
==============================================================================
 NDOW Volunteer Portal
 Address Selector
------------------------------------------------------------------------------
 Module      : address-selector.js
 Layer       : Frontend Controller

 Purpose:
    Initializes and manages the MapQuest Address Selector.

 Responsibilities:
    • Initialize MapQuest search
    • Handle address selection
    • Launch coordinate finder (temporary)
==============================================================================
*/

'use strict';
console.log('address-selector.js loaded');

/*
==============================================================================
 State
==============================================================================
*/

var addressSearchWidget = null;
/*
==============================================================================
 Initialize Address Search
==============================================================================
*/

function initializeAddressSearch(){

    const input =
        document.getElementById(
            'addressSearch'
        );

    if(!input){
        return;
    }

    if(addressSearchWidget){
        return;
    }

    addressSearchWidget = placeSearch({

    key: publicConfig.mapquestApiKey,

    container: input,

    collection: [
        'address',
        'poi'
    ],

    limit: 8

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

    if(addressSearchWidget){

        addressSearchWidget.close();

    }

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.initializeAddressSearch =
    initializeAddressSearch;
