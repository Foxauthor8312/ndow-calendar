/*
==============================================================================
 NDOW BETA MANUAL INSTRUCTOR SYNC
------------------------------------------------------------------------------
 Phase 1:
   - Opens NDOW in a visible browser
   - Tester logs in manually
   - Waits for navigation to finish safely
   - Scrapes only the logged-in account's assigned events
   - Saves results locally to beta-assigned-events.json
   - Does NOT save credentials or session cookies
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');

const NDOW_URL =
  'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events';

const OUTPUT_FILE =
  'ndow-scraper/beta-assigned-events.json';

async function main() {

  let browser;

  try {

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
    console.log('Waiting for NDOW login...');
    console.log('');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        '--start-maximized'
      ]
    });

    const page = await browser.newPage();

    await page.goto(NDOW_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    /*
    --------------------------------------------------------------------------
    IMPORTANT:
    Do NOT use waitForNavigation() here.

    NDOW can perform more than one navigation/redirect during login.
    We instead poll the page URL safely and tolerate execution-context
    changes while the page is navigating.
    --------------------------------------------------------------------------
    */

    const loginDeadline =
      Date.now() + (120 * 1000);

    let loggedIn = false;

    while (Date.now() < loginDeadline) {

      try {

        const url =
          page.url();

        const passwordField =
          await page.$(
            'input[type="password"]'
          );

        const onLoginPage =
          Boolean(passwordField) ||
          /login|sign.?in/i.test(url);

        if (
          !onLoginPage &&
          /\/dashboard\//i.test(url)
        ) {
          loggedIn = true;
          break;
        }

      } catch (err) {

        /*
        Navigation can destroy the execution context.
        That is expected during login, so simply wait and try again.
        */

      }

      await new Promise(
        resolve => setTimeout(resolve, 1000)
      );

    }

    if (!loggedIn) {

      throw new Error(
        'Login was not detected within 120 seconds.'
      );

    }

    console.log('Login detected.');
    console.log('Waiting for NDOW to settle...');
    console.log('');

    /*
    Give the application a moment to finish redirects,
    React rendering, and authentication state updates.
    */

    await new Promise(
      resolve => setTimeout(resolve, 3000)
    );

    /*
    --------------------------------------------------------------------------
    Open the assigned-events page AFTER login.
    This is important because the page should now represent the tester's
    authenticated NDOW account.
    --------------------------------------------------------------------------
    */

    console.log('Opening assigned events...');

    await page.goto(NDOW_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForSelector(
      'body',
      { timeout: 30000 }
    );

    console.log('Assigned events page loaded.');
    console.log('');

    let allEvents = [];
    let currentPage = 1;

    while (true) {

      const pageUrl =
        NDOW_URL +
        '?filter%5Bevents_program_id%5D=' +
        '&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending' +
        '&ordering%5Border_by%5D%5B%5D=desc' +
        '&page=' + currentPage +
        '&size=50';

      console.log(
        'Reading assigned events page:',
        currentPage
      );

      await page.goto(pageUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      await page.waitForSelector(
        'body',
        { timeout: 30000 }
      );

      const events =
        await page.evaluate(() => {

          const cards =
            [...document.querySelectorAll('article')];

          return cards.map(card => {

            const link =
              card.querySelector('a');

            const rawHref =
              link?.getAttribute('href') || '';

            const url =
              rawHref.startsWith('http')
                ? rawHref
                : 'https://nevada.events.licensing.app' +
                  rawHref;

            const idMatch =
              rawHref.match(
                /assigned_events\/(\d+)/
              );

            const text =
              card.innerText || '';

            return {
              id: idMatch ? idMatch[1] : '',
              url,
              text
            };

          }).filter(event => event.id);

        });

      if (events.length === 0) {

        console.log('No more assigned events.');
        break;

      }

      console.log(
        'Events found:',
        events.length
      );

      for (const event of events) {

        const text =
          event.text || '';

        const dateMatch =
          text.match(
            /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/
          );

        const locationMatch =
          text.match(
            /Location:\s*([\s\S]*?)(?:\s*Taught by:|\s*Date\s*&\s*Times:)/i
          );

        const instructorMatch =
          text.match(
            /Taught by:\s*([\s\S]*?)(?:\s*Date\s*&\s*Times:|$)/i
          );

        allEvents.push({
          id: event.id,
          url: event.url,
          date: dateMatch
            ? dateMatch[1]
            : '',
          location: locationMatch
            ? locationMatch[1]
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            : '',
          instructor: instructorMatch
            ? instructorMatch[1]
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            : '',
          text
        });

      }

      currentPage++;

    }

    /*
    Remove duplicate event IDs.
    */

    const uniqueEvents =
      [...new Map(
        allEvents.map(
          event => [event.id, event]
        )
      ).values()];

    const output = {
      scrapedAt:
        new Date().toISOString(),

      source:
        'NDOW manual beta instructor sync',

      eventCount:
        uniqueEvents.length,

      events:
        uniqueEvents
    };

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(
        output,
        null,
        2
      )
    );

    console.log('');
    console.log('========================================');
    console.log(' BETA SYNC COMPLETE');
    console.log('========================================');
    console.log('');
    console.log(
      'Assigned events found:',
      uniqueEvents.length
    );
    console.log('');
    console.log(
      'Saved:',
      OUTPUT_FILE
    );
    console.log('');
    console.log(
      'The browser will remain open for inspection.'
    );
    console.log('');

  } catch (err) {

    console.log('');
    console.log('========================================');
    console.log(' BETA SYNC FAILED');
    console.log('========================================');
    console.log('');
    console.error(err.message);
    console.log('');

  }

}

main();
