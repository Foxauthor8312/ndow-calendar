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

const PROPOSED_EVENT_ADDRESSES_API =
  'https://ndow-calendar-server.onrender.com/api/proposed-events/addresses';

let proposedEventAddresses = [];


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
// LOAD PROPOSED EVENT ADDRESSES
// ========================================

async function loadProposedEventAddresses() {

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
        PROPOSED_EVENT_ADDRESSES_API,
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
        'PROPOSED EVENT ADDRESSES API ERROR:',
        response.status
      );

      return [];
    }

    const result =
      await response.json();

    if (!result.success) {

      console.error(
        'PROPOSED EVENT ADDRESSES LOAD FAILED:',
        result
      );

      return [];
    }

    proposedEventAddresses =
      Array.isArray(result.addresses)
        ? result.addresses
        : [];

    return proposedEventAddresses;

  } catch (error) {

    console.error(
      'PROPOSED EVENT ADDRESSES EXCEPTION:',
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

        ${
          event.notes
            ? `
              <div style="
                margin-top:8px;
                padding-top:7px;
                border-top:1px solid #DBE3EC;
                color:#475569;
                font-size:11px;
                line-height:1.4;
              ">
                <span style="
                  color:#19304B;
                  font-weight:700;
                ">
                  Notes:
                </span>
                ${escapeProposedEventText(
                  event.notes
                )}
              </div>
            `
            : ''
        }

        <button
          type="button"
          onclick="editProposedEvent(${Number(event.id)})"
          style="
            width:100%;
            margin-top:10px;
            padding:6px 8px;
            border:1px solid #DBE3EC;
            border-radius:5px;
            background:#F8FAFC;
            color:#19304B;
            font-size:11px;
            font-weight:600;
            cursor:pointer;
          "
        >
          Edit
        </button>

        <button
          type="button"
          onclick="hideProposedEvent(${Number(event.id)})"
          style="
            width:100%;
            margin-top:6px;
            padding:6px 8px;
            border:1px solid #DBE3EC;
            border-radius:5px;
            background:#FFFFFF;
            color:#64748B;
            font-size:11px;
            font-weight:600;
            cursor:pointer;
          "
        >
          Hide
        </button>

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


// ========================================
// PROPOSED EVENT MODAL
// ========================================

let editingProposedEventId = null;

window.openProposedEventModal =
  async function () {

    await loadProposedEventAddresses();

    if (
      document.getElementById(
        'proposedEventModal'
      )
    ) {
      return;
    }

    const modal =
      document.createElement('div');

    modal.id =
      'proposedEventModal';

    modal.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:10000;
    `;

    modal.innerHTML = `

      <div
        style="
          width:460px;
          max-width:90vw;
          background:#FFFFFF;
          border-radius:8px;
          box-shadow:0 10px 30px rgba(0,0,0,.25);
          overflow:hidden;
        "
      >

        <!-- HEADER -->

        <div
          style="
            padding:14px 18px;
            background:#19304B;
            color:#FFFFFF;
            font-size:16px;
            font-weight:700;
            display:flex;
            align-items:center;
            justify-content:space-between;
          "
        >

          <span>
            Add Proposed Event
          </span>

          <button
            type="button"
            onclick="closeProposedEventModal()"
            style="
              border:none;
              background:transparent;
              color:#FFFFFF;
              font-size:22px;
              cursor:pointer;
              line-height:1;
            "
          >
            ×
          </button>

        </div>


        <!-- FORM -->

        <div
          style="
            padding:18px;
          "
        >

          <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Date
          </label>

          <input
            id="proposedEventDate"
            type="date"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-bottom:14px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:13px;
            "
          >


          <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Event Name
          </label>

          <input
            id="proposedEventName"
            type="text"
            placeholder="Event name"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-bottom:14px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:13px;
            "
          >


          <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Category
          </label>

          <select
            id="proposedEventCategory"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-bottom:14px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:13px;
              background:#FFFFFF;
            "
          >

            <option value="">
              Select Category
            </option>

            <option>Hunter Education</option>
            <option>Fishing</option>
            <option>Advanced Hunter Education</option>
            <option>Wildlife</option>
            <option>Urban Wildlife</option>
            <option>Archery</option>
            <option>Boating</option>
            <option>School</option>
            <option>Volunteer</option>
            <option>Other</option>

          </select>


          <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Location
          </label>

   <select
  id="proposedEventLocation"
  style="
    width:100%;
    box-sizing:border-box;
    padding:8px;
    margin-bottom:14px;
    border:1px solid #DBE3EC;
    border-radius:6px;
    font-size:13px;
    background:#FFFFFF;
  "
>
  <option value="">
    Select Location
  </option>

  ${
    proposedEventAddresses
      .map(address => `
        <option value="${Number(address.id)}">
          ${escapeProposedEventText(
            address.location_name
          )}
        </option>
      `)
      .join('')
  }

</select>


          <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Instructors Needed
          </label>

          <input
            id="proposedEventInstructors"
            type="number"
            min="1"
            step="1"
            value="1"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-bottom:14px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:13px;
            "
          >

                    <label
            style="
              display:block;
              margin-bottom:5px;
              font-size:12px;
              font-weight:600;
              color:#374151;
            "
          >
            Notes
          </label>

          <textarea
            id="proposedEventNotes"
            rows="3"
            placeholder="Optional notes"
            style="
              width:100%;
              box-sizing:border-box;
              padding:8px;
              margin-bottom:18px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:13px;
              resize:vertical;
            "
          ></textarea>


          <!-- BUTTONS -->

          <div
            style="
              display:flex;
              justify-content:flex-end;
              gap:8px;
            "
          >

            <button
              type="button"
              onclick="closeProposedEventModal()"
              style="
                padding:8px 14px;
                border:1px solid #DBE3EC;
                border-radius:6px;
                background:#FFFFFF;
                color:#374151;
                font-size:12px;
                cursor:pointer;
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onclick="saveProposedEvent()"
              style="
                padding:8px 14px;
                border:1px solid #19304B;
                border-radius:6px;
                background:#19304B;
                color:#FFFFFF;
                font-size:12px;
                font-weight:600;
                cursor:pointer;
              "
            >
              Save Proposed Event
            </button>

          </div>

        </div>

      </div>

    `;

    document.body.appendChild(modal);


    modal.addEventListener(
      'click',
      function (event) {

        if (
          event.target === modal
        ) {
          closeProposedEventModal();
        }

      }
    );

  };


// ========================================
// CLOSE PROPOSED EVENT MODAL
// ========================================

window.closeProposedEventModal =
  function () {

    const modal =
      document.getElementById(
        'proposedEventModal'
      );

    if (modal) {
      modal.remove();
    }

    editingProposedEventId = null;

  };


// ========================================
// EDIT PROPOSED EVENT
// ========================================

window.editProposedEvent =
  async function (eventId) {

    const token =
      localStorage.getItem('token');

    if (!token) {

      alert(
        'Your session has expired. Please log in again.'
      );

      return;

    }

    try {

      const response =
        await fetch(
          PROPOSED_EVENTS_API,
          {
            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          'Unable to load proposed event.'
        );

      }

      const event =
        result.events.find(
          item =>
            Number(item.id) ===
            Number(eventId)
        );

      if (!event) {

        throw new Error(
          'Proposed event could not be found.'
        );

      }


      /*
      ------------------------------------
      Open the existing modal
      ------------------------------------
      */

      await openProposedEventModal();

      editingProposedEventId =
        Number(event.id);


      /*
      ------------------------------------
      Populate fields
      ------------------------------------
      */

      document.getElementById(
        'proposedEventDate'
      ).value =
        event.event_date || '';

      document.getElementById(
        'proposedEventName'
      ).value =
        event.event_name || '';

      document.getElementById(
        'proposedEventCategory'
      ).value =
        event.category || '';

document.getElementById(
  'proposedEventLocation'
).value =
  event.address_id
    ? String(event.address_id)
    : '';
      document.getElementById(
        'proposedEventInstructors'
      ).value =
        event.instructors_needed || 1;

      document.getElementById(
        'proposedEventNotes'
      ).value =
        event.notes || '';


      /*
      ------------------------------------
      Change modal title
      ------------------------------------
      */

      const modal =
        document.getElementById(
          'proposedEventModal'
        );

      if (modal) {

        const title =
          modal.querySelector(
            'span'
          );

        if (title) {

          title.textContent =
            'Edit Proposed Event';

        }

        const buttons =
          modal.querySelectorAll(
            'button'
          );

        buttons.forEach(
          button => {

            if (
              button.textContent.trim() ===
              'Save Proposed Event'
            ) {

              button.textContent =
                'Save Changes';

            }

          }
        );

      }

    }

    catch (err) {

      console.error(
        'EDIT PROPOSED EVENT ERROR:',
        err
      );

      alert(
        err.message ||
        'Unable to load proposed event.'
      );

    }

  };


// ========================================
// HIDE PROPOSED EVENT
// ========================================

window.hideProposedEvent =
  async function (eventId) {

    if (
      !confirm(
        'Hide this proposed event?'
      )
    ) {
      return;
    }

    const token =
      localStorage.getItem('token');

    if (!token) {

      alert(
        'Your session has expired. Please log in again.'
      );

      return;
    }

    try {

      const getResponse =
        await fetch(
          PROPOSED_EVENTS_API,
          {
            headers: {
              'Authorization':
                `Bearer ${token}`
            }
          }
        );

      const getResult =
        await getResponse.json();

      if (
        !getResponse.ok ||
        !getResult.success
      ) {

        throw new Error(
          getResult.error ||
          'Unable to load proposed events.'
        );

      }

      const event =
        getResult.events.find(
          item =>
            Number(item.id) ===
            Number(eventId)
        );

      if (!event) {

        throw new Error(
          'Proposed event could not be found.'
        );

      }


      const response =
        await fetch(
          `${PROPOSED_EVENTS_API}/${eventId}`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${token}`
            },

            body:
              JSON.stringify({

                event_date:
                  event.event_date,

                event_name:
                  event.event_name,

                category:
                  event.category,

                location:
                  event.location,

                instructors_needed:
                  event.instructors_needed,

                notes:
                  event.notes,

                active:
                  false

              })
          }
        );


      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          'Unable to hide proposed event.'
        );

      }

      await renderProposedEvents();

    }

    catch (err) {

      console.error(
        'HIDE PROPOSED EVENT ERROR:',
        err
      );

      alert(
        err.message ||
        'Unable to hide proposed event.'
      );

    }

  };

// ========================================
// SAVE PROPOSED EVENT
// ========================================

window.saveProposedEvent =
  async function () {

    const date =
      document.getElementById(
        'proposedEventDate'
      ).value;

    const name =
      document.getElementById(
        'proposedEventName'
      ).value.trim();

    const category =
      document.getElementById(
        'proposedEventCategory'
      ).value;

   const locationSelect =
  document.getElementById(
    'proposedEventLocation'
  );

const addressId =
  locationSelect.value;

const location =
  locationSelect.options[
    locationSelect.selectedIndex
  ]?.textContent.trim() || '';

    const instructors =
      document.getElementById(
        'proposedEventInstructors'
      ).value;

    const notes =
      document.getElementById(
        'proposedEventNotes'
      ).value.trim();


    // ------------------------------------
    // VALIDATION
    // ------------------------------------

if (
  !date ||
  !name ||
  !category ||
  !addressId ||
  !instructors
)

      alert(
        'Please complete all required fields.'
      );

      return;

    }


    const token =
      localStorage.getItem('token');


    if (!token) {

      alert(
        'Your session has expired. Please log in again.'
      );

      return;

    }


    try {

      const response =
        await fetch(
          editingProposedEventId
            ? `${PROPOSED_EVENTS_API}/${editingProposedEventId}`
            : PROPOSED_EVENTS_API,
          {
            method:
              editingProposedEventId
                ? 'PATCH'
                : 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Authorization':
                `Bearer ${token}`
            },

body:
  JSON.stringify({

    event_date:
      date,

    event_name:
      name,

    category:
      category,

    address_id:
      Number(addressId),

    location:
      location,

    instructors_needed:
      Number(instructors),

    notes:
      notes || null

  })
          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          'Unable to save proposed event.'
        );

      }


      // ------------------------------------
      // SUCCESS
      // ------------------------------------

      closeProposedEventModal();

      await renderProposedEvents();


    } catch (err) {

      console.error(
        'SAVE PROPOSED EVENT ERROR:',
        err
      );

      alert(
        err.message ||
        'Unable to save proposed event.'
      );

    }

  };
