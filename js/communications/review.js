/*
==========================================================
 NDOW Volunteer Portal
 Review Module
==========================================================
*/

window.loadReview =
function(){

    document.getElementById(
        'communicationsContent'
    ).innerHTML = `

        <h2 style="margin-top:0;">
            ⭐ Review
        </h2>

        <p style="
            color:#6b7280;
            margin-bottom:20px;
        ">
            Send a thank-you message and request
            feedback from attendees.
        </p>

        <div id="reviewWorkspace">

            Loading...

        </div>

    `;

    renderReview();

};

function renderReview(){

    const div =
        document.getElementById(
            'reviewWorkspace'
        );

    div.innerHTML = `

        <div style="margin-bottom:18px;">

            <strong>Recipients</strong>

            <div style="
                margin-top:8px;
                padding:12px;
                border:1px solid #d1d5db;
                border-radius:8px;
                background:#fafafa;
            ">

                ☑ All Attendees

            </div>

        </div>

        <div style="margin-bottom:18px;">

            <strong>Subject</strong>

            <input
                type="text"
                style="
                    width:100%;
                    margin-top:6px;
                "
                value="Thank you for attending ${window.currentCommunicationEvent.title}"
            >

        </div>

        <div style="margin-bottom:18px;">

            <strong>Message</strong>

            <textarea
                style="
                    width:100%;
                    height:220px;
                    margin-top:6px;
                "
            >
Thank you for attending our class.

We appreciate your participation.

If you have a few moments, we'd appreciate your feedback.

[Jotform Link]

Thank you,

Nevada Department of Wildlife
            </textarea>

        </div>

        <button>

            Preview Review

        </button>

        <button>

            Send Review

        </button>

    `;

}
