/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-history.js
 Layer       : Frontend

 Purpose:
    Displays communication history for the selected event.

 Responsibilities:
    • Render communication history
    • Refresh history
    • Display empty state
    • Display communication status

 Used By:
    • communications-workspace.js
==============================================================================
*/

'use strict';

import {

    getState

}

from

'./communications-state.js';

import {

    emptyState,

    loading,

    statusBadge

}

from

'./communications-components.js';

import {

    formatDate

}

from

'./communications-utils.js';


/*===========================================================================
    INITIALIZE
===========================================================================*/

export function initializeHistory(){

    renderHistory();

}


/*===========================================================================
    RENDER
===========================================================================*/

export function renderHistory(){

    const container =

        document.getElementById(

            'communicationsHistory'

        );

    if(!container){

        return;

    }

    const state =

        getState();

    if(!state.history){

        container.innerHTML =

            loading();

        return;

    }

    if(state.history.length === 0){

        container.innerHTML =

            emptyState(

                'No History',

                'No communications have been sent for this event.'

            );

        return;

    }

    container.innerHTML =

        state.history

            .map(

                renderHistoryItem

            )

            .join('');

}


/*===========================================================================
    HISTORY ITEM
===========================================================================*/

function renderHistoryItem(item){

    return `

<div
    class="comm-history-item">

    <div
        class="comm-history-header">

        <strong>

            ${item.communication_type}

        </strong>

        ${statusBadge(

            item.status,

            badgeType(item.status)

        )}

    </div>

    <div
        class="comm-history-date">

        ${formatDate(

            item.sent_at ||

            item.created_at

        )}

    </div>

    <div
        class="comm-history-subject">

        ${item.subject || ''}

    </div>

    <div
        class="comm-history-count">

        ${item.recipient_count || 0}

        recipient(s)

    </div>

</div>

`;

}


/*===========================================================================
    REFRESH
===========================================================================*/

export function refreshHistory(){

    renderHistory();

}


/*===========================================================================
    BADGE
===========================================================================*/

function badgeType(status){

    switch(

        (status || '').toLowerCase()

    ){

        case 'sent':

            return 'success';

        case 'failed':

            return 'danger';

        case 'pending':

            return 'warning';

        default:

            return 'default';

    }

}
