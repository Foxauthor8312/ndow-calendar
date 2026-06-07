# NDOW Workflows

## Purpose

This document defines the automated workflows, processing pipelines, and operational procedures used by the NDOW Volunteer Portal.

The goal is to document how data moves through the system and how future automation should be implemented.

---

# Design Principles

1. Automate repetitive tasks.

2. Precompute data whenever practical.

3. Minimize user wait times.

4. Minimize repeated processing.

5. Maintain auditability.

6. Keep workflows independent from user interfaces.

---

# Calendar Update Workflow

Purpose:

Retrieve the latest NDOW event information and publish updated event data.

Current Schedule:

- 10:15 AM Pacific
- 12:15 PM Pacific
- 2:15 PM Pacific
- 4:15 PM Pacific

Manual execution is also available.

---

# Current Calendar Pipeline

NDOW Website

↓

Event Scraper

(app.cjs)

↓

Raw Event Data

↓

Event Converter

(convert-events.cjs)

↓

events.json

↓

GitHub Repository

↓

Published Calendar Data

↓

Volunteer Portal

---

# Manual Calendar Update

Purpose:

Allow SuperUsers to trigger an update outside the scheduled workflow.

Process:

System Console

↓

Update Calendar Now

↓

Render API Endpoint

↓

GitHub Workflow Dispatch

↓

Calendar Workflow Executes

↓

events.json Updated

↓

last-updated.json Updated

↓

Portal Displays New Data

Access:

SuperUser only

---

# Current Data Sources

Primary Source:

NDOW Event Website

Processed Outputs:

- events.json
- all-events.txt
- last-updated.json

---

# Volunteer Hours Workflow

Purpose:

Capture volunteer participation and approval records.

Process:

Volunteer

↓

Submit Hours

↓

volunteer_hours Table

↓

Approval Queue

↓

Admin Review

↓

Approved / Rejected

↓

Dashboard Statistics Updated

---

# Volunteer Totals Workflow

Purpose:

Generate volunteer impact metrics.

Source:

volunteer_hours

Calculated Values:

- Event Count
- Total Hours
- Total Mileage
- Volunteer Value

Current Endpoint:

/api/volunteer-totals/:ndowId

Used By:

- Dashboard
- Hours Entry Confirmation
- Future Reporting

---

# Upcoming Events Workflow (Planned)

Purpose:

Provide personalized event lists for users.

Source:

event_assignments

Process:

User Login

↓

Dashboard Request

↓

Lookup User Assignments

↓

Next 7 Days

↓

Display Upcoming Events

↓

Open Existing Event Modal

---

# Event Assignment Workflow (Planned)

Purpose:

Create an indexed instructor assignment table.

Reason:

Avoid repeatedly scanning all events for instructor information.

Process:

NDOW Website

↓

Scraper

↓

Extract Instructor Information

↓

Create Assignment Records

↓

event_assignments Table

↓

Dashboard Queries

↓

Notification Queries

Assignment Types:

- PRIMARY
- ASSISTANT

---

# Notification Workflow (Future)

Purpose:

Notify users of upcoming assignments and important updates.

Potential Channels:

- Email
- SMS

Potential Triggers:

- New Assignment
- Upcoming Event
- Event Change
- Approval Status Change
- Announcement

---

# Dashboard Data Workflow

Impact Summary

Source:

volunteer_hours

---

Upcoming Events

Source:

event_assignments

---

Recent Activity

Source:

volunteer_hours

---

Announcements

Source:

announcements

---

# Administrative Workflow

Admin

↓

Review Requests

↓

Review Hours

↓

Approve / Reject

↓

User Notification

↓

Dashboard Update

---

# System Workflow

SuperUser

↓

System Console

↓

Run Workflow

or

Reprocess Data

↓

Operational Status Update

↓

Dashboard / Admin Availability

---

# Future Workflow Goals

1. Eliminate unnecessary event scanning.

2. Improve dashboard performance.

3. Support automated notifications.

4. Support reporting and analytics.

5. Support demonstration-ready user onboarding.

6. Maintain separation between Dashboard, Admin, and System functions.

7. Ensure all workflows can be manually triggered when necessary.
