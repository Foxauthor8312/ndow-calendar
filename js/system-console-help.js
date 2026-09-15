/*
==============================================================================
 NDOW Volunteer Portal
 System Console Help
------------------------------------------------------------------------------
 Module      : system-console-help.js
 Layer       : Frontend UI

 Purpose:
    Provides contextual help for the System Console.

 Responsibilities:
    • Open System Console Help
    • Display operational definitions
    • Close and remove the help modal

 Used By:
    • System Console
==============================================================================
*/

'use strict';

window.openSystemConsoleHelp = function () {

  // Prevent duplicate help windows
  if (document.getElementById('systemConsoleHelpModal')) {
    return;
  }

  const modal = document.createElement('div');

  modal.id = 'systemConsoleHelpModal';

  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.60);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:100000;
  `;

  modal.innerHTML = `

    <div style="
      width:520px;
      max-width:90vw;
      max-height:80vh;
      overflow-y:auto;

      background:#111827;
      border:1px solid #374151;
      border-radius:10px;

      box-shadow:0 20px 50px rgba(0,0,0,.45);

      color:#e5e7eb;
      font-family:Arial,sans-serif;
    ">

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;

        padding:16px 18px;

        border-bottom:1px solid #374151;
      ">

        <div style="
          font-size:18px;
          font-weight:700;
          color:#f3f4f6;
        ">
          SYSTEM CONSOLE HELP
        </div>

        <button
          type="button"
          onclick="
            document
              .getElementById('systemConsoleHelpModal')
              ?.remove();
          "
          style="
            width:32px;
            height:32px;

            border:none;
            border-radius:6px;

            background:#dc2626;
            color:white;

            font-size:20px;
            font-weight:700;

            cursor:pointer;
          "
          title="Close"
        >
          ×
        </button>

      </div>

      <div style="
        padding:18px;
        line-height:1.5;
        font-size:13px;
      ">

        <div style="
          margin-bottom:18px;
          color:#93c5fd;
        ">
          The System Console provides operational information
          about the calendar event processing pipeline.
        </div>

        ${systemConsoleHelpItem(
          'Status',
          'Overall condition of the calendar processing system.'
        )}

        ${systemConsoleHelpItem(
          'Events',
          'Number of active events currently loaded into the calendar.'
        )}

        ${systemConsoleHelpItem(
          'Geo Mapped',
          'Number of events successfully assigned to an NDOW operational region.'
        )}

        ${systemConsoleHelpItem(
          'Geo Failures',
          'Number of events whose location could not be matched to an NDOW operational region.'
        )}

        ${systemConsoleHelpItem(
          'Uncategorized',
          'Number of events that could not be assigned to an event category.'
        )}

        ${systemConsoleHelpItem(
          'Parsed Blocks',
          'Number of event blocks processed from the source data.'
        )}

        ${systemConsoleHelpItem(
          'Skipped Old Events',
          'Number of events excluded because their dates are no longer active.'
        )}

        ${systemConsoleHelpItem(
          'Invalid Events',
          'Number of event records that could not be processed as valid calendar events.'
        )}

        ${systemConsoleHelpItem(
          'Reprocess Events',
          'Re-runs the event processing and classification pipeline using the current event data and lookup rules.'
        )}

        ${systemConsoleHelpItem(
          'Update Calendar Now',
          'Requests an immediate calendar data update.'
        )}

        <div style="
          margin-top:20px;
          padding:12px;

          background:#1f2937;
          border:1px solid #374151;
          border-radius:7px;

          color:#d1d5db;
        ">

          <strong style="color:#fbbf24;">
            TIP
          </strong>

          <div style="margin-top:5px;">
            Correct geographic or classification issues shown
            in the diagnostic lists, then use
            <strong>Reprocess Events</strong> to verify the correction.
          </div>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // Close when clicking outside the help panel
  modal.addEventListener('click', function (event) {

    if (event.target === modal) {
      modal.remove();
    }

  });

};


function systemConsoleHelpItem(title, description) {

  return `
    <div style="
      margin-bottom:14px;
    ">

      <div style="
        color:#93c5fd;
        font-weight:700;
        margin-bottom:3px;
      ">
        ${title}
      </div>

      <div style="
        color:#d1d5db;
      ">
        ${description}
      </div>

    </div>
  `;

}
