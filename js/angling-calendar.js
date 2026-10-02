'use strict';

const ANGLING_CALENDAR_API =
  'https://ndow-calendar-server.onrender.com/api/angling-calendar';


// ========================================
// LOAD ANGLING CALENDAR
// ========================================

async function loadAnglingCalendar() {

  try {

    const response =
      await fetch(ANGLING_CALENDAR_API);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data =
      await response.json();

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
// DATE / TIME FORMATTING
// ========================================

function normalizeAnglingDate(value) {

  if (!value) {
    return null;
  }

  let dateString = String(value);

  if (/^\d{8}T\d{6}Z$/.test(dateString)) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
        '$1-$2-$3T$4:$5:$6Z'
      );

  } else if (/^\d{8}T\d{6}$/.test(dateString)) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
        '$1-$2-$3T$4:$5:$6'
      );

  } else if (/^\d{8}$/.test(dateString)) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})$/,
        '$1-$2-$3'
      );

  }

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
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
    ? anglingDetailRow(
        'Location',
        locationDisplay
      )
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


  body.innerHTML =
    html;


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


  const events =
    await loadAnglingCalendar();


  if (!events.length) {

    container.innerHTML =
      '<div style="padding:10px;">No upcoming angling events.</div>';

    return;

  }


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


  if (!upcoming.length) {

    container.innerHTML =
      '<div style="padding:10px;">No upcoming angling events.</div>';

    return;

  }


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
                ${escapeAnglingHtml(date)}
              </div>

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
