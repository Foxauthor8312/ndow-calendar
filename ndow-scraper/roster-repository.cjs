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
    • Refresh roster cache
    • Update event statistics
    • Update workflow state

 Module Ver. : 1.1.0
 Build       : 2026.07.04.002

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
    // Read existing event
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
                event.event_id
            )
            .maybeSingle();

    if (eventError) {

        throw eventError;

    }

    //----------------------------------------------------------------------
    // No roster changes
    //----------------------------------------------------------------------

    if (
        currentEvent &&
        currentEvent.roster_hash === rosterHash
    ) {

        console.log(
            'Roster unchanged.'
        );

        const {
            error
        } =
            await supabase
                .from('events')
                .update({

                    roster_last_checked:
                        new Date()

                })
                .eq(
                    'event_id',
                    event.event_id
                );

        if (error) {

            throw error;

        }

        return;

    }

    console.log(
        'Roster changed.'
    );

    //----------------------------------------------------------------------
    // Delete existing roster
    //----------------------------------------------------------------------

    const {
        error: deleteError
    } =
        await supabase
            .from('event_rosters')
            .delete()
            .eq(
                'event_id',
                event.event_id
            );

    if (deleteError) {

        throw deleteError;

    }

    //----------------------------------------------------------------------
    // Build rows
    //----------------------------------------------------------------------

    const now =
        new Date();

    const rows =
        students.map(student => ({

            event_id:
                event.event_id,

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

    console.log(
        `Preparing to save ${rows.length} students.`
    );

    //----------------------------------------------------------------------
    // Insert roster
    //----------------------------------------------------------------------

    if (rows.length) {

        const {
            error: insertError
        } =
            await supabase
                .from('event_rosters')
                .insert(rows);

        if (insertError) {

            throw insertError;

        }

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

                registered_count:
                    rows.length,

                roster_student_count:
                    rows.length,

                roster_last_checked:
                    now,

                roster_last_updated:
                    now

            })
            .eq(
                'event_id',
                event.event_id
            );

    if (updateError) {

        throw updateError;

    }

    //----------------------------------------------------------------------
    // Update workflow (optional)
    //----------------------------------------------------------------------

    await supabase
        .from('event_workflow')
        .update({

            workflow_stage:
                'ROSTER_READY'

        })
        .eq(
            'event_id',
            event.event_id
        );

    console.log(
        `Saved ${rows.length} students.`
    );

};
