/*
==============================================================================
 NDOW Volunteer Portal
 Communications Workspace
------------------------------------------------------------------------------
 Module      : communications-config.js
 Layer       : Frontend Configuration

 Purpose:
    Central configuration for the Communications Workspace.

 Responsibilities:
    • Communication types
    • Subject prefixes
    • Status values
    • Default template
    • UI constants

 Used By:
    • communications-workspace.js
    • communications-compose.js
    • communications-preview.js
    • communications-templates.js
==============================================================================
*/

'use strict';

/*===========================================================================
    APPLICATION
===========================================================================*/

export const COMMUNICATION_VERSION = '2.0';


/*===========================================================================
    SUBJECTS
===========================================================================*/

export const SUBJECT_PREFIX =
    'Nevada Department of Wildlife - ';


/*===========================================================================
    COMMUNICATION TYPES
===========================================================================*/

export const COMMUNICATION_TYPES = {

    REMINDER : 'reminder',

    SURVEY : 'survey',

    NO_SHOW : 'no_show',

    CUSTOM : 'custom'

};


/*===========================================================================
    DEFAULTS
===========================================================================*/

export const DEFAULT_TEMPLATE =
    COMMUNICATION_TYPES.REMINDER;


/*===========================================================================
    COMMUNICATION STATUS
===========================================================================*/

export const STATUS = {

    NOT_SENT : 'Not Sent',

    PENDING : 'Pending',

    SENT : 'Sent',

    FAILED : 'Failed'

};


/*===========================================================================
    HISTORY TYPES
===========================================================================*/

export const HISTORY_TYPES = {

    REMINDER : 'Reminder',

    SURVEY : 'Survey',

    NO_SHOW : 'No Show',

    CUSTOM : 'Custom'

};


/*===========================================================================
    COLORS
===========================================================================*/

export const COLORS = {

    PRIMARY : '#19304B',

    SECONDARY : '#589FD6',

    SUCCESS : '#7A9E7F',

    WARNING : '#F29647',

    BORDER : '#DBE3EC',

    BACKGROUND : '#F8FAFC'

};
