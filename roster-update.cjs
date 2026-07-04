/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-update.cjs
 Description : Event roster update controller.
------------------------------------------------------------------------------
 Purpose:

    Coordinates the roster synchronization process.

 Responsibilities:

    • Login to NDOW
    • Load events.json
    • Synchronize events table
    • Load processing queue from database
    • Scrape event rosters
    • Save roster data

 Module Ver. : 1.0.0
 Build       : 2026.07.04.002

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

const fs = require('fs');
const path = require('path');

const createSession =
    require('./ndow-session.cjs');

const syncEvents =
    require('./ndow-scraper/event-repository.cjs');

const scrapeRoster =
    require('./ndow-scraper/roster-scraper.cjs');

const saveRoster =
    require('./ndow-scraper/roster-repository.cjs');

const EVENTS_FILE =
    path.join(
        __dirname,
        'events.json'
    );

(async function () {

    //----------------------------------------------------------------------
    // Create authenticated session
    //----------------------------------------------------------------------

    const {
        browser,
        page,
        supabase
    } =
        await createSession();

    //----------------------------------------------------------------------
    // Load events.json
    //----------------------------------------------------------------------

    console.log('');
    console.log('Loading events.json...');

    const raw =
        fs.readFileSync(
            EVENTS_FILE,
            'utf8'
        );

    const data =
        JSON.parse(raw);

    const events =
        data.events || [];

    //----------------------------------------------------------------------
    // Synchronize events table
    //----------------------------------------------------------------------

    await syncEvents(
        supabase,
        events
    );

    console.log(
        `Events Loaded : ${events.length}`
    );

    console.log('');

    //----------------------------------------------------------------------
    // Load processing queue
    //----------------------------------------------------------------------

    console.log(
        'Loading events from database...'
    );

    const {
        data: queue,
        error: queueError
    } =
        await supabase
            .from('events')
            .select('*')
            .order(
                'event_date',
                {
                    ascending: true
                }
            );

    if (queueError) {

        throw queueError;

    }

    console.log(
        `Events To Process : ${queue.length}`
    );

    console.log('');

    //----------------------------------------------------------------------
    // Process events
    //----------------------------------------------------------------------

    for (const event of queue) {

        console.log(
            '--------------------------------------------------'
        );

        console.log(
            `${event.event_id} - ${event.title}`
        );

        console.log(
            '--------------------------------------------------'
        );

        const students =
            await scrapeRoster(
                page,
                event.event_id
            );

        console.table(
            students
        );

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
    console.log(
        'Roster update completed.'
    );
    console.log('');

})().catch(error => {

    console.error('');
    console.error(error);
    console.error('');

    process.exit(1);

});
