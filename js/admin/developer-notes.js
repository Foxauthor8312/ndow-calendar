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

    <div
        style="
            display:flex;
            flex-direction:column;
            gap:10px;
            flex:1;
        "
    >

        <select
            id="developerNoteCategory"
            style="
                padding:10px;
                border:1px solid #d1d5db;
                border-radius:8px;
            "
        >

            <option value="BUG">🐞 Bug</option>
            <option value="UI_UX">🎨 UI / UX</option>
            <option value="ENHANCEMENT">✨ Enhancement</option>
            <option value="DOCUMENTATION">📚 Documentation</option>
            <option value="TECHNICAL_DEBT">🔧 Technical Debt</option>
            <option value="FUTURE_IDEA">💡 Future Idea</option>

        </select>

        <textarea
            id="developerNoteText"
            rows="3"
            placeholder="Describe the issue..."
            style="
                padding:12px;
                border-radius:8px;
                border:1px solid #d1d5db;
                resize:vertical;
            "
        ></textarea>

    </div>

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

}

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

const activeNotes =
    notes.filter(
        note => !note.fixed
    );

const completedNotes =
    notes.filter(
        note => note.fixed
    );

const categories = [

    {
        key:'BUG',
        label:'🐞 Bugs'
    },

    {
        key:'UI_UX',
        label:'🎨 UI / UX'
    },

    {
        key:'ENHANCEMENT',
        label:'✨ Enhancements'
    },

    {
        key:'DOCUMENTATION',
        label:'📚 Documentation'
    },

    {
        key:'TECHNICAL_DEBT',
        label:'🔧 Technical Debt'
    },

    {
        key:'FUTURE_IDEA',
        label:'💡 Future Ideas'
    }

];

const list =
    document.getElementById(
        'developerNotesList'
    );

function renderSection(title, notesArray){

    let html = '';

    html += `
<div style="
    margin-top:24px;
    margin-bottom:12px;
    font-size:22px;
    font-weight:700;
    color:#19304B;
">
${title}
</div>
`;

    categories.forEach(category=>{

        const items =
            notesArray.filter(
                (note.category || 'BUG') === category.key
            );

        if(items.length === 0){
            return;
        }

        html += `
<div style="
    margin-top:18px;
    margin-bottom:8px;
    font-size:17px;
    font-weight:700;
    color:#19304B;
    border-bottom:1px solid #DBE3EC;
    padding-bottom:4px;
">
${category.label}
</div>
`;

        items.forEach(note=>{

            html += `

<div
    style="
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:12px;
        margin-bottom:10px;
        background:${note.fixed ? '#F8FAFC' : '#FFFFFF'};
    "
>

<label
    style="
        display:flex;
        gap:10px;
        align-items:flex-start;
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

<div
    style="
        font-weight:600;
        ${note.fixed
            ? 'text-decoration:line-through;color:#64748B;'
            : ''
        }
    "
>

${note.note}

</div>

<div
    style="
        margin-top:6px;
        font-size:12px;
        color:#64748B;
    "
>

${new Date(
    note.created_at
).toLocaleString()}

</div>

</div>

</label>

</div>

`;

        });

    });

    return html;

}

let html =
    renderSection(
        'ACTIVE NOTES',
        activeNotes
    );

if(showCompleted){

    html +=
        renderSection(
            'COMPLETED NOTES',
            completedNotes
        );

}

if(
    html.trim() === ''
){

    html = `
<div
    style="
        color:#64748B;
    "
>

No developer notes.

</div>
`;

}

list.innerHTML = html;

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

  const category =
    document.getElementById(
        'developerNoteCategory'
    ).value;

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
          
              note,
              category
          
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
    
    document.getElementById(
        'developerNoteCategory'
    ).value = 'BUG';

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
