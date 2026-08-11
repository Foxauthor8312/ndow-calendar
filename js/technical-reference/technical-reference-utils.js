/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-utils.js
 Layer       : Frontend Utilities

 Purpose:
    Shared utility functions used throughout the Engineering
    Knowledge Center.
==============================================================================
*/

'use strict';

/*
==============================================================================
 Pixels to Percent
------------------------------------------------------------------------------
 Converts a pixel value to a percentage of the parent container.
==============================================================================
*/

function pixelsToPercent(
    pixels,
    total
){

    if(total <= 0){

        return 0;

    }

    return Number(

        (

            pixels / total * 100

        ).toFixed(3)

    );

}

/*
==============================================================================
 Percent to Pixels
------------------------------------------------------------------------------
 Converts a percentage to pixels based on the current container size.
==============================================================================
*/

function percentToPixels(
    percent,
    total
){

    return Math.round(

        total *

        (

            percent / 100

        )

    );

}
