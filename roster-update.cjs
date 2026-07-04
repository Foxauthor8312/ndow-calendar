/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-update.cjs
 Description : Event roster update controller.
------------------------------------------------------------------------------
 Purpose:

    Synchronizes NDOW event rosters into the operational database.

 Responsibilities:

    • Login to NDOW
    • Synchronize events table
    • Build roster processing queue
    • Scrape student rosters
    • Save roster cache

 Module Ver. : 1.1.0
 Build       : 2026.07.04.003

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

const ROSTER_LOOKBACK_DAYS = 7;

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
    // Build processing queue
    //----------------------------------------------------------------------

    const earliest =
        new Date();

    earliest.setHours(
        0,
        0,
        0,
        0
    );

    earliest.setDate(
        earliest.getDate() -
        ROSTER_LOOKBACK_DAYS
    );

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
            .gte(
                'event_date',
                earliest
                    .toISOString()
                    .slice(0, 10)
            )
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

    let processed = 0;
    let failed = 0;

    for (const event of queue) {

        try {

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

            processed++;

        }

        catch (error) {

            failed++;

            console.error('');
            console.error(
                `FAILED EVENT ${event.event_id}`
            );
            console.error(
                event.title
            );
            console.error(error);
            console.error('');

        }

    }

    //----------------------------------------------------------------------
    // Cleanup
    //----------------------------------------------------------------------

    await browser.close();

    console.log('');
    console.log('----------------------------------------');
    console.log('Roster Synchronization Complete');
    console.log('----------------------------------------');
    console.log(
        `Processed : ${processed}`
    );
    console.log(
        `Failed    : ${failed}`
    );
    console.log('----------------------------------------');
    console.log('');

})().catch(error => {

    console.error('');
    console.error(error);
    console.error('');

    process.exit(1);

});
