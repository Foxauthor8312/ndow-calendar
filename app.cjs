const puppeteer = require('puppeteer');
const fs = require('fs');

(async function () {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', req => {

    const type =
      req.resourceType();

    if(
      type === 'image' ||
      type === 'font'
    ){

      req.abort();

    } else {

      req.continue();

    }

  });

  if(fs.existsSync('session.json')){

    const cookies = JSON.parse(
      fs.readFileSync('session.json')
    );

    await page.setCookie(...cookies);

  }

  console.log('Opening NDOW...');

  await page.goto(
    'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events',
    {
      waitUntil:'networkidle2',
      timeout:60000
    }
  );

  await page.waitForSelector('body');

  await new Promise(resolve =>
  setTimeout(resolve, 2500)
);

  // auto login if needed
  if(await page.$('input[type="password"]')){

    console.log(
      'Login required...'
    );

    await page.type(
      'input[type="email"]',
      process.env.NDOW_EMAIL
    );

    await page.type(
      'input[type="password"]',
      process.env.NDOW_PASSWORD
    );

    await page.click(
      'button[type="submit"]'
    );

    await page.waitForNavigation({
      waitUntil:'domcontentloaded',
      timeout:60000
    });

    console.log(
      'Login successful.'
    );

  }

  const cookies =
    await page.cookies();

  fs.writeFileSync(
    'session.json',
    JSON.stringify(cookies, null, 2)
  );

  console.log('Session saved.');
  console.log('Starting fast scrape...');

  let combinedText = '';
  let currentPage = 1;

  while (true) {

    const pageUrl =
      'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events?filter%5Bevents_program_id%5D=&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending&ordering%5Border_by%5D%5B%5D=desc&page=' +
      currentPage +
      '&size=50';

    console.log(
      'Opening page ' + currentPage
    );

    await page.goto(
      pageUrl,
      {
        waitUntil:'domcontentloaded',
        timeout:60000
      }
    );

    const events =
      await page.evaluate(() => {

        const cards =
          document.querySelectorAll(
            'article'
          );

        if(cards.length === 0){
          return [];
        }

        const results = [];

        cards.forEach(card => {

          const linkEl =
            card.querySelector('a');

          const rawHref =
            linkEl?.getAttribute('href') || '';

          const url =
            rawHref.startsWith('http')
              ? rawHref
              : 'https://nevada.events.licensing.app' + rawHref;

          const instructorUrl =
            url + '/event_instructors';

          results.push({

            url,
            instructorUrl,
            text: card.innerText

          });

        });

        return results;

      });

    // STOP when no events found
    if(events.length === 0){

      console.log(
        'No more pages found.'
      );

      break;

    }

    for(const event of events){

      console.log(
        'Checking instructors for:',
        event.url
      );

      try {

        await page.goto(
          event.instructorUrl,
          {
            waitUntil:'domcontentloaded',
            timeout:60000
          }
        );

        await page.waitForSelector(
          'body'
        );

        const instructors =
          await page.evaluate(() => {

            const rows =
              Array.from(
                document.querySelectorAll('tr')
              );

            return rows.map(row => {

              const cells =
                row.querySelectorAll('td');

              if(cells.length < 3){
                return null;
              }

              return {

                name:
                  cells[0]
                    ?.innerText
                    ?.trim(),

                role:
                  cells[1]
                    ?.innerText
                    ?.trim(),

                username:
                  cells[2]
                    ?.innerText
                    ?.trim()

              };

            }).filter(Boolean);

          });

        combinedText +=

          '\n\n====================\n\n' +

          'URL: ' +
          event.url +

          '\n\nINSTRUCTORS:\n' +

          JSON.stringify(
            instructors,
            null,
            2
          ) +

          '\n\n' +

          event.text;

      } catch(err){

        console.log(
          'Instructor scrape failed:',
          event.url
        );

        combinedText +=

          '\n\n====================\n\n' +

          'URL: ' +
          event.url +

          '\n\n' +

          event.text;

      }

    }

    console.log(
      'Scraped',
      events.length,
      'events from page',
      currentPage
    );

    currentPage++;

  }

  fs.writeFileSync(
    'all-events.txt',
    combinedText
  );

  console.log('DONE!');

  try {

    await page.goto(
      'https://nevada.events.licensing.app/logout',
      {
        waitUntil:'networkidle2',
        timeout:60000
      }
    );

    console.log('Logged out.');

    if(fs.existsSync('session.json')){

      fs.unlinkSync('session.json');

      console.log(
        'Session cookies cleared.'
      );

    }

  } catch(err){

    console.log(
      'Logout skipped.'
    );

  }

  await browser.close();
  process.exit(0);

})();
