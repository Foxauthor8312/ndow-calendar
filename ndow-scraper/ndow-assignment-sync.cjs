/*
==============================================================================
 NDOW INSTRUCTOR ASSIGNMENT DISCOVERY
------------------------------------------------------------------------------

 Purpose:
    • Open NDOW in a visible browser
    • Instructor logs in manually
    • Discover the logged-in instructor's NDOW customer ID
    • Discover events available to that account
    • Open each event's Event Instructors page
    • Match by customer ID
    • Output ONLY matching event IDs

 IMPORTANT:
    • No credentials are saved
    • No session cookies are saved
    • No customer ID is hard-coded
    • No instructor name is used
    • No event ID is hard-coded
    • No Supabase connection
    • No Calendar API connection
    • No production files are modified
==============================================================================
*/

'use strict';

const puppeteer =
  require('puppeteer');


const NDOW_BASE =
  'https://nevada.events.licensing.app';

const NDOW_URL =
  `${NDOW_BASE}/dashboard/em/assigned_programs_events`;


// ============================================================================
// DISCOVER LOGGED-IN CUSTOMER ID
// ============================================================================

async function discoverCustomerId(page) {

  /*
  --------------------------------------------------------------------------
  Look for the authenticated customer ID in the NDOW page data.

  We deliberately do NOT use the account name.

  The value must come from NDOW itself.
  --------------------------------------------------------------------------
  */

  const customerId =
    await page.evaluate(() => {

      // ------------------------------------------------------
      // Search all script elements for a customer_id value.
      // ------------------------------------------------------

      const scripts =
        [
          ...document.querySelectorAll(
            'script'
          )
        ];


      for(
        const script of scripts
      ){

        const text =
          script.textContent || '';


        const matches =
          [
            ...text.matchAll(
              /["']customer_id["']\s*:\s*["']?(\d+)["']?/gi
            )
          ];


        if(matches.length){

          return matches[0][1];

        }

      }


      // ------------------------------------------------------
      // Search the page HTML as a fallback.
      // ------------------------------------------------------

      const html =
        document.documentElement
          ?.outerHTML || '';


      const match =
        html.match(
          /["']customer_id["']\s*:\s*["']?(\d+)["']?/i
        );


      if(match){

        return match[1];

      }


      return '';

    });


  return String(
    customerId || ''
  ).trim();

}


// ============================================================================
// READ EVENT INSTRUCTORS
// ============================================================================

async function readEventInstructors(
  page,
  eventUrl
){

  try {

    await page.goto(
      `${eventUrl}/event_instructors`,
      {
        waitUntil:
          'domcontentloaded',

        timeout:
          60000
      }
    );


    await page.waitForSelector(
      '[data-react-class="instructors/SearchInstructorsForm"]',
      {
        timeout:
          10000
      }
    );


    return await page.evaluate(() => {

      const node =
        document.querySelector(
          '[data-react-class="instructors/SearchInstructorsForm"]'
        );


      if(!node){

        return [];

      }


      const raw =
        node.getAttribute(
          'data-react-props'
        );


      if(!raw){

        return [];

      }


      let props;


      try {

        props =
          JSON.parse(
            raw
          );

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
      ).map(
        instructor => ({

          customerId:
            String(
              instructor.customer_id || ''
            ).trim()

        })
      );

    });

  }

  catch {

    return [];

  }

}


// ============================================================================
// READ ASSIGNED EVENTS
// ============================================================================

async function readAssignedEvents(
  page
){

  return await page.evaluate(
    baseUrl => {

      const cards =
        [
          ...document.querySelectorAll(
            'article'
          )
        ];


      return cards
        .map(
          card => {

            const link =
              card.querySelector(
                'a'
              );


            const href =
              link?.getAttribute(
                'href'
              ) || '';


            const match =
              href.match(
                /assigned_events\/(\d+)/
              );


            if(!match){

              return null;

            }


            return {

              id:
                match[1],

              url:
                href.startsWith(
                  'http'
                )
                  ? href
                  : baseUrl + href

            };

          }
        )
        .filter(Boolean);

    },

    NDOW_BASE
  );

}


// ============================================================================
// MAIN
// ============================================================================

async function main(){

  let browser;


  try {

    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      ' NDOW INSTRUCTOR ASSIGNMENT DISCOVERY'
    );

    console.log(
      '========================================'
    );

    console.log('');


    // ------------------------------------------------------------------------
    // OPEN BROWSER
    // ------------------------------------------------------------------------

    browser =
      await puppeteer.launch({

        headless:
          false,

        defaultViewport:
          null,

        args: [
          '--start-maximized'
        ]

      });


    const page =
      await browser.newPage();


    // ------------------------------------------------------------------------
    // LOGIN
    // ------------------------------------------------------------------------

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
        waitUntil:
          'domcontentloaded',

        timeout:
          60000
      }
    );


    const loginDeadline =
      Date.now() +
      (
        120 * 1000
      );


    let loggedIn =
      false;


    while(
      Date.now() <
      loginDeadline
    ){

      try {

        const url =
          page.url();


        const passwordField =
          await page.$(
            'input[type="password"]'
          );


        const onLoginPage =
          Boolean(
            passwordField
          ) ||
          /login|sign.?in/i.test(
            url
          );


        if(
          !onLoginPage &&
          /\/dashboard\//i.test(
            url
          )
        ){

          loggedIn =
            true;

          break;

        }

      }

      catch {

        // Continue waiting.

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


    // ------------------------------------------------------------------------
    // DISCOVER CUSTOMER ID
    // ------------------------------------------------------------------------

    const customerId =
      await discoverCustomerId(
        page
      );


    if(!customerId){

      throw new Error(
        'Could not discover the NDOW customer ID from the logged-in account.'
      );

    }


    console.log(
      `NDOW customer ID: ${customerId}`
    );

    console.log('');


    // ------------------------------------------------------------------------
    // DISCOVER ASSIGNED EVENTS
    // ------------------------------------------------------------------------

    const events =
      new Map();


    let currentPage =
      1;


    while(true){

      const pageUrl =
        `${NDOW_URL}?filter%5Bevents_program_id%5D=&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending&ordering%5Border_by%5D%5B%5D=desc&page=${currentPage}&size=50`;


      await page.goto(
        pageUrl,
        {
          waitUntil:
            'domcontentloaded',

          timeout:
            60000
        }
      );


      await page.waitForSelector(
        'body',
        {
          timeout:
            30000
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
        `Page ${currentPage}: ${pageEvents.length} events`
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


    // ------------------------------------------------------------------------
    // CHECK EVENT INSTRUCTORS
    // ------------------------------------------------------------------------

    const assignedEventIds =
      [];


    let checkedCount =
      0;


    let failedCount =
      0;


    console.log(
      'Checking instructor assignments...'
    );

    console.log('');


    for(
      let index = 0;
      index < allEvents.length;
      index++
    ){

      const event =
        allEvents[index];


      process.stdout.write(
        `[${index + 1}/${allEvents.length}] Event ${event.id} ... `
      );


      const instructors =
        await readEventInstructors(
          page,
          event.url
        );


      checkedCount++;


      if(!instructors.length){

        failedCount++;

        console.log(
          'no instructor data'
        );

        continue;

      }


      const isInstructor =
        instructors.some(
          instructor =>
            String(
              instructor.customerId
            ).trim()
            ===
            customerId
        );


      if(isInstructor){

        assignedEventIds.push(
          String(
            event.id
          )
        );

        console.log(
          '✓ INSTRUCTOR'
        );

      }

      else {

        console.log(
          'not assigned'
        );

      }

    }


    // ------------------------------------------------------------------------
    // FINAL RESULT
    // ------------------------------------------------------------------------

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
      ' ASSIGNMENT DISCOVERY COMPLETE'
    );

    console.log(
      '========================================'
    );

    console.log('');

    console.log(
      `Customer ID: ${customerId}`
    );

    console.log(
      `Events checked: ${checkedCount}`
    );

    console.log(
      `Lookup failures: ${failedCount}`
    );

    console.log(
      `Instructor events: ${eventIds.length}`
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
      'Discovery complete.'
    );

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
      '========================================'
    );

    console.error(
      ' ASSIGNMENT DISCOVERY FAILED'
    );

    console.error(
      '========================================'
    );

    console.error('');

    console.error(
      error.message ||
      error
    );

    console.error('');


    if(browser){

      await browser.close();

    }


    process.exitCode =
      1;

  }

}


main();
