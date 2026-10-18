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

        // Preserve operational roster fields when refreshing the
        // published event catalog. Roster synchronization owns these
        // values; the catalog feed must not reset them.
        const {
            data: existingEvent,
            error: existingEventError
        } = await supabase
            .from('events')
            .select(
                'registered_count,roster_student_count,roster_hash,roster_last_checked,roster_last_updated'
            )
            .eq('event_id', event.id)
            .maybeSingle();

        if (existingEventError) {

            throw existingEventError;

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

            // Keep the last known roster values until the scheduled
            // roster sync refreshes them. New events remain uncounted.
            registered_count:
                existingEvent?.registered_count ?? null,

            roster_student_count:
                existingEvent?.roster_student_count ?? null,

            roster_hash:
                existingEvent?.roster_hash ?? null,

            roster_last_checked:
                existingEvent?.roster_last_checked ?? null,

            roster_last_updated:
                existingEvent?.roster_last_updated ?? null,

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
