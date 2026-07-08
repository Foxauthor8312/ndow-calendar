/*
==========================================================
 NDOW Volunteer Portal
 Review Module
==========================================================
*/

window.loadReview =
async function(){

    if(!window.currentCommunicationEvent){
        return;
    }

    const event =
        window.currentCommunicationEvent;

    document.getElementById(
        'communicationsContent'
    ).innerHTML = `

        <div id="reviewContainer">

            Loading Review...

        </div>

    `;

    renderReview(event);

};

function renderReview(event){

    document.getElementById(
        'reviewContainer'
    ).innerHTML = `

        <h2 style="margin-top:0;">
            ⭐ Review
        </h2>

        <p style="
            color:#6b7280;
            margin-bottom:24px;
        ">
            Send a thank-you email and invite
            attendees to submit a class review.
        </p>

        <div style="
            background:#f8fafc;
            border:1px solid #dbe3ec;
            border-radius:8px;
            padding:18px;
            margin-bottom:18px;
        ">

            <strong>Recipients</strong>

            <div style="margin-top:8px;">

                Registered Students
                (${selectedRecipients.length})

            </div>

        </div>

        <div style="margin-bottom:18px;">

            <strong>Subject</strong>

            <input
                id="reviewSubject"
                class="admin-input"
                value="Thank You for Attending ${event.title}"
            >

        </div>

        <div style="margin-bottom:18px;">

            <strong>Message</strong>

            <textarea
                id="reviewMessage"
                class="admin-input"
                style="height:220px;"
            >Thank you for attending "${event.title}."

We appreciate your participation and hope you enjoyed the class.

Please take a few moments to complete our short class review.

[Jotform Review Link]

Thank you,

Nevada Department of Wildlife</textarea>

        </div>

        <div style="
            display:flex;
            gap:10px;
        ">

            <button
                onclick="previewReview()"
            >
                Preview
            </button>

            <button
                onclick="sendReview()"
            >
                Send Review
            </button>

        </div>

    `;

}

window.previewReview =
function(){

    alert(
        'Review Preview coming next.'
    );

};

window.sendReview =
function(){

    alert(
        'Review Send coming next.'
    );

};
