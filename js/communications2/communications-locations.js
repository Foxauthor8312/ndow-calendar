/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-locations.js
 Layer       : Frontend

 Purpose:
    Loads communication location information used by email templates.

 Responsibilities:
    • Lookup communication_locations
    • Match event location
    • Return directions
    • Return parking information
    • Return meeting point

 Used By:
    • communications-templates.js
    • communications-compose.js
==============================================================================
*/

'use strict';

import {

    API_BASE

}

from

'./communications-config.js';


/*===========================================================================
    LOAD LOCATION
===========================================================================*/

export async function loadCommunicationLocation(
    event
){

    if(!event){

        return null;

    }

    try{

        const response =
            await fetch(

`${API_BASE}/communications/location?location_key=${encodeURIComponent(

    event.location_key ||

    event.location ||

    ''

)}`

            );

        if(!response.ok){

            throw new Error(

                'Unable to load location.'

            );

        }

        const result =
            await response.json();

        return result.location || null;

    }

    catch(error){

        console.error(

            '[Communications]', error

        );

        return null;

    }

}


/*===========================================================================
    DEFAULT LOCATION
===========================================================================*/

export function emptyLocation(){

    return {

        location_name : '',

        directions : '',

        parking_notes : '',

        meeting_point : '',

        google_maps_url : '',

        notes : ''

    };

}
