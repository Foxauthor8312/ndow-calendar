/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-scraper.cjs
 Description : Extract student roster from an NDOW event.
------------------------------------------------------------------------------
 Purpose:

    Opens an NDOW roster page and extracts all registered students.

 Responsibilities

    • Open roster page
    • Expand student cards
    • Extract registration information
    • Remove duplicate students
    • Return normalized roster

 Module Ver. : 1.1.0
 Build       : 2026.07.04.002

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

module.exports = async function scrapeRoster(
    page,
    eventId
) {

    //----------------------------------------------------------------------
    // Open roster page
    //----------------------------------------------------------------------

    const rosterUrl =
        `https://nevada.events.licensing.app/dashboard/em/event_rosters/${eventId}`;

    console.log(
        `Opening roster ${eventId}...`
    );

    await page.goto(
        rosterUrl,
        {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        }
    );

    await page.waitForSelector('body');

    //----------------------------------------------------------------------
    // Expand all collapsed student cards
    //----------------------------------------------------------------------

    await page.evaluate(() => {

        document
            .querySelectorAll('.card-title.collapsed')
            .forEach(card => card.click());

    });

    await new Promise(resolve =>
        setTimeout(resolve, 1000)
    );

    //----------------------------------------------------------------------
    // Extract roster
    //----------------------------------------------------------------------

    const students =
        await page.evaluate(eventId => {

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
                    card.querySelector(
                        '.card-title'
                    );

                const studentName =
                    title
                        ? title.textContent.trim()
                        : '';

                if (!studentName)
                    return;

                //----------------------------------------------------------
                // Card Text
                //----------------------------------------------------------

                const text =
                    card.innerText;

                //----------------------------------------------------------
                // Email
                //----------------------------------------------------------

                let studentEmail = '';

                const emailMatch =
                    text.match(
                        /Email Address:\s*([^\s]+)/i
                    );

                if (emailMatch) {

                    studentEmail =
                        emailMatch[1].trim();

                }

                //----------------------------------------------------------
                // Customer ID
                //----------------------------------------------------------

                let customerId = null;

                const emailButton =
                    card.querySelector(
                        'a[href*="messages?student="]'
                    );

                if (emailButton) {

                    const match =
                        emailButton.href.match(
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

                const moveButton =
                    card.querySelector(
                        'a[href*="/registrations/"]'
                    );

                if (moveButton) {

                    const match =
                        moveButton.href.match(
                            /registrations\/(\d+)/
                        );

                    if (match) {

                        registrationId =
                            Number(match[1]);

                    }

                }

                //----------------------------------------------------------
                // Add student
                //----------------------------------------------------------

                roster.push({

                    event_id:
                        eventId,

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

    //----------------------------------------------------------------------
    // Remove duplicate students
    //
    // Customer ID uniquely identifies a person in NDOW.
    // Email addresses are NOT unique because family members
    // may share a common email address.
    //----------------------------------------------------------------------

    const uniqueStudents =
        Array.from(

            new Map(

                students.map(student => [

                    student.customer_id,

                    student

                ])

            ).values()

        );

    //----------------------------------------------------------------------
    // Logging
    //----------------------------------------------------------------------

    console.log(
        `Students found: ${uniqueStudents.length}`
    );

    return uniqueStudents;

};
