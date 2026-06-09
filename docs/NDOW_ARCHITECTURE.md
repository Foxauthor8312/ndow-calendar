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
