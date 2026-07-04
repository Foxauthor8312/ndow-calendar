/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-update.cjs

 Description : Event roster update utility.

 Purpose:

    Reads events.json, identifies events that require roster maintenance,
    and prepares the processing queue.

    Version 0.2 establishes the complete processing loop but does not
    yet scrape roster data.

 Module Ver. : 0.2.0
 Build       : 2026.07.04.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const EVENTS_FILE =
    path.join(__dirname, 'events.json');

const LOOKBACK_DAYS = 7;

(async function () {

    //----------------------------------------------------------------------
    // Supabase
    //----------------------------------------------------------------------

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } =
        await supabase
            .from('volunteer_hours')
            .select('id')
            .limit(1);

    if (error)
        throw error;

    console.log('SUPABASE CONNECTED');

    //----------------------------------------------------------------------
    // Browser
    //----------------------------------------------------------------------

    const browser =
        await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

    const page =
        await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', req => {

        const type = req.resourceType();

        if (
            type === 'image' ||
            type === 'font' ||
            type === 'stylesheet' ||
            type === 'media'
        ) {

            req.abort();

        } else {

            req.continue();

        }

    });

    //----------------------------------------------------------------------
    // Restore Session
    //----------------------------------------------------------------------

    if (fs.existsSync('session.json')) {

        const cookies =
            JSON.parse(
                fs.readFileSync('session.json')
            );

        await page.setCookie(...cookies);

    }

    console.log('Opening NDOW...');

    await page.goto(
        'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events',
        {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        }
    );

    await page.waitForSelector('body');

    //----------------------------------------------------------------------
    // Login
    //----------------------------------------------------------------------

    if (await page.$('input[type="password"]')) {

        console.log('Login required...');

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
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

    }

    const cookies =
        await page.cookies();

    fs.writeFileSync(
        'session.json',
        JSON.stringify(cookies, null, 2)
    );

    console.log('Session ready.');
    console.log('');

    //----------------------------------------------------------------------
    // Load Events
    //----------------------------------------------------------------------

    const raw =
        fs.readFileSync(EVENTS_FILE, 'utf8');

    const data =
        JSON.parse(raw);

    const events =
        data.events || [];

    console.log(
        `Calendar Updated : ${data.lastUpdated}`
    );

    console.log(
        `Events Loaded    : ${events.length}`
    );

    console.log('');

    //----------------------------------------------------------------------
    // Build Queue
    //----------------------------------------------------------------------

    const today =
        new Date();

    today.setHours(0,0,0,0);

    const earliest =
        new Date(today);

    earliest.setDate(
        earliest.getDate() - LOOKBACK_DAYS
    );

    const queue =
        events.filter(event => {

            const eventDate =
                new Date(event.date);

            return eventDate >= earliest;

        });

    console.log(
        `Events To Process : ${queue.length}`
    );

    console.log('');

    //----------------------------------------------------------------------
    // Process Queue
    //----------------------------------------------------------------------

    for (const event of queue) {

        const rosterUrl =
            `https://nevada.events.licensing.app/dashboard/em/event_rosters/${event.id}`;

        console.log('------------------------------------------------');

        console.log(event.id);

        console.log(event.title);

        console.log(event.date);

        console.log(event.status);

        console.log(rosterUrl);

        console.log('');

        //
        // Version 0.3
        //
        // await page.goto(rosterUrl);
        //

    }

    console.log('Completed.');

    await browser.close();

})().catch(err => {

    console.error(err);

    process.exit(1);

});
