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

    // ----------------------------------------
// Capture Program
// ----------------------------------------

try{

  event.program =
    await page.evaluate(() => {

      const body =
        document.body.innerText;

      const match =
        body.match(
          /Program\s*:?[\r\n\s]+([^\r\n]+)/i
        );

      return match
        ? match[1].trim()
        : '';

    });

  console.log(
    'PROGRAM:',
    event.program
  );

}catch(err){

  event.program = '';

}

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

  const eventId =
    rawHref.match(
      /assigned_events\/(\d+)/
    )?.[1] || '';

  const instructorUrl =
    url +
    '/event_instructors';

  const text =
    card.innerText || '';

  results.push({

    id: eventId,

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

  const text =
  event.title || '';

const locationMatch =
  text.match(
    /Location:\s*([\s\S]*?)(?:\s*Taught by:|\s*Date\s*&\s*Times:)/i
  );

const timeMatch =
  text.match(
    /Date\s*&\s*Times:\s*([\s\S]*?)\s*View$/i
  );

const instructorMatch =
  text.match(
    /Taught by:\s*([\s\S]*?)(?:\s*Date\s*&\s*Times:|$)/i
  );

if(locationMatch){

  event.location =
    locationMatch[1]
      .replace(/\n+/g,' ')
      .replace(/\s+/g,' ')
      .trim();

}

if(timeMatch){

  event.time =
    timeMatch[1]
      .replace(/\n+/g,' ')
      .replace(/\s+/g,' ')
      .trim();

  const dateMatch =
    event.time.match(
      /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/
    );

  if(dateMatch){

    event.date =
      dateMatch[1];

  }

}

if(instructorMatch){

  event.instructors = [
    {
      name:
        instructorMatch[1]
          .replace(/\n+/g,' ')
          .replace(/\s+/g,' ')
          .trim(),
      role:'PRIMARY',
      email:''
    }
  ];

}

const isCompleted =
  event.title.includes(
    'Event Completed'
  );

if(isCompleted){

  console.log(
    'COMPLETED EVENT - VERIFYING INSTRUCTORS:',
    event.url
  );

}

 console.log(
  'Loading event:',
  event.url
);

await page.goto(
  event.url,
  {
    waitUntil:'networkidle2',
    timeout:60000
  }
);

const details =
  await page.evaluate(() => {

    const text =
      document.body.innerText;

    function extract(label){

      const match =
        text.match(
          new RegExp(
            label + '\\s*:\\s*([^\\r\\n]+)',
            'i'
          )
        );

      return match
        ? match[1].trim()
        : '';

    }

    return {

      program:
        extract('Program'),

      eventName:
        extract('Event Name'),

      location:
        extract('Location'),

      dateTime:
        extract('Date & Times'),

      about:
        extract('About this Event')

    };

  });

event.program =
  details.program;

if(details.eventName){
  event.title =
    details.eventName;
}

if(details.location){
  event.location =
    details.location;
}

if(details.dateTime){
  event.time =
    details.dateTime;
}

if(details.about){
  event.description =
    details.about;
}

  try {

    await page.goto(
      event.instructorUrl,
      {
        waitUntil:'networkidle2',
        timeout:60000
      }
    );

  
   
  const instructorData =
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

try{

  props =
    JSON.parse(rawProps);

}catch{

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
    ).map(i => ({

      name:
        `${i.customer?.first_name || ''} ${i.customer?.last_name || ''}`
          .trim(),

      role:
        i.is_primary
          ? 'PRIMARY'
          : 'ASSISTANT',

      email:
        i.customer?.email_address || '',

      customerId:
        String(
          i.customer_id || ''
        )

    }));

  });

        event.instructors =
  instructorData;

event.ndowResults = [];

console.log(
  'Instructor count:',
  instructorData.length
);

for(const instructor of instructorData){

const resultsUrl =

`https://nevada.events.licensing.app/dashboard/em/assigned_events/${event.id}/instructor_results/${instructor.customerId}`;

console.log(
  'EVENT ID:',
  event.id
);

console.log(
  'CUSTOMER ID:',
  instructor.customerId
);

console.log(
  'TEST RESULTS URL:',
  resultsUrl
);

try{

  await page.goto(
    resultsUrl,
    {
      waitUntil:'networkidle2',
      timeout:60000
    }
  );

  const pageText =
    await page.evaluate(() =>
      document.body.innerText
    );

  const hoursMatch =
    pageText.match(
      /Total \(hrs\)\s+([0-9.]+)/
    );

  const breakMatch =
  pageText.match(
    /Select how many break hours you took\s+([0-9.]+)/
  );

  const travelMatch =
    pageText.match(
      /Travel Hours\s+([0-9.]+)/
    );

  const mileageMatch =
    pageText.match(
      /Mileage\s+([0-9.]+)/
    );

  event.ndowResults.push({

  customerId:
    instructor.customerId,

  name:
    instructor.name,

  hours:
    hoursMatch
      ? Number(
          hoursMatch[1]
        )
      : 0,

  breakHours:
    breakMatch
      ? Number(
          breakMatch[1]
        )
      : 0,

    travelHours:
      travelMatch
        ? Number(
            travelMatch[1]
          )
        : 0,

    mileage:
      mileageMatch
        ? Number(
            mileageMatch[1]
          )
        : 0

  });

  console.log(
    'NDOW RESULTS:',
    event.id,
    instructor.name,
    event.ndowResults[
      event.ndowResults.length - 1
    ]
  );

}catch(err){

  console.log(
    'RESULTS PAGE FAILED:',
    resultsUrl
  );

  console.log(err);

}

}

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
