/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-templates.js
 Layer       : Frontend

 Purpose:
    Builds communication templates.

 Responsibilities:
    • Reminder
    • Survey
    • No Show
    • Custom

 Used By:
    • communications-compose.js
==============================================================================
*/

'use strict';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';


/*==============================================================================
    BUILD TEMPLATE
==============================================================================*/

export function buildTemplate(

    type,

    event,

    location,

    options = {}

){

    switch(type){

        case COMMUNICATION_TYPES.SURVEY:

            return surveyTemplate(

                event,

                options

            );

        case COMMUNICATION_TYPES.NO_SHOW:

            return noShowTemplate(

                event

            );

        case COMMUNICATION_TYPES.CUSTOM:

            return customTemplate(

                event

            );

        default:

            return reminderTemplate(

                event,

                location

            );

    }

}


/*==============================================================================
    REMINDER
==============================================================================*/

function reminderTemplate(

    event,

    location

){

    return {

        subject:

`Nevada Department of Wildlife - Reminder: ${event.title}`,

        html:

`

<h2>

${event.title}

</h2>

<p>

Thank you for registering for a
Nevada Department of Wildlife event.

</p>

<p>

<strong>Date:</strong>
${event.date}

<br>

<strong>Time:</strong>
${event.time || ''}

<br>

<strong>Location:</strong>
${event.location}

</p>

<p>

${location?.directions || ''}

</p>

<p>

We look forward to seeing you.

</p>

`

    };

}


/*==============================================================================
    SURVEY
==============================================================================*/

function surveyTemplate(

    event,

    options

){

    return {

        subject:

`Nevada Department of Wildlife - Thank You for Attending ${event.title}`,

        html:

`

<h2>

Thank You

</h2>

<p>

Thank you for attending

<strong>

${event.title}

</strong>.

</p>

<p>

Your feedback helps improve future
Nevada Department of Wildlife programs.

</p>

<p>

<a href="${options.surveyUrl || '#'}">

Complete the Class Survey

</a>

</p>

`

    };

}


/*==============================================================================
    NO SHOW
==============================================================================*/

function noShowTemplate(

    event

){

    return {

        subject:

`Nevada Department of Wildlife - We Missed You`,

        html:

`

<h2>

We Missed You

</h2>

<p>

We noticed you were unable to attend

<strong>

${event.title}

</strong>.

</p>

<p>

We hope you'll register for another
Nevada Department of Wildlife class soon.

</p>

<p>

We look forward to seeing you at
a future event.

</p>

`

    };

}


/*==============================================================================
    CUSTOM
==============================================================================*/

function customTemplate(

    event

){

    return {

        subject:

`Nevada Department of Wildlife - ${event.title}`,

        html:

`

<h2>

${event.title}

</h2>

<p>

Enter your custom communication here.

</p>

`

    };

}
