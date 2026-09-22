'use strict';

const puppeteer = require('puppeteer');

const NDOW_BASE =
  'https://nevada.events.licensing.app';

const NDOW_URL =
  `${NDOW_BASE}/dashboard/em/assigned_programs_events`;


// ============================================================
// NDOW INSTRUCTOR ASSIGNMENT DISCOVERY
// ============================================================
// Purpose:
//   Log into NDOW manually and discover the event IDs for which
//   the logged-in NDOW account is listed as an instructor.
//
// This utility:
//   • Does not store credentials
//   • Does not store cookies
//   • Does not connect to Supabase
//   • Does not connect to the Calendar API
//   • Does not modify production files
//   • Produces only event IDs
// ============================================================


// ------------------------------------------------------------
// Detect the logged-in NDOW account name
// ------------------------------------------------------------

async function detectLoggedInName(page) {

  try {

    const text =
      await page.evaluate(
        () => document.body.innerText || ''
      );

    const match =
      text.match(
        /Hello!\s*([^\r\n]+)/i
      );

    return match
      ? match[1].trim()
      : '';

  }

  catch {

    return '';

  }

}


// ------------------------------------------------------------
// Read instructor records from an event
// ------------------------------------------------------------

async function readEventInstructors(
  page,
  eventUrl
) {

  try {

    await page.goto(
      `${eventUrl}/event_instructors`,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
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
        node.getAttribute(
          'data-react-props'
        );

      if (!raw) return [];


      let props;

      try {

        props =
          JSON.parse(raw);

      }

      catch {

        props =
          JSON.parse(
            raw.replace(
              /&quot;/g,
              '"'
            )
          );

      }


      return (
        props.instructors || []
      ).map(instructor => ({

        customerId:
          String(
            instructor.customer_id || ''
          ).trim(),

        name:
          `${instructor.customer?.first_name || ''} ${instructor.customer?.last_name || ''}`
            .trim(),

        role:
          instructor.is_primary
            ? 'PRIMARY'
            : 'ASSISTANT'

      }));

    });

  }

  catch {

    return [];

  }

}


// ------------------------------------------------------------
// Read events from the current Assigned Events page
// ------------------------------------------------------------

async function readAssignedEvents(page) {

  return await page.evaluate(
    baseUrl => {

      const cards =
        [
          ...document.querySelectorAll(
            'article'
          )
        ];


      return cards
        .map(card => {

          const link =
            card.querySelector('a');

          const href =
            link?.getAttribute(
              'href'
            ) || '';


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
// MAIN
// ------------------------------------------------------------

async function main() {

  let browser;


  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW INSTRUCTOR ASSIGNMENT DISCOVERY');
    console.log('========================================');
    console.log('');


    // --------------------------------------------------------
    // Open visible browser
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
    // Manual NDOW login
    // --------------------------------------------------------

    console.log(
      'Opening NDOW...'
    );

    console.log('');

    console.log(
      'Log into NDOW using the instructor account.'
    );

    console.log(
      'Credentials are not saved.'
    );

    console.log('');


    await page.goto(
      NDOW_URL,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );


    const loginDeadline =
      Date.now() +
      (120 * 1000);


    let loggedIn = false;


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

        loggedIn = true;

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


    if(!loggedIn){

      throw new Error(
        'NDOW login was not detected within 120 seconds.'
      );

    }


    console.log(
      'Login detected.'
    );

    console.log('');


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          2000
        )
    );


    // --------------------------------------------------------
    // Identify account
    // --------------------------------------------------------

    const accountName =
      await detectLoggedInName(
        page
      );


    console.log(
      'NDOW account:',
      accountName ||
      '(name not detected)'
    );

    console.log('');


    // --------------------------------------------------------
    // Read Assigned Events
    // --------------------------------------------------------

    const events =
      new Map();

    let currentPage = 1;


    while(true){

      const pageUrl =
        `${NDOW_URL}?filter%5Bevents_program_id%5D=&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending&ordering%5Border_by%5D%5B%5D=desc&page=${currentPage}&size=50`;


      await page.goto(
        pageUrl,
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
        `Assigned Events page ${currentPage}: ${pageEvents.length}`
      );


      currentPage++;

    }


    const allEvents =
      [
        ...events.values()
      ];


    console.log('');

    console.log(
      `Events available to account: ${allEvents.length}`
    );

    console.log('');


    // --------------------------------------------------------
    // Determine customer ID and assignments
    // --------------------------------------------------------
    //
    // We do NOT hard-code the customer ID.
    //
    // The first instructor record matching the logged-in
    // account name establishes the NDOW customer ID.
    // --------------------------------------------------------

    let customerId = '';

    const assignedEventIds = [];

    let checked = 0;

    let failures = 0;


    for(
      let i = 0;
      i < allEvents.length;
      i++
    ){

      const event =
        allEvents[i];


      process.stdout.write(
        `[${i + 1}/${allEvents.length}] ${event.id} ... `
      );


      const instructors =
        await readEventInstructors(
          page,
          event.url
        );


      checked++;


      if(!instructors.length){

        failures++;

        console.log(
          'no instructor data'
        );

        continue;

      }


      // ------------------------------------------------------
      // Establish customer ID from account name
      // ------------------------------------------------------

      if(
        !customerId &&
        accountName
      ){

        const normalizedAccount =
          accountName
            .toLowerCase()
            .replace(
              /\s+/g,
              ' '
            )
            .trim();


        const accountInstructor =
          instructors.find(
            instructor => {

              const normalizedName =
                instructor.name
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    ' '
                  )
                  .trim();


              return (
                normalizedName ===
                normalizedAccount
              );

            }
          );


        if(
          accountInstructor?.customerId
        ){

          customerId =
            accountInstructor.customerId;


          console.log(
            `customer ID discovered: ${customerId}`
          );

        }

      }


      // ------------------------------------------------------
      // Check assignment
      // ------------------------------------------------------

      if(customerId){

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
            '✓ instructor'
          );

        } else {

          console.log(
            'not assigned'
          );

        }

      } else {

        console.log(
          'customer ID not yet discovered'
        );

      }

    }


    // --------------------------------------------------------
    // Final result
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
      ' NDOW ASSIGNMENT DISCOVERY COMPLETE'
    );

    console.log(
      '========================================'
    );

    console.log('');

    console.log(
      'NDOW account:',
      accountName ||
      '(not detected)'
    );

    console.log(
      'Customer ID:',
      customerId ||
      '(not discovered)'
    );

    console.log(
      'Events checked:',
      checked
    );

    console.log(
      'Lookup failures:',
      failures
    );

    console.log(
      'Instructor events:',
      eventIds.length
    );

    console.log('');

    console.log(
      'Event IDs:'
    );

    console.log(
      JSON.stringify(
        eventIds,
        null,
        2
      )
    );

    console.log('');

    console.log(
      'No data was sent to the Calendar API.'
    );

    console.log(
      'No data was written to Supabase.'
    );

    console.log('');


    await browser.close();

  }

  catch(error){

    console.error('');

    console.error(
      'NDOW assignment discovery failed:'
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
