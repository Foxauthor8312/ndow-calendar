/*
==============================================================================
 NDOW Volunteer Portal
 Review Service
------------------------------------------------------------------------------
 File        : review-service.js

 Purpose

    Creates and manages post-event surveys.

 Responsibilities

    • Create survey record
    • Generate secure review token
    • Build survey URL
    • Render survey email

==============================================================================
*/

const crypto =
    require('crypto');

const renderSurveyTemplate =
    require('../templates/survey-template');

async function createSurveyInvitation({

    supabase,

    communicationId,

    event,

    recipient

}){

    //--------------------------------------------------
    // Generate secure review token
    //--------------------------------------------------

    const reviewToken =
        crypto.randomUUID();

    //--------------------------------------------------
    // Create survey record
    //--------------------------------------------------

    const { error } =

        await supabase

            .from('event_reviews')

            .insert({

                event_id:
                    event.id,

                ndow_customer_id:
                    recipient.customer_id,

                recipient_name:
                    recipient.student_name,

                recipient_email:
                    recipient.student_email,

                communication_id:
                    communicationId,

                review_token:
                    reviewToken,

                status:
                    'Sent',

                sent_at:
                    new Date()

            });

    if(error){

        throw error;

    }

    //--------------------------------------------------
    // Build survey URL
    //--------------------------------------------------

    const surveyUrl =

        `${process.env.PUBLIC_URL}/survey/${reviewToken}`;

    //--------------------------------------------------
    // Build email
    //--------------------------------------------------

    const html =

        renderSurveyTemplate({

            eventTitle:
                event.title,

            surveyUrl

        });

    return {

        reviewToken,

        surveyUrl,

        html

    };

}

module.exports = {

    createSurveyInvitation

};
