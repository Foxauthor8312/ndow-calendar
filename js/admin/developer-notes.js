/*
==============================================================================
 NDOW Volunteer Portal
 Developer Notes
------------------------------------------------------------------------------
 Module      : developer-notes.js
 Layer       : Admin Workspace

 Purpose:
    Internal development notes for Superusers.

 Responsibilities:
    • Display notes
    • Add notes
    • Mark fixed
    • Delete notes

==============================================================================
*/

'use strict';

/*==============================================================================
    OPEN
==============================================================================*/

window.openDeveloperNotes =
function(){

    openModal(
        'developerNotesModal'
    );

    renderDeveloperNotes();

};


/*==============================================================================
    RENDER
==============================================================================*/

async function renderDeveloperNotes(){

    const body =
        document.getElementById(
            'developerNotesBody'
        );

    body.innerHTML = `

<div style="
    font-size:28px;
    font-weight:700;
    margin-bottom:24px;
">
    DEVELOPER NOTES
</div>

<div style="
    display:flex;
    gap:12px;
    margin-bottom:20px;
">

    <textarea

        id="developerNoteText"

        rows="3"

        placeholder="Describe the issue..."

        style="
            flex:1;
            padding:12px;
            border-radius:8px;
            border:1px solid #d1d5db;
            resize:vertical;
        "

    ></textarea>

    <button

        onclick="saveDeveloperNote()"

        style="
            background:#2563eb;
            color:white;
            border:none;
            border-radius:8px;
            padding:12px 18px;
            cursor:pointer;
            font-weight:600;
            height:48px;
        "

    >

        Add Note

    </button>

</div>

<div
    id="developerNotesList"
>

    Loading...

</div>

`;

    loadDeveloperNotes();

}


/*==============================================================================
    LOAD
==============================================================================*/

async function loadDeveloperNotes(){

    document.getElementById(
        'developerNotesList'
    ).innerHTML = `

<div style="
    color:#6b7280;
">

No developer notes yet.

</div>

`;

}


/*==============================================================================
    SAVE
==============================================================================*/

async function saveDeveloperNote(){

    alert(
        'Database connection coming next.'
    );

}
