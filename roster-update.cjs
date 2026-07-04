/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-update.cjs
 Description : Updates cached student rosters for instructor events.

 Purpose:
   Reads events.json, determines which events require roster maintenance,
   retrieves student rosters from the NDOW event management system, and
   updates the local operational database.

 Responsibilities:

     • Read events.json
     • Determine qualifying instructor events
     • Retrieve event rosters
     • Detect roster changes
     • Update cached roster information
     • Update workflow status

 Notes:

     This module DOES NOT update the calendar.

     The calendar continues to operate exclusively from events.json.

     This module maintains only the operational database used for
     communications and future workflow automation.

 Module Ver. : 0.1.0
 Build       : 2026.07.03.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';
