/*
==============================================================================
 NDOW Volunteer Portal
 Proposed Events
------------------------------------------------------------------------------
 Module      : proposed-events.js
 Layer       : Frontend UI

 Purpose:
    Displays active proposed events in a vertical side calendar.

 Responsibilities:
    • Load proposed events from the API
    • Sort events by date
    • Group events by month/year
    • Render the Proposed Events panel

==============================================================================
*/

'use strict';

const PROPOSED_EVENTS_API =
  'https://ndow-calendar-server.onrender.com/api/proposed-events';


// ========================================
// LOAD PROPOSED EVENTS
// ========================================

async function loadProposedEvents() {

  try {

    const token =
      localStorage.getItem('token');

    if (!token) {
      console.warn(
        'PROPOSED EVENTS: No authentication token found.'
      );
      return [];
    }

    const response =
      await fetch(
        PROPOSED_EVENTS_API,
        {
          method: 'GET',

          headers: {
            'Authorization':
              'Bearer ' + token,

            'Content-Type':
              'application/json'
          }
        }
      );

    if (!response.ok) {

      console.error(
        'PROPOSED EVENTS API ERROR:',
        response.status
      );

      return [];
    }

    const result =
      await response.json();

    if (!result.success) {

      console.error(
        'PROPOSED EVENTS LOAD FAILED:',
        result
      );

      return [];
    }

    return Array.isArray(result.events)
      ? result.events
      : [];

  } catch (error) {

    console.error(
      'PROPOSED EVENTS EXCEPTION:',
      error
    );

    return [];

  }

}


// ========================================
// RENDER PROPOSED EVENTS
// ========================================

async function renderProposedEvents() {

  const container =
    document.getElementById(
      'proposedEventsList'
    );

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div style="
      padding:20px;
      text-align:center;
      color:#64748b;
      font-size:12px;
    ">
      Loading...
    </div>
  `;

  const events =
    await loadProposedEvents();

  if (!events.length) {

    container.innerHTML = `
      <div style="
        padding:24px 12px;
        text-align:center;
        color:#64748b;
        font-size:12px;
      ">
        No proposed events.
      </div>
    `;

    return;
  }

  // --------------------------------------
  // Sort by date
  // --------------------------------------

  events.sort(
    (a, b) =>
      new Date(a.event_date) -
      new Date(b.event_date)
  );


  let html = '';

  let currentMonth = '';


  events.forEach(event => {

    const date =
      new Date(
        event.event_date +
        'T00:00:00'
      );

    const monthKey =
      date.getFullYear() +
      '-' +
      String(
        date.getMonth() + 1
      ).padStart(2, '0');


    // ------------------------------------
    // Month heading
    // ------------------------------------

    if (monthKey !== currentMonth) {

      currentMonth =
        monthKey;

      html += `
        <div style="
          margin-top:16px;
          margin-bottom:10px;

          padding-bottom:6px;

          border-bottom:
            1px solid #DBE3EC;

          color:#19304B;

          font-size:12px;
          font-weight:700;

          letter-spacing:.5px;
        ">
          ${date.toLocaleDateString(
            'en-US',
            {
              month:'long',
              year:'numeric'
            }
          ).toUpperCase()}
        </div>
      `;
    }


    // ------------------------------------
    // Event card
    // ------------------------------------

    html += `

      <div style="
        padding:12px;
        margin-bottom:10px;

        background:#FFFFFF;

        border:1px solid #DBE3EC;
        border-radius:8px;

        box-shadow:
          0 1px 2px rgba(0,0,0,.04);
      ">

        <div style="
          color:#19304B;
          font-size:20px;
          font-weight:700;
          line-height:1;
          margin-bottom:5px;
        ">
          ${date.getDate()}
        </div>

        <div style="
          color:#19304B;
          font-size:13px;
          font-weight:700;
          line-height:1.35;
          margin-bottom:5px;
        ">
          ${escapeProposedEventText(
            event.event_name
          )}
        </div>

        <div style="
          color:#589FD6;
          font-size:11px;
          font-weight:600;
          margin-bottom:3px;
        ">
          ${escapeProposedEventText(
            event.category
          )}
        </div>

        <div style="
          color:#475569;
          font-size:11px;
          line-height:1.4;
        ">
          ${escapeProposedEventText(
            event.location
          )}
        </div>

        <div style="
          margin-top:7px;

          color:#19304B;

          font-size:11px;
          font-weight:600;
        ">
          Instructors Needed:
          ${Number(
            event.instructors_needed
          )}
        </div>

      </div>

    `;

  });


  container.innerHTML =
    html;

}


// ========================================
// ESCAPE DISPLAY TEXT
// ========================================

function escapeProposedEventText(value) {

  if (value === null ||
      value === undefined) {

    return '';

  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


// ========================================
// GLOBAL ACCESS
// ========================================

window.loadProposedEvents =
  loadProposedEvents;

window.renderProposedEvents =
  renderProposedEvents;
