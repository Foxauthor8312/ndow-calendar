/*
==============================================================================
 NDOW BETA ASSIGNED-EVENT REQUEST DIAGNOSTIC
------------------------------------------------------------------------------
 Purpose:
   Inspect the Assigned Events page for server-side filters, forms, links,
   embedded data, and network/resource URLs that may support filtering by
   instructor/customer ID.

 Safety:
   - No credentials are saved.
   - No cookies are saved.
   - No Supabase access.
   - Does NOT open individual event pages.
   - Does NOT crawl the 197 events.
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');

const ASSIGNED_URL =
  'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events';

const CUSTOMER_ID = '562293';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

  let browser;

  try {

    console.log('');
    console.log('========================================');
    console.log(' NDOW ASSIGNED-EVENT REQUEST DIAGNOSTIC');
    console.log('========================================');
    console.log('');
    console.log(`Target NDOW Customer ID: ${CUSTOMER_ID}`);
    console.log('');
    console.log('Opening Assigned Events...');
    console.log('');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });

    const page = await browser.newPage();

    const requests = [];

    page.on('request', request => {

      const type = request.resourceType();

      if (
        type === 'xhr' ||
        type === 'fetch' ||
        type === 'document'
      ) {
        requests.push({
          type,
          method: request.method(),
          url: request.url(),
          postData: request.postData() || ''
        });
      }
    });

    await page.goto(ASSIGNED_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('If NDOW asks for login, log in manually.');
    console.log('Waiting for the Assigned Events page...');
    console.log('');

    let ready = false;

    for (let i = 0; i < 120; i++) {

      await sleep(1000);

      try {

        const state = await page.evaluate(() => ({
          url: location.href,
          hasPassword:
            !!document.querySelector('input[type="password"]'),
          text:
            document.body ? document.body.innerText : ''
        }));

        if (
          !state.hasPassword &&
          /assigned_programs_events/i.test(state.url)
        ) {
          ready = true;
          break;
        }

      } catch (_) {}
    }

    if (!ready) {
      throw new Error(
        'Assigned Events page was not reached.'
      );
    }

    await sleep(2000);

    const pageData = await page.evaluate(
      (targetCustomerId) => {

        const bodyText =
          document.body ? document.body.innerText : '';

        const forms = Array.from(
          document.querySelectorAll('form')
        ).map((form, index) => {

          const controls =
            Array.from(
              form.querySelectorAll(
                'input, select, textarea, button'
              )
            ).map(control => ({
              tag: control.tagName,
              type: control.getAttribute('type') || '',
              name: control.getAttribute('name') || '',
              id: control.id || '',
              value: control.value || '',
              text:
                (control.innerText || '').trim().slice(0, 200),
              href:
                control.getAttribute('href') || ''
            }));

          return {
            index,
            action: form.action || '',
            method: form.method || '',
            controls
          };
        });

        const selects = Array.from(
          document.querySelectorAll('select')
        ).map((select, index) => ({
          index,
          name: select.name || '',
          id: select.id || '',
          value: select.value || '',
          options: Array.from(select.options).map(option => ({
            value: option.value,
            text: option.textContent.trim()
          }))
        }));

        const inputs = Array.from(
          document.querySelectorAll('input')
        ).map((input, index) => ({
          index,
          type: input.type || '',
          name: input.name || '',
          id: input.id || '',
          value: input.value || '',
          placeholder: input.placeholder || ''
        }));

        const links = Array.from(
          document.querySelectorAll('a[href]')
        ).map(a => ({
          text: (a.innerText || '').trim(),
          href: a.href
        })).filter(x =>
          /filter|search|instructor|assigned|customer|program/i.test(
            `${x.text} ${x.href}`
          )
        ).slice(0, 200);

        const reactProps = [];

        document
          .querySelectorAll('[data-react-class][data-react-props]')
          .forEach((el, index) => {

            reactProps.push({
              index,
              className:
                el.getAttribute('data-react-class') || '',
              props:
                (el.getAttribute('data-react-props') || '')
                  .slice(0, 5000)
            });
          });

        const html = document.documentElement
          ? document.documentElement.innerHTML
          : '';

        const targetOccurrences = [];

        let pos = 0;

        while (true) {

          const found =
            html.indexOf(targetCustomerId, pos);

          if (found === -1) break;

          targetOccurrences.push(
            html.slice(
              Math.max(0, found - 300),
              Math.min(html.length, found + 500)
            )
          );

          pos = found + targetCustomerId.length;

          if (targetOccurrences.length >= 20) break;
        }

        return {
          url: location.href,
          title: document.title,
          bodyPreview: bodyText.slice(0, 6000),
          forms,
          selects,
          inputs,
          links,
          reactProps,
          targetOccurrences
        };

      },
      CUSTOMER_ID
    );

    console.log('----------------------------------------');
    console.log(' PAGE');
    console.log('----------------------------------------');
    console.log('URL:', pageData.url);
    console.log('Title:', pageData.title);
    console.log('');

    console.log('----------------------------------------');
    console.log(' FORMS');
    console.log('----------------------------------------');

    if (pageData.forms.length) {

      for (const form of pageData.forms) {

        console.log(
          `[FORM ${form.index}] ${form.method.toUpperCase()} ${form.action}`
        );

        for (const control of form.controls) {
          console.log(
            `  ${control.tag} type=${control.type} ` +
            `name=${control.name} id=${control.id} ` +
            `value=${control.value} text=${control.text}`
          );
        }

        console.log('');
      }

    } else {
      console.log('(No forms found.)');
    }

    console.log('----------------------------------------');
    console.log(' SELECT FILTERS');
    console.log('----------------------------------------');

    if (pageData.selects.length) {

      for (const select of pageData.selects) {

        console.log(
          `[SELECT ${select.index}] ` +
          `name=${select.name} id=${select.id} ` +
          `value=${select.value}`
        );

        for (const option of select.options) {
          console.log(
            `  ${option.value} = ${option.text}`
          );
        }

        console.log('');
      }

    } else {
      console.log('(No select controls found.)');
    }

    console.log('----------------------------------------');
    console.log(' INPUT CONTROLS');
    console.log('----------------------------------------');

    for (const input of pageData.inputs) {

      console.log(
        `[${input.index}] type=${input.type} ` +
        `name=${input.name} id=${input.id} ` +
        `value=${input.value} placeholder=${input.placeholder}`
      );

    }

    console.log('');

    console.log('----------------------------------------');
    console.log(' RELEVANT LINKS');
    console.log('----------------------------------------');

    if (pageData.links.length) {

      for (const link of pageData.links) {
        console.log(
          `${link.text || '(no text)'}`
        );
        console.log(
          `  ${link.href}`
        );
      }

    } else {
      console.log('(None found.)');
    }

    console.log('');

    console.log('----------------------------------------');
    console.log(' REACT PROPS');
    console.log('----------------------------------------');

    if (pageData.reactProps.length) {

      for (const item of pageData.reactProps) {

        console.log(
          `[${item.index}] ${item.className}`
        );

        console.log(item.props);
        console.log('');

      }

    } else {
      console.log('(No data-react props found.)');
    }

    console.log('----------------------------------------');
    console.log(` CUSTOMER ID ${CUSTOMER_ID} IN PAGE HTML`);
    console.log('----------------------------------------');

    if (pageData.targetOccurrences.length) {

      for (const occurrence of pageData.targetOccurrences) {
        console.log(occurrence);
        console.log('---');
      }

    } else {
      console.log('Customer ID not found in page HTML.');
    }

    console.log('');
    console.log('----------------------------------------');
    console.log(' NETWORK / RESOURCE REQUESTS');
    console.log('----------------------------------------');

    const uniqueRequests = [];
    const seen = new Set();

    for (const request of requests) {

      const key =
        `${request.method}|${request.url}|${request.postData}`;

      if (seen.has(key)) continue;

      seen.add(key);
      uniqueRequests.push(request);
    }

    for (const request of uniqueRequests) {

      console.log(
        `[${request.type}] ${request.method} ${request.url}`
      );

      if (request.postData) {
        console.log(
          `  POST DATA: ${request.postData.slice(0, 2000)}`
        );
      }
    }

    console.log('');
    console.log('========================================');
    console.log(' DIAGNOSTIC COMPLETE');
    console.log('========================================');
    console.log('');
    console.log('No individual event pages were opened.');
    console.log('Paste the complete output back here.');
    console.log('');

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
