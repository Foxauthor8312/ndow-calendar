# NDOW_ARCHITECTURE.md

## Purpose

The NDOW Volunteer Portal is a volunteer management platform designed to support volunteers, administrators, and system operators through a unified interface.

The system prioritizes user-specific information, operational efficiency, and administrative oversight while maintaining a clear separation of responsibilities.

---

# USER ACCESS LEVELS

User roles determine system access.

## Volunteer

Permissions:

* View calendar
* View event details
* Request participation
* Enter volunteer hours
* View personal dashboard
* View personal activity

Volunteers are the primary users of the system.

---

## Front End Architecture

6/7/26
Help Module
File: js/help.js

Responsibilities:
- Help Center rendering
- Topic search
- Context-sensitive help
- Help administration support
- Help content formatting

---

## Admin

Includes all Volunteer permissions plus:

* Approve volunteer hours
* Review event submissions
* Manage users
* Manage announcements
* Manage help topics
* Manage requests
* Access Admin Panel

Admins manage volunteers and event operations.

---

## SuperUser

Includes all Admin permissions plus:

* Access System Console
* Execute workflows
* Reprocess event pipelines
* Run calendar updates
* Manage system-level functions

SuperUsers manage platform operations.

---

# EVENT PARTICIPATION

Event participation is independent of user access level.

A Volunteer, Admin, or SuperUser may participate in events.

Participation is defined by assignment type.

---

## Primary Instructor

Responsibilities:

* Review event details
* Edit event information
* Verify attendance
* Submit event for approval
* Enter volunteer hours

Primary Instructors are responsible for event management.

---

## Assistant Instructor

Responsibilities:

* Enter volunteer hours

Assistant Instructors participate in events but do not manage event records.

---

# SYSTEM ORGANIZATION

The platform is organized into three functional areas.

---

## Dashboard

Purpose:

User information.

Examples:

* Impact Summary
* Upcoming Events
* Recent Activity
* Personal Statistics

The Dashboard answers:

"What do I need to know?"

---

## Admin

Purpose:

Management functions.

Examples:

* User Management
* Hour Approvals
* Announcements
* Help Topics
* Requests

The Admin area answers:

"What needs to be managed?"

---

## System

Purpose:

Operational functions.

Examples:

* Workflow Status
* Calendar Updates
* Reprocessing
* System Health

The System area answers:

"What needs to be operated?"

---

# DASHBOARD PHILOSOPHY

The Dashboard is always:

"My Dashboard"

The Dashboard is never:

* Admin Dashboard
* Instructor Dashboard
* System Dashboard

Content may change based on role and event assignments, but the Dashboard remains user-centric.

---

# CURRENT DASHBOARD DESIGN

## Impact Summary

Displays:

* Events
* Hours
* Miles
* Volunteer Value

---

## Upcoming Events

Displays:

* Next 7 days only
* Compact scrollable list
* Event assignment indicators
* Opens existing event modal

---

## Recent Activity

Displays:

* Recently completed events
* Submitted hours
* Personal participation history

---

# FUTURE EVENT ASSIGNMENT MODEL

Purpose:

Provide rapid lookup of user-event relationships.

Table:

event_assignments

Fields:

* event_id
* event_name
* event_date
* email
* assignment_type

Assignment Types:

* PRIMARY
* ASSISTANT

---

# ARCHITECTURE PRINCIPLES

1. User access determines permissions.

2. Event assignments determine responsibilities.

3. Dashboard displays user information.

4. Admin manages operations.

5. System manages platform functions.

6. Precompute data whenever possible.

7. Avoid repeated scanning of large datasets.

8. Reuse existing interfaces whenever practical.

9. Maintain a clear separation between user, admin, and system responsibilities.

10. Every feature should answer:

"How does this help the logged-in user?"
