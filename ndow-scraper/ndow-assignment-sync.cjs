/*
==============================================================================
 NDOW INSTRUCTOR ASSIGNMENT DISCOVERY
------------------------------------------------------------------------------

 Purpose:
    • Open NDOW in a visible browser
    • Instructor logs in manually
    • Read the instructor's Assigned Events page
    • Collect the assigned event IDs
    • Output ONLY those event IDs

 IMPORTANT:
    • No credentials are saved
    • No session cookies are saved
    • No customer ID is hard-coded
    • No instructor name is used
    • No event ID is hard-coded
    • No event-by-event instructor lookup
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
  `${NDOW_BASE}/dashboard/em/assigned_events`;


// ============================================================================
// READ ASSIGNED EVENTS
// ============================================================================

async function readAssignedEvents(page){

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
            link?.getAttribute('href') || '';

          const match =
            href.match(
              /assigned_events\/(\d+)/
            );

          if(!match){
            return null;
          }

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
      ' NDOW ASSIGNED EVENT DISCOVERY'
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

        headless: false,

        defaultViewport:
          null,

        args: [
          '--start-maximized'
        ]

      });

    const page =
      await browser.newPage();


    // ------------------------------------------------------------------------
    // OPEN NDOW
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


    // ------------------------------------------------------------------------
    // WAIT FOR LOGIN
    // ------------------------------------------------------------------------

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


    // ------------------------------------------------------------------------
    // READ ASSIGNED EVENTS
    // ------------------------------------------------------------------------

    const events =
      new Map();

    let currentPage =
      1;


    while(true){

      const pageUrl =
        `${NDOW_URL}?page=${currentPage}&size=50`;


      console.log(
        `Reading Assigned Events page ${currentPage}...`
      );


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
        `  Found ${pageEvents.length} events`
      );


      currentPage++;

    }


    // ------------------------------------------------------------------------
    // FINAL RESULT
    // ------------------------------------------------------------------------

    const eventIds =
      [
        ...events.keys()
      ];


    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      ' ASSIGNED EVENT DISCOVERY COMPLETE'
    );

    console.log(
      '========================================'
    );

    console.log('');

    console.log(
      `Assigned events: ${eventIds.length}`
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
      ' ASSIGNED EVENT DISCOVERY FAILED'
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
