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
      fs.readFileSync(
        'session.json'
      )
    );

    await page.setCookie(
      ...cookies
    );

  }

  console.log(
    'Opening NDOW...'
  );

  await page.goto(
    'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events',
    {
      waitUntil:'domcontentloaded',
      timeout:60000
    }
  );

  await page.waitForSelector(
    'body'
  );

  if(
    await page.$(
      'input[type="password"]'
    )
  ){

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
      waitUntil:'networkidle2',
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
    JSON.stringify(
      cookies,
      null,
      2
    )
  );

  console.log(
    'Session saved.'
  );

  console.log(
    'Starting enriched scrape...'
  );

  let allEvents = [];
  let currentPage = 1;

  while(true){

    const pageUrl =
      'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events?filter%5Bevents_program_id%5D=&ordering%5Border_by%5D%5B%5D=Start+Date+-+Descending&ordering%5Border_by%5D%5B%5D=desc&page=' +
      currentPage +
      '&size=50';

    console.log(
      'Opening page:',
      currentPage
    );

    await page.goto(
      pageUrl,
      {
        waitUntil:'domcontentloaded',
        timeout:60000
      }
    );

    await page.waitForSelector(
      'body'
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
            linkEl?.getAttribute(
              'href'
            ) || '';

          const url =
            rawHref.startsWith(
              'http'
            )
              ? rawHref
              : 'https://nevada.events.licensing.app' +
                rawHref;

          const instructorUrl =
            url +
            '/event_instructors';

          const text =
            card.innerText || '';

          results.push({

            title: text,
            date: '',
            location: '',
            url,
            instructorUrl,
            text,
            instructors: [],
            enrichment: {
              scrapedAt:
                new Date()
                  .toISOString(),
              source:
                'ndow-scraper-v2'
            }

          });

        });

        return results;

      });

    if(events.length === 0){

      console.log(
        'No more pages found.'
      );

      break;

    }

    console.log(
      'Events found:',
      events.length
    );

    for(const event of events){

      console.log(
        'Checking instructors for:',
        event.url
      );

      console.log(
        'INSTRUCTOR URL:',
        event.instructorUrl
      );

      try {

        await page.goto(
          event.instructorUrl,
          {
            waitUntil:
              'networkidle2',

            timeout:60000
          }
        );

        await page.waitForSelector(
          'body'
        );

        await new Promise(resolve =>
          setTimeout(
            resolve,
            4000
          )
        );

        const instructorData =
          await page.evaluate(() => {

            const text =
              document.body
                .innerText;

            const lowerText =
              text.toLowerCase();

            const splitIndex =
              lowerText.indexOf(
                'assigned instructors'
              );

            if(splitIndex === -1){

              return [];

            }

            const section =
              text.substring(
                splitIndex
              );

            const lines =
              section
                .split('\n')
                .map(line =>
                  line.trim()
                )
                .filter(Boolean);

            const instructorData =
              [];

            for(
              let i = 0;
              i < lines.length;
              i++
            ){

              const line =
                lines[i];

              const lowerLine =
                line.toLowerCase();

              if(
                lowerLine.includes(
                  'primary'
                ) ||
                lowerLine.includes(
                  'assistant'
                )
              ){

                const parts =
                  line.split(/\s+/);

                const role =
                  parts.pop();

                const name =
                  parts.join(' ');

                let email = '';

                if(
                  lines[i + 1] &&
                  lines[i + 1].includes('@')
                ){

                  email =
                    lines[i + 1];

                }

                instructorData.push({

                  name:
                    name.trim(),

                  role:
                    role.trim(),

                  email:
                    email.trim()

                });

              }

            }

            return instructorData;

          });

        event.instructors =
          instructorData;

        console.log(
          'Instructor count:',
          instructorData.length
        );

      } catch(err){

        console.log(
          'Instructor scrape failed:',
          event.url
        );

        console.log(err);

      }

      allEvents.push(event);

    }

    currentPage++;

  }

  fs.writeFileSync(
    'all-events.txt',

    JSON.stringify(
      allEvents,
      null,
      2
    )
  );

  console.log(
    'Instructor enrichment complete.'
  );

  await browser.close();

  process.exit(0);

})();
