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
    • Open Address Modal
    • Close Address Modal
    • Populate Address Form
    • Clear Address Form
==============================================================================
*/

'use strict';

/*
==============================================================================
 Open Address Modal
==============================================================================
*/

function openAddAddressModal(){

    editingAddressId = null;

    clearAddressForm();

    document.getElementById(
        'addressModalTitle'
    ).textContent =
        'Add Address';

    document.getElementById(
        'addressId'
    ).value = '';

    document.getElementById(
        'addressType'
    ).value = 'NDOW';

    document.getElementById(
        'addressDescription'
    ).value = '';

    document.getElementById(
        'addressFavorite'
    ).checked = false;

    document.getElementById(
        'addressActive'
    ).checked = true;

    const modal =
        document.getElementById(
            'addressModal'
        );

    modal.classList.remove(
        'hidden'
    );

    modal.style.display =
        'flex';

    initializeAddressSearch();

}

/*
==============================================================================
 Close Address Modal
==============================================================================
*/

function closeAddressModal(){

    const modal =
        document.getElementById(
            'addressModal'
        );

    modal.classList.add(
        'hidden'
    );

    modal.style.display =
        'none';

}

/*
==============================================================================
 Populate Address Form
==============================================================================
*/

function populateAddressForm(result){

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

function clearAddressForm(){

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

    const search =
        document.getElementById(
            'addressSearch'
        );

    if(search){

        search.value = '';

    }

}

/*
==============================================================================
 Expose Public Functions
==============================================================================
*/

window.openAddAddressModal =
    openAddAddressModal;

window.closeAddressModal =
    closeAddressModal;

window.populateAddressForm =
    populateAddressForm;

window.clearAddressForm =
    clearAddressForm;
