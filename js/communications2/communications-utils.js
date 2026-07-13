/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-utils.js
 Layer       : Frontend Utility Library

 Purpose:
    Shared helper functions used throughout the Communications Workspace.

 Responsibilities:
    • Date formatting
    • Time formatting
    • Subject generation
    • Placeholder replacement
    • HTML escaping
    • General utility helpers

 Used By:
    • communications-compose.js
    • communications-preview.js
    • communications-templates.js
    • communications-history.js
==============================================================================
*/

'use strict';

import {

    SUBJECT_PREFIX

}

from

'./communications-config.js';


/*===========================================================================
    DATE
===========================================================================*/

export function formatDate(dateString){

    if(!dateString){

        return '';

    }

    return new Date(

        dateString

    ).toLocaleDateString(

        'en-US',

        {

            weekday : 'long',

            year : 'numeric',

            month : 'long',

            day : 'numeric'

        }

    );

}


/*===========================================================================
    TIME
===========================================================================*/

export function formatTime(time){

    return time || '';

}


/*===========================================================================
    SUBJECT
===========================================================================*/

export function buildSubject(subject){

    return SUBJECT_PREFIX + subject;

}


/*===========================================================================
    HTML
===========================================================================*/

export function escapeHtml(text){

    if(text == null){

        return '';

    }

    return String(text)

        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');

}


/*===========================================================================
    PLACEHOLDERS
===========================================================================*/

export function replacePlaceholders(

    template,

    values

){

    let html = template;

    Object.entries(values).forEach(

        ([key,value])=>{

            const regex =

                new RegExp(

                    `{{\\s*${key}\\s*}}`,

                    'g'

                );

            html = html.replace(

                regex,

                value ?? ''

            );

        }

    );

    return html;

}


/*===========================================================================
    STRING
===========================================================================*/

export function titleCase(text){

    if(!text){

        return '';

    }

    return text

        .toLowerCase()

        .replace(

            /\b\w/g,

            letter =>

                letter.toUpperCase()

        );

}


/*===========================================================================
    ARRAY
===========================================================================*/

export function sortByName(list){

    return [...list].sort(

        (a,b)=>

            (a.student_name || '')

            .localeCompare(

                b.student_name || ''

            )

    );

}


/*===========================================================================
    EMAIL
===========================================================================*/

export function isValidEmail(email){

    if(!email){

        return false;

    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        .test(email);

}


/*===========================================================================
    STATUS
===========================================================================*/

export function yesNo(value){

    return value ? 'Yes' : 'No';

}


/*===========================================================================
    EMPTY
===========================================================================*/

export function isEmpty(value){

    return (

        value === null ||

        value === undefined ||

        value === ''

    );

}
