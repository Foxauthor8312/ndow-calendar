/*
==============================================================================
 NDOW BETA MANUAL INSTRUCTOR SYNC - PHASE 2
------------------------------------------------------------------------------
 Purpose:
   • Opens NDOW in a visible browser
   • Tester logs in manually
   • Discovers the events available to that account
   • Opens each event's Event Instructors page
   • Reads ALL assigned instructors from NDOW's React data
   • Identifies events assigned to the logged-in instructor
   • Saves the complete enriched result locally

 IMPORTANT:
   • No credentials are saved.
   • No session cookies are saved.
   • No Supabase connection.
   • No production files are modified.
   • This is a beta diagnostic tool only.
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const NDOW_BASE =
  'https://nevada.events.licensing.app';

const NDOW_URL =
  `${NDOW_BASE}/dashboard/em/assigned_programs_events`;

const OUTPUT_FILE =
  path.join(__dirname, 'beta-assigned-events.json');

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function namesMatch(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);

  if (!left || !right) {
    return false;
  }

  if (left === right) {
    return true;
  }

  const leftParts = left.split(' ');
  const rightParts = right.split(' ');

  /*
  NDOW may display a middle initial on one page and omit it on another.
  Compare first + last names when both are available.
  */
  if (
    leftParts.length >= 2 &&
    rightParts.length >= 2 &&
    leftParts[0] === rightParts[0] &&
    leftParts[leftParts.length - 1] === rightParts[rightParts.length - 1]
  ) {
    return true;
  }

  return false;
}

async function detectLoggedInInstructor(page) {
  try {
    const bodyText = await page.evaluate(() => document.body.innerText || '');

    const helloMatch =
      bodyText.match(/Hello!\s*([^\r\n]+)/i);

    if (helloMatch && helloMatch[1]) {
      return helloMatch[1].trim();
    }
  } catch (err) {
    // Ignore and fall through.
  }

  return '';
}

async function readEventInstructors(page, event) {
  const instructorUrl =
    `${event.url}/event_instructors`;

  try {
    await page.goto(instructorUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    /*
    Give React a moment to render the SearchInstructorsForm.
    */
    try {
      await page.waitForSelector(
        '[data-react-class="instructors/SearchInstructorsForm"]',
        { timeout: 10000 }
      );
    } catch (err) {
      // Continue; the evaluate below will report an empty list.
    }

    const instructors =
      await page.evaluate(() => {

        const reactNode =
          document.querySelector(
            '[data-react-class="instructors/SearchInstructorsForm"]'
          );

        if (!reactNode) {
          return [];
        }

        const rawProps =
          reactNode.getAttribute('data-react-props');

        if (!rawProps) {
          return [];
        }

        let props;

        try {
          props = JSON.parse(rawProps);
        } catch (err) {
          props = JSON.parse(
            rawProps.replace(/&quot;/g, '"')
          );
        }

        return (
          props.instructors || []
        ).map(instructor => ({
          name:
            `${instructor.customer?.first_name || ''} ${instructor.customer?.last_name || ''}`
              .trim(),

          role:
            instructor.is_primary
              ? 'PRIMARY'
              : 'ASSISTANT',

          email:
            instructor.customer?.email_address || '',

          customerId:
            String(instructor.customer_id || '')
        }));
      });

    return {
      instructors,
      error: ''
    };

  } catch (err) {

    return {
      instructors: [],
      error: err.message || String(err)
    };
  }
}

async function main() {

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW BETA MANUAL INSTRUCTOR SYNC');
    console.log(' PHASE 2 - INSTRUCTOR ASSIGNMENTS');
    console.log('========================================');
    console.log('');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const page =
      await browser.newPage();

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

    await page.goto(NDOW_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    /*
    Do not use waitForNavigation().
    NDOW may perform multiple redirects during login.
    */
    const loginDeadline =
      Date.now() + (120 * 1000);

    let loggedIn = false;

    while (Date.now() < loginDeadline) {

      try {

        const url =
          page.url();

        const passwordField =
          await page.$('input[type="password"]');

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
        // Navigation can destroy the execution context.
        // Simply retry on the next pass.
      }

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
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

    await new Promise(resolve =>
      setTimeout(resolve, 3000)
    );

    /*
    Detect the account name displayed by NDOW.
    Example: "Hello! Jackie Brooks"
    */
    const loggedInInstructor =
      await detectLoggedInInstructor(page);

    if (loggedInInstructor) {
      console.log(
        'Logged-in account:',
        loggedInInstructor
      );
    } else {
      console.log(
        'Logged-in account name could not be read.'
      );
    }

    console.log('');
    console.log('Opening assigned events...');

    await page.goto(NDOW_URL, {
      waitUntil: 'domcontentloaded',
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
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      await page.waitForSelector(
        'body',
        { timeout: 30000 }
      );

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

      const events =
        await page.evaluate((baseUrl) => {

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
                : baseUrl + rawHref;

            const idMatch =
              rawHref.match(
                /assigned_events\/(\d+)/
              );

            const text =
              card.innerText || '';

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

            return {

              id:
                idMatch
                  ? idMatch[1]
                  : '',

              url,

              date:
                dateMatch
                  ? dateMatch[1]
                  : '',

              location:
                locationMatch
                  ? locationMatch[1]
                      .replace(/\n+/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
                  : '',

              displayedInstructor:
                instructorMatch
                  ? instructorMatch[1]
                      .replace(/\n+/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
                  : '',

              text
            };

          }).filter(event => event.id);

        }, NDOW_BASE);

      if (events.length === 0) {
        console.log('No more assigned events.');
        break;
      }

      console.log(
        'Events found:',
        events.length
      );

      allEvents.push(...events);

      currentPage++;
    }

    const uniqueEvents =
      [...new Map(
        allEvents.map(event => [
          event.id,
          event
        ])
      ).values()];

    console.log('');
    console.log(
      'Total unique events:',
      uniqueEvents.length
    );
    console.log('');
    console.log('Now reading Event Instructors...');
    console.log('');

    let assignedCount = 0;
    let failedCount = 0;

    for (
      let index = 0;
      index < uniqueEvents.length;
      index++
    ) {

      const event =
        uniqueEvents[index];

      const progress =
        `[${index + 1}/${uniqueEvents.length}]`;

      process.stdout.write(
        `${progress} Event ${event.id} ... `
      );

      const result =
        await readEventInstructors(
          page,
          event
        );

      event.instructors =
        result.instructors;

      event.instructorLookupError =
        result.error;

      if (result.error) {

        failedCount++;

        console.log(
          `FAILED - ${result.error}`
        );

        continue;
      }

      /*
      Prefer the account name read from NDOW.
      If NDOW does not expose it, the beta tester can still
      inspect the full instructor list in the JSON.
      */
      event.assignedToLoggedInInstructor =
        Boolean(
          loggedInInstructor &&
          result.instructors.some(
            instructor =>
              namesMatch(
                instructor.name,
                loggedInInstructor
              )
          )
        );

      /*
      Keep the exact matching instructor record.
      This gives us customerId for the eventual calendar sync.
      */
      event.loggedInInstructor =
        result.instructors.find(
          instructor =>
            loggedInInstructor &&
            namesMatch(
              instructor.name,
              loggedInInstructor
            )
        ) || null;

      if (event.assignedToLoggedInInstructor) {

        assignedCount++;

        console.log(
          `✓ ${event.loggedInInstructor.name} (${event.loggedInInstructor.role})`
        );

      } else {

        console.log(
          `instructors: ${result.instructors.length}`
        );
      }
    }

    const output = {

      scrapedAt:
        new Date().toISOString(),

      source:
        'NDOW manual beta instructor sync',

      loggedInInstructor,

      eventCount:
        uniqueEvents.length,

      assignedEventCount:
        assignedCount,

      instructorLookupFailures:
        failedCount,

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
      'Logged-in account:',
      loggedInInstructor || '(not detected)'
    );
    console.log(
      'Events discovered:',
      uniqueEvents.length
    );
    console.log(
      'Events assigned to account:',
      assignedCount
    );
    console.log(
      'Instructor lookup failures:',
      failedCount
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
    console.error(
      err.message || err
    );
    console.log('');

  }
}

main();
