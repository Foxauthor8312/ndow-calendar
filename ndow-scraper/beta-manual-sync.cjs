/*
==============================================================================
 NDOW Volunteer Calendar
 Beta Manual Instructor Sync
------------------------------------------------------------------------------

 Purpose:
    Temporary beta-testing scraper allowing an instructor to manually
    authenticate to NDOW using their own NDOW account.

 Important:
    • NDOW credentials are entered directly into the NDOW login page.
    • Credentials are NOT stored.
    • No session.json is created.
    • This tool runs with a visible browser.
    • Phase 1 only retrieves the instructor's assigned events.

 Usage:
    node ndow-scraper/beta-manual-sync.cjs

==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');

const NDOW_ASSIGNED_EVENTS =
  'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events';

const OUTPUT_FILE =
  'ndow-scraper/beta-assigned-events.json';

(async function () {

  console.log('');
  console.log('========================================');
  console.log(' NDOW BETA MANUAL INSTRUCTOR SYNC');
  console.log('========================================');
  console.log('');

  console.log('Opening NDOW...');
  console.log('');
  console.log('A browser window will open.');
  console.log('');
  console.log('Please log into NDOW using your normal');
  console.log('NDOW credentials.');
  console.log('');
  console.log('Your credentials are NOT saved by this tool.');
  console.log('');

  const browser =
    await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        '--start-maximized'
      ]
    });

  try {

    const page =
      await browser.newPage();

    /*
    --------------------------------------------------------------------------
     Open NDOW
    --------------------------------------------------------------------------
    */

    await page.goto(
      NDOW_ASSIGNED_EVENTS,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    /*
    --------------------------------------------------------------------------
     Wait for manual authentication
    --------------------------------------------------------------------------

     We deliberately do NOT enter credentials here.

     Instead, we wait until the NDOW login form disappears and the
     assigned-events page becomes available.
    --------------------------------------------------------------------------
    */

    console.log('Waiting for NDOW login...');

    let authenticated = false;

    for (let attempt = 0; attempt < 120; attempt++) {

      await new Promise(
        resolve => setTimeout(resolve, 1000)
      );

      const loginForm =
        await page.$(
          'input[type="password"]'
        );

      const currentUrl =
        page.url();

      /*
       * If the password field is gone and we're no longer on the
       * authentication page, consider authentication complete.
       */

      if (
        !loginForm &&
        currentUrl.includes(
          '/dashboard/'
        )
      ) {

        authenticated = true;
        break;

      }

      /*
       * Also allow the user to finish login and arrive at the
       * assigned-events page even if the URL changes slightly.
       */

      if (
        !loginForm &&
        !currentUrl.includes(
          '/login'
        )
      ) {

        authenticated = true;
        break;

      }

    }

    if (!authenticated) {

      throw new Error(
        'NDOW login was not detected within the allowed time.'
      );

    }

    console.log('');
    console.log('NDOW login detected.');
    console.log('');

    /*
    --------------------------------------------------------------------------
     Navigate to assigned events
    --------------------------------------------------------------------------
    */

    await page.goto(
      NDOW_ASSIGNED_EVENTS,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    await page.waitForSelector(
      'body'
    );

    console.log(
      'Loading assigned events...'
    );

    /*
    --------------------------------------------------------------------------
     Scrape assigned events
    --------------------------------------------------------------------------
    */

    const allEvents = [];

    let currentPage = 1;

    while (true) {

      const pageUrl =
        NDOW_ASSIGNED_EVENTS +
        '?filter%5Bevents_program_id%5D=' +
        '&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending' +
        '&ordering%5Border_by%5D%5B%5D=desc' +
        '&page=' +
        currentPage +
        '&size=50';

      console.log(
        `Loading assigned events page ${currentPage}...`
      );

      await page.goto(
        pageUrl,
        {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        }
      );

      await page.waitForSelector(
        'body'
      );

      const events =
        await page.evaluate(() => {

          const cards =
            document.querySelectorAll(
              'article'
            );

          const results = [];

          cards.forEach(card => {

            const linkEl =
              card.querySelector('a');

            const rawHref =
              linkEl?.getAttribute(
                'href'
              ) || '';

            const eventId =
              rawHref.match(
                /assigned_events\/(\d+)/
              )?.[1] || '';

            if (!eventId) {
              return;
            }

            const url =
              rawHref.startsWith('http')
                ? rawHref
                : 'https://nevada.events.licensing.app' +
                  rawHref;

            const text =
              card.innerText || '';

            /*
            --------------------------------------------------------------
             Extract location
            --------------------------------------------------------------
            */

            const locationMatch =
              text.match(
                /Location:\s*([\s\S]*?)(?:\s*Taught by:|\s*Date\s*&\s*Times:)/i
              );

            /*
            --------------------------------------------------------------
             Extract date/time
            --------------------------------------------------------------
            */

            const timeMatch =
              text.match(
                /Date\s*&\s*Times:\s*([\s\S]*?)\s*View$/i
              );

            /*
            --------------------------------------------------------------
             Extract instructor
            --------------------------------------------------------------
            */

            const instructorMatch =
              text.match(
                /Taught by:\s*([\s\S]*?)(?:\s*Date\s*&\s*Times:|$)/i
              );

            let location = '';

            if (locationMatch) {

              location =
                locationMatch[1]
                  .replace(/\n+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();

            }

            let time = '';

            if (timeMatch) {

              time =
                timeMatch[1]
                  .replace(/\n+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();

            }

            let date = '';

            const dateMatch =
              time.match(
                /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/
              );

            if (dateMatch) {
              date = dateMatch[1];
            }

            let instructor = '';

            if (instructorMatch) {

              instructor =
                instructorMatch[1]
                  .replace(/\n+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();

            }

            results.push({

              eventId,

              title:
                text
                  .split('\n')
                  .map(x => x.trim())
                  .filter(Boolean)[0] || '',

              date,

              time,

              location,

              instructor,

              url

            });

          });

          return results;

        });

      if (events.length === 0) {

        console.log(
          'No more assigned events found.'
        );

        break;

      }

      allEvents.push(
        ...events
      );

      console.log(
        `  Found ${events.length} events.`
      );

      currentPage++;

    }

    /*
    --------------------------------------------------------------------------
     Remove duplicate event IDs
    --------------------------------------------------------------------------
    */

    const uniqueEvents =
      Array.from(
        new Map(
          allEvents.map(
            event => [
              event.eventId,
              event
            ]
          )
        ).values()
      );

    /*
    --------------------------------------------------------------------------
     Create beta result
    --------------------------------------------------------------------------
    */

    const result = {

      scrapedAt:
        new Date().toISOString(),

      source:
        'ndow-beta-manual-sync',

      eventCount:
        uniqueEvents.length,

      events:
        uniqueEvents

    };

    /*
    --------------------------------------------------------------------------
     Save results
    --------------------------------------------------------------------------
    */

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(
        result,
        null,
        2
      )
    );

    /*
    --------------------------------------------------------------------------
     Console summary
    --------------------------------------------------------------------------
    */

    console.log('');
    console.log('========================================');
    console.log(' BETA SYNC COMPLETE');
    console.log('========================================');
    console.log('');

    console.log(
      `Assigned events found: ${uniqueEvents.length}`
    );

    console.log('');

    uniqueEvents.forEach(
      event => {

        console.log(
          `${event.eventId} | ${event.date} | ${event.title}`
        );

      }
    );

    console.log('');
    console.log(
      `Results saved to: ${OUTPUT_FILE}`
    );
    console.log('');

    console.log(
      'The browser will remain open for review.'
    );

    console.log(
      'Close the browser when finished.'
    );

    console.log('');

    /*
    --------------------------------------------------------------------------
     IMPORTANT:
     Do NOT save cookies or credentials.
    --------------------------------------------------------------------------
    */

  } catch (error) {

    console.error('');
    console.error(
      '========================================'
    );

    console.error(
      ' BETA SYNC FAILED'
    );

    console.error(
      '========================================'
    );

    console.error('');

    console.error(
      error.message
    );

    console.error('');

  }

})();
