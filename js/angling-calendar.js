/*
============================================================
 NDOW Volunteer Portal
 Angling Calendar — Frontend
------------------------------------------------------------
 Source:
    /api/angling-calendar

 Display:
    Existing #proposedEventsList container

 Notes:
    This is intentionally separate from the parked
    Proposed Events system.
============================================================
*/

'use strict';

const ANGLING_CALENDAR_API =
  'https://ndow-calendar-server.onrender.com/api/angling-calendar';


// ============================================================
// LOAD ANGLING CALENDAR
// ============================================================

async function loadAnglingCalendar() {

  try {

    const response =
      await fetch(
        ANGLING_CALENDAR_API
      );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
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


// ============================================================
// FORMAT EVENT DATE
// ============================================================

function formatAnglingDate(value) {

  if (!value) {
    return '';
  }

  let dateString = value;

  /*
   * Google Calendar exports UTC values such as:
   *
   * 20261009T160000Z
   *
   * Convert that to something JavaScript can parse.
   */

  if (
    /^\d{8}T\d{6}Z$/.test(dateString)
  ) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
        '$1-$2-$3T$4:$5:$6Z'
      );

  }

  else if (
    /^\d{8}T\d{6}$/.test(dateString)
  ) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
        '$1-$2-$3T$4:$5:$6'
      );

  }

  else if (
    /^\d{8}$/.test(dateString)
  ) {

    dateString =
      dateString.replace(
        /^(\d{4})(\d{2})(\d{2})$/,
        '$1-$2-$3'
      );

  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }

  return date.toLocaleDateString(
    undefined,
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );

}


// ============================================================
// RENDER ANGLING CALENDAR
// ============================================================

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


  /*
   * Only show current and future events.
   */

  const now =
    new Date();


  const upcoming =
    events
      .filter(event => {

        if (!event.start) {
          return false;
        }

        let start =
          event.start;

        if (
          /^\d{8}T\d{6}Z$/.test(start)
        ) {

          start =
            start.replace(
              /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
              '$1-$2-$3T$4:$5:$6Z'
            );

        }

        else if (
          /^\d{8}T\d{6}$/.test(start)
        ) {

          start =
            start.replace(
              /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
              '$1-$2-$3T$4:$5:$6'
            );

        }

        else if (
          /^\d{8}$/.test(start)
        ) {

          start =
            start.replace(
              /^(\d{4})(\d{2})(\d{2})$/,
              '$1-$2-$3'
            );

        }

        const date =
          new Date(start);

        return (
          Number.isNaN(
            date.getTime()
          ) ||
          date >= now
        );

      })
      .sort(
        (a, b) =>
          String(a.start)
            .localeCompare(
              String(b.start)
            )
      );


  if (!upcoming.length) {

    container.innerHTML =
      '<div style="padding:10px;">No upcoming angling events.</div>';

    return;

  }


  container.innerHTML =
    upcoming
      .map(event => {

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
            style="
              padding:10px 12px;
              margin-bottom:6px;
              border-bottom:1px solid #DBE3EC;
              cursor:pointer;
            "
            title="View Angling Calendar event"
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

      })
      .join('');

}


// ============================================================
// BASIC HTML ESCAPE
// ============================================================

function escapeAnglingHtml(value) {

  return String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}


// ============================================================
// INITIAL LOAD
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderAnglingCalendar();

  }
);
