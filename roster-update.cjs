/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-update.cjs
 Description : Event roster update controller.
------------------------------------------------------------------------------
 Purpose:

    Coordinates the roster update process.

    Responsibilities:

      • Login to NDOW
      • Load events.json
      • Build processing queue
      • Call roster scraper
      • (Future) Call repository
      • Log progress

 Module Ver. : 0.3.0
 Build       : 2026.07.04.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

const fs = require('fs');
const path = require('path');

const createSession = require('./ndow-session');
const scrapeRoster = require('./ndow-scraper/roster-scraper');
const saveRoster = require('./ndow-scraper/roster-repository');

const EVENTS_FILE = path.join(__dirname, 'events.json');
const LOOKBACK_DAYS = 7;

(async function () {

    //----------------------------------------------------------------------
    // Create authenticated session
    //----------------------------------------------------------------------

    const {
        browser,
        page,
        supabase
    } = await createSession();

    //----------------------------------------------------------------------
    // Load events.json
    //----------------------------------------------------------------------

    console.log('');
    console.log('Loading events.json...');

    const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
    const data = JSON.parse(raw);

    const events = data.events || [];

    console.log(`Events Loaded : ${events.length}`);
    console.log('');

    //----------------------------------------------------------------------
    // Build processing queue
    //----------------------------------------------------------------------

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const earliest = new Date(today);

    earliest.setDate(
        earliest.getDate() - LOOKBACK_DAYS
    );

    const queue = events.filter(event => {

        const eventDate = new Date(event.date);

        return eventDate >= earliest;

    });

    console.log(
        `Events To Process : ${queue.length}`
    );

    console.log('');

    //----------------------------------------------------------------------
    // Process Events
    //----------------------------------------------------------------------

    for (const event of queue) {

        console.log('--------------------------------------------------');
        console.log(`${event.id} - ${event.title}`);
        console.log('--------------------------------------------------');

    const students =
        await scrapeRoster(
            page,
            event.id
        );
    
    console.table(students);
    
    await saveRoster(
        supabase,
        event,
        students
    );
    
    console.log('');

    }

    //----------------------------------------------------------------------
    // Cleanup
    //----------------------------------------------------------------------

    await browser.close();

    console.log('');
    console.log('Roster update completed.');
    console.log('');

})().catch(error => {

    console.error('');
    console.error(error);
    console.error('');

    process.exit(1);

});
