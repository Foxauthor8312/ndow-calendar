# CHANGELOG

All notable changes to the NDOW Volunteer Portal are documented in this file.
Current Development Target:
index-dev.html

Production File:
index.html

Version numbers follow:

MAJOR.MINOR.PATCH

Examples:

1.0.0
1.1.0
1.1.1

Version Guidelines

MAJOR
Breaking changes or major platform milestones.

MINOR
New features and modules.

PATCH
Bug fixes and small improvements.

---

Tonight's scorecard:

✔️ Geo Analytics resurrected
✔️ County population working
✔️ Event aggregation working
✔️ Login repaired
✔️ Rogue modal evicted
✔️ Parser restored to lawful behavior
✔️ Dashboard looking like a dashboard again
✔️ Finished before 2030

Date: 2026-06-07
NDOW Volunteer Event Calendar - Development Update v26.1.5-7.1

Current State

✓ Department Contacts module integrated with Supabase
✓ Department Contacts loaded from API endpoint
✓ Contact deletion functional
✓ Contact edit modal loads and populates correctly
✓ Contact selector now displays Region, Name, Role, and Email
✓ Instructor request workflow confirmed to use Department Contacts data source
✓ Email recipient selector sorted and displaying active contacts correctly
✓ Legacy recipient display issue resolved
✓ JavaScript template literal parsing errors identified and corrected

Email & Contact System

✓ Verified department_contacts table is the authoritative contact source
✓ Confirmed instructor request workflow uses selected contact email from Department Contacts
✓ Removed dependency on hidden recipient assumptions
✓ Contact selector updated for improved operational visibility
✓ Active contacts displayed with expanded identification information

Architecture Findings

✓ Confirmed instructor request workflow pulls recipient email from contactSelect control
✓ Confirmed Department Contacts data loaded from NDOW Calendar server API
✓ Confirmed contact selection no longer dependent on hard-coded recipient display values
✓ Identified historical email configuration references for future review

Instructor Assignment Investigation

✓ Investigated feasibility of instructor-assignment event indicators
✓ Determined instructor visibility is restricted by NDOW licensing system permissions
✓ Confirmed instructor assignment data is only visible when logged in as an assigned instructor
✓ Identified permissions model as primary blocker to universal instructor assignment mapping
✓ Opened investigation with NDOW IT regarding elevated administrative visibility

Future Considerations

• Possible nightly instructor-assignment synchronization workflow
• Potential administrative account access for complete instructor visibility
• NDOW portal integration and single-sign-on opportunities
• Self-registration model using NDOW ID validation
• Instructor assignment indicators based on authenticated user identity

Known Issues

• Contact edit modal stacking issue persists beneath Dashboard/Admin panels
• Save Edited Contact functionality remains incomplete
• Contacts UI requires additional style-guide cleanup

Development Notes

• Confirmed current login system remains appropriate for demonstrations and pilot deployment
• Determined large-scale user management should be deferred pending NDOW integration discussions
• Identified NDOW identity infrastructure as preferred long-term authentication solution
• Continued maintaining project independence and separation from official NDOW branding pending future deployment decisions


---
## Version 26.1.5.0

Date: 2026-06-07

Features

* Added My Dashboard modal
* Added volunteer impact summary
* Added event count to volunteer totals
* Added volunteer totals API endpoint enhancements
* Added manual calendar update capability
* Added GitHub workflow dispatch integration
* Added System Console calendar update control

Architecture

* Defined Dashboard philosophy
* Defined user-centric design model
* Defined Primary Instructor and Assistant Instructor responsibilities
* Defined future event_assignments architecture

Documentation

* Added NDOW Portal Style Guide
* Added Architecture documentation
* Added Database documentation
* Added Workflow documentation
* Added Demo Notes documentation

---

## Version 26.1.4.0

Date: YYYY-MM-DD

Features

* Added ...

Fixes

* Fixed ...


6/7/26

* Version 26.1.5.1

HELP SYSTEM
- Extracted Help functionality from index.html into js/help.js
- Added Help topic search
- Added active topic highlighting
- Improved Help Center layout and scrolling
- Added automatic Help content formatting
- Fixed Context Help topic highlighting

CALENDAR
- Updated calendar layout so header, status bar,
  legends, region filter, and day names remain visible
- Calendar grid now scrolls independently

UI
- Began Help module alignment with NDOW Style Guide

Documentation

* Updated ...

* ## v26.1.5.2

### User Interface Improvements

* Refined footer styling to function as low-emphasis informational content.
* Reduced footer font size and adjusted line spacing for improved readability.
* Updated footer presentation to align with NDOW Portal Style Guide.
* Confirmed version display renders correctly in footer.
* Preserved independent calendar scrolling architecture.
* Header, status bar, legends, region filters, and day names remain fixed while calendar grid scrolls independently.
* Footer remains visible below calendar content and outside scrollable grid area.

=====================================================
2026-06-09
Sidebar Redesign Project Initiated
=====================================================

Created development environment:

- Created index-dev.html from production index.html
- Added DEV title indicator
- Added DEV visual banner

Created foundational project structure:

/css
    admin.css

/js
    sidebar.js

Linked admin.css into index-dev.html
Linked sidebar.js into index-dev.html

Purpose:

Prepare for migration from modal-based
administration workflow to permanent
sidebar navigation architecture.

No production functionality changed.

Status:
Foundation Complete
* 6-9-26
* start UI dvelopment
*  index-dev.html created
✓ DEV environment identified
✓ /css folder created
✓ admin.css created and linked
✓ /js folder created
✓ sidebar.js created and linked
✓ Existing help.js preserved
✓ No production impact

MILESTONE 2
Administrative Design System Created

File:
css/admin.css

Added:
- Design tokens
- Sidebar framework
- Panel framework
- Card framework
- Table framework
- Button framework
- Layout framework

Purpose:
Establish a consistent NDOW administrative UI
before sidebar construction begins.

Current Status

Production:
index.html

Development:
index-dev.html

Next Task:
Build Admin Shell

Goal:
Permanent left navigation with content-area panels.

Calendar functionality remains unchanged during Phase 1.

MILESTONE 3
Administrative Shell Implemented

Files Modified:
- index-dev.html
- css/admin.css

Added:
- Permanent left navigation
- Administrative shell layout
- Content area architecture

Result:
Calendar successfully operates inside the new
admin-content container.

Status:
Ready for panel-based navigation.

UPDATE DASHBOARD 6-13

Dashboard Refactor Completed

✓ Renamed My Instructor Dashboard → Dashboard
✓ Dashboard promoted to primary application hub
✓ Added direct launchers for:
    - User Management
    - Program Updates
    - Contacts
    - Help Manager
    - Analytics
    - Categories
    - Release Management
    - Instructor Requests
    - System Console
✓ Admin modal retained as backend container
✓ All launcher buttons verified
✓ No functionality moved or rewritten

