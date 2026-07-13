/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-templates.js
 Layer       : Frontend

 Purpose:
    Generates all communication templates.

 Responsibilities:
    • Reminder emails
    • Survey emails
    • No Show emails
    • Custom emails

 Returns:
    {
        subject,
        html
    }

 Used By:
    • communications-compose.js
    • communications-preview.js
==============================================================================
*/

'use strict';

import {

    COMMUNICATION_TYPES

}

from

'./communications-config.js';

import {

    buildSubject,

    replacePlaceholders

}

from

'./communications-utils.js';


/*===========================================================================
    PUBLIC
===========================================================================*/

export function buildTemplate(

    type,

    event,

    location = {},

    options = {}

){

    switch(type){

        case COMMUNICATION_TYPES.SURVEY:

            return buildSurveyTemplate(

                event,

                options

            );

        case COMMUNICATION_TYPES.NO_SHOW:

            return buildNoShowTemplate(

                event,

                options

            );

        case COMMUNICATION_TYPES.CUSTOM:

            return buildCustomTemplate(

                event,

                options

            );

        case COMMUNICATION_TYPES.REMINDER:

        default:

            return buildReminderTemplate(

                event,

                location,

                options

            );

    }

}


/*===========================================================================
    REMINDER
===========================================================================*/

function buildReminderTemplate(

    event,

    location,

    options

){

    const subject =

        buildSubject(

            `Reminder: ${event.title}`

        );

    const html = replacePlaceholders(

`<h2>{{title}}</h2>

<p>

Thank you for registering for this Nevada Department of Wildlife event.

</p>

<p>

This is a friendly reminder that your class is scheduled for:

</p>

<ul>

<li><strong>Date:</strong> {{date}}</li>

<li><strong>Time:</strong> {{time}}</li>

<li><strong>Location:</strong> {{location}}</li>

</ul>

<h3>Directions</h3>

<p>

{{directions}}

</p>

<p>

We look forward to seeing you.

</p>

<p>

Nevada Department of Wildlife

</p>`,

        {

            title :

                event.title,

            date :

                event.date,

            time :

                event.time,

            location :

                event.location,

            directions :

                location.directions ||

                ''

        }

    );

    return {

        subject,

        html

    };

}


/*===========================================================================
    SURVEY
===========================================================================*/

function buildSurveyTemplate(

    event,

    options

){

    const subject =

        buildSubject(

            `We'd Appreciate Your Feedback: ${event.title}`

        );

    const html = replacePlaceholders(

`<h2>Thank You</h2>

<p>

Thank you for attending

<strong>{{title}}</strong>.

</p>

<p>

Please take a few moments to complete our survey.

</p>

<p>

<a href="{{surveyUrl}}">

Complete Survey

</a>

</p>

<p>

We appreciate your feedback.

</p>`,

        {

            title :

                event.title,

            surveyUrl :

                options.surveyUrl ||

                '#'

        }

    );

    return {

        subject,

        html

    };

}


/*===========================================================================
    NO SHOW
===========================================================================*/

function buildNoShowTemplate(

    event,

    options

){

    const subject =

        buildSubject(

            `We Missed You at ${event.title}`

        );

    const html = replacePlaceholders(

`<h2>We Missed You</h2>

<p>

We noticed that you were unable to attend

<strong>{{title}}</strong>.

</p>

<p>

We hope you'll register for another upcoming class.

</p>

<p>

Thank you for your interest in Nevada Department of Wildlife programs.

</p>`,

        {

            title :

                event.title

        }

    );

    return {

        subject,

        html

    };

}


/*===========================================================================
    CUSTOM
===========================================================================*/

function buildCustomTemplate(

    event,

    options

){

    return {

        subject :

            buildSubject(

                options.subject ||

                ''

            ),

        html :

            options.html ||

            ''

    };

}
