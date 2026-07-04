/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-scraper.cjs

 Description : Event roster scraper.

 Purpose:

    Opens an NDOW event roster page and extracts all registered students.

 Returns:

    [
        {
            event_id,
            registration_id,
            customer_id,
            student_name,
            student_email,
            registration_status
        }
    ]

 Module Ver. : 1.0.0
 Build       : 2026.07.04.001

 Developer   : Barry Mattison
==============================================================================
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

    const students = await page.evaluate((eventId) => {

        const roster = [];

        const cards = document.querySelectorAll(
            '.card.bg-white.mb-2.p-3.card-expand'
        );

        cards.forEach(card => {

            //
            // Student Name
            //

            const title =
                card.querySelector('.card-title');

            const studentName =
                title
                    ? title.textContent.trim()
                    : '';

            //
            // Email
            //

            let studentEmail = '';

            const body =
                card.innerText;

            const emailMatch =
                body.match(
                    /Email Address:\s*([^\s]+)/i
                );

            if (emailMatch) {

                studentEmail =
                    emailMatch[1].trim();

            }

            //
            // Customer ID
            //

            let customerId = null;

            const messageLink =
                card.querySelector(
                    'a[href*="messages?student="]'
                );

            if (messageLink) {

                const href =
                    messageLink.getAttribute('href');

                const match =
                    href.match(
                        /student=(\d+)/
                    );

                if (match) {

                    customerId =
                        Number(match[1]);

                }

            }

            //
            // Registration ID
            //

            let registrationId = null;

            const moveLink =
                card.querySelector(
                    'a[href*="/registrations/"]'
                );

            if (moveLink) {

                const href =
                    moveLink.getAttribute('href');

                const match =
                    href.match(
                        /registrations\/(\d+)/
                    );

                if (match) {

                    registrationId =
                        Number(match[1]);

                }

            }

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
