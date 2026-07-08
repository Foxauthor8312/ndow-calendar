/*
==========================================================
 NDOW Volunteer Portal
 Review Module
==========================================================
*/

window.loadReview = async function(){

    if(!window.currentCommunicationEvent){
        return;
    }

    currentEvent =
        window.currentCommunicationEvent;

    roster =
        await loadEventRoster(
            currentEvent.id
        );

    selectedRecipients =
        [...roster];

    renderCommunicationModal({

        mode: 'review',

        title: 'Review',

        subject:
            `Thank You for Attending ${currentEvent.title}`,

        message:
`Thank you for attending "${currentEvent.title}."

We appreciate your participation and hope you enjoyed the class.

Your feedback helps us improve future programs.

Please take a few moments to complete our review using the link below.

[Jotform Link]

Thank you,

Nevada Department of Wildlife`,

        buttonText:
            'Send Review'

    });

};
