# ==================================================

# NDOW VOLUNTEER PORTAL ARCHITECTURE

# ==================================================

Version: 06-09-26

Purpose

This document serves as the authoritative
architecture reference for the NDOW Volunteer
Portal and Instructor Calendar.

It defines:

* System organization
* User access levels
* Navigation architecture
* Overlay architecture
* Permission standards
* Design philosophy
* Future module placement

All future development should follow the
standards defined within this document.

# ==================================================

# TERMINOLOGY STANDARD

# ==================================================

Technical Role Name

Volunteer

User Interface Label

Instructor

Purpose

The application originated using the role
name "Volunteer" throughout the codebase
and database schema.

To preserve compatibility and avoid
unnecessary database migrations, the
technical role name remains Volunteer.

For user-facing screens, reports, menus,
help content, and administrative interfaces,
the preferred label is Instructor.

Examples

Code / Database

Volunteer

User Interface

Instructor

This standard applies throughout the system.

# ==================================================

# CURRENT APPLICATION ARCHITECTURE

# ==================================================

Primary Workspace

Calendar

The calendar is the primary application
workspace.

Administrative tools support the calendar.

Administrative tools do not replace the
calendar.

The calendar should remain visible whenever
practical.

# ==================================================

# USER ACCESS LEVELS

# ==================================================

Volunteer

Permissions

* View calendar
* View event details
* Request participation
* Enter volunteer hours
* View personal dashboard
* View personal activity

---

Admin

Includes all Volunteer permissions plus:

* Approve volunteer hours
* Review event submissions
* Manage users
* Manage announcements
* Manage help topics
* Manage requests
* Access administrative overlays

---

SuperUser

Includes all Admin permissions plus:

* Access System Console
* Execute workflows
* Reprocess event pipelines
* Run calendar updates
* Manage system-level functions
* Access Release Manager

# ==================================================

# PERMISSION MATRIX

# ==================================================

## Feature                      Volunteer   Admin   SuperUser

View Calendar                   Yes       Yes       Yes
View Event Details              Yes       Yes       Yes
View Help                       Yes       Yes       Yes

View Contacts                   No        Yes       Yes

View Analytics                  No        Yes       Yes

Manage Users                    No        Yes       Yes

Manage Requests                 No        Yes       Yes

Manage Categories               No        Yes       Yes

View Updates                    No        Yes       Yes

Release Manager                 No        No        Yes

System Functions                No        No        Yes

Version Information             Yes       Yes       Yes

# ==================================================

# SIDEBAR VISIBILITY MATRIX

# ==================================================

Volunteer

Dashboard
Help

---

Admin

Dashboard
Users
Requests
Updates
Contacts
Help
Analytics
Categories

---

SuperUser

Dashboard
Users
Requests
Updates
Contacts
Help
Analytics
Categories

Release Manager
System

# ==================================================

# SIDEBAR ARCHITECTURE

# ==================================================

Purpose

Provide permanent application navigation.

Replace popup-driven navigation.

Eliminate nested administrative modals.

---

Sidebar Layout

Volunteer Calendar
Administration

Dashboard
Users
Requests
Updates
Contacts
Help
Analytics
Categories

---

Sidebar Rules

* Sidebar remains visible at all times
* Sidebar controls navigation
* Dashboard functions as Home
* Navigation never launches nested popups
* Navigation opens overlays

# ==================================================

# OVERLAY ARCHITECTURE

# ==================================================

Purpose

Administrative functions operate through a
reusable overlay workspace.

The overlay appears above the calendar.

The calendar remains the primary application
workspace.

---

Dashboard Behavior

Dashboard is Home.

Selecting Dashboard:

* Closes any open overlay
* Returns focus to the calendar
* Does not open a separate panel

---

Overlay Behavior

Administrative functions open inside a reusable
workspace.

Examples

* Users
* Requests
* Updates
* Contacts
* Analytics
* Categories

---

Overlay Rules

* Sidebar remains visible
* One overlay at a time
* Overlay includes Close button
* Closing returns to calendar
* Calendar remains default application state

# ==================================================

# DASHBOARD PHILOSOPHY

# ==================================================

The Dashboard is always:

"My Dashboard"

The Dashboard is never:

* Admin Dashboard
* Instructor Dashboard
* System Dashboard

Content may change based on role.

The Dashboard remains user-centric.

The Dashboard is not a menu.

The Dashboard is an information surface.

Navigation belongs in the sidebar.

# ==================================================

# ANALYTICS ARCHITECTURE

# ==================================================

All analytics must support drill-down.

Counts without underlying records are not
considered complete analytics.

---

Example

Washoe County      74

Click

Display all Washoe County events.

---

Example

Fishing      32

Click

Display all Fishing events.

---

Rule

Every statistic must lead to the underlying data.

No dead-end numbers.

# ==================================================

# FUTURE ADMINISTRATIVE MODULES

# ==================================================

Planned Modules

* Categories
* Training
* Instructors
* Locations
* Reports
* Notifications

All future administrative modules shall:

* Appear in sidebar navigation
* Open in overlay workspace
* Follow permission matrix rules

# ==================================================

# LEGACY COMPONENTS SCHEDULED FOR REMOVAL

# ==================================================

After migration is complete:

* Dashboard modal
* Nested admin popups
* Dashboard launch buttons
* Legacy dashboard button grid
* Popup-based admin navigation

# ==================================================

# DEVELOPMENT ROADMAP

# ==================================================

Phase 1
Build sidebar shell

Phase 2
Implement overlay framework

Phase 3
Move Users into overlay

Phase 4
Move Requests into overlay

Phase 5
Move Contacts into overlay

Phase 6
Move Help into overlay

Phase 7
Move Analytics into overlay

Phase 8
Implement analytics drill-down

Phase 9
Add Categories overlay

Phase 10
Final style-guide cleanup

# ==================================================

# ARCHITECTURE PRINCIPLES

# ==================================================

1. Information before decoration.

2. Every click should reveal information
   or perform an action.

3. Statistics must be actionable.

4. Users should never lose context.

5. Administrative workflows should require
   the fewest practical clicks.

6. Mobile and desktop interfaces should
   expose the same functionality.

7. Business logic changes require separate
   approval from UI changes.

8. User access determines permissions.

9. Event assignments determine responsibilities.

10. Dashboard displays user information.

11. Admin manages operations.

12. System manages platform functions.

13. Precompute data whenever possible.

14. Avoid repeated scanning of large datasets.

15. Reuse existing interfaces whenever practical.

16. Maintain clear separation between user,
    admin, and system responsibilities.

17. The calendar is the primary workspace.

18. Administrative tools support the calendar,
    not replace it.

19. Dashboard is Home.

20. Every feature should answer:

"How does this help the logged-in user?"



# ==================================================

# HISTORICAL ARCHITECTURE NOTES

# ==================================================

The original architecture content begins below.
Retain all existing content below this marker
for historical reference and migration tracking.

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

1. Information before decoration.
2. Every click should reveal information or perform an action.
3. Statistics must be actionable.
4. Users should never lose context.
5. Administrative workflows should require the fewest practical clicks.
6. Mobile and desktop interfaces should expose the same functionality.
7. Business logic changes require separate approval from UI changes.
Dashboard Rule
The Dashboard is not a menu.

The Dashboard is an information surface.

Navigation belongs in the sidebar.

That single statement prevents future regression back toward popup-launchers and dashboard button grids.

Analytics Rule
All analytics metrics must support drill-down.

Counts without underlying records are not considered complete analytics.

This is one of the strongest improvements in the redesign.

Future Feature Placement

Document where future modules belong.

Future Administrative Modules

- Categories
- Training
- Instructors
- Locations
- Reports
- Notifications

These modules should appear as sidebar items and open within the main content area.

That keeps future growth consistent with the new architecture.

Technical Debt Notes

Create a section called:

Legacy Components Scheduled for Removal

Then list things like:

- Dashboard modal
- Nested admin popups
- Redundant navigation launch buttons
- Legacy dashboard button grid

This becomes a cleanup checklist later.

The biggest thing you've accomplished tonight is not the sidebar design itself—it's that you've finally defined a coherent application architecture. Up until now, features were accumulating through modals and utility windows. The sidebar/content-area model turns the calendar into a true administrative application instead of a collection of popups.

Once you paste the existing dashboard HTML in the next session, we can start producing exact replacement blocks for Phase 1 (sidebar shell) without having to redesign the architecture again.

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

06-09-26 
NDOW Calendar Dashboard Redesign Project
Core Objective

Convert the current modal-driven Dashboard/Admin interface into a permanent application layout consisting of:

┌──────────────┬───────────────────────────────┐
│              │                               │
│   SIDEBAR    │       CONTENT AREA            │
│              │                               │
│ Dashboard    │ Dashboard Panel               │
│ Users        │                               │
│ Requests     │ User Management Panel         │
│ Updates      │                               │
│ Contacts     │ Requests Panel                │
│ Help         │                               │
│ Analytics    │ Analytics Panel               │
│ Categories   │                               │
│              │                               │
└──────────────┴───────────────────────────────┘

No dashboard popups.

No nested modals.

One active content panel at a time.

Existing Functional Systems (Keep As-Is)

These systems are already working and should only be relocated into content panels:

Dashboard Statistics
Event Counts
Volunteer Counts
Pending Requests
County Statistics
User Management
Add User
Edit User
Role Management
PIN Reset
Requests
Approval Workflow
Pending Requests
Contacts
Contact Manager
Contact CRUD
Updates
Release Manager
Version Notes
Deployment Tracking
Analytics
Geo Analytics
County Analytics
Help
Existing Help Content
Authentication
Login
Role Visibility
Permissions

No business logic changes.

Sidebar Requirements

Width:

width:260px;

Sticky full-height layout:

height:100vh;
position:sticky;
top:0;

Visual style:

background:#19304B;
color:white;
Sidebar Header

Contains:

NDOW Volunteer Program Logo

Application title:

Volunteer Calendar
Administration

Version display beneath title.

Current user information.

Sidebar Navigation

Order:

Dashboard
Users
Requests
Updates
Contacts
Help
Analytics
Categories

Active item:

background:rgba(255,255,255,.12);
border-left:4px solid #589FD6;

Hover:

background:rgba(255,255,255,.06);
Main Content Area
flex:1;
overflow:auto;
padding:20px;
background:#F8FAFC;

Only one panel visible.

Switching navigation:

showAdminPanel("dashboard");
showAdminPanel("users");
showAdminPanel("analytics");

Hide all others.

Dashboard Layout

Top Row:

Total Events
Volunteers
Pending Requests
Active Programs

Second Row:

Upcoming Events
Recent Activity
County Summary

Third Row:

Quick Actions

No popups.

Everything visible.

Analytics Redesign

Analytics becomes fully drill-down capable.

Example

Display:

Washoe County      74
Clark County      122
Elko County        31

Click:

Washoe County

Opens:

Events in Washoe County

with event list.

Display:

Fishing        32
Hunter Ed      15
Boating        18

Click:

Fishing

Shows:

All Fishing Events
Rule

Every statistic must lead to underlying data.

No dead-end numbers.

Categories Panel

Future administrative category management.

Placeholder panel initially.

Navigation item should exist now.

UI Standards
Cards
background:#FFFFFF;
border:1px solid #DBE3EC;
border-radius:6px;
padding:10px 12px;
Panels
background:#FFFFFF;
border-radius:6px;
padding:16px;
Labels
font-size:11px;
font-weight:500;
letter-spacing:.08em;
text-transform:uppercase;
color:#6B7280;
Values
font-size:16px;
font-weight:700;
color:#19304B;
Section Headers
font-size:22px;
font-weight:700;
Navigation Philosophy

The user should never need to think:

"Where did that popup go?"

The user should always know:

Where they are
What section they are viewing
What actions are available
How to return

Everything visible.

Everything discoverable.

Minimal clicks.

Immediate Development Sequence
Phase 1

Build sidebar shell.

Phase 2

Move Dashboard into content panel.

Phase 3

Move Users panel.

Phase 4

Move Requests panel.

Phase 5

Move Contacts panel.

Phase 6

Move Help panel.

Phase 7

Move Analytics panel.

Phase 8

Implement analytics drill-down.

Phase 9

Add Categories panel.

Phase 10

Final style-guide cleanup.

When you paste the current dashboard HTML/CSS structure next, we'll be able to generate exact replacement blocks (start/end markers) for the sidebar conversion and keep with your preferred VS Code workflow.

