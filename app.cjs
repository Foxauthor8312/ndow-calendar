const puppeteer =
  require('puppeteer');

const fs =
  require('fs');

const { createClient } =
  require('@supabase/supabase-js');

(async function () {

  const supabase =
    createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

  const { data, error } =
    await supabase
      .from('volunteer_hours')
      .select('id')
      .limit(1);

  if(error){

    throw error;

  }

  console.log(
    'SUPABASE CONNECTED'
  );

  const browser =
    await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

  const DEBUG = false;

// Parse daily sections only when NDOW exposes multiple dated entries.
// If the page does not clearly provide each date's values, return [] so the
// scraper falls back to its existing single-summary behavior.
function parseNdowDailyEntries(pageText, fallbackYear) {
  const lines = String(pageText || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const monthDate = /^(?:Date\s*:?\s*)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:,?\s+(\d{4}))?$/i;
  const numericDate = /^(?:Date\s*:?\s*)?(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/i;
  const monthIndex = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

  const parseDate = line => {
    let match = line.match(monthDate);
    if (match) {
      const month = monthIndex[match[1].slice(0, 3).toLowerCase()];
      const year = Number(match[3] || fallbackYear);
      return year + '-' + String(month).padStart(2, '0') + '-' + String(Number(match[2])).padStart(2, '0');
    }
    match = line.match(numericDate);
    if (match) {
      return match[3] + '-' + String(Number(match[1])).padStart(2, '0') + '-' + String(Number(match[2])).padStart(2, '0');
    }
    return null;
  };

  const dateLines = [];
  lines.forEach((line, index) => {
    const eventDate = parseDate(line);
    if (eventDate) dateLines.push({ index, eventDate });
  });

  const summaryStart = lines.findIndex(line => /^(?:Event Working Hours|Summary|Totals?)\b/i.test(line));
  const datedLines = dateLines.filter(item => summaryStart < 0 || item.index < summaryStart);
  if (datedLines.length < 2) return [];

  const readNumber = (section, pattern) => {
    const match = section.match(pattern);
    return match ? Number(match[1]) : null;
  };

  const entries = [];
  for (let i = 0; i < datedLines.length; i++) {
    const start = datedLines[i].index;
    const end = i + 1 < datedLines.length
      ? datedLines[i + 1].index
      : (summaryStart >= 0 ? summaryStart : lines.length);
    const section = lines.slice(start, end).join('\n');
    const hours = readNumber(section, /Total\s*\(hrs\)\s*:?\s*([0-9]+(?:\.[0-9]+)?)/i);
    const breakHours = readNumber(section, /Select how many break hours you took\s*:?\s*([0-9]+(?:\.[0-9]+)?)/i);
    const travelHours = readNumber(section, /Travel Hours\s*:?\s*([0-9]+(?:\.[0-9]+)?)/i);
    const mileage = readNumber(section, /Mileage\s*:?\s*([0-9]+(?:\.[0-9]+)?)/i);

    if (hours === null) return [];
    entries.push({
      eventDate: datedLines[i].eventDate,
      hours,
      breakHours: breakHours ?? 0,
      travelHours: travelHours ?? 0,
      mileage: mileage ?? 0
    });
  }
  return entries;
}

  
  const page = await browser.newPage();

    await page.setRequestInterception(true);

  page.on('request', req => {

    const type =
      req.resourceType();

if (
  type === 'image' ||
  type === 'font' ||
  type === 'stylesheet' ||
  type === 'media'
){

  req.abort();

}else{

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
      waitUntil:'domcontentloaded',
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
    waitUntil:'domcontentloaded',
    timeout:60000
  }
);

const details =
  await page.evaluate(() => {

function extractDtValue(label){

  const normalize = value =>
    value
      .replace(/:$/, '')
      .trim()
      .toLowerCase();

  const dt =
    [...document.querySelectorAll('dt')]
      .find(el =>
        normalize(el.textContent) ===
        normalize(label)
      );

  if(!dt){
    return '';
  }

  const dd =
    dt.nextElementSibling;

  return dd
    ? dd.textContent.trim()
    : '';

}
    
 return {

  status:
    extractDtValue('Event Status'),

  program:
    extractDtValue('Program'),

  eventName:
    extractDtValue('Event Name'),

  location:
    extractDtValue('Location'),

  dateTime:
    extractDtValue('Date & Times'),

  about:
    extractDtValue('About this Event')

};

  });

event.program =
  details.program;

 event.status =
  details.status ||
  'Registration Open';

// Events denied activation never became active. Exclude them before
// instructor/results scraping so they cannot enter all-events.txt/events.json
// or create/update volunteer-hour records.
if (
  String(event.status || '')
    .trim()
    .toLowerCase() === 'activation denied'
) {
  console.log(
    'SKIPPING ACTIVATION-DENIED EVENT:',
    event.id,
    event.title
  );
  continue;
}

if(details.eventName){
  event.title =
    details.eventName;
}
// Preserve the richer location extracted from the event card.
// The detail page currently only returns the first line of
// the location, which removes the city and ZIP.

if(
  details.location &&
  !event.location
){
  event.location =
    details.location;
}

if(details.dateTime){

  const dateTime =
    details.dateTime.trim();

  event.time =
    dateTime;

  if(!event.date){

    const dateMatch =
      dateTime.match(
        /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/
      );

    if(dateMatch){

      event.date =
        dateMatch[1];

    }

  }

}

if(details.about){
  event.description =
    details.about;
}

  try {

    await page.goto(
      event.instructorUrl,
      {
        waitUntil:'domcontentloaded',
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

const hasPrimaryInstructor =
  Array.isArray(instructorData) &&
  instructorData.some(instructor =>
    String(instructor.role || '')
      .trim()
      .toUpperCase() === 'PRIMARY' &&
    String(instructor.customerId || '').trim() !== ''
  );

if (hasPrimaryInstructor) {
  // Accept the NDOW roster as authoritative only when it contains a
  // primary instructor. Replacing the full list also removes assistants
  // who are no longer assigned to this event.
  event.instructors = instructorData;
} else {
  // Every valid NDOW event must have a primary. If the roster is empty,
  // incomplete, or unreadable, keep the instructor captured from the event
  // card rather than accidentally clearing the assignment.
  console.warn(
    'INSTRUCTOR ROSTER NOT RECONCILED — PRIMARY INSTRUCTOR NOT VERIFIED:',
    event.id,
    event.title
  );
}

event.ndowResults = [];

console.log(
  'Instructor count:',
  instructorData.length
);

for(const instructor of instructorData){

const resultsUrl =

`https://nevada.events.licensing.app/dashboard/em/assigned_events/${event.id}/instructor_results/${instructor.customerId}`;

if(DEBUG){

  console.log(
    'EVENT ID:',
    event.id
  );

}


if(DEBUG){

  console.log(
  'CUSTOMER ID:',
  instructor.customerId
);

}

if(DEBUG){
  
console.log(
  'TEST RESULTS URL:',
  resultsUrl
);
}  

try{

  await page.goto(
    resultsUrl,
    {
      waitUntil:'domcontentloaded',
      timeout:60000
    }
  );

  const pageText =
    await page.evaluate(() =>
      document.body.innerText
    );

  const hoursMatch = pageText.match(/Total \(hrs\)\s+([0-9.]+)/);
  const breakMatch = pageText.match(/Select how many break hours you took\s+([0-9.]+)/);
  const travelMatch = pageText.match(/Travel Hours\s+([0-9.]+)/);
  const mileageMatch = pageText.match(/Mileage\s+([0-9.]+)/);

  const fallbackYear =
    String(event.date || '').match(/\b(20\d{2})\b/)?.[1] ||
    String(event.time || '').match(/\b(20\d{2})\b/)?.[1] ||
    String(new Date().getFullYear());

  const dailyEntries = parseNdowDailyEntries(pageText, fallbackYear);

  event.ndowResults.push({
    customerId: instructor.customerId,
    name: instructor.name,
    hours: hoursMatch ? Number(hoursMatch[1]) : 0,
    breakHours: breakMatch ? Number(breakMatch[1]) : 0,
    travelHours: travelMatch ? Number(travelMatch[1]) : 0,
    mileage: mileageMatch ? Number(mileageMatch[1]) : 0,
    dailyEntries
  });

  if (!hoursMatch && !breakMatch && !travelMatch && !mileageMatch) {
    console.warn('NDOW result fields missing; no ndow_hours rows written:', event.id, instructor.customerId);
    continue;
  }

  const rowsToSave = dailyEntries.length
    ? dailyEntries
    : [{
        eventDate: event.date,
        hours: Number(hoursMatch?.[1] || 0),
        breakHours: Number(breakMatch?.[1] || 0),
        travelHours: Number(travelMatch?.[1] || 0),
        mileage: Number(mileageMatch?.[1] || 0)
      }];

  for (const daily of rowsToSave) {
    const { error: upsertError } = await supabase
      .from('ndow_hours')
      .upsert({
        event_id: event.id,
        ndow_customer_id: instructor.customerId,
        event_date: daily.eventDate,
        event_name: event.title,
        program: event.program,
        location: event.location,
        volunteer_name: instructor.name,
        volunteer_hours: daily.hours,
        break_minutes: daily.breakHours * 60,
        travel_hours: daily.travelHours,
        mileage: daily.mileage,
        event_url: event.url,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'event_id,ndow_customer_id,event_date'
      });

    if (upsertError) {
      console.error('NDOW HOURS UPSERT FAILED:', event.id, instructor.customerId, daily.eventDate, upsertError);
    } else {
      console.log('NDOW HOURS SAVED:', event.id, instructor.customerId, daily.eventDate, daily.hours, daily.travelHours, daily.mileage);
    }
  }

  console.log('NDOW RESULTS:', event.id, instructor.name, event.ndowResults[event.ndowResults.length - 1]);

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

  if(DEBUG){
    
  console.log(
    'Instructor enrichment complete.'
  );
  }

  await browser.close();

  process.exit(0);

})();
