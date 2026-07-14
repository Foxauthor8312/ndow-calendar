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

window.openDeveloperNotes = function(){

  const modal =
    document.getElementById(
      'developerNotes'
    );

  modal.classList.remove(
    'hidden'
  );

  modal.style.display =
    'flex';

  renderDeveloperNotes();

};


/*==============================================================================
    CLOSE
==============================================================================*/

window.closeDeveloperNotes = function(){

  const modal =
    document.getElementById(
      'developerNotes'
    );

  modal.classList.add(
    'hidden'
  );

  modal.style.display =
    'none';

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
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:24px;
">

    <div style="
        font-size:28px;
        font-weight:700;
    ">
        DEVELOPER NOTES
    </div>

    <button
        onclick="closeDeveloperNotes()"
        style="
            background:#dc2626;
            color:white;
            border:none;
            border-radius:8px;
            padding:10px 16px;
            cursor:pointer;
            font-weight:600;
        "
    >
        Close
    </button>

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

window.loadDeveloperNotes =
async function(){

    document.getElementById(
        'developerNotesList'
    ).innerHTML = `

<div style="
    color:#6b7280;
    font-size:15px;
">

No developer notes yet.

</div>

`;

}


/*==============================================================================
    SAVE
==============================================================================*/

window.saveDeveloperNote =
async function(){

  const textarea =
    document.getElementById(
      'developerNoteText'
    );

  const note =
    textarea.value.trim();

  if(!note){

    alert(
      'Please enter a note.'
    );

    return;

  }

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(

        'https://ndow-calendar-server.onrender.com/api/developer-notes',

        {

          method:'POST',

          headers:{

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body:JSON.stringify({

            note

          })

        }

      );

    const result =
      await response.json();

    if(!response.ok){

      throw new Error(

        result.error ||

        'Unable to save note.'

      );

    }

    textarea.value = '';

    loadDeveloperNotes();

  }

  catch(err){

    alert(
      err.message
    );

  }

};
