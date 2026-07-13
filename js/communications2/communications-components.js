/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-components.js
 Layer       : Frontend Components

 Purpose:
    Shared UI components used throughout the Communications Workspace.

 Responsibilities:
    • Cards
    • Section headers
    • Status badges
    • Empty states
    • Loading indicators

 Used By:
    • communications-compose.js
    • communications-history.js
    • communications-preview.js
    • communications-recipients.js
==============================================================================
*/

'use strict';


/*===========================================================================
    CARD
===========================================================================*/

export function card(

    title,

    body,

    options = {}

){

    return `

<div class="comm-card">

    ${cardHeader(

        title,

        options.headerRight || ''

    )}

    <div class="comm-card-body">

        ${body}

    </div>

</div>

`;

}


/*===========================================================================
    CARD HEADER
===========================================================================*/

export function cardHeader(

    title,

    right = ''

){

    return `

<div class="comm-card-header">

    <div>

        ${title}

    </div>

    <div>

        ${right}

    </div>

</div>

`;

}


/*===========================================================================
    SECTION TITLE
===========================================================================*/

export function sectionTitle(title){

    return `

<div class="comm-section-title">

    ${title}

</div>

`;

}


/*===========================================================================
    STATUS BADGE
===========================================================================*/

export function statusBadge(

    text,

    type = 'default'

){

    return `

<span class="comm-status-badge ${type}">

    ${text}

</span>

`;

}


/*===========================================================================
    LABEL / VALUE
===========================================================================*/

export function labelValue(

    label,

    value

){

    return `

<div class="comm-field">

    <div class="comm-label">

        ${label}

    </div>

    <div class="comm-value">

        ${value ?? '-'}

    </div>

</div>

`;

}


/*===========================================================================
    EMPTY STATE
===========================================================================*/

export function emptyState(

    title,

    message

){

    return `

<div class="comm-empty">

    <h3>

        ${title}

    </h3>

    <p>

        ${message}

    </p>

</div>

`;

}


/*===========================================================================
    LOADING
===========================================================================*/

export function loading(message='Loading...'){

    return `

<div class="comm-loading">

    <div class="comm-spinner"></div>

    <div>

        ${message}

    </div>

</div>

`;

}


/*===========================================================================
    DIVIDER
===========================================================================*/

export function divider(){

    return `

<hr class="comm-divider">

`;

}


/*===========================================================================
    BUTTON BAR
===========================================================================*/

export function buttonBar(

    left = '',

    right = ''

){

    return `

<div class="comm-button-bar">

    <div>

        ${left}

    </div>

    <div>

        ${right}

    </div>

</div>

`;

}


/*===========================================================================
    MESSAGE
===========================================================================*/

export function message(

    text,

    type='info'

){

    return `

<div class="comm-message ${type}">

    ${text}

</div>

`;

}
