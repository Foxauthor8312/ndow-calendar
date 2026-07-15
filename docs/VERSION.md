Current Version

26.3.05.04

Release Date

2026-06-19

Current Focus
Report Printouts
Stared and completed User Report

Date: June 18, 2026

### First Login / PIN Reset System

* Implemented first-login PIN reset workflow.
* Added `must_change_pin` flag support during authentication.
* Users marked with `must_change_pin = true` are now presented with a PIN creation dialog immediately after successful login.
* Added backend `/change-pin` endpoint.
* PIN validation requires exactly 6 numeric digits.
* Successful PIN change:

  * Updates password hash.
  * Resets `must_change_pin` to `false`.
  * Allows normal login on future sessions.
* Added frontend PIN confirmation validation and error handling.

### User Authentication Enhancements

* Added support for returning `must_change_pin` during login.
* Added support for returning `ndow_customer_id` during login.
* Updated frontend user object storage to include `ndow_customer_id`.

### NDOW Customer ID Migration

* Began migration from legacy `ndow_id` references to `ndow_customer_id`.
* Updated authentication payloads.
* Updated dashboard totals lookups.
* Updated volunteer hour retrieval logic.
* Updated volunteer totals retrieval logic.
* Verified dashboard totals now load correctly using NDOW customer identifiers.
* Inserted test data to validate migration path.

### Dashboard Permission System (Phase 1)

Implemented role-based dashboard visibility.

Role Definitions:

* user = Instructor
* admin = Administrator
* superuser = Full System Access

Dashboard Visibility Matrix:

Instructor:

* Instructor Tools only

Admin:

* Instructor Tools
* Administrator Tools

Superuser:

* Instructor Tools
* Administrator Tools
* System Tools

Implementation Notes:

* Added role detection:

  * isInstructor
  * isAdmin
  * isSuperuser

* Added:

  * adminSectionStyle
  * systemSectionStyle

* Dashboard sections are now conditionally displayed without modifying existing modal logic.

### Instructor Request Workflow Improvements

Identified issue:

* Instructor Event Requests opened the Admin Modal.
* Instructors were exposed to administrator navigation controls.

Implemented fix:

* Added instructor-specific sidebar suppression.
* `openAssignmentRequests()` now hides `adminSidebar`.
* `openAdminPanel()` restores `adminSidebar` for administrators.

Result:

Instructor View:

* Instructor Assignment Requests only.
* No access to:

  * Users
  * Updates
  * Contacts
  * Addresses
  * Help
  * Analytics
  * Categories

Administrator View:

* Full administrative navigation remains available.

### Dashboard Validation

Verified:

* Dashboard loads successfully for instructors.
* Dashboard loads successfully for administrators.
* Dashboard loads successfully for superusers.
* Historical totals remain accurate.
* Current test account shows:

  * 62 Events
  * 461.0 Hours
  * 1051 Miles
  * $25,857.95 Volunteer Value

### Architecture Discovery

Confirmed:

* Instructor Event Requests and Instructor Request Center currently share the same request infrastructure.
* Instructor Event Requests now functions as a simplified instructor-facing request view.
* Instructor Request Center remains the administrator-facing review interface.

Future work:

* Complete Admin Modal permission matrix.
* Add function-level role guards.
* Review backend route permissions.
* Continue migration from `ndow_id` to `ndow_customer_id`.
* Evaluate removal of legacy Admin sidebar navigation in favor of dashboard-first navigation.




* Upcoming Events Dashboard
* event_assignments Architecture
* Compact Dashboard Layout

Recent Release (26.2.61.71)

Highlights

* Updated footer styling to a low-emphasis informational format.
* Reduced footer font size and adjusted spacing.
* Confirmed version display functionality.
* Maintained independent calendar scrolling architecture.

Previous Release (26.1.5.42)

Highlights

* Extracted Help system from index.html into js/help.js
* Added Help topic search
* Improved Help Center layout and formatting
* Fixed Context Help topic highlighting
* Implemented sticky operational calendar layout
* Calendar grid now scrolls independently while header, filters, and day names remain visible
* Began Help module alignment with NDOW Portal Style Guide
