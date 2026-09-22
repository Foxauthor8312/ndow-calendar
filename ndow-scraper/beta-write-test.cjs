'use strict';

const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

const EVENT_ID = '4919';
const CUSTOMER_ID = '562293';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

async function waitForReactInstructorPage(page) {
  for (let i = 0; i < 30; i++) {

    const found = await page.evaluate(() => {
      return !!document.querySelector(
        '[data-react-class="instructors/SearchInstructorsForm"]'
      );
    });

    if (found) return true;

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return false;
}

async function getInstructorFromEvent(page) {

  const url =
    `https://nevada.events.licensing.app/dashboard/em/assigned_events/${EVENT_ID}/event_instructors`;

  console.log('');
  console.log('Opening instructor page:');
  console.log(url);

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  const ready =
    await waitForReactInstructorPage(page);

  if (!ready) {
    throw new Error(
      'Instructor React component did not appear.'
    );
  }

  return await page.evaluate((customerId) => {

    const element =
      document.querySelector(
        '[data-react-class="instructors/SearchInstructorsForm"]'
      );

    if (!element) {
      return {
        found: false,
        reason: 'React instructor component not found'
      };
    }

    const raw =
      element.getAttribute('data-react-props');

    if (!raw) {
      return {
        found: false,
        reason: 'data-react-props not found'
      };
    }

    let props;

    try {
      props = JSON.parse(raw);
    } catch (error) {
      return {
        found: false,
        reason: 'Could not parse data-react-props'
      };
    }

    const instructors =
      Array.isArray(props.instructors)
        ? props.instructors
        : [];

    const match =
      instructors.find(
        instructor =>
          String(instructor.customer_id) ===
          String(customerId)
      );

    if (!match) {
      return {
        found: false,
        reason: 'Customer ID not found',
        instructors:
          instructors.map(i => ({
            customer_id: i.customer_id,
            name:
              `${i.customer?.first_name || ''} ${
                i.customer?.last_name || ''
              }`.trim(),
            email:
              i.customer?.email_address || '',
            role:
              i.is_primary
                ? 'PRIMARY'
                : 'ASSISTANT'
          }))
      };
    }

    return {
      found: true,
      instructor: {
        customer_id:
          String(match.customer_id),

        name:
          `${match.customer?.first_name || ''} ${
            match.customer?.last_name || ''
          }`.trim(),

        email:
          match.customer?.email_address || '',

        role:
          match.is_primary
            ? 'PRIMARY'
            : 'ASSISTANT'
      }
    };

  }, CUSTOMER_ID);
}

async function main() {

  console.log('');
  console.log('========================================');
  console.log(' NDOW BETA WRITE TEST');
  console.log('========================================');
  console.log('');
  console.log(`Event ID:    ${EVENT_ID}`);
  console.log(`Customer ID: ${CUSTOMER_ID}`);
  console.log('');

  const browser =
    await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

  try {

    const page =
      await browser.newPage();

    /*
     * Manual NDOW login.
     */
    await page.goto(
      'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    console.log(
      'Browser opened.'
    );

    console.log('');
    console.log(
      'Log into NDOW manually in the browser.'
    );
    console.log(
      'Do not enter credentials into this terminal.'
    );
    console.log('');

    /*
     * Wait until the login page is gone.
     */
    for (;;) {

      const state =
        await page.evaluate(() => ({
          url: location.href,
          hasPassword:
            !!document.querySelector(
              'input[type="password"]'
            ),
          body:
            document.body?.innerText?.slice(0, 500) || ''
        }));

      const loggedIn =
        !state.hasPassword &&
        !state.url.includes('/sign_in');

      if (loggedIn) {
        console.log('');
        console.log('NDOW login detected.');
        break;
      }

      await new Promise(
        resolve => setTimeout(resolve, 1000)
      );
    }

    /*
     * Get the instructor assignment.
     */
    const result =
      await getInstructorFromEvent(page);

    console.log('');
    console.log('Assignment lookup result:');
    console.log(
      JSON.stringify(result, null, 2)
    );

    if (!result.found) {
      throw new Error(
        'Jackie was not found on event 4919.'
      );
    }

    const instructor =
      result.instructor;

    console.log('');
    console.log('Writing assignment to event_instructors...');
    console.log('');

    const row = {
      event_id: EVENT_ID,
      customer_id: CUSTOMER_ID,
      name: instructor.name,
      email: instructor.email,
      role: instructor.role
    };

    const { data, error } =
      await supabase
        .from('event_instructors')
        .upsert(
          row,
          {
            onConflict:
              'event_id,customer_id'
          }
        )
        .select();

    if (error) {
      throw error;
    }

    console.log('SUCCESS');
    console.log('');
    console.log(
      JSON.stringify(data, null, 2)
    );

    /*
     * Read it back from Supabase.
     */
    const { data: verify, error: verifyError } =
      await supabase
        .from('event_instructors')
        .select('*')
        .eq('event_id', EVENT_ID)
        .eq('customer_id', CUSTOMER_ID);

    if (verifyError) {
      throw verifyError;
    }

    console.log('');
    console.log('Database verification:');
    console.log(
      JSON.stringify(verify, null, 2)
    );

    console.log('');
    console.log('========================================');
    console.log(' WRITE TEST COMPLETE');
    console.log('========================================');
    console.log('');

    console.log(
      'If the row above looks correct, check event 4919'
    );
    console.log(
      'in the calendar and see whether Jackie receives'
    );
    console.log(
      'the instructor star.'
    );
    console.log('');

  } catch (error) {

    console.error('');
    console.error('TEST FAILED');
    console.error('');
    console.error(
      error?.stack || error
    );

  } finally {

    console.log('');
    console.log(
      'Browser left open for inspection.'
    );
    console.log(
      'Close it manually when finished.'
    );
  }
}

main();
