'use strict';

const ANGLING_CALENDAR_API =
  'https://ndow-calendar-server.onrender.com/api/angling-calendar';


// ========================================
// LOAD ANGLING CALENDAR
// ========================================

async function loadAnglingCalendar() {

  try {
    const live = await fetch(ANGLING_CALENDAR_API.replace('/angling-calendar', '/angling-calendar/google/events'));
    if (live.ok) {
      const payload = await live.json();
      if (payload.success && Array.isArray(payload.items)) {
        return payload.items.map(item => ({
          id: item.id,
          uid: item.iCalUID || item.id,
          title: item.summary || 'Untitled Event',
          start: item.start?.dateTime || item.start?.date || '',
          end: item.end?.dateTime || item.end?.date || '',
          location: item.location || '',
          description: item.description || '',
          status: item.status || '',
          lastModified: item.updated || '',
          url: item.htmlLink || '',
          rrule: item.recurrence || '',
          recurrenceId: item.recurringEventId || '',
          organizer: item.organizer?.displayName || item.organizer?.email || '',
          creator: item.creator?.displayName || item.creator?.email || '',
          attendees: Array.isArray(item.attendees) ? item.attendees : [],
          visibility: item.visibility || '',
          transparency: item.transparency || '',
          googleEvent: item
        }));
      }
    }
  } catch (error) {
    console.warn('Live Google Calendar unavailable; using iCal feed.', error);
  }

  try {

    const response =
      await fetch(ANGLING_CALENDAR_API);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data =
  await response.json();


// ========================================
// UPDATE HEADER TIMESTAMP
// ========================================

const updatedElement =
  document.getElementById(
    'anglingCalendarUpdated'
  );

if (
  updatedElement &&
  data.lastUpdated
) {

  const updatedDate =
    new Date(
      data.lastUpdated
    );

  updatedElement.textContent =
    'Calendar data updated: ' +
    updatedDate.toLocaleDateString(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    ) +
    ' • ' +
    updatedDate.toLocaleTimeString(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    );

}


if (
  !data.success ||
  !Array.isArray(data.events)
) {
  
      throw new Error(
        'Invalid Angling Calendar response.'
      );
    }

    return data.events;

  } catch (error) {

    console.error(
      'ANGLING CALENDAR LOAD ERROR:',
      error
    );

    return [];

  }

}

// ========================================
// LOAD OFFICIAL NDOW EVENTS FOR MATCHING
// ========================================

const NDOW_EVENTS_URL =
  'https://foxauthor8312.github.io/ndow-calendar/events.json';


async function loadNdowEventsForAnglingMatch() {

  try {

    const response =
      await fetch(
        NDOW_EVENTS_URL +
        '?t=' +
        Date.now()
      );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }

    const data =
      await response.json();

    if (
      !data ||
      !Array.isArray(data.events)
    ) {

      throw new Error(
        'Invalid NDOW events response.'
      );

    }

    return data.events;

  } catch (error) {

    console.error(
      'ANGLING CALENDAR NDOW MATCH LOAD ERROR:',
      error
    );

    return [];

  }

}


// ========================================
// NDOW MATCH HELPERS
// ========================================

function normalizeAnglingMatchText(
  value
) {

  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

}


function anglingDateKey(
  value
) {

  const date =
    normalizeAnglingDate(value);

  if (!date) {
    return '';
  }

  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1
    ).padStart(2, '0'),
    String(
      date.getDate()
    ).padStart(2, '0')
  ].join('-');

}


function anglingTitlesMatch(
  anglingTitle,
  ndowTitle
) {

  const a =
    normalizeAnglingMatchText(
      anglingTitle
    );

  const b =
    normalizeAnglingMatchText(
      ndowTitle
    );

  if (!a || !b) {
    return false;
  }

  return (
    a === b ||
    a.includes(b) ||
    b.includes(a)
  );

}


function anglingLocationsMatch(
  anglingLocation,
  ndowLocation
) {

  const a =
    normalizeAnglingMatchText(
      anglingLocation
    );

  const b =
    normalizeAnglingMatchText(
      ndowLocation
    );

  if (!a || !b) {
    return false;
  }

  // Exact or contained address match
  if (
    a === b ||
    a.includes(b) ||
    b.includes(a)
  ) {
    return true;
  }

  // Try ZIP-code confirmation
  const zipA =
    String(anglingLocation)
      .match(/\b\d{5}(?:-\d{4})?\b/);

  const zipB =
    String(ndowLocation)
      .match(/\b\d{5}(?:-\d{4})?\b/);

  if (
    zipA &&
    zipB &&
    zipA[0] === zipB[0]
  ) {
    return true;
  }

  return false;

}


// ========================================
// FIND MATCHING NDOW EVENT
// ========================================

function findMatchingNdowEvent(
  anglingEvent,
  ndowEvents
) {

  if (
    !anglingEvent ||
    !Array.isArray(ndowEvents)
  ) {
    return null;
  }

  const anglingDate =
    anglingDateKey(
      anglingEvent.start
    );


  
  if (!anglingDate) {
    return null;
  }

  // ----------------------------------------
  // 1. DATE MUST MATCH
  // ----------------------------------------

  let candidates =
    ndowEvents.filter(
      ndowEvent =>
        anglingDateKey(
          ndowEvent.date
        ) === anglingDate
    );

  if (!candidates.length) {
    return null;
  }


  // ----------------------------------------
  // 2. TITLE MUST MATCH
  // ----------------------------------------

  candidates =
    candidates.filter(
      ndowEvent =>
        anglingTitlesMatch(
          anglingEvent.title,
          ndowEvent.title
        )
    );

  if (!candidates.length) {
    return null;
  }


  // ----------------------------------------
  // 3. UNIQUE TITLE/DATE MATCH
  // ----------------------------------------

  if (candidates.length === 1) {
    return candidates[0];
  }


  // ----------------------------------------
  // 4. LOCATION DISAMBIGUATION
  // ----------------------------------------

  const locationMatches =
    candidates.filter(
      ndowEvent =>
        anglingLocationsMatch(
          anglingEvent.location,
          ndowEvent.location
        )
    );

  if (locationMatches.length === 1) {
    return locationMatches[0];
  }


  // ----------------------------------------
  // 5. DO NOT GUESS
  // ----------------------------------------

  return null;

}


// ========================================
// DATE / TIME FORMATTING
// ========================================

function normalizeAnglingDate(value) {

  if (!value) {
    return null;
  }

  let dateString =
    String(value).trim();

  // ----------------------------------------
  // DATE ONLY — KEEP AS LOCAL DATE
  // ----------------------------------------

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

    const [
      year,
      month,
      day
    ] =
      dateString
        .split('-')
        .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  // ----------------------------------------
  // COMPACT iCAL UTC DATE/TIME
  // ----------------------------------------

  if (/^\d{8}T\d{6}Z$/.test(dateString)) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
        '$1-$2-$3T$4:$5:$6Z'
      );

  }

  // ----------------------------------------
  // COMPACT iCAL LOCAL DATE/TIME
  // ----------------------------------------

  else if (/^\d{8}T\d{6}$/.test(dateString)) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
        '$1-$2-$3T$4:$5:$6'
      );

  }

  // ----------------------------------------
  // COMPACT DATE ONLY
  // ----------------------------------------

  else if (/^\d{8}$/.test(dateString)) {

    const year =
      Number(dateString.slice(0, 4));

    const month =
      Number(dateString.slice(4, 6));

    const day =
      Number(dateString.slice(6, 8));

    return new Date(
      year,
      month - 1,
      day
    );
  }

  // ----------------------------------------
  // STANDARD DATE/TIME
  // ----------------------------------------

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}


function formatAnglingDate(value) {

  const date =
    normalizeAnglingDate(value);

  if (!date) {
    return value || '';
  }

  return date.toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  );

}


function formatAnglingDateTime(value) {

  const date =
    normalizeAnglingDate(value);

  if (!date) {
    return value || '';
  }

  return date.toLocaleString(
    undefined,
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }
  );

}


// Format the clock time for the compact event list.
// Date-only events intentionally return no time.
function formatAnglingTime(value) {

  if (!value) {
    return '';
  }

  const raw = String(value).trim();

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(raw) ||
    /^\d{8}$/.test(raw)
  ) {
    return '';
  }

  const date = normalizeAnglingDate(raw);

  if (!date) {
    return '';
  }

  return date.toLocaleTimeString(
    undefined,
    {
      hour: 'numeric',
      minute: '2-digit'
    }
  );

}


// ========================================
// HTML SAFETY
// ========================================

function escapeAnglingHtml(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}


// ========================================
// DESCRIPTION FORMATTING
// ========================================

function formatAnglingDescription(value) {

  if (!value) {
    return '';
  }

  let text =
    String(value);

  /*
    Convert URLs into clickable links
    AFTER escaping the text.
  */

  text =
    escapeAnglingHtml(text);

  text =
    text.replace(
      /(https?:\/\/[^\s<]+)/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  /*
    Preserve line breaks from Google Calendar.
  */

  text =
    text.replace(/\r?\n/g, '<br>');

  return text;

}


// ========================================
// ANGling EVENT DETAILS MODAL
// ========================================

function createAnglingDetailsModal() {

  if (
    document.getElementById(
      'anglingEventDetailsModal'
    )
  ) {
    return;
  }

  const modal =
    document.createElement('div');

  modal.id =
    'anglingEventDetailsModal';

 modal.className =
  'angling-event-details-modal';

  modal.style.cssText = `
    position:fixed;
    inset:0;
    z-index:11000;
    display:none;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.45);
    padding:20px;
    box-sizing:border-box;
  `;

  modal.innerHTML = `

    <div
      style="
        width:min(850px,100%);
        max-height:90vh;
        overflow-y:auto;
        background:#FFFFFF;
        border-radius:10px;
        box-shadow:0 20px 50px rgba(0,0,0,.30);
        border:1px solid #DBE3EC;
        box-sizing:border-box;
      "
    >

      <!-- HEADER -->

      <div
        style="
          position:sticky;
          top:0;
          z-index:2;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:15px;
          padding:14px 18px;
          background:#19304B;
          color:#FFFFFF;
          border-radius:10px 10px 0 0;
        "
      >

        <div
          style="
            font-size:16px;
            font-weight:700;
            letter-spacing:.3px;
          "
        >
          ANGLING CALENDAR — EVENT DETAILS
        </div>

        <button
          type="button"
          id="closeAnglingDetails"
          title="Close"
          style="
            width:30px;
            height:30px;
            padding:0;
            border:1px solid rgba(255,255,255,.65);
            border-radius:5px;
            background:transparent;
            color:#FFFFFF;
            font-size:18px;
            cursor:pointer;
          "
        >
          ✕
        </button>

      </div>

      <!-- BODY -->

      <div
        id="anglingEventDetailsBody"
        style="
          padding:22px;
        "
      >
      </div>

    </div>
  `;

  document.body.appendChild(modal);


  // CLOSE BUTTON

  document
    .getElementById(
      'closeAnglingDetails'
    )
    .addEventListener(
      'click',
      closeAnglingEventDetails
    );


  // CLICK OUTSIDE

  modal.addEventListener(
    'click',
    event => {

      if (
        event.target === modal
      ) {
        closeAnglingEventDetails();
      }

    }
  );


  // ESCAPE KEY

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape' &&
        modal.style.display !== 'none'
      ) {

        closeAnglingEventDetails();

      }

    }
  );

}


// ========================================
// OPEN EVENT DETAILS
// ========================================

function openAnglingEventDetails(event) {

  createAnglingDetailsModal();

  const modal =
    document.getElementById(
      'anglingEventDetailsModal'
    );

  const body =
    document.getElementById(
      'anglingEventDetailsBody'
    );

  if (!modal || !body) {
    return;
  }


  const title =
    event.title ||
    'Untitled Event';

  const start =
    event.start || '';

  const end =
    event.end || '';

  const location =
  event.location || '';

const ndowEventNumber =
  event.ndowEventNumber || '';

const description =
  event.description || '';

  const status =
    event.status || '';

  const uid =
    event.uid ||
    event.id ||
    '';

  const lastModified =
    event.lastModified ||
    event.last_modified ||
    '';

  const recurrence =
    event.rrule ||
    event.recurrenceRule ||
    '';

  const recurrenceId =
    event.recurrenceId ||
    event.recurrence_id ||
    '';


  // ----------------------------------------
  // POSSIBLE SOURCE URL
  // ----------------------------------------

  let sourceUrl =
    event.url ||
    event.htmlLink ||
    event.link ||
    '';


  /*
    If the backend does not provide a URL,
    look for one in the description.
  */

  if (!sourceUrl && description) {

    const match =
      String(description).match(
        /https?:\/\/[^\s<]+/i
      );

    if (match) {
      sourceUrl = match[0];
    }

  }

  // ----------------------------------------
  // LOCATION / MAP LINK
  // ----------------------------------------

  let locationDisplay =
    escapeAnglingHtml(location);

  if (location) {

    const locationText =
      String(location).trim();

    let mapUrl =
      locationText;

    /*
      If the location is not already a URL,
      turn the address/text into a Google Maps
      search URL.
    */

    if (!/^https?:\/\//i.test(locationText)) {

      mapUrl =
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(locationText);

    }

    locationDisplay = `

      <a
        href="${escapeAnglingHtml(mapUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        style="
          color:#19304B;
          font-weight:600;
          text-decoration:none;
        "
        title="Open location in Google Maps"
      >
        📍 ${escapeAnglingHtml(locationText)}
      </a>

    `;

  }


  // ----------------------------------------
  // BUILD DETAILS
  // ----------------------------------------

  let html = `

    <div
      style="
        font-size:22px;
        font-weight:700;
        color:#19304B;
        margin-bottom:20px;
      "
    >
      ${escapeAnglingHtml(title)}
    </div>


    <div
      style="
        display:grid;
        grid-template-columns:
          minmax(140px,180px)
          1fr;
        gap:0;
        border:1px solid #DBE3EC;
        border-radius:8px;
        overflow:hidden;
        margin-bottom:22px;
      "
    >

  ${anglingDetailRow(
  'Date',
  formatAnglingDate(start)
)}

${
  ndowEventNumber
    ? anglingDetailRow(
        'NDOW Event',
        '#' + ndowEventNumber
      )
    : ''
}

${anglingDetailRow(
  'Start',
  formatAnglingDateTime(start)
)}

      ${
        end
          ? anglingDetailRow(
              'End',
              formatAnglingDateTime(end)
            )
          : ''
      }

${
  location
    ? `
      <div
        style="
          display:contents;
        "
      >

        <div
          style="
            padding:10px 12px;
            background:#F8FAFC;
            border-bottom:1px solid #DBE3EC;
            font-size:12px;
            font-weight:700;
            color:#19304B;
          "
        >
          Location
        </div>

        <div
          style="
            padding:10px 12px;
            border-bottom:1px solid #DBE3EC;
            font-size:13px;
            color:#374151;
            word-break:break-word;
          "
        >
          ${locationDisplay}
        </div>

      </div>
    `
    : ''
}

      ${
        status
          ? anglingDetailRow(
              'Status',
              status
            )
          : ''
      }

    </div>
  `;


  // ----------------------------------------
  // DESCRIPTION
  // ----------------------------------------

  if (description) {

    html += `

      <div
        style="
          margin-bottom:22px;
        "
      >

        <div
          style="
            font-size:15px;
            font-weight:700;
            color:#19304B;
            margin-bottom:8px;
          "
        >
          DESCRIPTION
        </div>

        <div
          style="
            padding:14px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:7px;
            line-height:1.55;
            color:#374151;
            font-size:14px;
          "
        >
          ${formatAnglingDescription(description)}
        </div>

      </div>

    `;

  }


  // ----------------------------------------
  // EVENT INFORMATION
  // ----------------------------------------

  if (
    uid ||
    lastModified ||
    recurrence ||
    recurrenceId
  ) {

    html += `

      <div
        style="
          margin-bottom:22px;
        "
      >

        <div
          style="
            font-size:15px;
            font-weight:700;
            color:#19304B;
            margin-bottom:8px;
          "
        >
          EVENT INFORMATION
        </div>

        <div
          style="
            border:1px solid #DBE3EC;
            border-radius:7px;
            overflow:hidden;
          "
        >

          ${
            uid
              ? anglingDetailRow(
                  'Event ID',
                  uid
                )
              : ''
          }

          ${
            lastModified
              ? anglingDetailRow(
                  'Last Modified',
                  formatAnglingDateTime(
                    lastModified
                  )
                )
              : ''
          }

          ${
            recurrence
              ? anglingDetailRow(
                  'Recurrence',
                  recurrence
                )
              : ''
          }

          ${
            recurrenceId
              ? anglingDetailRow(
                  'Recurrence ID',
                  recurrenceId
                )
              : ''
          }

        </div>

      </div>

    `;

  }


  // ----------------------------------------
  // GOOGLE CALENDAR / SOURCE LINK
  // ----------------------------------------

  if (sourceUrl) {

    html += `

      <div
        style="
          margin-top:8px;
        "
      >

        <a
          href="${escapeAnglingHtml(sourceUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display:inline-block;
            padding:9px 14px;
            border-radius:6px;
            background:#19304B;
            color:#FFFFFF;
            text-decoration:none;
            font-size:13px;
            font-weight:600;
          "
        >
          Open Event Link
        </a>

      </div>

    `;

  }


  if (anglingCanEdit && event.googleEvent) {
    html += '<div style="display:flex;gap:8px;margin-top:16px;"><button id="anglingEditGoogle" style="padding:9px 14px;background:#19304B;color:#fff;border:0;border-radius:6px;cursor:pointer;">Edit Google Event</button><button id="anglingDeleteGoogle" style="padding:9px 14px;background:#fff;color:#DC2626;border:1px solid #DC2626;border-radius:6px;cursor:pointer;">Delete Event</button></div>';
  }

  body.innerHTML = html;
  document.getElementById('anglingEditGoogle')?.addEventListener('click', () => editAnglingGoogleEvent(event));
  document.getElementById('anglingDeleteGoogle')?.addEventListener('click', () => deleteAnglingGoogleEvent(event));


  modal.style.display =
    'flex';

}


// ========================================
// DETAIL ROW
// ========================================

function anglingDetailRow(
  label,
  value,
  allowHtml = false
) {

  return `

    <div
      style="
        display:contents;
      "
    >

      <div
        style="
          padding:10px 12px;
          background:#F8FAFC;
          border-bottom:1px solid #DBE3EC;
          font-size:12px;
          font-weight:700;
          color:#19304B;
        "
      >
        ${escapeAnglingHtml(label)}
      </div>

       <div
        style="
          padding:10px 12px;
          border-bottom:1px solid #DBE3EC;
          font-size:13px;
          color:#374151;
          word-break:break-word;
        "
      >
        ${allowHtml
          ? value
          : escapeAnglingHtml(value)}
      </div>

    </div>

  `;

}


// ========================================
// CLOSE EVENT DETAILS
// ========================================

function closeAnglingEventDetails() {

  const modal =
    document.getElementById(
      'anglingEventDetailsModal'
    );

  if (!modal) {
    return;
  }

  modal.style.display =
    'none';

}



let anglingCanEdit = false;
let anglingGoogleConnected = false;

function anglingHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

async function checkAnglingEditorAccess() {
  try {
    const url = ANGLING_CALENDAR_API.replace('/angling-calendar', '/angling-calendar/google/status');
    const response = await fetch(url, { headers: anglingHeaders() });
    if (!response.ok) return anglingCanEdit = false;
    const result = await response.json();
    anglingGoogleConnected = !!result.connected;
    return anglingCanEdit = !!result.success;
  } catch (_) {
    return anglingCanEdit = false;
  }
}


async function connectAnglingGoogleCalendar() {
  try {
    const url = ANGLING_CALENDAR_API.replace('/angling-calendar', '/angling-calendar/google/start-url');
    const response = await fetch(url, { headers: anglingHeaders() });
    const result = await response.json();
    if (!response.ok || !result.authorizationUrl) throw new Error(result.message || 'Unable to start Google authorization.');
    window.location.href = result.authorizationUrl;
  } catch (error) { alert(error.message); }
}

function anglingDateTimeWithOffset(value) {
  const d = new Date(value);
  const p = n => String(n).padStart(2, '0');
  const offset = -d.getTimezoneOffset();
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate()) + 'T' +
    p(d.getHours()) + ':' + p(d.getMinutes()) + ':00' +
    (offset >= 0 ? '+' : '-') + p(Math.floor(Math.abs(offset)/60)) + ':' + p(Math.abs(offset)%60);
}

async function anglingGoogleWrite(path, method, body) {
  const url = ANGLING_CALENDAR_API.replace('/angling-calendar', '/angling-calendar/google/events') + path;
  const response = await fetch(url, {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, anglingHeaders()),
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Google Calendar request failed.');
  return result;
}

async function createAnglingGoogleEvent() {
  const summary = prompt('Event title:');
  if (summary === null || !summary.trim()) return;
  const start = prompt('Start date/time (YYYY-MM-DDTHH:MM) or all-day date (YYYY-MM-DD):');
  if (start === null) return;
  const end = prompt('End date/time (YYYY-MM-DDTHH:MM) or all-day date (YYYY-MM-DD):');
  if (end === null) return;
  const location = prompt('Location (optional):', '');
  if (location === null) return;
  const description = prompt('Description (optional):', '');
  if (description === null) return;
  const allDay = /^\d{4}-\d{2}-\d{2}$/.test(start.trim());
  const body = {
    summary: summary.trim(), location: location.trim(), description,
    start: allDay ? { date: start.trim() } : { dateTime: anglingDateTimeWithOffset(start.trim()) },
    end: allDay ? { date: end.trim() } : { dateTime: anglingDateTimeWithOffset(end.trim()) }
  };
  try {
    await anglingGoogleWrite('', 'POST', body);
    alert('Google Calendar event created.');
    await renderAnglingCalendar();
  } catch (error) { alert(error.message); }
}

async function editAnglingGoogleEvent(event) {
  const g = event.googleEvent || {};
  const summary = prompt('Event title:', g.summary || '');
  if (summary === null) return;
  const location = prompt('Location:', g.location || '');
  if (location === null) return;
  const description = prompt('Description:', g.description || '');
  if (description === null) return;
  const start = prompt('Start date/time (YYYY-MM-DDTHH:MM) or all-day date:', g.start?.dateTime || g.start?.date || '');
  if (start === null) return;
  const end = prompt('End date/time (YYYY-MM-DDTHH:MM) or all-day date:', g.end?.dateTime || g.end?.date || '');
  if (end === null) return;
  const allDay = /^\d{4}-\d{2}-\d{2}$/.test(start.trim());
  const body = {
    summary: summary.trim(), location: location.trim(), description,
    start: allDay ? { date: start.trim() } : { dateTime: anglingDateTimeWithOffset(start.trim()) },
    end: allDay ? { date: end.trim() } : { dateTime: anglingDateTimeWithOffset(end.trim()) }
  };
  try {
    await anglingGoogleWrite('/' + encodeURIComponent(event.id), 'PATCH', body);
    alert('Google Calendar event updated.');
    closeAnglingEventDetails();
    await renderAnglingCalendar();
  } catch (error) { alert(error.message); }
}

async function deleteAnglingGoogleEvent(event) {
  if (!confirm('Delete this event from Google Calendar? This cannot be undone.')) return;
  try {
    await anglingGoogleWrite('/' + encodeURIComponent(event.id), 'DELETE');
    alert('Google Calendar event deleted.');
    closeAnglingEventDetails();
    await renderAnglingCalendar();
  } catch (error) { alert(error.message); }
}

// ========================================
// RENDER ANGling CALENDAR
// ========================================

async function renderAnglingCalendar() {

  const container =
    document.getElementById(
      'proposedEventsList'
    );

  if (!container) {

    console.warn(
      'ANGLING CALENDAR: #proposedEventsList not found.'
    );

    return;

  }


  container.innerHTML =
    '<div style="padding:10px;">Loading...</div>';


await checkAnglingEditorAccess();

const events =
  await loadAnglingCalendar();


if (!events.length) {

  container.innerHTML =
    '<div style="padding:10px;">No upcoming angling events.</div>';

  return;

}


// ========================================
// LOAD OFFICIAL NDOW EVENTS
// ========================================

const ndowEvents =
  await loadNdowEventsForAnglingMatch();


// ========================================
// MATCH ANGling EVENTS TO NDOW EVENTS
// ========================================

events.forEach(
  event => {

    const matchingNdowEvent =
      findMatchingNdowEvent(
        event,
        ndowEvents
      );

    event.ndowEventNumber =
      matchingNdowEvent
        ? matchingNdowEvent.id
        : '';

  }
);


// ========================================
// DEBUG — NDOW EVENT MATCHING
// ========================================



const now =
  new Date();


const upcoming =
  events
    .filter(event => {

      if (!event.start) {
        return false;
      }

      const date =
        normalizeAnglingDate(
          event.start
        );

      return (
        date &&
        date >= now
      );

    })
    .sort(
      (a, b) => {

        const aDate =
          normalizeAnglingDate(
            a.start
          );

        const bDate =
          normalizeAnglingDate(
            b.start
          );

        return (
          aDate - bDate
        );

      }
    );

  // ----------------------------------------
  // DISPLAY EVENT LIST
  // ----------------------------------------

  container.innerHTML =
    upcoming
      .map(
        (event, index) => {

          const title =
            event.title ||
            'Untitled Event';

          const date =
            formatAnglingDate(
              event.start
            );

          const startTime =
            formatAnglingTime(event.start);

          const endTime =
            formatAnglingTime(event.end);

          const timeDisplay =
            startTime
              ? startTime + (endTime ? ' – ' + endTime : '')
              : 'Time not specified';

          const location =
            event.location ||
            '';


          return `

            <div
              class="angling-calendar-event"
              data-angling-index="${index}"
              style="
                padding:10px 12px;
                margin-bottom:6px;
                border-bottom:1px solid #DBE3EC;
                cursor:pointer;
                transition:background .15s;
              "
              title="Click to view event details"
            >

              <div
                style="
                  font-weight:600;
                  color:#19304B;
                  margin-bottom:3px;
                "
              >
                ${escapeAnglingHtml(title)}
              </div>

              <div
  style="
    font-size:12px;
    color:#555;
  "
>
  ${escapeAnglingHtml(date)} • ${escapeAnglingHtml(timeDisplay)}
</div>

${
  event.ndowEventNumber
    ? `
      <div
        style="
          font-size:11px;
          color:#589FD6;
          font-weight:600;
          margin-top:3px;
        "
      >
        NDOW Event #${escapeAnglingHtml(
          event.ndowEventNumber
        )}
      </div>
    `
    : ''
}
              ${
                location
                  ? `
                    <div
                      style="
                        font-size:12px;
                        color:#777;
                        margin-top:2px;
                      "
                    >
                      ${escapeAnglingHtml(location)}
                    </div>
                  `
                  : ''
              }

            </div>

          `;

        }
      )
      .join('');

  if (anglingCanEdit) {
    const bar = document.createElement('div');
    bar.style.cssText = 'display:flex;justify-content:flex-end;padding:4px 8px 10px;';
    bar.innerHTML = anglingGoogleConnected
      ? '<button id="anglingAddGoogle" style="padding:7px 11px;background:#19304B;color:#fff;border:0;border-radius:5px;cursor:pointer;font-size:12px;">+ Add Google Event</button>'
      : '<button id="anglingConnectGoogle" style="padding:7px 11px;background:#589FD6;color:#fff;border:0;border-radius:5px;cursor:pointer;font-size:12px;">Connect Google Calendar</button>';
    container.prepend(bar);
    document.getElementById('anglingAddGoogle')?.addEventListener('click', createAnglingGoogleEvent);
    document.getElementById('anglingConnectGoogle')?.addEventListener('click', connectAnglingGoogleCalendar);
  }

  // ----------------------------------------
  // CLICK HANDLERS
  // ----------------------------------------

  container
    .querySelectorAll(
      '.angling-calendar-event'
    )
    .forEach(
      element => {

        const index =
          Number(
            element.dataset.anglingIndex
          );

        element.addEventListener(
          'mouseenter',
          () => {

            element.style.background =
              '#F8FAFC';

          }
        );

        element.addEventListener(
          'mouseleave',
          () => {

            element.style.background =
              '';

          }
        );

        element.addEventListener(
          'click',
          () => {

            openAnglingEventDetails(
              upcoming[index]
            );

          }
        );

      }
    );

}


// ========================================
// START
// ========================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    createAnglingDetailsModal();

    renderAnglingCalendar();

  }
);
