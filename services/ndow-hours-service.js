'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');

async function getVolunteerHours(eventId, customerId) {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  if (fs.existsSync('session.json')) {

    const cookies = JSON.parse(
      fs.readFileSync('session.json')
    );

    await page.setCookie(...cookies);

  }

  const resultsUrl =
    `https://nevada.events.licensing.app/dashboard/em/assigned_events/${eventId}/instructor_results/${customerId}`;

  await page.goto(resultsUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  const pageText =
    await page.evaluate(() =>
      document.body.innerText
    );

  await browser.close();

  const hoursMatch =
    pageText.match(/Total \(hrs\)\s+([0-9.]+)/);

  const breakMatch =
    pageText.match(/Select how many break hours you took\s+([0-9.]+)/);

  const travelMatch =
    pageText.match(/Travel Hours\s+([0-9.]+)/);

  const mileageMatch =
    pageText.match(/Mileage\s+([0-9.]+)/);

  return {

    hours:
      hoursMatch ? Number(hoursMatch[1]) : 0,

    breakHours:
      breakMatch ? Number(breakMatch[1]) : 0,

    travelHours:
      travelMatch ? Number(travelMatch[1]) : 0,

    mileage:
      mileageMatch ? Number(mileageMatch[1]) : 0

  };

}

module.exports = {
  getVolunteerHours
};
