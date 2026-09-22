'use strict';

const puppeteer = require('puppeteer');

const NDOW_BASE =
  'https://nevada.events.licensing.app';

const NDOW_URL =
  `${NDOW_BASE}/dashboard/em/assigned_programs_events`;

const API_URL =
  'https://ndow-calendar-server.onrender.com/api/ndow-assignments/sync';


// ============================================================
// NDOW ASSIGNMENT SYNC
// ============================================================
// Beta utility.
//
// 1. Instructor logs into NDOW manually.
// 2. Read all Assigned Events available to that account.
// 3. Check each Event Instructors page.
// 4. Keep only events containing the supplied customer ID.
// 5. Send ONLY the event IDs to the Calendar API.
//
// No NDOW credentials are stored.
// No NDOW cookies are stored.
// No event data is sent to the Calendar API.
// ============================================================


// ------------------------------------------------------------
// Read instructors from an Event Instructors page
// ------------------------------------------------------------

async function readEventInstructors(page, eventUrl) {

  const url =
    `${eventUrl}/event_instructors`;

  try {

    await page.goto(
      url,
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );

    await page.waitForSelector(
      '[data-react-class="instructors/SearchInstructorsForm"]',
      {
        timeout: 10000
      }
    );

    return await page.evaluate(() => {

      const node =
        document.querySelector(
          '[data-react-class="instructors/SearchInstructorsForm"]'
        );

      if (!node) return [];

      const raw =
        node.getAttribute('data-react-props');

      if (!raw) return [];

      let props;

      try {

        props =
          JSON.parse(raw);

      } catch {

        props =
          JSON.parse(
            raw.replace(/&quot;/g, '"')
          );

      }

      return (
        props.instructors || []
      ).map(instructor => ({

        customerId:
          String(
            instructor.customer_id || ''
          ).trim()

      }));

    });

  } catch {

    return [];

  }

}


// ------------------------------------------------------------
// Read events from current Assigned Events page
// ------------------------------------------------------------

async function readAssignedEvents(page) {

  return await page.evaluate(
    baseUrl => {

      const cards =
        [
          ...document.querySelectorAll('article')
        ];

      return cards
        .map(card => {

          const link =
            card.querySelector('a');

          const href =
            link?.getAttribute('href') || '';

          const match =
            href.match(
              /assigned_events\/(\d+)/
            );

          if (!match) return null;

          return {

            id: match[1],

            url:
              href.startsWith('http')
                ? href
                : baseUrl + href

          };

        })
        .filter(Boolean);

    },
    NDOW_BASE
  );

}


// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

async function main() {

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW ASSIGNMENT SYNC');
    console.log('========================================');
    console.log('');

    // --------------------------------------------------------
    // Beta customer ID
    // --------------------------------------------------------

    const customerId =
      '562293';

    console.log(
      `NDOW customer ID: ${customerId}`
    );

    console.log('');
    console.log(
      'Opening NDOW...'
    );


    // --------------------------------------------------------
    // Browser
    // --------------------------------------------------------

    browser =
      await puppeteer.launch({

        headless: false,

        defaultViewport: null,

        args: [
          '--start-maximized'
        ]

      });


    const page =
      await browser.newPage();


    // --------------------------------------------------------
    // Manual login
    // --------------------------------------------------------

    await page.goto(
      NDOW_URL,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );


    console.log('');
    console.log(
      'Log into NDOW in the browser.'
    );

    console.log(
      'The sync will continue after login.'
    );

    console.log('');


    const loginDeadline =
      Date.now() +
      (120 * 1000);


    while(
      Date.now() <
      loginDeadline
    ){

      const url =
        page.url();

      const passwordField =
        await page.$(
          'input[type="password"]'
        );

      const loginPage =
        Boolean(passwordField) ||
        /login|sign.?in/i.test(url);


      if(
        !loginPage &&
        /\/dashboard\//i.test(url)
      ){

        break;

      }


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );

    }


    if(
      !/\/dashboard\//i.test(
        page.url()
      )
    ){

      throw new Error(
        'NDOW login was not detected.'
      );

    }


    console.log(
      'Login detected.'
    );

    console.log('');


    // --------------------------------------------------------
    // Discover all Assigned Events pages
    // --------------------------------------------------------

    const events =
      new Map();

    let pageNumber = 1;


    while(true){

      const url =
        `${NDOW_URL}?ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending&ordering%5Border_by%5D%5B%5D=desc&page=${pageNumber}&size=50`;


      await page.goto(
        url,
        {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        }
      );


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );


      const pageEvents =
        await readAssignedEvents(
          page
        );


      if(
        pageEvents.length === 0
      ){

        break;

      }


      for(
        const event of pageEvents
      ){

        events.set(
          event.id,
          event
        );

      }


      console.log(
        `Assigned Events page ${pageNumber}: ${pageEvents.length}`
      );


      pageNumber++;

    }


    const allEvents =
      [
        ...events.values()
      ];


    console.log('');

    console.log(
      `Events available to account: ${allEvents.length}`
    );

    console.log(
      'Checking instructor assignments...'
    );

    console.log('');


    // --------------------------------------------------------
    // Check instructor assignments
    // --------------------------------------------------------

    const assignedEventIds = [];


    for(
      let i = 0;
      i < allEvents.length;
      i++
    ){

      const event =
        allEvents[i];


      process.stdout.write(
        `[${i + 1}/${allEvents.length}] ${event.id} `
      );


      const instructors =
        await readEventInstructors(
          page,
          event.url
        );


      const assigned =
        instructors.some(
          instructor =>
            instructor.customerId ===
            customerId
        );


      if(assigned){

        assignedEventIds.push(
          event.id
        );

        console.log(
          '✓'
        );

      } else {

        console.log(
          '-'
        );

      }

    }


    // --------------------------------------------------------
    // Remove duplicates
    // --------------------------------------------------------

    const eventIds =
      [
        ...new Set(
          assignedEventIds
        )
      ];


    console.log('');
    console.log(
      '========================================'
    );

    console.log(
      `Instructor assignments found: ${eventIds.length}`
    );

    console.log(
      '========================================'
    );

    console.log('');


    if(!eventIds.length){

      console.log(
        'No instructor assignments found.'
      );

      await browser.close();

      return;

    }


    // --------------------------------------------------------
    // Send ONLY event IDs to Calendar API
    // --------------------------------------------------------

    console.log(
      'Sending assignments to Calendar...'
    );


    const response =
      await page.evaluate(
        async (apiUrl, ids) => {

          const token =
            localStorage.getItem('token');

          if(!token){

            throw new Error(
              'Calendar authentication token not available.'
            );

          }


          const result =
            await fetch(
              apiUrl,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  'Authorization':
                    `Bearer ${token}`
                },

                body:
                  JSON.stringify({
                    eventIds: ids
                  })
              }
            );


          return {
            status: result.status,
            body: await result.json()
          };

        },
        API_URL,
        eventIds
      );


    console.log('');

    console.log(
      'Calendar API:',
      response.body
    );


    if(
      !response.body?.success
    ){

      throw new Error(
        response.body?.error ||
        'Assignment sync failed.'
      );

    }


    console.log('');

    console.log(
      'Assignment sync complete.'
    );

    console.log(
      `Assignments synced: ${response.body.count}`
    );

    console.log('');


    await browser.close();

  }

  catch(error){

    console.error('');

    console.error(
      'NDOW assignment sync failed:'
    );

    console.error(
      error.message ||
      error
    );

    console.error('');

    if(browser){

      await browser.close();

    }

    process.exitCode = 1;

  }

}


main();
