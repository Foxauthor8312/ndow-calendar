/*
==============================================================================
 NDOW BETA ACCOUNT DIAGNOSTIC
------------------------------------------------------------------------------
 Purpose:
   Inspect the logged-in NDOW dashboard for account/instructor information.

 Safety:
   - No credentials are saved.
   - No cookies are saved.
   - No Supabase access.
   - No event crawling.
   - No event_instructors pages opened.

 Run:
   node ndow-scraper/beta-account-diagnostic.cjs
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');

const DASHBOARD_URL =
  'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeEvaluate(page, fn, ...args) {
  try {
    return await page.evaluate(fn, ...args);
  } catch (err) {
    return {
      __error: err && err.message ? err.message : String(err)
    };
  }
}

(async () => {

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW BETA ACCOUNT DIAGNOSTIC');
    console.log('========================================');
    console.log('');
    console.log('Opening NDOW...');
    console.log('');
    console.log('A browser window will open.');
    console.log('');
    console.log('Please log into NDOW using the');
    console.log('instructor account being tested.');
    console.log('');
    console.log('Credentials are NOT saved by this tool.');
    console.log('');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        '--start-maximized'
      ]
    });

    const page = await browser.newPage();

    await page.goto(DASHBOARD_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('Waiting for NDOW login...');

    // Poll safely through navigation.  We deliberately do not use
    // waitForNavigation because the login can navigate more than once.
    let loggedIn = false;

    for (let i = 0; i < 180; i++) {

      await sleep(1000);

      try {

        const state = await page.evaluate(() => ({
          url: location.href,
          title: document.title,
          text: document.body ? document.body.innerText : '',
          passwordField: !!document.querySelector(
            'input[type="password"]'
          )
        }));

        const text = state.text || '';

        const looksLoggedIn =
          !state.passwordField &&
          (
            state.url.includes('/dashboard/') ||
            /assigned_programs_events/i.test(state.url) ||
            /Hello!/i.test(text)
          );

        if (looksLoggedIn) {
          loggedIn = true;
          break;
        }

      } catch (err) {
        // Navigation is normal during login. Keep polling.
      }
    }

    if (!loggedIn) {
      throw new Error(
        'Login was not detected within the expected time.'
      );
    }

    console.log('');
    console.log('Login detected.');
    console.log('Inspecting account information...');
    console.log('');

    // Give the dashboard a moment to finish rendering.
    await sleep(2000);

    const diagnostic = await safeEvaluate(page, () => {

      const bodyText =
        document.body ? document.body.innerText : '';

      const html =
        document.documentElement
          ? document.documentElement.innerHTML
          : '';

      const dataReact = [];

      document
        .querySelectorAll('[data-react-class][data-react-props]')
        .forEach((el, index) => {

          const reactClass =
            el.getAttribute('data-react-class');

          const props =
            el.getAttribute('data-react-props');

          dataReact.push({
            index,
            reactClass,
            propsLength: props ? props.length : 0,
            propsPreview: props
              ? props.slice(0, 1200)
              : ''
          });
        });

      const links = Array.from(
        document.querySelectorAll('a[href]')
      )
        .map(a => ({
          text: (a.innerText || '').trim(),
          href: a.href
        }))
        .filter(x =>
          /profile|account|customer|instructor|user/i.test(
            `${x.text} ${x.href}`
          )
        )
        .slice(0, 100);

      // Look for likely customer/account identifiers in the raw HTML.
      const patterns = [
        /customer[_-]?id.{0,100}/ig,
        /customerId.{0,100}/g,
        /account[_-]?id.{0,100}/ig,
        /instructor[_-]?id.{0,100}/ig,
        /user[_-]?id.{0,100}/ig
      ];

      const identifierMatches = [];

      for (const pattern of patterns) {

        const matches = html.match(pattern) || [];

        for (const match of matches.slice(0, 20)) {
          identifierMatches.push(match);
        }
      }

      return {
        url: location.href,
        title: document.title,

        bodyPreview: bodyText.slice(0, 5000),

        dataReact,

        relevantLinks: links,

        identifierMatches:
          [...new Set(identifierMatches)].slice(0, 100),

        hasCustomerIdText:
          /customer[_-]?id|customerId/i.test(html),

        hasInstructorIdText:
          /instructor[_-]?id/i.test(html),

        hasAccountIdText:
          /account[_-]?id/i.test(html)
      };

    });

    console.log('----------------------------------------');
    console.log(' CURRENT PAGE');
    console.log('----------------------------------------');
    console.log('URL:', diagnostic.url);
    console.log('Title:', diagnostic.title);
    console.log('');

    console.log('----------------------------------------');
    console.log(' PAGE TEXT PREVIEW');
    console.log('----------------------------------------');
    console.log(diagnostic.bodyPreview || '(none)');
    console.log('');

    console.log('----------------------------------------');
    console.log(' RELEVANT LINKS');
    console.log('----------------------------------------');

    if (diagnostic.relevantLinks.length) {

      for (const link of diagnostic.relevantLinks) {
        console.log(
          `${link.text || '(no text)'}`
        );
        console.log(
          `  ${link.href}`
        );
      }

    } else {
      console.log('(none found)');
    }

    console.log('');

    console.log('----------------------------------------');
    console.log(' IDENTIFIER SEARCH');
    console.log('----------------------------------------');
    console.log(
      'customer ID text:',
      diagnostic.hasCustomerIdText
    );
    console.log(
      'instructor ID text:',
      diagnostic.hasInstructorIdText
    );
    console.log(
      'account ID text:',
      diagnostic.hasAccountIdText
    );
    console.log('');

    if (diagnostic.identifierMatches.length) {

      console.log('Possible identifier matches:');

      for (const match of diagnostic.identifierMatches) {
        console.log('  ', match);
      }

    } else {
      console.log('No obvious identifier strings found.');
    }

    console.log('');

    console.log('----------------------------------------');
    console.log(' REACT COMPONENTS');
    console.log('----------------------------------------');

    if (diagnostic.dataReact.length) {

      for (const item of diagnostic.dataReact) {

        console.log(
          `[${item.index}] ${item.reactClass}`
        );

        console.log(
          `    props length: ${item.propsLength}`
        );

        if (item.propsPreview) {
          console.log(
            `    ${item.propsPreview}`
          );
        }

        console.log('');

      }

    } else {
      console.log('(No data-react props found on this page.)');
    }

    console.log('========================================');
    console.log(' DIAGNOSTIC COMPLETE');
    console.log('========================================');
    console.log('');
    console.log('Please copy the console output back here.');
    console.log('The browser can remain open for now.');
    console.log('');

    // Deliberately leave the browser open so the tester can inspect it.
    await new Promise(() => {});

  } catch (err) {

    console.log('');
    console.log('========================================');
    console.log(' DIAGNOSTIC FAILED');
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
