/*
==============================================================================
 NDOW Volunteer Portal
 Project Workspace
------------------------------------------------------------------------------
 Module      : projects-workspace.js
 Layer       : Frontend Workspace

 Purpose:
    Individual project workspace.

 Responsibilities:
    • Load selected project
    • Load project members
    • Display project information
    • Display project members
    • Display shared project notes
    • Create shared project notes
    • Provide workspace navigation

==============================================================================
*/

'use strict';


// ========================================
// API
// ========================================

const PROJECTS_API_BASE =
  'https://ndow-calendar-server.onrender.com';


// ========================================
// PROJECT STATE
// ========================================

let currentProject = null;

let currentProjectMembers = [];

let currentProjectNotes = [];

let currentProjectTasks = [];

let editingProjectTaskId = null;

let showArchivedProjectTasks = false;


// ========================================
// OPEN PROJECT
// ========================================

export async function openProjectWorkspace(
  projectId
){

  console.log(
    'Opening project:',
    projectId
  );


  try{

    const project =
      await loadProject(
        projectId
      );


    const members =
      await loadProjectMembers(
        projectId
      );


    const notes =
      await loadProjectNotes(
        projectId
      );

   const tasks =
  await loadProjectTasks(
    projectId
  );


    currentProject =
      project;

    currentProjectMembers =
      members;

    currentProjectNotes =
      notes;

   currentProjectTasks =
  tasks;


    renderProjectWorkspace();


  }catch(error){

    console.error(
      'Failed to open project workspace:',
      error
    );


    alert(
      error.message ||
      'Unable to load project workspace.'
    );

  }

}


// ========================================
// LOAD PROJECT
// ========================================

async function loadProject(
  projectId
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    throw new Error(
      'Your calendar session has expired. Please log in again.'
    );

  }


  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/my-projects`,
      {
        method:'GET',

        headers:{
          'Authorization':
            'Bearer ' + token
        }
      }
    );


  const result =
    await response.json();


  if(
    !response.ok ||
    !result.success
  ){

    throw new Error(
      result.message ||
      'Failed to load projects.'
    );

  }


  const project =
    (result.projects || [])
      .find(
        item =>
          Number(item.id) ===
          Number(projectId)
      );


  if(!project){

    throw new Error(
      'Project not found or you do not have access to it.'
    );

  }


  return project;

}


// ========================================
// LOAD PROJECT MEMBERS
// ========================================

async function loadProjectMembers(
  projectId
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    throw new Error(
      'Your calendar session has expired. Please log in again.'
    );

  }


  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/${projectId}/members`,
      {
        method:'GET',

        headers:{
          'Authorization':
            'Bearer ' + token
        }
      }
    );


  const result =
    await response.json();


  if(
    !response.ok ||
    !result.success
  ){

    throw new Error(
      result.message ||
      'Failed to load project members.'
    );

  }


  return Array.isArray(
    result.members
  )
    ? result.members
    : [];

}


// ========================================
// LOAD PROJECT NOTES
// ========================================

async function loadProjectNotes(
  projectId
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    throw new Error(
      'Your calendar session has expired. Please log in again.'
    );

  }


  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/${projectId}/notes`,
      {
        method:'GET',

        headers:{
          'Authorization':
            'Bearer ' + token
        }
      }
    );


  const result =
    await response.json();


  if(
    !response.ok ||
    !result.success
  ){

    throw new Error(
      result.message ||
      'Failed to load project notes.'
    );

  }


  return Array.isArray(
    result.notes
  )
    ? result.notes
    : [];

}

// ========================================
// LOAD PROJECT TASKS
// ========================================

async function loadProjectTasks(
  projectId,
  showArchived = false
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    throw new Error(
      'Your calendar session has expired. Please log in again.'
    );

  }


  const query =
    showArchived
      ? '?archived=true'
      : '';


  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/${projectId}/tasks${query}`,
      {
        method:'GET',

        headers:{
          'Authorization':
            'Bearer ' + token
        }
      }
    );


  const result =
    await response.json();


  if(
    !response.ok ||
    !result.success
  ){

    throw new Error(
      result.message ||
      'Failed to load project tasks.'
    );

  }


  return Array.isArray(
    result.tasks
  )
    ? result.tasks
    : [];

}

// ========================================
// CREATE PROJECT NOTE
// ========================================

async function createProjectNote(
  noteText
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    throw new Error(
      'Your calendar session has expired. Please log in again.'
    );

  }


  if(
    !currentProject ||
    !currentProject.id
  ){

    throw new Error(
      'No project is currently open.'
    );

  }


  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/notes`,
      {
        method:'POST',

        headers:{
          'Content-Type':
            'application/json',

          'Authorization':
            'Bearer ' + token
        },

        body:JSON.stringify({

          note_text:
            noteText

        })
      }
    );


  const result =
    await response.json();


  if(
    !response.ok ||
    !result.success
  ){

    throw new Error(
      result.message ||
      'Failed to create project note.'
    );

  }


  return result.note;

}


// ========================================
// RENDER WORKSPACE
// ========================================

function renderProjectWorkspace(){

  const existing =
    document.getElementById(
      'projectDetailWorkspace'
    );


  if(existing){

    existing.remove();

  }


  const workspace =
    document.createElement(
      'div'
    );


  workspace.id =
    'projectDetailWorkspace';


  workspace.style.cssText = `
    position:fixed;
    inset:0;
    z-index:10001;
    background:#F8FAFC;
    overflow:auto;
  `;


  workspace.innerHTML = `

    <!-- =================================
         WORKSPACE HEADER
         ================================= -->

    <div style="
      background:#FFFFFF;
      border-bottom:1px solid #DBE3EC;
    ">

      <div style="
        max-width:1200px;
        margin:0 auto;
        padding:18px 24px;
      ">

        <div style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
        ">

          <div>

            <div style="
              font-size:24px;
              font-weight:700;
              color:#19304B;
            ">
              ${escapeProjectHtml(
                currentProject.project_name
              )}
            </div>

            <div style="
              margin-top:4px;
              color:#64748B;
              font-size:14px;
            ">
              ${formatProjectDates(
                currentProject.start_date,
                currentProject.end_date
              )}
            </div>

          </div>


          <button
            type="button"
            onclick="
              window.closeProjectWorkspace &&
              window.closeProjectWorkspace();
            "
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#19304B;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
              white-space:nowrap;
            "
          >
            ← Back to Projects
          </button>

        </div>

      </div>

    </div>


    <!-- =================================
         WORKSPACE BODY
         ================================= -->

    <div style="
      max-width:1200px;
      margin:0 auto;
      padding:20px 24px 40px;
    ">


      <!-- =================================
           NAVIGATION
           ================================= -->

      <div style="
        display:flex;
        gap:4px;
        border-bottom:1px solid #DBE3EC;
        margin-bottom:20px;
      ">

        <button
          type="button"
          id="projectTabOverview"
          onclick="
            window.selectProjectTab &&
            window.selectProjectTab('overview');
          "
          style="
            border:none;
            border-bottom:2px solid #19304B;
            background:transparent;
            color:#19304B;
            font-weight:600;
            padding:10px 14px;
            cursor:pointer;
          "
        >
          Overview
        </button>


        <button
          type="button"
          id="projectTabNotes"
          onclick="
            window.selectProjectTab &&
            window.selectProjectTab('notes');
          "
          style="
            border:none;
            border-bottom:2px solid transparent;
            background:transparent;
            color:#64748B;
            font-weight:500;
            padding:10px 14px;
            cursor:pointer;
          "
        >
          Notes
        </button>


        <button
          type="button"
          id="projectTabTasks"
          onclick="
            window.selectProjectTab &&
            window.selectProjectTab('tasks');
          "
          style="
            border:none;
            border-bottom:2px solid transparent;
            background:transparent;
            color:#64748B;
            font-weight:500;
            padding:10px 14px;
            cursor:pointer;
          "
        >
          Tasks
        </button>


        <button
          type="button"
          id="projectTabDiscussion"
          onclick="
            window.selectProjectTab &&
            window.selectProjectTab('discussion');
          "
          style="
            border:none;
            border-bottom:2px solid transparent;
            background:transparent;
            color:#64748B;
            font-weight:500;
            padding:10px 14px;
            cursor:pointer;
          "
        >
          Discussion
        </button>

      </div>


      <!-- =================================
           CONTENT
           ================================= -->

      <div id="projectWorkspaceContent">

        ${renderOverview()}

      </div>

    </div>

  `;


  document.body.appendChild(
    workspace
  );

}


// ========================================
// OVERVIEW
// ========================================

function renderOverview(){

  return `

    <div style="
      display:grid;
      grid-template-columns:
        minmax(0, 2fr)
        minmax(280px, 1fr);
      gap:16px;
    ">


      <!-- ===============================
           PROJECT INFORMATION
           =============================== -->

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:20px;
      ">

        <div style="
          font-size:16px;
          font-weight:600;
          color:#19304B;
          margin-bottom:12px;
        ">
          Project Information
        </div>


        <div style="
          color:#475569;
          line-height:1.6;
          white-space:pre-wrap;
        ">
          ${escapeProjectHtml(
            currentProject.description ||
            'No project description has been entered.'
          )}
        </div>


        <div style="
          display:grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap:12px;
          margin-top:20px;
        ">


          <div style="
            padding:12px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:6px;
          ">

            <div style="
              font-size:12px;
              color:#64748B;
              margin-bottom:4px;
            ">
              Start Date
            </div>

            <div style="
              font-weight:600;
              color:#19304B;
            ">
              ${escapeProjectHtml(
                currentProject.start_date || ''
              )}
            </div>

          </div>


          <div style="
            padding:12px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            border-radius:6px;
          ">

            <div style="
              font-size:12px;
              color:#64748B;
              margin-bottom:4px;
            ">
              End Date
            </div>

            <div style="
              font-weight:600;
              color:#19304B;
            ">
              ${escapeProjectHtml(
                currentProject.end_date || ''
              )}
            </div>

          </div>


        </div>

      </div>


      <!-- ===============================
           MEMBERS
           =============================== -->

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:20px;
      ">

        <div style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:14px;
        ">

          <div style="
            font-size:16px;
            font-weight:600;
            color:#19304B;
          ">
            Members
          </div>

          <div style="
            font-size:13px;
            color:#64748B;
          ">
            ${currentProjectMembers.length}
          </div>

        </div>


        ${renderMembers(
          currentProjectMembers
        )}

      </div>


    </div>

  `;

}


// ========================================
// MEMBERS
// ========================================

function renderMembers(
  members
){

  if(!members.length){

    return `

      <div style="
        color:#64748B;
        font-size:14px;
      ">
        No project members found.
      </div>

    `;

  }


  return members
    .map(member => {

      const displayName =
        member.full_name ||
        member.username ||
        member.email ||
        'Unknown User';


      return `

        <div style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:10px 0;
          border-bottom:1px solid #EEF2F6;
        ">

          <div style="
            min-width:0;
          ">

            <div style="
              font-weight:600;
              color:#19304B;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            ">
              ${escapeProjectHtml(
                displayName
              )}
            </div>

            <div style="
              margin-top:2px;
              color:#64748B;
              font-size:12px;
            ">
              ${escapeProjectHtml(
                member.email || ''
              )}
            </div>

          </div>


          <div style="
            flex-shrink:0;
            padding:4px 8px;
            border-radius:4px;
            background:#F8FAFC;
            border:1px solid #DBE3EC;
            color:#475569;
            font-size:12px;
            text-transform:capitalize;
          ">
            ${escapeProjectHtml(
              member.permission || 'view'
            )}
          </div>

        </div>

      `;

    })
    .join('');

}


// ========================================
// NOTES
// ========================================

function renderNotes(){

  const canEdit =
    currentProjectMembers.some(
      member =>
        member.permission ===
        'edit'
    );


  return `

    <div>

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:16px;
      ">

        <div>

          <div style="
            font-size:18px;
            font-weight:600;
            color:#19304B;
          ">
            Shared Notes
          </div>

          <div style="
            margin-top:3px;
            font-size:13px;
            color:#64748B;
          ">
            Notes shared with everyone on this project.
          </div>

        </div>


        ${
          canEdit
            ? `
              <button
                type="button"
                onclick="
                  window.showProjectNoteEditor &&
                  window.showProjectNoteEditor();
                "
                style="
                  border:1px solid #19304B;
                  background:#19304B;
                  color:#FFFFFF;
                  border-radius:6px;
                  padding:8px 14px;
                  cursor:pointer;
                  font-weight:600;
                  white-space:nowrap;
                "
              >
                + Add Note
              </button>
            `
            : ''
        }

      </div>


      <div
        id="projectNoteEditor"
        style="
          display:none;
          background:#FFFFFF;
          border:1px solid #DBE3EC;
          border-radius:8px;
          padding:18px;
          margin-bottom:16px;
        "
      >

        <div style="
          font-size:15px;
          font-weight:600;
          color:#19304B;
          margin-bottom:10px;
        ">
          Add a Note
        </div>


        <textarea
          id="projectNoteText"
          rows="5"
          maxlength="5000"
          placeholder="Enter a note for the project..."
          style="
            width:100%;
            box-sizing:border-box;
            resize:vertical;
            border:1px solid #DBE3EC;
            border-radius:6px;
            padding:10px;
            font-family:inherit;
            font-size:14px;
            color:#19304B;
            outline:none;
          "
        ></textarea>


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:8px;
          margin-top:10px;
        ">

          <button
            type="button"
            onclick="
              window.hideProjectNoteEditor &&
              window.hideProjectNoteEditor();
            "
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#475569;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Cancel
          </button>


          <button
            type="button"
            id="saveProjectNoteButton"
            onclick="
              window.saveProjectNote &&
              window.saveProjectNote();
            "
            style="
              border:1px solid #19304B;
              background:#19304B;
              color:#FFFFFF;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
              font-weight:600;
            "
          >
            Save Note
          </button>

        </div>

      </div>


      <div id="projectNotesList">

        ${renderNotesList()}

      </div>

    </div>

  `;

}


// ========================================
// NOTES LIST
// ========================================

function renderNotesList(){

  if(!currentProjectNotes.length){

    return `

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:24px;
        color:#64748B;
        text-align:center;
      ">
        No shared notes have been added yet.
      </div>

    `;

  }


  return currentProjectNotes
    .map(note => {

      const author =
        note.author?.full_name ||
        note.author?.username ||
        note.author?.email ||
        'Unknown User';


      const date =
        formatNoteDate(
          note.created_at
        );


      return `

        <div style="
          background:#FFFFFF;
          border:1px solid #DBE3EC;
          border-radius:8px;
          padding:18px;
          margin-bottom:12px;
        ">

          <div style="
            color:#334155;
            font-size:14px;
            line-height:1.6;
            white-space:pre-wrap;
          ">
            ${escapeProjectHtml(
              note.note_text
            )}
          </div>


          <div style="
            display:flex;
            justify-content:space-between;
            gap:12px;
            margin-top:14px;
            padding-top:10px;
            border-top:1px solid #EEF2F6;
            color:#64748B;
            font-size:12px;
          ">

            <span>
              ${escapeProjectHtml(
                author
              )}
            </span>

            <span>
              ${escapeProjectHtml(
                date
              )}
            </span>

          </div>

        </div>

      `;

    })
    .join('');

}

// ========================================
// TASKS
// ========================================

function renderTasks(){

  const canEdit =
    currentProjectMembers.some(
      member =>
        member.permission === 'edit'
    );

  return `

    <div>

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:16px;
      ">

        <div>

          <div style="
            font-size:18px;
            font-weight:600;
            color:#19304B;
          ">
            Project Tasks
          </div>

          <div style="
            margin-top:3px;
            font-size:13px;
            color:#64748B;
          ">
            Tasks shared with everyone on this project.
          </div>

        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
        ">

          <button
            type="button"
            onclick="
              window.toggleArchivedProjectTasks &&
              window.toggleArchivedProjectTasks();
            "
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#475569;
              border-radius:6px;
              padding:8px 12px;
              cursor:pointer;
              font-weight:600;
              white-space:nowrap;
            "
          >
            ${
              showArchivedProjectTasks
                ? 'Hide Archived'
                : 'Show Archived'
            }
          </button>

          ${
            canEdit
              ? `
                <button
                  type="button"
                  onclick="
                    window.showProjectTaskEditor &&
                    window.showProjectTaskEditor();
                  "
                  style="
                    border:1px solid #19304B;
                    background:#19304B;
                    color:#FFFFFF;
                    border-radius:6px;
                    padding:8px 14px;
                    cursor:pointer;
                    font-weight:600;
                    white-space:nowrap;
                  "
                >
                  + Add Task
                </button>
              `
              : ''
          }

        </div>

      </div>


      <div
        id="projectTaskEditor"
        style="
          display:none;
          background:#FFFFFF;
          border:1px solid #DBE3EC;
          border-radius:8px;
          padding:18px;
          margin-bottom:16px;
        "
      >

        <div
          id="projectTaskEditorTitle"
          style="
            font-size:15px;
            font-weight:600;
            color:#19304B;
            margin-bottom:12px;
          "
        >
          Add Task
        </div>


        <div style="
          display:grid;
          grid-template-columns:
            minmax(0, 2fr)
            minmax(180px, 1fr);
          gap:12px;
        ">

          <div>

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Task Title
            </label>

            <input
              id="projectTaskTitle"
              type="text"
              maxlength="200"
              placeholder="Enter task title..."
              style="
                width:100%;
                box-sizing:border-box;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:9px 10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
              "
            >

          </div>


          <div>

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Assigned To
            </label>

            <select
              id="projectTaskAssignedTo"
              style="
                width:100%;
                box-sizing:border-box;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:9px 10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
                background:#FFFFFF;
              "
            >

              <option value="">
                Unassigned
              </option>

              ${currentProjectMembers
                .map(member => {

                  const name =
                    member.full_name ||
                    member.username ||
                    member.email ||
                    'Unknown User';

                  return `
                    <option value="${member.id}">
                      ${escapeProjectHtml(name)}
                    </option>
                  `;

                })
                .join('')}

            </select>

          </div>


          <div>

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Status
            </label>

            <select
              id="projectTaskStatus"
              style="
                width:100%;
                box-sizing:border-box;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:9px 10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
                background:#FFFFFF;
              "
            >
              <option value="open">
                Open
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

          </div>


          <div>

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Priority
            </label>

            <select
              id="projectTaskPriority"
              style="
                width:100%;
                box-sizing:border-box;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:9px 10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
                background:#FFFFFF;
              "
            >
              <option value="low">
                Low
              </option>

              <option value="normal" selected>
                Normal
              </option>

              <option value="high">
                High
              </option>
            </select>

          </div>


          <div>

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Due Date
            </label>

            <input
              id="projectTaskDueDate"
              type="date"
              style="
                width:100%;
                box-sizing:border-box;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:9px 10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
              "
            >

          </div>


          <div style="
            grid-column:1 / -1;
          ">

            <label style="
              display:block;
              font-size:12px;
              color:#64748B;
              margin-bottom:5px;
            ">
              Description
            </label>

            <textarea
              id="projectTaskDescription"
              rows="4"
              maxlength="5000"
              placeholder="Describe the task..."
              style="
                width:100%;
                box-sizing:border-box;
                resize:vertical;
                border:1px solid #DBE3EC;
                border-radius:6px;
                padding:10px;
                font-family:inherit;
                font-size:14px;
                color:#19304B;
              "
            ></textarea>

          </div>

        </div>


        <div style="
          display:flex;
          justify-content:flex-end;
          gap:8px;
          margin-top:12px;
        ">

          <button
            type="button"
            id="archiveProjectTaskButton"
            onclick="
              window.archiveProjectTask &&
              window.archiveProjectTask();
            "
            style="
              display:none;
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#475569;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Archive Task
          </button>


          <button
            type="button"
            id="restoreProjectTaskButton"
            onclick="
              window.restoreProjectTask &&
              window.restoreProjectTask();
            "
            style="
              display:none;
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#475569;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Restore Task
          </button>


          <button
            type="button"
            id="deleteProjectTaskButton"
            onclick="
              window.deleteProjectTask &&
              window.deleteProjectTask();
            "
            style="
              display:none;
              border:1px solid #DC2626;
              background:#FFFFFF;
              color:#DC2626;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Delete Task
          </button>


          <button
            type="button"
            onclick="
              window.hideProjectTaskEditor &&
              window.hideProjectTaskEditor();
            "
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#475569;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Cancel
          </button>


          <button
            type="button"
            id="saveProjectTaskButton"
            onclick="
              window.saveProjectTask &&
              window.saveProjectTask();
            "
            style="
              border:1px solid #19304B;
              background:#19304B;
              color:#FFFFFF;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
              font-weight:600;
            "
          >
            Save Task
          </button>

        </div>

      </div>


      <div id="projectTasksList">

        ${renderTasksList()}

      </div>

    </div>

  `;

}


// ========================================
// TASKS LIST
// ========================================

function renderTasksList(){

  if(!currentProjectTasks.length){

    return `

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:24px;
        color:#64748B;
        text-align:center;
      ">
        ${
          showArchivedProjectTasks
            ? 'No tasks are currently archived.'
            : 'No active project tasks have been added yet.'
        }
      </div>

    `;

  }


  const canEdit =
    currentProjectMembers.some(
      member =>
        member.permission === 'edit'
    );


  return currentProjectTasks
    .map(task => {

      const assignedName =
        task.assigned_user?.full_name ||
        task.assigned_user?.username ||
        task.assigned_user?.email ||
        'Unassigned';


      const status =
        task.status ||
        'open';


      const priority =
        task.priority ||
        'normal';


      const archived =
        task.archived === true;


      return `

        <div
          ${
            canEdit
              ? `
                onclick="
                  window.openProjectTaskEditor &&
                  window.openProjectTaskEditor(${task.id});
                "
              `
              : ''
          }
          style="
            background:#FFFFFF;
            border:1px solid ${
              archived
                ? '#CBD5E1'
                : '#DBE3EC'
            };
            border-radius:8px;
            padding:18px;
            margin-bottom:12px;
            ${
              canEdit
                ? 'cursor:pointer;'
                : ''
            }
            ${
              archived
                ? 'opacity:0.72;'
                : ''
            }
          "
        >

          <div style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:16px;
          ">

            <div style="
              min-width:0;
              flex:1;
            ">

              <div style="
                display:flex;
                align-items:center;
                gap:8px;
                flex-wrap:wrap;
              ">

                <div style="
                  font-size:15px;
                  font-weight:600;
                  color:#19304B;
                ">
                  ${escapeProjectHtml(
                    task.task_title
                  )}
                </div>

                ${
                  archived
                    ? `
                      <span style="
                        padding:3px 7px;
                        border-radius:4px;
                        background:#F1F5F9;
                        border:1px solid #CBD5E1;
                        color:#64748B;
                        font-size:11px;
                        font-weight:600;
                      ">
                        Archived
                      </span>
                    `
                    : ''
                }

              </div>


              ${
                task.task_description
                  ? `
                    <div style="
                      margin-top:6px;
                      color:#475569;
                      font-size:13px;
                      line-height:1.5;
                      white-space:pre-wrap;
                    ">
                      ${escapeProjectHtml(
                        task.task_description
                      )}
                    </div>
                  `
                  : ''
              }

            </div>


            <div style="
              display:flex;
              gap:6px;
              flex-shrink:0;
              flex-wrap:wrap;
              justify-content:flex-end;
            ">

              <span style="
                padding:4px 8px;
                border-radius:4px;
                background:#F8FAFC;
                border:1px solid #DBE3EC;
                color:#475569;
                font-size:12px;
                text-transform:capitalize;
              ">
                ${escapeProjectHtml(
                  status.replace(
                    '_',
                    ' '
                  )
                )}
              </span>


              <span style="
                padding:4px 8px;
                border-radius:4px;
                background:#F8FAFC;
                border:1px solid #DBE3EC;
                color:#475569;
                font-size:12px;
                text-transform:capitalize;
              ">
                ${escapeProjectHtml(
                  priority
                )}
              </span>

            </div>

          </div>


          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:18px;
            margin-top:14px;
            padding-top:10px;
            border-top:1px solid #EEF2F6;
            color:#64748B;
            font-size:12px;
          ">

            <span>
              Assigned to:
              ${escapeProjectHtml(
                assignedName
              )}
            </span>


            ${
              task.due_date
                ? `
                  <span>
                    Due:
                    ${escapeProjectHtml(
                      task.due_date
                    )}
                  </span>
                `
                : ''
            }

          </div>

        </div>

      `;

    })
    .join('');

}


// ========================================
// OPEN TASK EDITOR
// ========================================

function openProjectTaskEditor(
  taskId
){

  const canEdit =
    currentProjectMembers.some(
      member =>
        member.permission === 'edit'
    );

  if(!canEdit){

    return;

  }


  const task =
    currentProjectTasks.find(
      item =>
        Number(item.id) ===
        Number(taskId)
    );


  if(!task){

    alert(
      'Task could not be found.'
    );

    return;

  }


  editingProjectTaskId =
    Number(task.id);


  const saveButton =
    document.getElementById(
      'saveProjectTaskButton'
    );


  const archiveButton =
    document.getElementById(
      'archiveProjectTaskButton'
    );


  const restoreButton =
    document.getElementById(
      'restoreProjectTaskButton'
    );


  const deleteButton =
    document.getElementById(
      'deleteProjectTaskButton'
    );


  const editor =
    document.getElementById(
      'projectTaskEditor'
    );


  const editorTitle =
    document.getElementById(
      'projectTaskEditorTitle'
    );


  const title =
    document.getElementById(
      'projectTaskTitle'
    );


  const description =
    document.getElementById(
      'projectTaskDescription'
    );


  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );


  const status =
    document.getElementById(
      'projectTaskStatus'
    );


  const priority =
    document.getElementById(
      'projectTaskPriority'
    );


  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );


  if(!editor){

    return;

  }


  if(editorTitle){

    editorTitle.textContent =
      task.archived === true
        ? 'Archived Task'
        : 'Edit Task';

  }


  if(title){

    title.value =
      task.task_title || '';

  }


  if(description){

    description.value =
      task.task_description || '';

  }


  if(assignedTo){

    assignedTo.value =
      task.assigned_to
        ? String(task.assigned_to)
        : '';

  }


  if(status){

    status.value =
      task.status ||
      'open';

  }


  if(priority){

    priority.value =
      task.priority ||
      'normal';

  }


  if(dueDate){

    dueDate.value =
      task.due_date || '';

  }


  if(archiveButton){

    archiveButton.style.display =
      task.archived === true
        ? 'none'
        : 'inline-block';

  }


  if(restoreButton){

    restoreButton.style.display =
      task.archived === true
        ? 'inline-block'
        : 'none';

  }


  if(deleteButton){

    deleteButton.style.display =
      'inline-block';

  }


  if(saveButton){

    saveButton.textContent =
      task.archived === true
        ? 'Save Changes'
        : 'Save Changes';

  }


  editor.style.display =
    'block';


  if(title){

    title.focus();

  }

}


// ========================================
// SHOW TASK EDITOR
// ========================================

function showProjectTaskEditor(){

  const canEdit =
    currentProjectMembers.some(
      member =>
        member.permission === 'edit'
    );

  if(!canEdit){

    return;

  }


  editingProjectTaskId =
    null;


  const editor =
    document.getElementById(
      'projectTaskEditor'
    );


  const editorTitle =
    document.getElementById(
      'projectTaskEditorTitle'
    );


  const title =
    document.getElementById(
      'projectTaskTitle'
    );


  const description =
    document.getElementById(
      'projectTaskDescription'
    );


  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );


  const status =
    document.getElementById(
      'projectTaskStatus'
    );


  const priority =
    document.getElementById(
      'projectTaskPriority'
    );


  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );


  const saveButton =
    document.getElementById(
      'saveProjectTaskButton'
    );


  const archiveButton =
    document.getElementById(
      'archiveProjectTaskButton'
    );


  const restoreButton =
    document.getElementById(
      'restoreProjectTaskButton'
    );


  const deleteButton =
    document.getElementById(
      'deleteProjectTaskButton'
    );


  if(!editor){

    return;

  }


  if(editorTitle){

    editorTitle.textContent =
      'Add Task';

  }


  if(title){

    title.value =
      '';

  }


  if(description){

    description.value =
      '';

  }


  if(assignedTo){

    assignedTo.value =
      '';

  }


  if(status){

    status.value =
      'open';

  }


  if(priority){

    priority.value =
      'normal';

  }


  if(dueDate){

    dueDate.value =
      '';

  }


  if(saveButton){

    saveButton.textContent =
      'Save Task';

  }


  if(archiveButton){

    archiveButton.style.display =
      'none';

  }


  if(restoreButton){

    restoreButton.style.display =
      'none';

  }


  if(deleteButton){

    deleteButton.style.display =
      'none';

  }


  editor.style.display =
    'block';


  if(title){

    title.focus();

  }

}


// ========================================
// HIDE TASK EDITOR
// ========================================

function hideProjectTaskEditor(){

  editingProjectTaskId =
    null;


  const editor =
    document.getElementById(
      'projectTaskEditor'
    );


  const title =
    document.getElementById(
      'projectTaskTitle'
    );


  const description =
    document.getElementById(
      'projectTaskDescription'
    );


  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );


  const status =
    document.getElementById(
      'projectTaskStatus'
    );


  const priority =
    document.getElementById(
      'projectTaskPriority'
    );


  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );


  const archiveButton =
    document.getElementById(
      'archiveProjectTaskButton'
    );


  const restoreButton =
    document.getElementById(
      'restoreProjectTaskButton'
    );


  const deleteButton =
    document.getElementById(
      'deleteProjectTaskButton'
    );


  if(editor){

    editor.style.display =
      'none';

  }


  if(title){

    title.value =
      '';

  }


  if(description){

    description.value =
      '';

  }


  if(assignedTo){

    assignedTo.value =
      '';

  }


  if(status){

    status.value =
      'open';

  }


  if(priority){

    priority.value =
      'normal';

  }


  if(dueDate){

    dueDate.value =
      '';

  }


  if(archiveButton){

    archiveButton.style.display =
      'none';

  }


  if(restoreButton){

    restoreButton.style.display =
      'none';

  }


  if(deleteButton){

    deleteButton.style.display =
      'none';

  }

}


// ========================================
// TOGGLE ARCHIVED TASKS
// ========================================

async function toggleArchivedProjectTasks(){

  const nextValue =
    !showArchivedProjectTasks;

  try{

    await loadProjectTasks(
      currentProject.id,
      nextValue
    );

    showArchivedProjectTasks =
      nextValue;

    renderTasksTab();

  }catch(error){

    console.error(
      'Failed to toggle archived tasks:',
      error
    );

    alert(
      error.message ||
      'Unable to load archived tasks.'
    );

  }

}


// ========================================
// ARCHIVE TASK
// ========================================

async function archiveProjectTask(){

  if(
    !currentProject ||
    !editingProjectTaskId
  ){

    return;

  }


  const confirmed =
    confirm(
      'Archive this task? You can restore it later.'
    );


  if(!confirmed){

    return;

  }


  await updateProjectTaskLifecycle(
    'archive'
  );

}


// ========================================
// RESTORE TASK
// ========================================

async function restoreProjectTask(){

  if(
    !currentProject ||
    !editingProjectTaskId
  ){

    return;

  }


  await updateProjectTaskLifecycle(
    'restore'
  );

}


// ========================================
// UPDATE TASK LIFECYCLE
// ========================================

async function updateProjectTaskLifecycle(
  action
){

  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    alert(
      'Your calendar session has expired. Please log in again.'
    );

    return;

  }


  try{

    const response =
      await fetch(
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${editingProjectTaskId}/${action}`,
        {
          method:'PATCH',

          headers:{
            'Authorization':
              'Bearer ' + token
          }
        }
      );


    const result =
      await response.json();


    if(
      !response.ok ||
      !result.success
    ){

      throw new Error(
        result.message ||
        `Failed to ${action} project task.`
      );

    }


    editingProjectTaskId =
      null;


    hideProjectTaskEditor();


    await loadProjectTasks(
      currentProject.id,
      showArchivedProjectTasks
    );


    renderTasksTab();

  }catch(error){

    console.error(
      `Failed to ${action} project task:`,
      error
    );


    alert(
      error.message ||
      `Unable to ${action} task.`
    );

  }

}


// ========================================
// DELETE TASK
// ========================================

async function deleteProjectTask(){

  if(
    !currentProject ||
    !editingProjectTaskId
  ){

    return;

  }


  const confirmed =
    confirm(
      'Delete this task permanently? This cannot be undone.'
    );


  if(!confirmed){

    return;

  }


  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    alert(
      'Your calendar session has expired. Please log in again.'
    );

    return;

  }


  try{

    const response =
      await fetch(
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${editingProjectTaskId}`,
        {
          method:'DELETE',

          headers:{
            'Authorization':
              'Bearer ' + token
          }
        }
      );


    const result =
      await response.json();


    if(
      !response.ok ||
      !result.success
    ){

      throw new Error(
        result.message ||
        'Failed to delete project task.'
      );

    }


    editingProjectTaskId =
      null;


    hideProjectTaskEditor();


    await loadProjectTasks(
      currentProject.id,
      showArchivedProjectTasks
    );


    renderTasksTab();

  }catch(error){

    console.error(
      'Failed to delete project task:',
      error
    );


    alert(
      error.message ||
      'Unable to delete task.'
    );

  }

}


// ========================================
// SAVE PROJECT TASK
// ========================================

async function saveProjectTask(){

  const title =
    document.getElementById(
      'projectTaskTitle'
    );


  const description =
    document.getElementById(
      'projectTaskDescription'
    );


  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );


  const status =
    document.getElementById(
      'projectTaskStatus'
    );


  const priority =
    document.getElementById(
      'projectTaskPriority'
    );


  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );


  const button =
    document.getElementById(
      'saveProjectTaskButton'
    );


  if(!title){

    return;

  }


  const taskTitle =
    String(
      title.value || ''
    ).trim();


  if(!taskTitle){

    alert(
      'Please enter a task title.'
    );

    title.focus();

    return;

  }


  const token =
    localStorage.getItem(
      'token'
    );


  if(!token){

    alert(
      'Your calendar session has expired. Please log in again.'
    );

    return;

  }


  if(
    !currentProject ||
    !currentProject.id
  ){

    alert(
      'No project is currently open.'
    );

    return;

  }


  try{

    if(button){

      button.disabled =
        true;

      button.textContent =
        'Saving...';

    }


    const isEditing =
      Number.isFinite(
        editingProjectTaskId
      );


    const url =
      isEditing
        ? `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${editingProjectTaskId}`
        : `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks`;


    const response =
      await fetch(
        url,
        {
          method:
            isEditing
              ? 'PATCH'
              : 'POST',

          headers:{
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' + token
          },

          body:JSON.stringify({

            task_title:
              taskTitle,

            task_description:
              String(
                description?.value || ''
              ).trim() || null,

            assigned_to:
              assignedTo?.value
                ? Number(
                    assignedTo.value
                  )
                : null,

            status:
              status?.value ||
              'open',

            priority:
              priority?.value ||
              'normal',

            due_date:
              dueDate?.value ||
              null

          })

        }
      );


    const result =
      await response.json();


    if(
      !response.ok ||
      !result.success
    ){

      throw new Error(
        result.message ||
        (
          isEditing
            ? 'Failed to update project task.'
            : 'Failed to create project task.'
        )
      );

    }


    editingProjectTaskId =
      null;


    hideProjectTaskEditor();


    await loadProjectTasks(
      currentProject.id,
      showArchivedProjectTasks
    );


    renderTasksTab();


  }catch(error){

    console.error(
      'Failed to save project task:',
      error
    );


    alert(
      error.message ||
      'Unable to save task.'
    );


  }finally{

    if(button){

      button.disabled =
        false;

      button.textContent =
        'Save Task';

    }

  }

}

// ========================================
// SHOW NOTE EDITOR
// ========================================

function showProjectNoteEditor(){

  const editor =
    document.getElementById(
      'projectNoteEditor'
    );


  const textarea =
    document.getElementById(
      'projectNoteText'
    );


  if(!editor){

    return;

  }


  editor.style.display =
    'block';


  if(textarea){

    textarea.focus();

  }

}


// ========================================
// HIDE NOTE EDITOR
// ========================================

function hideProjectNoteEditor(){

  const editor =
    document.getElementById(
      'projectNoteEditor'
    );


  const textarea =
    document.getElementById(
      'projectNoteText'
    );


  if(editor){

    editor.style.display =
      'none';

  }


  if(textarea){

    textarea.value =
      '';

  }

}


// ========================================
// SAVE NOTE
// ========================================

async function saveProjectNote(){

  const textarea =
    document.getElementById(
      'projectNoteText'
    );


  const button =
    document.getElementById(
      'saveProjectNoteButton'
    );


  if(!textarea){

    return;

  }


  const noteText =
    String(
      textarea.value || ''
    ).trim();


  if(!noteText){

    alert(
      'Please enter a note.'
    );

    textarea.focus();

    return;

  }


  try{

    if(button){

      button.disabled =
        true;

      button.textContent =
        'Saving...';

    }


    const note =
      await createProjectNote(
        noteText
      );


    currentProjectNotes =
      [
        note,
        ...currentProjectNotes
      ];


    renderNotesTab();


  }catch(error){

    console.error(
      'Failed to save project note:',
      error
    );


    alert(
      error.message ||
      'Unable to save note.'
    );


  }finally{

    if(button){

      button.disabled =
        false;

      button.textContent =
        'Save Note';

    }

  }

}


// ========================================
// RENDER NOTES TAB
// ========================================

function renderNotesTab(){

  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  content.innerHTML =
    renderNotes();

}

// ========================================
// RENDER TASKS TAB
// ========================================

function renderTasksTab(){

  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  content.innerHTML =
    renderTasks();

}

// ========================================
// TAB SELECTION
// ========================================

function selectProjectTab(
  tab
){

  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  const tabs = [
    'overview',
    'notes',
    'tasks',
    'discussion'
  ];


  tabs.forEach(
    name => {

      const button =
        document.getElementById(
          `projectTab${capitalize(name)}`
        );


      if(!button){

        return;

      }


      const active =
        name === tab;


      button.style.borderBottom =
        active
          ? '2px solid #19304B'
          : '2px solid transparent';

      button.style.color =
        active
          ? '#19304B'
          : '#64748B';

      button.style.fontWeight =
        active
          ? '600'
          : '500';

    }
  );


  if(tab === 'overview'){

    content.innerHTML =
      renderOverview();

    return;

  }


  if(tab === 'notes'){

    content.innerHTML =
      renderNotes();

    return;

  }


  if(tab === 'tasks'){

    content.innerHTML =
      renderTasks();

    return;

  }


  content.innerHTML = `

    <div style="
      background:#FFFFFF;
      border:1px solid #DBE3EC;
      border-radius:8px;
      padding:24px;
      color:#64748B;
    ">

      <div style="
        font-size:16px;
        font-weight:600;
        color:#19304B;
        margin-bottom:6px;
      ">
        ${capitalize(tab)}
      </div>

      <div>
        This workspace section will be added next.
      </div>

    </div>

  `;

}


// ========================================
// CLOSE PROJECT
// ========================================

export function closeProjectWorkspace(){

  const workspace =
    document.getElementById(
      'projectDetailWorkspace'
    );


  if(workspace){

    workspace.remove();

  }


  currentProject =
    null;

  currentProjectMembers =
    [];

  currentProjectNotes =
    [];

}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.openProjectWorkspace =
  openProjectWorkspace;

window.closeProjectWorkspace =
  closeProjectWorkspace;

window.selectProjectTab =
  selectProjectTab;

window.showProjectNoteEditor =
  showProjectNoteEditor;

window.hideProjectNoteEditor =
  hideProjectNoteEditor;

window.saveProjectNote =
  saveProjectNote;

window.openProjectTaskEditor =
  openProjectTaskEditor;

window.showProjectTaskEditor =
  showProjectTaskEditor;

window.hideProjectTaskEditor =
  hideProjectTaskEditor;

window.saveProjectTask =
  saveProjectTask;

window.toggleArchivedProjectTasks =
  toggleArchivedProjectTasks;

window.archiveProjectTask =
  archiveProjectTask;

window.restoreProjectTask =
  restoreProjectTask;

window.deleteProjectTask =
  deleteProjectTask;


// ========================================
// HELPERS
// ========================================

function escapeProjectHtml(
  value
){

  return String(
    value || ''
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}


function formatProjectDates(
  startDate,
  endDate
){

  if(
    !startDate &&
    !endDate
  ){

    return 'Dates not specified';

  }


  if(!endDate){

    return escapeProjectHtml(
      startDate
    );

  }


  if(!startDate){

    return escapeProjectHtml(
      endDate
    );

  }


  return `
    ${escapeProjectHtml(startDate)}
    –
    ${escapeProjectHtml(endDate)}
  `;

}


function formatNoteDate(
  value
){

  if(!value){

    return '';

  }


  const date =
    new Date(value);


  if(
    Number.isNaN(
      date.getTime()
    )
  ){

    return String(
      value
    );

  }


  return date.toLocaleString(
    undefined,
    {
      month:'short',
      day:'numeric',
      year:'numeric',
      hour:'numeric',
      minute:'2-digit'
    }
  );

}


function capitalize(
  value
){

  return String(
    value || ''
  )
    .charAt(0)
    .toUpperCase() +
    String(
      value || ''
    ).slice(1);

}
