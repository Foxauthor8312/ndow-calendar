/*
==============================================================================
 NDOW Volunteer Portal
 Address Selector Utilities
------------------------------------------------------------------------------
 Module      : address-selector-utils.js
 Layer       : Frontend Utility

 Purpose:
    Utility functions for the Address Selector.

 Responsibilities:
    • Build MapQuest suggestion templates
    • Address formatting
    • Coordinate formatting
==============================================================================
*/

'use strict';

/*
==============================================================================
 Build Suggestion Template
==============================================================================
*/

function buildSuggestionTemplate(result){

    const props =
        result.searchAheadResult?.place?.properties || {};

    return `

        <div class="mqSuggestion">

            <div class="mqTitle">

                ${result.name || ''}

            </div>

            <div class="mqAddress">

                ${props.street || ''}

            </div>

            <div class="mqCity">

                ${props.city || ''},
                ${props.stateCode || ''}
                ${props.postalCode || ''}

            </div>

            <div class="mqCoords">

                📍 ${result.latlng?.lat || ''},
                ${result.latlng?.lng || ''}

            </div>

        </div>

    `;

}

/*
==============================================================================
 Format Coordinates
==============================================================================
*/

function formatCoordinates(lat, lng){

    if(!lat || !lng){
        return '';

    }

    return `${lat}, ${lng}`;

}

/*
==============================================================================
 Public Functions
==============================================================================
*/

window.buildSuggestionTemplate =
    buildSuggestionTemplate;

window.formatCoordinates =
    formatCoordinates;
