/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : event-repository.cjs
 Description : Event catalog repository.
------------------------------------------------------------------------------
 Purpose:

    Synchronizes events.json with the operational events table.

 Responsibilities

    • Insert new events
    • Update existing events
    • Preserve operational fields
    • Link events to master addresses table

 Module Ver. : 1.1.0
 Build       : 2026.07.26.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

module.exports = async function syncEvents(
    supabase,
    events
) {

    console.log('');
    console.log('Synchronizing events table...');

    let updated = 0;

    for (const event of events) {

        // --------------------------------------------------
        // Locate matching address record
        // --------------------------------------------------

        let addressId = null;

        if (event.location) {

            const { data: address } =
                await supabase
                    .from('addresses')
                    .select('id')
                    .ilike(
                        'location_name',
                        event.location.trim()
                    )
                    .maybeSingle();

            if (address) {

                addressId =
                    address.id;

            }
            else {

                console.warn(
                    `Address not found: ${event.location}`
                );

            }

        }

        const row = {

            event_id:
                event.id,

            title:
                event.title || '',

            program:
                event.program || '',

            category:
                event.category || '',

            status:
                event.status || '',

            event_date:
                event.date || null,

            start_time:
                event.time || '',

            end_time:
                event.time || '',

            location:
                event.location || '',

            address_id:
                addressId,

            description:
                event.description || '',

            capacity:
                null,

            registered_count:
                null,

            waitlist_enabled:
                false,

            url:
                event.url || '',

            instructor_url:
                event.instructorUrl || '',

            last_scraped:
                new Date(),

            updated_at:
                new Date()

        };

        const { error } =
            await supabase
                .from('events')
                .upsert(
                    row,
                    {
                        onConflict:
                            'event_id'
                    }
                );

        if (error) {

            throw error;

        }

        updated++;

    }

    console.log(
        `Events synchronized: ${updated}`
    );

};
