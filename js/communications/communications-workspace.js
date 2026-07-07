/*
==========================================================
 NDOW Volunteer Portal
 Communications Workspace
==========================================================
*/

window.openCommunicationsWorkspace =
function(event){

    const workspace =
        document.getElementById(
            'communicationsWorkspace'
        );

    const header =
        document.getElementById(
            'communicationsHeader'
        );

    const body =
        document.getElementById(
            'communicationsBody'
        );

    if(
        !workspace ||
        !header ||
        !body
    ){
        return;
    }

    // Hide Event Modal

    const modal =
        document.getElementById(
            'eventModal'
        );

    if(modal){

        modal.style.display =
            'none';

    }

    // Show Workspace

    workspace.style.display =
        'block';

    // Header

    header.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:18px 26px;
            background:#19304B;
            color:white;
        ">

            <div>

                <div style="
                    font-size:26px;
                    font-weight:700;
                ">
                    Communications
                </div>

                <div style="
                    opacity:.85;
                    margin-top:4px;
                    font-size:14px;
                ">
                    ${event.title}
                </div>

            </div>

            <button
                onclick="closeCommunicationsWorkspace()"
                style="
                    background:white;
                    color:#19304B;
                    border:none;
                    padding:8px 18px;
                    border-radius:6px;
                    cursor:pointer;
                    font-weight:600;
                "
            >

                Close

            </button>

        </div>

    `;

    body.innerHTML = `

        <div style="
            padding:28px;
            max-width:1200px;
            margin:auto;
        ">

            <div style="
                background:white;
                border:1px solid #ddd;
                border-radius:10px;
                padding:24px;
                margin-bottom:28px;
            ">

                <div style="
                    font-size:14px;
                    color:#666;
                ">
                    Event #${event.id}
                </div>

                <div style="
                    font-size:28px;
                    font-weight:700;
                    margin-top:4px;
                ">
                    ${event.title}
                </div>

                <div style="
                    color:#1d4f91;
                    font-weight:600;
                    margin-top:6px;
                ">
                    ${event.program || ''}
                </div>

                <div style="
                    margin-top:10px;
                    color:#555;
                ">
                    ${event.time || event.date}
                </div>

                <div style="
                    margin-top:6px;
                    color:#555;
                ">
                    ${event.location}
                </div>

            </div>

            <div id="communicationsCards"
                 style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(240px,1fr));
                    gap:18px;
                 ">
            </div>

        </div>

    `;

    const cards =
        document.getElementById(
            'communicationsCards'
        );

    addCommunicationCard(
        cards,
        "📧",
        "Compose Email",
        "Send reminders and messages.",
        () => {

            if(
                window.openEventCommunications
            ){

                window.openEventCommunications(
                    event
                );

            }else{

                alert(
                    "Compose module not connected yet."
                );

            }

        }
    );

    addCommunicationCard(
        cards,
        "📜",
        "History",
        "Coming Soon"
    );

    addCommunicationCard(
        cards,
        "📄",
        "Templates",
        "Coming Soon"
    );

    addCommunicationCard(
        cards,
        "✓",
        "Attendance",
        "Coming Soon"
    );

    addCommunicationCard(
        cards,
        "💬",
        "Thank You & Feedback",
        "Coming Soon"
    );

    addCommunicationCard(
        cards,
        "⚙",
        "Automation",
        "Coming Soon"
    );

};

window.closeCommunicationsWorkspace =
function(){

    document.getElementById(
        'communicationsWorkspace'
    ).style.display =
        'none';

};

function addCommunicationCard(

    parent,
    icon,
    title,
    description,
    clickHandler

){

    const card =
        document.createElement(
            'div'
        );

    card.style.cssText = `
        background:white;
        border:1px solid #ddd;
        border-radius:10px;
        padding:22px;
        cursor:pointer;
        transition:.2s;
    `;

    card.innerHTML = `
        <div style="
            font-size:34px;
        ">
            ${icon}
        </div>

        <div style="
            font-size:20px;
            font-weight:700;
            margin-top:14px;
        ">
            ${title}
        </div>

        <div style="
            color:#666;
            margin-top:8px;
        ">
            ${description}
        </div>
    `;

    if(clickHandler){

        card.onclick =
            clickHandler;

    }

    parent.appendChild(
        card
    );

}
