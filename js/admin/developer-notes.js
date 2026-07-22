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

<div style="
    margin-bottom:16px;
">

    <label style="
        font-weight:600;
        cursor:pointer;
        color:#19304B;
    ">

        <input
            type="checkbox"
            id="showCompletedNotes"
            onchange="loadDeveloperNotes()"
        >

        Show Completed Notes

    </label>

</div>

<div
    id="developerNotesList"
>

    Loading...

</div>

`;

loadDeveloperNotes();


/*==============================================================================
    LOAD
==============================================================================*/

window.loadDeveloperNotes =
async function(){

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(

        'https://ndow-calendar-server.onrender.com/api/developer-notes',

        {

          headers:{

            Authorization:
              `Bearer ${token}`

          }

        }

      );

    const result =
      await response.json();

    if(!response.ok){

      throw new Error(

        result.error ||

        'Unable to load notes.'

      );

    }

    const notes =
      result.notes || [];

   const showCompleted =
  document.getElementById(
    'showCompletedNotes'
  )?.checked || false;

const filteredNotes =
  showCompleted
    ? notes
    : notes.filter(
        note => !note.fixed
      );

    const list =
      document.getElementById(
        'developerNotesList'
      );

   if(filteredNotes.length === 0){

      list.innerHTML = `

<div style="
  color:#6b7280;
">

No developer notes.

</div>

`;

      return;

    }

    list.innerHTML =

      filteredNotes.map(note => `

<div
  style="
    border:1px solid #d1d5db;
    border-radius:8px;
    padding:12px;
    margin-bottom:12px;
    background:${
      note.fixed
        ? '#f3f4f6'
        : '#ffffff'
    };
  "
>

  <label
    style="
      display:flex;
      align-items:flex-start;
      gap:10px;
    "
  >

    <input
  type="checkbox"

  ${note.fixed ? 'checked' : ''}

  onchange="
    toggleDeveloperNote(
      ${note.id},
      this.checked
    );
  "
>

    <div>

      <div style="
        font-weight:600;
        ${
          note.fixed
            ? 'text-decoration:line-through;color:#6b7280;'
            : ''
        }
      ">
        ${note.note}
      </div>

      <div style="
        margin-top:6px;
        font-size:12px;
        color:#6b7280;
      ">

        ${
          new Date(
            note.created_at
          ).toLocaleString()
        }

      </div>

    </div>

  </label>

</div>

`).join('');

  }

  catch(err){

    console.error(err);

    alert(
      err.message
    );

  }

};

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


/*==============================================================================
    TOGGLE FIXED
==============================================================================*/

window.toggleDeveloperNote =
async function(
  id,
  fixed
){

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(

        `https://ndow-calendar-server.onrender.com/api/developer-notes/${id}`,

        {

          method:'PUT',

          headers:{

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body:JSON.stringify({

            fixed

          })

        }

      );

    const result =
      await response.json();

    if(!response.ok){

      throw new Error(

        result.error ||

        'Unable to update note.'

      );

    }

    loadDeveloperNotes();

  }

  catch(err){

    alert(
      err.message
    );

  }

};
