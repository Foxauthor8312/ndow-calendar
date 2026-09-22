/*
==============================================================================
 NDOW BETA SINGLE-EVENT DIAGNOSTIC
------------------------------------------------------------------------------
 Event: 4919
 Instructor/customer ID: 562293

 Purpose:
   Test the exact production instructor lookup against one event only.

 Safety:
   - No credentials are saved.
   - No cookies are saved.
   - No Supabase access.
   - Only ONE event is inspected.
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');

const EVENT_ID = '4919';
const CUSTOMER_ID = '562293';

const EVENT_URL =
  `https://nevada.events.licensing.app/dashboard/em/assigned_events/${EVENT_ID}`;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW SINGLE-EVENT DIAGNOSTIC');
    console.log('========================================');
    console.log('');
    console.log(`Event ID: ${EVENT_ID}`);
    console.log(`NDOW Customer ID: ${CUSTOMER_ID}`);
    console.log('');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const page = await browser.newPage();

    console.log('Opening NDOW...');
    await page.goto(EVENT_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Allow either an existing session or manual login.
    console.log('');
    console.log('If NDOW asks for login, log in manually.');
    console.log('Waiting for the event page...');
    console.log('');

    let ready = false;

    for (let i = 0; i < 120; i++) {

      await sleep(1000);

      try {

        const state = await page.evaluate(() => ({
          url: location.href,
          hasPassword:
            !!document.querySelector('input[type="password"]'),
          text:
            document.body ? document.body.innerText : ''
        }));

        if (
          !state.hasPassword &&
          /assigned_events\/4919/i.test(state.url)
        ) {
          ready = true;
          break;
        }

      } catch (_) {
        // Ignore navigation transitions.
      }
    }

    if (!ready) {
      throw new Error(
        'Event page was not reached within the expected time.'
      );
    }

    await sleep(1500);

    const instructorUrl = `${EVENT_URL}/event_instructors`;

    console.log('Opening instructor assignment page...');
    console.log(instructorUrl);
    console.log('');

    await page.goto(instructorUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page.waitForSelector(
      '[data-react-class="instructors/SearchInstructorsForm"]',
      { timeout: 30000 }
    );

    const result = await page.evaluate(
      (targetCustomerId) => {

        const el =
          document.querySelector(
            '[data-react-class="instructors/SearchInstructorsForm"]'
          );

        if (!el) {
          return {
            foundComponent: false,
            instructors: []
          };
        }

        const raw =
          el.getAttribute('data-react-props') || '';

        let props;

        try {
          props = JSON.parse(raw);
        } catch (_) {

          try {
            props = JSON.parse(
              raw.replace(/&quot;/g, '"')
            );
          } catch (err) {

            return {
              foundComponent: true,
              parseError: err.message,
              rawPreview: raw.slice(0, 2000),
              instructors: []
            };
          }
        }

        const instructors =
          (props.instructors || []).map(i => ({
            name:
              `${i.customer?.first_name || ''} ${
                i.customer?.last_name || ''
              }`.trim(),

            role:
              i.is_primary
                ? 'PRIMARY'
                : 'ASSISTANT',

            email:
              i.customer?.email_address || '',

            customerId:
              String(i.customer_id || '')
          }));

        return {
          foundComponent: true,
          instructorCount: instructors.length,
          instructors,
          targetCustomerId,
          targetFound:
            instructors.some(
              i => i.customerId === String(targetCustomerId)
            )
        };

      },
      CUSTOMER_ID
    );

    console.log('----------------------------------------');
    console.log(' EVENT INSTRUCTOR ASSIGNMENTS');
    console.log('----------------------------------------');

    if (!result.foundComponent) {
      console.log('Instructor component was NOT found.');
    }

    if (result.parseError) {
      console.log('Props parse error:', result.parseError);
      console.log('');
      console.log(result.rawPreview);
    }

    console.log(
      `Instructor count: ${result.instructorCount || 0}`
    );
    console.log('');

    for (const instructor of result.instructors || []) {

      console.log(
        `${instructor.role}: ${instructor.name}`
      );

      console.log(
        `  Customer ID: ${instructor.customerId}`
      );

      console.log(
        `  Email: ${instructor.email || '(none)'}`
      );

      console.log('');

    }

    console.log(
      `Target ${CUSTOMER_ID} found: ${
        result.targetFound ? 'YES' : 'NO'
      }`
    );

    if (result.targetFound) {

      const resultsUrl =
        `${EVENT_URL}/instructor_results/${CUSTOMER_ID}`;

      console.log('');
      console.log('----------------------------------------');
      console.log(' INSTRUCTOR RESULTS');
      console.log('----------------------------------------');
      console.log(resultsUrl);
      console.log('');

      await page.goto(resultsUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      await sleep(1500);

      const resultsPage = await page.evaluate(() => ({
        url: location.href,
        title: document.title,
        text:
          document.body
            ? document.body.innerText.slice(0, 10000)
            : ''
      }));

      console.log('Final URL:', resultsPage.url);
      console.log('Title:', resultsPage.title);
      console.log('');
      console.log(resultsPage.text);

    }

    console.log('');
    console.log('========================================');
    console.log(' TEST COMPLETE');
    console.log('========================================');
    console.log('');

    // Keep browser open for inspection.
    await new Promise(() => {});

  } catch (err) {

    console.log('');
    console.log('========================================');
    console.log(' TEST FAILED');
    console.log('========================================');
    console.log('');
    console.log(err && err.stack ? err.stack : err);

    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
    }

    process.exitCode = 1;
  }

})();
