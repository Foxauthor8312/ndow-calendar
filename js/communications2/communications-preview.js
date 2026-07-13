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

    container.innerHTML = `

<div
    style="
        background:white;
        border:1px solid #DBE3EC;
        border-radius:10px;
        padding:36px;
        min-height:700px;
        box-shadow:0 2px 10px rgba(0,0,0,.06);
        overflow:auto;
    "
>

${state.preview.html || ''}

</div>

`;

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
        background:white;
        border:1px solid #DBE3EC;
        border-radius:10px;
        min-height:700px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#6B7280;
        font-size:15px;
        box-shadow:0 2px 10px rgba(0,0,0,.06);
    "
>

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
        font-size:20px;
        font-weight:700;
        color:#19304B;
        margin-bottom:18px;
    "
>

    Email Preview

</div>

`;

}
