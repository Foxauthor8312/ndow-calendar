/*
==============================================================================
 NDOW Volunteer Portal
 Address Selector UI
------------------------------------------------------------------------------
 Module      : address-selector-ui.js
 Layer       : Frontend UI

 Purpose:
    User interface functions for Address Selector.

 Responsibilities:
    • Populate address form
    • Clear address form
==============================================================================
*/

'use strict';

/*
==============================================================================
 Populate Address Form
==============================================================================
*/

export function populateAddressForm(result){

    const props =
        result.searchAheadResult?.place?.properties || {};

    document.getElementById(
        'addressLocationName'
    ).value =
        result.name || '';

    document.getElementById(
        'addressAddress1'
    ).value =
        props.street || '';

    document.getElementById(
        'addressCity'
    ).value =
        props.city || '';

    document.getElementById(
        'addressState'
    ).value =
        props.stateCode || '';

    document.getElementById(
        'addressZip'
    ).value =
        props.postalCode || '';

    document.getElementById(
        'addressRegion'
    ).value =
        props.county || '';

    document.getElementById(
        'addressLatitude'
    ).value =
        result.latlng?.lat || '';

    document.getElementById(
        'addressLongitude'
    ).value =
        result.latlng?.lng || '';

}

/*
==============================================================================
 Clear Address Form
==============================================================================
*/

export function clearAddressForm(){

    document.getElementById(
        'addressLocationName'
    ).value = '';

    document.getElementById(
        'addressAddress1'
    ).value = '';

    document.getElementById(
        'addressCity'
    ).value = '';

    document.getElementById(
        'addressState'
    ).value = 'NV';

    document.getElementById(
        'addressZip'
    ).value = '';

    document.getElementById(
        'addressRegion'
    ).value = '';

    document.getElementById(
        'addressLatitude'
    ).value = '';

    document.getElementById(
        'addressLongitude'
    ).value = '';

}
