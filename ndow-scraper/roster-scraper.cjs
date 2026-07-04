/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-scraper.cjs
 Description : Extract student roster from an NDOW event.
------------------------------------------------------------------------------
*/

'use strict';

module.exports = async function scrapeRoster(page, eventId) {

    const rosterUrl =
        `https://nevada.events.licensing.app/dashboard/em/event_rosters/${eventId}`;

    console.log(`Opening roster ${eventId}...`);

    await page.goto(
        rosterUrl,
        {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        }
    );

    await page.waitForSelector('body');

    //
    // Expand all collapsed student cards.
    //

    await page.evaluate(() => {

        document
            .querySelectorAll('.card-title.collapsed')
            .forEach(title => title.click());

    });

    await new Promise(resolve => setTimeout(resolve, 750));

    const students = await page.evaluate(eventId => {

        const roster = [];

        const cards =
            document.querySelectorAll(
                '.card.card-expand'
            );

        cards.forEach(card => {

            //----------------------------------------------------------
            // Student Name
            //----------------------------------------------------------

            const title =
                card.querySelector('.card-title');

            const studentName =
                title
                    ? title.textContent.trim()
                    : '';

            //----------------------------------------------------------
            // Entire Card Text
            //----------------------------------------------------------

            const text =
                card.innerText;

            //----------------------------------------------------------
            // Email
            //----------------------------------------------------------

            let studentEmail = '';

            const email =
                text.match(
                    /Email Address:\s*([^\s]+)/i
                );

            if (email) {

                studentEmail =
                    email[1].trim();

            }

            //----------------------------------------------------------
            // Customer ID
            //----------------------------------------------------------

            let customerId = null;

            const emailLink =
                card.querySelector(
                    'a[href*="messages?student="]'
                );

            if (emailLink) {

                const match =
                    emailLink.href.match(
                        /student=(\d+)/
                    );

                if (match) {

                    customerId =
                        Number(match[1]);

                }

            }

            //----------------------------------------------------------
            // Registration ID
            //----------------------------------------------------------

            let registrationId = null;

            const moveLink =
                card.querySelector(
                    'a[href*="/registrations/"]'
                );

            if (moveLink) {

                const match =
                    moveLink.href.match(
                        /registrations\/(\d+)/
                    );

                if (match) {

                    registrationId =
                        Number(match[1]);

                }

            }

            //----------------------------------------------------------
            // Ignore empty cards
            //----------------------------------------------------------

            if (!studentName)
                return;

            roster.push({

                event_id: eventId,

                registration_id:
                    registrationId,

                customer_id:
                    customerId,

                student_name:
                    studentName,

                student_email:
                    studentEmail,

                registration_status:
                    'Registered'

            });

        });

        return roster;

    }, eventId);

    console.log(
        `Students found: ${students.length}`
    );

    return students;

};
