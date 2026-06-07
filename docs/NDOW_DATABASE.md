# NDOW Database

## Purpose

This document defines the database structure used by the NDOW Volunteer Portal.

The database supports user management, volunteer participation, event tracking, approvals, communications, and future dashboard functionality.

---

# Design Principles

1. Store data once whenever possible.

2. Use relationships rather than duplicate data.

3. Preserve historical records.

4. Support dashboard reporting.

5. Support future automation and notifications.

---

# users

Purpose:

Stores user accounts and system permissions.

Key Fields:

- id
- username
- password_hash
- email
- phone
- ndow_id
- role
- notify_email
- notify_sms
- disabled

Role Values:

- volunteer
- admin
- superuser

Used By:

- Login
- Permissions
- Dashboard
- Notifications
- Admin Panel

---

# volunteer_hours

Purpose:

Stores volunteer participation records.

Each record represents a volunteer's participation in an event.

Key Fields:

- id
- user_id
- ndow_id
- event_id
- event_name
- program
- county
- region
- event_date
- location
- start_time
- end_time
- volunteer_hours
- mileage
- service_value
- approval_status
- submitted_at

Approval Status:

- submitted
- approved
- rejected

Used By:

- Volunteer Dashboard
- Hour Approvals
- Reports
- Volunteer Totals

---

# announcements

Purpose:

Stores system announcements displayed to users.

Key Fields:

- id
- title
- message
- active
- created_at

Used By:

- Dashboard
- Announcement Panel

---

# help_topics

Purpose:

Stores help documentation available within the portal.

Key Fields:

- id
- category
- topic_key
- title
- content
- sort_order
- active

Used By:

- Help System
- Admin Help Editor

---

# instructor_requests

Purpose:

Stores volunteer requests related to event participation.

Key Fields:

- id
- event_id
- user_id
- status
- notes
- submitted_at

Status Values:

- pending
- approved
- rejected

Used By:

- Volunteer Requests
- Admin Review

---

# event_assignments (Planned)

Purpose:

Stores instructor assignments extracted from event data.

This table exists to provide rapid dashboard lookups and future notification support.

Key Fields:

- id
- event_id
- event_name
- event_date
- email
- assignment_type
- created_at
- updated_at

Assignment Types:

- PRIMARY
- ASSISTANT

Used By:

- Upcoming Events
- Dashboard Personalization
- Notifications
- Instructor Activity Reporting

---

# Derived Data

The following values are calculated from volunteer_hours:

Volunteer Totals

- Events
- Hours
- Mileage
- Volunteer Value

Current Endpoint:

/api/volunteer-totals/:ndowId

Returned Values:

{
  events,
  hours,
  mileage,
  serviceValue
}

---

# Future Dashboard Data Sources

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

Notifications

Source:

event_assignments
announcements

---

# Future Database Goals

1. Support dashboard personalization.

2. Support automated notifications.

3. Support instructor activity reporting.

4. Support volunteer analytics.

5. Support NDOW operational reporting.

6. Minimize repeated processing of event data.

7. Maintain clear relationships between users, events, and participation records.
