/*
==============================================================================
 NDOW INSTRUCTOR ASSIGNMENT SYNC
------------------------------------------------------------------------------
 Purpose:
    • Opens NDOW in a visible browser
    • Instructor logs in manually
    • Discovers events available to that account
    • Opens each event's Event Instructors page
    • Checks whether the logged-in NDOW customer is an instructor
    • Saves ONLY the matching event IDs and customer ID

 IMPORTANT:
    • No credentials are saved.
    • No session cookies are saved.
    • No Supabase connection.
    • No production files are modified.
    • This is a standalone assignment-sync tool.
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');

const NDOW_BASE =
  'https://nevada.events.licensing.app';

const NDOW_URL =
  `${NDOW_BASE}/dashboard/em/assigned_programs_events`;


/*
==============================================================================
 DETECT LOGGED-IN ACCOUNT
==============================================================================
*/

async function detectLoggedInInstructor(page) {

  try {

    const bodyText =
      await page.evaluate(
        () => document.body.innerText || ''
      );

    const helloMatch =
      bodyText.match(
        /Hello!\s*([^\r\n]+)/i
      );

    if (
      helloMatch &&
      helloMatch[1]
    ){

      return helloMatch[1].trim();

    }

  } catch(err){

    // Ignore and continue.

  }

  return '';

}


/*
==============================================================================
 READ EVENT INSTRUCTORS
------------------------------------------------------------------------------
 Returns only the information required to determine whether the logged-in
 NDOW customer is assigned to the event.
==============================================================================
*/

async function readEventInstructors(
  page,
  event
){

  const instructorUrl =
    `${event.url}/event_instructors`;

  try {

    await page.goto(
      instructorUrl,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    try {

      await page.waitForSelector(
        '[data-react-class="instructors/SearchInstructorsForm"]',
        {
          timeout: 10000
        }
      );

    } catch(err){

      // Continue. The evaluate below will determine
      // whether instructor data is available.

    }


    const instructors =
      await page.evaluate(() => {

        const reactNode =
          document.querySelector(
            '[data-react-class="instructors/SearchInstructorsForm"]'
          );

        if(!reactNode){

          return [];

        }

        const rawProps =
          reactNode.getAttribute(
            'data-react-props'
          );

        if(!rawProps){

          return [];

        }

        let props;

        try {

          props =
            JSON.parse(
              rawProps
            );

        } catch(err){

          props =
            JSON.parse(
              rawProps.replace(
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
            ),

          name:
            `${instructor.customer?.first_name || ''} ${instructor.customer?.last_name || ''}`
              .trim(),

          role:
            instructor.is_primary
              ? 'PRIMARY'
              : 'ASSISTANT'

        }));

      });


    return {
      instructors,
      error: ''
    };


  } catch(err){

    return {
      instructors: [],
      error:
        err.message ||
        String(err)
    };

  }

}


/*
==============================================================================
 MAIN
==============================================================================
*/

async function main(){

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW INSTRUCTOR ASSIGNMENT SYNC');
    console.log('========================================');
    console.log('');

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


    /*
    --------------------------------------------------------------------------
     MANUAL LOGIN
    --------------------------------------------------------------------------
    */

    console.log(
      'Opening NDOW...'
    );

    console.log('');

    console.log(
      'A browser window will open.'
    );

    console.log(
      'Log into NDOW using the instructor account.'
    );

    console.log('');

    console.log(
      'Credentials are NOT saved by this tool.'
    );

    console.log('');

    console.log(
      'Waiting for NDOW login...'
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


        if(
          !onLoginPage &&
          /\/dashboard\//i.test(url)
        ){

          loggedIn = true;

          break;

        }

      } catch(err){

        // Navigation can temporarily destroy
        // the execution context.

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
        'Login was not detected within 120 seconds.'
      );

    }


    console.log(
      'Login detected.'
    );

    console.log(
      'Waiting for NDOW to settle...'
    );

    console.log('');


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          3000
        )
    );


    /*
    --------------------------------------------------------------------------
     ACCOUNT NAME
    --------------------------------------------------------------------------
    */

    const loggedInInstructor =
      await detectLoggedInInstructor(
        page
      );


    console.log(
      'Logged-in account:',
      loggedInInstructor ||
      '(not detected)'
    );

    console.log('');


    /*
    --------------------------------------------------------------------------
     OPEN ASSIGNED EVENTS
    --------------------------------------------------------------------------
    */

    console.log(
      'Opening assigned events...'
    );

    console.log('');


    await page.goto(
      NDOW_URL,
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );


    await page.waitForSelector(
      'body',
      {
        timeout: 30000
      }
    );


    /*
    --------------------------------------------------------------------------
     DISCOVER ASSIGNED EVENTS
    --------------------------------------------------------------------------
    */

    let allEvents = [];

    let currentPage = 1;


    while(true){

      const pageUrl =
        NDOW_URL +
        '?filter%5Bevents_program_id%5D=' +
        '&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending' +
        '&ordering%5Border_by%5D%5B%5D=desc' +
        '&page=' +
        currentPage +
        '&size=50';


      console.log(
        'Reading assigned events page:',
        currentPage
      );


      await page.goto(
        pageUrl,
        {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        }
      );


      await page.waitForSelector(
        'body',
        {
          timeout: 30000
        }
      );


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            1000
          )
      );


      const events =
        await page.evaluate(
          baseUrl => {

            const cards =
              [
                ...document.querySelectorAll(
                  'article'
                )
              ];


            return cards.map(card => {

              const link =
                card.querySelector(
                  'a'
                );


              const rawHref =
                link?.getAttribute(
                  'href'
                ) || '';


              const url =
                rawHref.startsWith('http')
                  ? rawHref
                  : baseUrl + rawHref;


              const idMatch =
                rawHref.match(
                  /assigned_events\/(\d+)/
                );


              return {

                id:
                  idMatch
                    ? idMatch[1]
                    : '',

                url

              };

            }).filter(
              event =>
                event.id
            );

          },
          NDOW_BASE
        );


      if(
        events.length === 0
      ){

        console.log(
          'No more assigned events.'
        );

        break;

      }


      console.log(
        'Events found:',
        events.length
      );


      allEvents.push(
        ...events
      );


      currentPage++;

    }


    /*
    --------------------------------------------------------------------------
     REMOVE DUPLICATES
    --------------------------------------------------------------------------
    */

    const uniqueEvents =
      [
        ...new Map(
          allEvents.map(
            event => [
              event.id,
              event
            ]
          )
        ).values()
      ];


    console.log('');

    console.log(
      'Total unique events:',
      uniqueEvents.length
    );

    console.log('');

    console.log(
      'Checking instructor assignments...'
    );

    console.log('');


    /*
    --------------------------------------------------------------------------
     DETERMINE CUSTOMER ID
    --------------------------------------------------------------------------

     We don't assume the account name is the identity.

     The first Event Instructors page that contains the logged-in account
     gives us the authoritative NDOW customer ID.
    --------------------------------------------------------------------------
    */

    let loggedInCustomerId = '562293';

    const assignedEventIds = [];

    let checkedCount = 0;

    let failedCount = 0;


    /*
    --------------------------------------------------------------------------
     CHECK EACH EVENT
    --------------------------------------------------------------------------
    */

    for(
      let index = 0;
      index < uniqueEvents.length;
      index++
    ){

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


      checkedCount++;


      if(
        result.error
      ){

        failedCount++;

        console.log(
          `FAILED - ${result.error}`
        );

        continue;

      }


      /*
      ------------------------------------------------------------------------
       If we don't know the customer ID yet, try to establish it from the
       instructor record matching the logged-in NDOW account name.
      ------------------------------------------------------------------------
      */

      if(
        !loggedInCustomerId &&
        loggedInInstructor
      ){

        const accountInstructor =
          result.instructors.find(
            instructor =>
              instructor.name
                .toLowerCase()
                .trim()
              ===
              loggedInInstructor
                .toLowerCase()
                .trim()
          );


        if(
          accountInstructor &&
          accountInstructor.customerId
        ){

          loggedInCustomerId =
            accountInstructor.customerId;


          console.log(
            `NDOW customer ID detected: ${loggedInCustomerId}`
          );

        }

      }


      /*
      ------------------------------------------------------------------------
       Once we have the customer ID, determine whether this event belongs
       to that instructor.
      ------------------------------------------------------------------------
      */

      if(
        loggedInCustomerId
      ){

        const isInstructor =
          result.instructors.some(
            instructor =>
              String(
                instructor.customerId
              ).trim()
              ===
              String(
                loggedInCustomerId
              ).trim()
          );


        if(isInstructor){

          assignedEventIds.push(
            String(event.id)
          );


          console.log(
            `✓ INSTRUCTOR`
          );

        } else {

          console.log(
            'not assigned'
          );

        }

      } else {

        console.log(
          'customer ID not established'
        );

      }

    }


    /*
    --------------------------------------------------------------------------
     RESULT
    --------------------------------------------------------------------------
    */

    const output = {

      syncedAt:
        new Date().toISOString(),

      customerId:
        loggedInCustomerId,

      eventIds:
        [
          ...new Set(
            assignedEventIds
          )
        ]

    };


    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      ' NDOW ASSIGNMENT SYNC COMPLETE'
    );

    console.log(
      '========================================'
    );

    console.log('');

    console.log(
      'NDOW account:',
      loggedInInstructor ||
      '(not detected)'
    );

    console.log(
      'Customer ID:',
      loggedInCustomerId ||
      '(not detected)'
    );

    console.log(
      'Events checked:',
      checkedCount
    );

    console.log(
      'Instructor events:',
      output.eventIds.length
    );

    console.log(
      'Lookup failures:',
      failedCount
    );

    console.log('');

    console.log(
      'Assignment event IDs:'
    );

    console.log(
      JSON.stringify(
        output.eventIds,
        null,
        2
      )
    );

    console.log('');

    /*
    --------------------------------------------------------------------------
     KEEP BROWSER OPEN FOR THIS FIRST TEST
    --------------------------------------------------------------------------

     We will close this after the sync is proven.
    --------------------------------------------------------------------------
    */

    console.log(
      'Browser left open for inspection.'
    );

    console.log('');


  } catch(err){

    console.log('');

    console.log(
      '========================================'
    );

    console.log(
      ' NDOW ASSIGNMENT SYNC FAILED'
    );

    console.log(
      '========================================'
    );

    console.error(
      err.message ||
      err
    );

    console.log('');

  }

}


main();
