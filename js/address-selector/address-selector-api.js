/*
==============================================================================
 NDOW Volunteer Portal
 Address Selector API
------------------------------------------------------------------------------
 Module      : address-selector-api.js
 Layer       : Frontend API

 Purpose:
    Communicates with the Address Service.

 Used By:
    • address-selector.js
==============================================================================
*/

'use strict';

/*
==============================================================================
 Search Addresses
==============================================================================
*/

async function searchAddresses(query) {

    try {

        const response =
            await fetch(

                `${API_BASE}/api/address/search?q=${
                    encodeURIComponent(query)
                }`,

                {
                    headers: authHeaders()
                }

            );

        const data =
            await response.json();

        if (!data.success) {

            return [];

        }

        return data.results;

    }

    catch (error) {

        console.error(
            'Address search failed:',
            error
        );

        return [];

    }

}
