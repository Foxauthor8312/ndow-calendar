/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : ndow-session.cjs
 Description : Shared browser session and authentication module.

 Purpose:
   Creates an authenticated Puppeteer session for NDOW automation scripts.

 Used By:

     • app.cjs
     • roster-update.cjs
     • hours-update.cjs (future)

 Responsibilities:

     • Connect to Supabase
     • Launch browser
     • Create page
     • Optimize requests
     • Restore session cookies
     • Authenticate when required

 Returns:
 

     {
         browser,
         page,
         supabase
     }

 Module Ver. : 1.0.0
 Build       : 2026.07.03.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function createSession() {

    //
    // Connect to Supabase
    //

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
        .from('volunteer_hours')
        .select('id')
        .limit(1);

    if (error) {
        throw error;
    }

    console.log('SUPABASE CONNECTED');

    //
    // Launch browser
    //

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    //
    // Improve performance
    //

    await page.setRequestInterception(true);

    page.on('request', request => {

        const type = request.resourceType();

        if (
            type === 'image' ||
            type === 'font' ||
            type === 'stylesheet' ||
            type === 'media'
        ) {

            request.abort();

        } else {

            request.continue();

        }

    });

    //
    // Restore cookies
    //

    if (fs.existsSync('session.json')) {

        const cookies = JSON.parse(
            fs.readFileSync('session.json')
        );

        await page.setCookie(...cookies);

    }

    //
    // Open NDOW
    //

    console.log('Opening NDOW...');

    await page.goto(
        'https://nevada.events.licensing.app/dashboard/em/assigned_programs_events',
        {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        }
    );

    await page.waitForSelector('body');

    //
    // Login if necessary
    //

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

    //
    // Save cookies
    //

    const cookies = await page.cookies();

    fs.writeFileSync(
        'session.json',
        JSON.stringify(cookies, null, 2)
    );

    console.log('NDOW session ready.');

    return {
        browser,
        page,
        supabase
    };

}

module.exports = createSession;
