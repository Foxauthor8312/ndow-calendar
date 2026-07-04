/*
==============================================================================
 NDOW Volunteer Portal
------------------------------------------------------------------------------
 Module      : roster-repository.cjs
 Description : Event roster database repository.
------------------------------------------------------------------------------
 Purpose:

    Synchronizes scraped event rosters with the operational database.

 Responsibilities

    • Compare roster hash
    • Update roster cache
    • Update events table
    • Update workflow

 Module Ver. : 1.0.0
 Build       : 2026.07.04.001

 Developer   : Barry Mattison
==============================================================================
*/

'use strict';

const crypto = require('crypto');

module.exports = async function saveRoster(
    supabase,
    event,
    students
) {

    //----------------------------------------------------------------------
    // Normalize roster for hashing
    //----------------------------------------------------------------------

    const normalized =
        students
            .map(student => ({

                customer_id:
                    student.customer_id,

                student_name:
                    student.student_name,

                student_email:
                    student.student_email,

                registration_status:
                    student.registration_status

            }))
            .sort((a, b) =>
                a.customer_id - b.customer_id
            );

    //----------------------------------------------------------------------
    // Generate roster hash
    //----------------------------------------------------------------------

    const rosterHash =
        crypto
            .createHash('sha256')
            .update(
                JSON.stringify(normalized)
            )
            .digest('hex');

    //----------------------------------------------------------------------
    // Check current hash
    //----------------------------------------------------------------------

    const {
        data: currentEvent,
        error: eventError
    } =
        await supabase
            .from('events')
            .select(
                'roster_hash'
            )
            .eq(
                'event_id',
                event.id
            )
            .single();

    if (eventError)
        throw eventError;

    //----------------------------------------------------------------------
    // No changes
    //----------------------------------------------------------------------

    if (
        currentEvent &&
        currentEvent.roster_hash === rosterHash
    ) {

        console.log(
            'Roster unchanged.'
        );

        await supabase
            .from('events')
            .update({

                roster_last_checked:
                    new Date()

            })
            .eq(
                'event_id',
                event.id
            );

        return;

    }

    console.log(
        'Roster changed.'
    );

    //----------------------------------------------------------------------
    // Delete previous roster
    //----------------------------------------------------------------------

    await supabase
        .from('event_rosters')
        .delete()
        .eq(
            'event_id',
            event.id
        );

    //----------------------------------------------------------------------
    // Insert new roster
    //----------------------------------------------------------------------

    const now =
        new Date();

    const rows =
        students.map(student => ({

            event_id:
                event.id,

            registration_id:
                student.registration_id,

            customer_id:
                student.customer_id,

            student_name:
                student.student_name,

            student_email:
                student.student_email,

            registration_status:
                student.registration_status,

            registered_at:
                now,

            last_scraped:
                now

        }));

    if (rows.length) {

        const {
            error: insertError
        } =
            await supabase
                .from('event_rosters')
                .insert(rows);

        if (insertError)
            throw insertError;

    }

    //----------------------------------------------------------------------
    // Update event
    //----------------------------------------------------------------------

    const {
        error: updateError
    } =
        await supabase
            .from('events')
            .update({

                roster_hash:
                    rosterHash,

                roster_student_count:
                    rows.length,

                roster_last_checked:
                    now,

                roster_last_updated:
                    now

            })
            .eq(
                'event_id',
                event.id
            );

    if (updateError)
        throw updateError;

    //----------------------------------------------------------------------
    // Update workflow
    //----------------------------------------------------------------------

    await supabase
        .from('event_workflow')
        .update({

            workflow_stage:
                'ROSTER_READY'

        })
        .eq(
            'event_id',
            event.id
        );

    console.log(
        `Saved ${rows.length} students.`
    );

};
