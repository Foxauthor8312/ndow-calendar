# Project state file
---
v26.1.5-7.1
6/7/26
Next Focus

Progress Focus-
  Future Work

• Project Status Center
  - Current State
  - Known Issues
  - Future Focus
  - Development Notes
  - Architecture Notes
  - Read-only user view
  - Editable admin interface
---
Current Version:
1.5.0

Completed

✓ Volunteer Hours
✓ Admin Panel
✓ Help System
✓ Announcements
✓ Manual Calendar Update
✓ Dashboard Modal
✓ Volunteer Totals

In Progress

• Dashboard UI Cleanup
• Upcoming Events

Next

• event_assignments table
• Recent Activity
• Notifications

# NDOW Event Results Integration Research

**Status:** Feasibility Confirmed
**Date:** June 14, 2026

## Objective

Eliminate duplicate instructor reporting by allowing NDOW Calendar volunteer hour submissions to eventually populate NDOW Event Results automatically.

Current workflow:

Instructor → NDOW Calendar
Instructor → NDOW Event Results

Future workflow:

Instructor → NDOW Calendar
NDOW Calendar → NDOW Event Results

---

# Research Findings

## NDOW Event Results Edit Page

Example URL:

```text
https://nevada.events.licensing.app/dashboard/em/assigned_events/4662/instructor_results/4017707/edit
```

This page contains a standard HTML form used to submit:

* Event Working Hours
* Break Hours
* Travel Hours
* Mileage
* Map Upload
* Certification Statement

The page is editable and accepts updates.

---

## Form Submission Method

Network inspection confirmed:

```text
_method = put
```

The page submits as a standard Rails-style form update.

Observed behavior:

1. Save button clicked
2. Form submitted
3. HTTP 302 redirect returned
4. User redirected back to Event Results page

This is NOT an XHR-only API.

---

## Authenticity Token

Page exposes CSRF token.

Example:

```javascript
document.querySelector(
  'input[name="authenticity_token"]'
).value
```

Returns:

```text
x/nOgbaAm5hBs4IL4Fi7U0Y3/VXWv2t9N3snD1weo7LpAMRWdkhap4AeqcEugIm0nBz706wUifKxy8mOnYdDqw==
```

Conclusion:

Puppeteer can retrieve a valid token from the page prior to submission.

---

# Form Field Mapping

Observed payload:

Hours Worked

```text
report_detail_question_id = 1673
value = 7.00
```

Break Hours

```text
report_detail_question_id = 1674
value = 0.5
```

Travel Hours

```text
report_detail_question_id = 1665
value = 0
```

Mileage

```text
report_detail_question_id = 1666
value = 1
```

Certification

```text
report_detail_question_id = 1675
value = Yes
```

Additional fields include:

```text
start_at
end_at
events_event_activity_id
events_instructor_result_id
instructor_pin
```

---

# Instructor Result IDs

Instructor result pages expose instructor-specific IDs.

Example Event:

```text
assigned_events/4548
```

Instructor links:

```text
Barry E Mattison
→ instructor_results/4017707

Keith Randall Roether
→ instructor_results/4269442

Donald E Propst Jr
→ instructor_results/1367753
```

Conclusion:

Each instructor has a unique NDOW instructor result identifier that is visible and scrapeable.

---

# Important Discovery

Instructor Result IDs appear to persist across multiple events.

Example:

```text
4017707
```

appears in:

* Event URLs
* Form payloads
* Attachment user IDs

Further investigation required to determine whether this represents:

A) Instructor Result Record

or

B) Instructor Account Record

This distinction is important before implementing automated submission.

---

# Event Activity IDs

Observed payload:

```text
events_event_activity_id = 7289
```

This value appears to identify the event activity being updated.

Future event imports should capture and store:

```text
ndow_event_activity_id
```

for use in synchronization.

---

# Recommended Future Database Fields

Event Mapping

```text
ndow_event_activity_id
```

Instructor Mapping

```text
ndow_instructor_result_id
```

Potential table:

```text
ndow_instructor_results

id
event_id
ndow_event_id
ndow_instructor_result_id
instructor_name
role
edit_url
last_synced
```

---

# Proposed Future Workflow

Instructor submits hours in NDOW Calendar.

Calendar stores:

```text
hours
break_minutes
travel_hours
mileage
notes
```

Synchronization process:

1. Locate matching instructor result record
2. Open NDOW edit page
3. Read authenticity token
4. Populate form fields
5. Submit form
6. Verify success
7. Mark NDOW sync status

---

# Feasibility Assessment

Current Status:

✓ Edit page located

✓ Form payload captured

✓ Field mappings identified

✓ CSRF token accessible

✓ Instructor IDs accessible

✓ Event activity IDs accessible

✓ Standard Rails update workflow confirmed

✓ Puppeteer-based automation appears feasible

Remaining Work:

* Determine persistence rules for instructor_result_id
* Capture event_activity_id during import
* Store instructor result mappings
* Build submission workflow
* Build verification workflow

Assessment:

NDOW Event Results synchronization is technically feasible and should be considered a Phase 2 enhancement after dashboard, admin workflow, and request center development are complete.

Excellent. Then I'd lock in the roadmap like this and avoid any detours.

Certification System Roadmap
Phase 1 — Database Foundation

Status: Complete

✅ programs table

✅ Seeded program records

✅ instructor_certifications table

✅ ndow_customer_id relationship strategy

✅ User migration substantially complete

✅ Admin backdoor intentionally excluded

Phase 2 — Certification Import Manager

Next Build

Backend Routes
GET    /api/admin/programs
POST   /api/admin/import-certifications
GET    /api/admin/certifications
GET    /api/admin/user-certifications/:ndow_customer_id
Import Workflow
Upload CSV
    ↓
Parse
    ↓
Validate Program
    ↓
Validate Customer ID
    ↓
Skip Duplicates
    ↓
Insert Records
    ↓
Return Report
Import Report
Records Processed
Imported
Duplicates
Unknown Programs
Unknown Customer IDs

This should feel very similar to the instructor import process you just finished.

Phase 3 — Certification Viewer

Add a section to the user dashboard:

My Certifications
-------------------------
Hunter Education
Archery Education
Advanced Hunter Education
Fishing Classes

No editing.

Read-only.

NDOW remains the source of truth.

Imports remain the update mechanism.

Phase 4 — Certification Administration

Admin panel:

Certification Management

Tabs:

Import Certifications
View Certifications
Program Management

User lookup:

Search User
     ↓
View Certifications

Useful for troubleshooting imports.

Phase 5 — Instructor Request Center

This is where the earlier discovery becomes important.

Current system:

Instructor
    ↓
Requests Event Assignment

Future system:

Admin
    ↓
Needs Staff
    ↓
Creates Staffing Request

Completely different workflow.

Phase 6 — Certification-Aware Staffing

Example:

Event:
Hunter Education

System automatically queries:

program_id = 1

Returns:

Qualified Instructors

Admin sees:

Need: 3 instructors

Available:
✓ Barry Mattison
✓ Sonya Wilson
✓ Keith Roether
✓ Claude Nielsen
Phase 7 — Notifications

Potential channels:

Dashboard Alerts
Login Popup
Email
SMS (Twilio)

Response options:

Accept
Decline
Unavailable
Phase 8 — Coverage Analytics

Questions the system can answer:

How many certified instructors
by program?

Which programs have low coverage?

Which counties lack certified instructors?

Which events required emergency staffing?

Which programs generate the most staffing requests?
One Design Decision I'd Make Now

For the certification import table, keep:

ndow_customer_id
program_id
active
created_at

and do not add instructor names, emails, usernames, or roles.

Treat certifications as a pure relationship table:

User
   ↔
Certification
   ↔
Program

Everything else should always come from the users table.

That will prevent synchronization headaches later and keep the staffing engine fast and reliable.

Known Issues

• Dashboard cards too large

My Profile (User)
Account Information
Username (read only)
Email Address (editable)
Mobile Phone (editable)
Account Security
Change PIN
Notification Preferences
Email Notifications
Dashboard Notifications
SMS Notifications (future)
Save
Save Changes
Read Only Fields

Users can see:

Username

Users cannot edit:

Username
Role
Certifications
Hidden Fields

Not displayed to users:

NDOW Customer ID
Status
must_change_pin
Internal IDs
Permission Flags
Admin User Editor

Admins can manage:

Name
Email
Phone
Role
Status
Certifications

No NDOW Customer ID visible.

Superuser User Editor

Additional section:

System Information
------------------
NDOW Customer ID

Visible only to:

currentUser.role === 'superuser'

This keeps the user profile clean and gives ndow_customer_id the protection it deserves as the system's primary relationship key. It also fits nicely with the upcoming Certification Management and staffing-request features.




