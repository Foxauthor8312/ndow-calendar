/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-preview.js
 Layer       : Frontend

 Purpose:
    Renders the communication preview inside the Communications Workspace.

 Responsibilities:
    • Render HTML email preview
    • Refresh preview
    • Display empty state

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


/*===========================================================================
    INITIALIZE
===========================================================================*/

export function initPreview(){

    renderEmptyPreview();

}


/*===========================================================================
    RENDER
===========================================================================*/

export function renderPreview(){

    const container =

        document.getElementById(

            'communicationsPreview'

        );

    if(!container){

        return;

    }

    const state =

        getState();

    container.innerHTML =

        state.preview.html ||

        '';

}


/*===========================================================================
    REFRESH
===========================================================================*/

export function refreshPreview(){

    renderPreview();

}


/*===========================================================================
    EMPTY
===========================================================================*/

export function renderEmptyPreview(){

    const container =

        document.getElementById(

            'communicationsPreview'

        );

    if(!container){

        return;

    }

    container.innerHTML = `

<div
    style="
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#6b7280;
        font-size:15px;
    ">

    Select a communication template.

</div>

`;

}


/*===========================================================================
    HEADER
===========================================================================*/

export function renderPreviewHeader(){

    return `

<div
    style="
        padding:14px 18px;
        border-bottom:1px solid #DBE3EC;
        background:#F8FAFC;
        font-weight:700;
        color:#19304B;
    ">

    Email Preview

</div>

`;

}
