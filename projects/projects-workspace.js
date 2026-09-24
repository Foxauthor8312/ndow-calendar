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
    • Display project tasks
    • Display project discussion
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

let currentProjectDiscussion = [];

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

    const discussion =
      await loadProjectDiscussion(
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

    currentProjectDiscussion =
      discussion;

    editingProjectTaskId =
      null;

    showArchivedProjectTasks =
      false;

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
// LOAD PROJECT DISCUSSION
// ========================================

async function loadProjectDiscussion(
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
      `${PROJECTS_API_BASE}/api/projects/${projectId}/discussions`,
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
      'Failed to load project discussion.'
    );

  }

  return Array.isArray(
    result.discussion
  )
    ? result.discussion
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
// CURRENT USER PROJECT PERMISSION
// ========================================

function currentUserCanEditProject(){

  return Boolean(
    currentProject &&
    currentProject.permission ===
      'edit'
  );

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
        overflow-x:auto;
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
            white-space:nowrap;
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
            white-space:nowrap;
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
            white-space:nowrap;
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
            white-space:nowrap;
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
    currentUserCanEditProject();

  return `

    <div style="
      max-width:900px;
    ">


      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:14px;
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
                  border:none;
                  background:#19304B;
                  color:#FFFFFF;
                  border-radius:6px;
                  padding:8px 14px;
                  cursor:pointer;
                  white-space:nowrap;
                "
              >
                + Add Note
              </button>
            `
            : ''
        }

      </div>


      ${
        canEdit
          ? `
            <div
              id="projectNoteEditor"
              style="
                display:none;
                background:#FFFFFF;
                border:1px solid #DBE3EC;
                border-radius:8px;
                padding:16px;
                margin-bottom:16px;
              "
            >

              <textarea
                id="projectNoteText"
                rows="5"
                placeholder="Enter a shared project note..."
                style="
                  width:100%;
                  box-sizing:border-box;
                  resize:vertical;
                  border:1px solid #CBD5E1;
                  border-radius:6px;
                  padding:10px;
                  font:inherit;
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
                    border:none;
                    background:#19304B;
                    color:#FFFFFF;
                    border-radius:6px;
                    padding:8px 14px;
                    cursor:pointer;
                  "
                >
                  Save Note
                </button>

              </div>

            </div>
          `
          : ''
      }


      ${
        currentProjectNotes.length
          ? currentProjectNotes
              .map(note => {

                const author =
                  note.author?.full_name ||
                  note.author?.username ||
                  note.author?.email ||
                  'Project Member';

                return `

                  <div style="
                    background:#FFFFFF;
                    border:1px solid #DBE3EC;
                    border-radius:8px;
                    padding:16px;
                    margin-bottom:10px;
                  ">

                    <div style="
                      display:flex;
                      justify-content:space-between;
                      gap:12px;
                      margin-bottom:8px;
                    ">

                      <div style="
                        font-weight:600;
                        color:#19304B;
                      ">
                        ${escapeProjectHtml(
                          author
                        )}
                      </div>

                      <div style="
                        color:#64748B;
                        font-size:12px;
                        white-space:nowrap;
                      ">
                        ${formatNoteDate(
                          note.created_at
                        )}
                      </div>

                    </div>


                    <div style="
                      color:#475569;
                      line-height:1.6;
                      white-space:pre-wrap;
                    ">
                      ${escapeProjectHtml(
                        note.note_text
                      )}
                    </div>

                  </div>

                `;

              })
              .join('')
          : `

              <div style="
                background:#FFFFFF;
                border:1px solid #DBE3EC;
                border-radius:8px;
                padding:24px;
                color:#64748B;
                text-align:center;
              ">
                No shared notes yet.
              </div>

            `
      }

    </div>

  `;

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

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

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
// END PART 1
// ========================================

// ========================================
// LOAD SINGLE TASK
// ========================================

function getProjectTask(
  taskId
){

  return currentProjectTasks.find(
    task =>
      Number(task.id) ===
      Number(taskId)
  );

}


// ========================================
// CREATE / UPDATE PROJECT TASK
// ========================================

async function saveProjectTaskToApi(
  taskData
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

  if(
    !currentUserCanEditProject()
  ){

    throw new Error(
      'You do not have permission to edit this project.'
    );

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

        body:JSON.stringify(
          taskData
        )
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

  return result.task;

}


// ========================================
// RENDER TASKS
// ========================================

function renderTasks(){

  const canEdit =
    currentUserCanEditProject();

  return `

    <div>

      <!-- ===============================
           TASK HEADER
           =============================== -->

      <div style="
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:16px;
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
            Shared tasks for this project.
          </div>

        </div>


        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
          justify-content:flex-end;
        ">

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
                    border:none;
                    background:#19304B;
                    color:#FFFFFF;
                    border-radius:6px;
                    padding:8px 14px;
                    cursor:pointer;
                    white-space:nowrap;
                  "
                >
                  + Add Task
                </button>
              `
              : ''
          }


          <button
            type="button"
            onclick="
              window.toggleArchivedProjectTasks &&
              window.toggleArchivedProjectTasks();
            "
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#19304B;
              border-radius:6px;
              padding:8px 12px;
              cursor:pointer;
              white-space:nowrap;
            "
          >
            ${
              showArchivedProjectTasks
                ? 'Show Active Tasks'
                : 'Show Archived'
            }
          </button>

        </div>

      </div>


      <!-- ===============================
           TASK EDITOR
           =============================== -->

      ${
        canEdit
          ? `

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

              <div style="
                font-size:16px;
                font-weight:600;
                color:#19304B;
                margin-bottom:14px;
              "
              id="projectTaskEditorTitle">
                Add Task
              </div>


              <!-- TASK TITLE -->

              <div style="
                margin-bottom:12px;
              ">

                <label style="
                  display:block;
                  margin-bottom:5px;
                  font-size:13px;
                  font-weight:600;
                  color:#475569;
                ">
                  Task
                </label>

                <input
                  id="projectTaskTitle"
                  type="text"
                  maxlength="200"
                  placeholder="Task title"
                  style="
                    width:100%;
                    box-sizing:border-box;
                    border:1px solid #CBD5E1;
                    border-radius:6px;
                    padding:9px 10px;
                    font:inherit;
                    color:#19304B;
                  "
                />

              </div>


              <!-- ASSIGNED / PRIORITY / DUE DATE -->

              <div style="
                display:grid;
                grid-template-columns:
                  minmax(0, 1fr)
                  minmax(0, 1fr)
                  minmax(0, 1fr);
                gap:12px;
                margin-bottom:12px;
              ">


                <!-- ASSIGNED TO -->

                <div>

                  <label style="
                    display:block;
                    margin-bottom:5px;
                    font-size:13px;
                    font-weight:600;
                    color:#475569;
                  ">
                    Assigned To
                  </label>

                  <select
                    id="projectTaskAssignedTo"
                    style="
                      width:100%;
                      box-sizing:border-box;
                      border:1px solid #CBD5E1;
                      border-radius:6px;
                      padding:9px 10px;
                      font:inherit;
                      color:#19304B;
                      background:#FFFFFF;
                    "
                  >

                    <option value="">
                      Unassigned
                    </option>

                    ${
                      currentProjectMembers
                        .map(member => {

                          const name =
                            member.full_name ||
                            member.username ||
                            member.email ||
                            'Project Member';

                          return `
                            <option
                              value="${escapeProjectHtml(
                                member.id
                              )}"
                            >
                              ${escapeProjectHtml(
                                name
                              )}
                            </option>
                          `;

                        })
                        .join('')
                    }

                  </select>

                </div>


                <!-- PRIORITY -->

                <div>

                  <label style="
                    display:block;
                    margin-bottom:5px;
                    font-size:13px;
                    font-weight:600;
                    color:#475569;
                  ">
                    Priority
                  </label>

                  <select
                    id="projectTaskPriority"
                    style="
                      width:100%;
                      box-sizing:border-box;
                      border:1px solid #CBD5E1;
                      border-radius:6px;
                      padding:9px 10px;
                      font:inherit;
                      color:#19304B;
                      background:#FFFFFF;
                    "
                  >

                    <option value="low">
                      Low
                    </option>

                    <option
                      value="normal"
                      selected
                    >
                      Normal
                    </option>

                    <option value="high">
                      High
                    </option>

                  </select>

                </div>


                <!-- DUE DATE -->

                <div>

                  <label style="
                    display:block;
                    margin-bottom:5px;
                    font-size:13px;
                    font-weight:600;
                    color:#475569;
                  ">
                    Due Date
                  </label>

                  <input
                    id="projectTaskDueDate"
                    type="date"
                    style="
                      width:100%;
                      box-sizing:border-box;
                      border:1px solid #CBD5E1;
                      border-radius:6px;
                      padding:9px 10px;
                      font:inherit;
                      color:#19304B;
                    "
                  />

                </div>


              </div>


              <!-- STATUS -->

              <div style="
                margin-bottom:12px;
              ">

                <label style="
                  display:block;
                  margin-bottom:5px;
                  font-size:13px;
                  font-weight:600;
                  color:#475569;
                ">
                  Status
                </label>

                <select
                  id="projectTaskStatus"
                  style="
                    width:100%;
                    box-sizing:border-box;
                    border:1px solid #CBD5E1;
                    border-radius:6px;
                    padding:9px 10px;
                    font:inherit;
                    color:#19304B;
                    background:#FFFFFF;
                  "
                >

                  <option
                    value="open"
                    selected
                  >
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


              <!-- DESCRIPTION -->

              <div style="
                margin-bottom:12px;
              ">

                <label style="
                  display:block;
                  margin-bottom:5px;
                  font-size:13px;
                  font-weight:600;
                  color:#475569;
                ">
                  Description
                </label>

                <textarea
                  id="projectTaskDescription"
                  rows="4"
                  placeholder="Optional task details..."
                  style="
                    width:100%;
                    box-sizing:border-box;
                    resize:vertical;
                    border:1px solid #CBD5E1;
                    border-radius:6px;
                    padding:10px;
                    font:inherit;
                    color:#19304B;
                  "
                ></textarea>

              </div>


              <!-- EDITOR BUTTONS -->

              <div style="
                display:flex;
                justify-content:flex-end;
                gap:8px;
              ">

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
                    border:none;
                    background:#19304B;
                    color:#FFFFFF;
                    border-radius:6px;
                    padding:8px 14px;
                    cursor:pointer;
                  "
                >
                  Save Task
                </button>

              </div>

            </div>

          `
          : ''
      }


      <!-- ===============================
           TASK LIST
           =============================== -->

      <div id="projectTasksList">

        ${renderTasksList()}

      </div>

    </div>

  `;

}


// ========================================
// RENDER TASK LIST
// ========================================

function renderTasksList(){

  const canEdit =
    currentUserCanEditProject();

  if(!currentProjectTasks.length){

    return `

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:28px;
        text-align:center;
        color:#64748B;
      ">

        ${
          showArchivedProjectTasks
            ? 'No archived tasks to show.'
            : 'No active tasks yet.'
        }

      </div>

    `;

  }

  return currentProjectTasks
    .map(task => {

      const assigned =
        task.assigned_user?.full_name ||
        task.assigned_user?.username ||
        task.assigned_user?.email ||
        'Unassigned';

      const creator =
        task.created_user?.full_name ||
        task.created_user?.username ||
        task.created_user?.email ||
        '';

      const statusLabel =
        task.status === 'in_progress'
          ? 'In Progress'
          : task.status === 'completed'
            ? 'Completed'
            : 'Open';

      const priorityLabel =
        task.priority === 'high'
          ? 'High'
          : task.priority === 'low'
            ? 'Low'
            : 'Normal';

      const priorityBackground =
        task.priority === 'high'
          ? '#FEF2F2'
          : task.priority === 'low'
            ? '#F8FAFC'
            : '#FFF7ED';

      const priorityColor =
        task.priority === 'high'
          ? '#B91C1C'
          : task.priority === 'low'
            ? '#64748B'
            : '#C2410C';

      const statusBackground =
        task.status === 'completed'
          ? '#F0FDF4'
          : task.status === 'in_progress'
            ? '#EFF6FF'
            : '#F8FAFC';

      const statusColor =
        task.status === 'completed'
          ? '#166534'
          : task.status === 'in_progress'
            ? '#1D4ED8'
            : '#475569';

      return `

        <div
          style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:8px;
            padding:16px;
            margin-bottom:10px;
          "
        >

          <div style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
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
                margin-bottom:7px;
              ">

                <div style="
                  font-size:16px;
                  font-weight:600;
                  color:#19304B;
                ">
                  ${escapeProjectHtml(
                    task.task_title
                  )}
                </div>


                <span style="
                  padding:3px 7px;
                  border-radius:4px;
                  background:${statusBackground};
                  color:${statusColor};
                  font-size:11px;
                  font-weight:600;
                ">
                  ${statusLabel}
                </span>


                <span style="
                  padding:3px 7px;
                  border-radius:4px;
                  background:${priorityBackground};
                  color:${priorityColor};
                  font-size:11px;
                  font-weight:600;
                ">
                  ${priorityLabel}
                </span>


                ${
                  task.archived
                    ? `
                      <span style="
                        padding:3px 7px;
                        border-radius:4px;
                        background:#F1F5F9;
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
                      color:#475569;
                      line-height:1.5;
                      white-space:pre-wrap;
                      margin-bottom:10px;
                    ">
                      ${escapeProjectHtml(
                        task.task_description
                      )}
                    </div>
                  `
                  : ''
              }


              <div style="
                display:flex;
                flex-wrap:wrap;
                gap:14px;
                color:#64748B;
                font-size:12px;
              ">

                <span>
                  <strong>
                    Assigned:
                  </strong>
                  ${escapeProjectHtml(
                    assigned
                  )}
                </span>


                ${
                  task.due_date
                    ? `
                      <span>
                        <strong>
                          Due:
                        </strong>
                        ${escapeProjectHtml(
                          task.due_date
                        )}
                      </span>
                    `
                    : ''
                }


                ${
                  creator
                    ? `
                      <span>
                        <strong>
                          Created by:
                        </strong>
                        ${escapeProjectHtml(
                          creator
                        )}
                      </span>
                    `
                    : ''
                }

              </div>

            </div>


            ${
              canEdit
                ? `

                  <div style="
                    display:flex;
                    gap:6px;
                    flex-shrink:0;
                    flex-wrap:wrap;
                    justify-content:flex-end;
                  ">

                    ${
                      task.archived
                        ? `
                          <button
                            type="button"
                            onclick="
                              window.restoreProjectTask &&
                              window.restoreProjectTask(
                                ${Number(task.id)}
                              );
                            "
                            style="
                              border:1px solid #DBE3EC;
                              background:#FFFFFF;
                              color:#19304B;
                              border-radius:5px;
                              padding:6px 9px;
                              cursor:pointer;
                              font-size:12px;
                            "
                          >
                            Restore
                          </button>
                        `
                        : `
                          <button
                            type="button"
                            onclick="
                              window.openProjectTaskEditor &&
                              window.openProjectTaskEditor(
                                ${Number(task.id)}
                              );
                            "
                            style="
                              border:1px solid #DBE3EC;
                              background:#FFFFFF;
                              color:#19304B;
                              border-radius:5px;
                              padding:6px 9px;
                              cursor:pointer;
                              font-size:12px;
                            "
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onclick="
                              window.archiveProjectTask &&
                              window.archiveProjectTask(
                                ${Number(task.id)}
                              );
                            "
                            style="
                              border:1px solid #DBE3EC;
                              background:#FFFFFF;
                              color:#64748B;
                              border-radius:5px;
                              padding:6px 9px;
                              cursor:pointer;
                              font-size:12px;
                            "
                          >
                            Archive
                          </button>
                        `
                    }


                    <button
                      type="button"
                      onclick="
                        window.deleteProjectTask &&
                        window.deleteProjectTask(
                          ${Number(task.id)}
                        );
                      "
                      style="
                        border:1px solid #FECACA;
                        background:#FFFFFF;
                        color:#B91C1C;
                        border-radius:5px;
                        padding:6px 9px;
                        cursor:pointer;
                        font-size:12px;
                      "
                    >
                      Delete
                    </button>

                  </div>

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
// SHOW TASK EDITOR
// ========================================

function showProjectTaskEditor(){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  editingProjectTaskId =
    null;

  const editor =
    document.getElementById(
      'projectTaskEditor'
    );

  const title =
    document.getElementById(
      'projectTaskEditorTitle'
    );

  const saveButton =
    document.getElementById(
      'saveProjectTaskButton'
    );

  const taskTitle =
    document.getElementById(
      'projectTaskTitle'
    );

  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );

  const priority =
    document.getElementById(
      'projectTaskPriority'
    );

  const status =
    document.getElementById(
      'projectTaskStatus'
    );

  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );

  const description =
    document.getElementById(
      'projectTaskDescription'
    );

  if(!editor){

    return;

  }

  if(title){

    title.textContent =
      'Add Task';

  }

  if(saveButton){

    saveButton.textContent =
      'Save Task';

  }

  if(taskTitle){

    taskTitle.value =
      '';

  }

  if(assignedTo){

    assignedTo.value =
      '';

  }

  if(priority){

    priority.value =
      'normal';

  }

  if(status){

    status.value =
      'open';

  }

  if(dueDate){

    dueDate.value =
      '';

  }

  if(description){

    description.value =
      '';

  }

  editor.style.display =
    'block';

  if(taskTitle){

    taskTitle.focus();

  }

}


// ========================================
// OPEN EXISTING TASK EDITOR
// ========================================

function openProjectTaskEditor(
  taskId
){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  const task =
    getProjectTask(
      taskId
    );

  if(!task){

    alert(
      'Task could not be found.'
    );

    return;

  }

  editingProjectTaskId =
    Number(task.id);

  const editor =
    document.getElementById(
      'projectTaskEditor'
    );

  const title =
    document.getElementById(
      'projectTaskEditorTitle'
    );

  const saveButton =
    document.getElementById(
      'saveProjectTaskButton'
    );

  const taskTitle =
    document.getElementById(
      'projectTaskTitle'
    );

  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );

  const priority =
    document.getElementById(
      'projectTaskPriority'
    );

  const status =
    document.getElementById(
      'projectTaskStatus'
    );

  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );

  const description =
    document.getElementById(
      'projectTaskDescription'
    );

  if(!editor){

    return;

  }

  if(title){

    title.textContent =
      'Edit Task';

  }

  if(saveButton){

    saveButton.textContent =
      'Save Changes';

  }

  if(taskTitle){

    taskTitle.value =
      task.task_title || '';

  }

  if(assignedTo){

    assignedTo.value =
      task.assigned_to
        ? String(
            task.assigned_to
          )
        : '';

  }

  if(priority){

    priority.value =
      task.priority ||
      'normal';

  }

  if(status){

    status.value =
      task.status ||
      'open';

  }

  if(dueDate){

    dueDate.value =
      task.due_date || '';

  }

  if(description){

    description.value =
      task.task_description ||
      '';

  }

  editor.style.display =
    'block';

  if(taskTitle){

    taskTitle.focus();

  }

}


// ========================================
// HIDE TASK EDITOR
// ========================================

function hideProjectTaskEditor(){

  const editor =
    document.getElementById(
      'projectTaskEditor'
    );

  if(editor){

    editor.style.display =
      'none';

  }

  editingProjectTaskId =
    null;

}


// ========================================
// SAVE TASK
// ========================================

async function saveProjectTask(){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  const taskTitle =
    document.getElementById(
      'projectTaskTitle'
    );

  const assignedTo =
    document.getElementById(
      'projectTaskAssignedTo'
    );

  const priority =
    document.getElementById(
      'projectTaskPriority'
    );

  const status =
    document.getElementById(
      'projectTaskStatus'
    );

  const dueDate =
    document.getElementById(
      'projectTaskDueDate'
    );

  const description =
    document.getElementById(
      'projectTaskDescription'
    );

  const button =
    document.getElementById(
      'saveProjectTaskButton'
    );

  const titleValue =
    String(
      taskTitle?.value || ''
    ).trim();

  if(!titleValue){

    alert(
      'Please enter a task title.'
    );

    taskTitle?.focus();

    return;

  }

  const taskData = {

    task_title:
      titleValue,

    task_description:
      String(
        description?.value || ''
      ).trim() ||
      null,

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

  };

  const isEditing =
    Number.isFinite(
      editingProjectTaskId
    );

  try{

    if(button){

      button.disabled =
        true;

      button.textContent =
        isEditing
          ? 'Saving...'
          : 'Creating...';

    }

    await saveProjectTaskToApi(
      taskData
    );

    editingProjectTaskId =
      null;

    hideProjectTaskEditor();

    currentProjectTasks =
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
        isEditing
          ? 'Save Changes'
          : 'Save Task';

    }

  }

}


// ========================================
// END PART 2
// ========================================

// ========================================
// TOGGLE ARCHIVED TASKS
// ========================================

async function toggleArchivedProjectTasks(){

  if(!currentProject){

    return;

  }

  showArchivedProjectTasks =
    !showArchivedProjectTasks;

  try{

    currentProjectTasks =
      await loadProjectTasks(
        currentProject.id,
        showArchivedProjectTasks
      );

    renderTasksTab();

  }catch(error){

    console.error(
      'Failed to load archived tasks:',
      error
    );

    showArchivedProjectTasks =
      !showArchivedProjectTasks;

    alert(
      error.message ||
      'Unable to load tasks.'
    );

  }

}


// ========================================
// ARCHIVE TASK
// ========================================

async function archiveProjectTask(
  taskId
){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  if(!currentProject){

    return;

  }

  const task =
    getProjectTask(
      taskId
    );

  if(!task){

    alert(
      'Task could not be found.'
    );

    return;

  }

  if(
    !confirm(
      `Archive "${task.task_title}"?`
    )
  ){

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
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${taskId}/archive`,
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
        'Failed to archive task.'
      );

    }

    currentProjectTasks =
      await loadProjectTasks(
        currentProject.id,
        showArchivedProjectTasks
      );

    renderTasksTab();

  }catch(error){

    console.error(
      'Failed to archive project task:',
      error
    );

    alert(
      error.message ||
      'Unable to archive task.'
    );

  }

}


// ========================================
// RESTORE TASK
// ========================================

async function restoreProjectTask(
  taskId
){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  if(!currentProject){

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
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${taskId}/restore`,
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
        'Failed to restore task.'
      );

    }

    currentProjectTasks =
      await loadProjectTasks(
        currentProject.id,
        showArchivedProjectTasks
      );

    renderTasksTab();

  }catch(error){

    console.error(
      'Failed to restore project task:',
      error
    );

    alert(
      error.message ||
      'Unable to restore task.'
    );

  }

}


// ========================================
// DELETE TASK
// ========================================

async function deleteProjectTask(
  taskId
){

  if(!currentUserCanEditProject()){

    alert(
      'You do not have permission to edit this project.'
    );

    return;

  }

  if(!currentProject){

    return;

  }

  const task =
    getProjectTask(
      taskId
    );

  if(!task){

    alert(
      'Task could not be found.'
    );

    return;

  }

  if(
    !confirm(
      `Permanently delete "${task.task_title}"? This cannot be undone.`
    )
  ){

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
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/tasks/${taskId}`,
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
        'Failed to delete task.'
      );

    }

    currentProjectTasks =
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


  if(tab === 'discussion'){

    content.innerHTML =
      renderDiscussion();

    return;

  }

}


// ========================================
// DISCUSSION
// ========================================


// ========================================
// LOAD DISCUSSION THREADS
// ========================================

async function loadProjectDiscussion(){

  if(
    !currentProject ||
    !currentProject.id
  ){

    return [];

  }


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
      `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/discussions`,
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
      'Failed to load discussion threads.'
    );

  }


  return Array.isArray(
    result.discussions
  )
    ? result.discussions
    : [];

}


// ========================================
// RENDER DISCUSSION
// ========================================

function renderDiscussion(){

  const canEdit =
    currentUserCanEditProject();


  return `

    <div>

      <!-- =================================
           HEADER
           ================================= -->

      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-bottom:18px;
      ">

        <div>

          <div style="
            font-size:18px;
            font-weight:600;
            color:#19304B;
          ">
            Discussion
          </div>

          <div style="
            margin-top:4px;
            color:#64748B;
            font-size:13px;
          ">
            Shared discussion for the project team.
          </div>

        </div>


        ${
          canEdit
            ? `
              <button
                type="button"
                onclick="
                  window.showNewProjectDiscussion &&
                  window.showNewProjectDiscussion();
                "
                style="
                  border:none;
                  border-radius:6px;
                  background:#19304B;
                  color:#FFFFFF;
                  padding:9px 14px;
                  font-size:13px;
                  font-weight:600;
                  cursor:pointer;
                "
              >
                Start New Discussion
              </button>
            `
            : ''
        }

      </div>


      <!-- =================================
           NEW DISCUSSION FORM
           ================================= -->

      ${
        canEdit
          ? `
            <div
              id="projectDiscussionEditor"
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
                font-size:16px;
                font-weight:600;
                color:#19304B;
                margin-bottom:14px;
              ">
                Start New Discussion
              </div>


              <div style="
                margin-bottom:12px;
              ">

                <label style="
                  display:block;
                  font-size:12px;
                  font-weight:600;
                  color:#475569;
                  margin-bottom:5px;
                ">
                  Discussion Title
                </label>

                <input
                  type="text"
                  id="projectDiscussionTitle"
                  maxlength="200"
                  placeholder="Enter a discussion title"
                  style="
                    width:100%;
                    box-sizing:border-box;
                    padding:9px 10px;
                    border:1px solid #DBE3EC;
                    border-radius:6px;
                    font-size:14px;
                  "
                >

              </div>


              <div style="
                margin-bottom:14px;
              ">

                <label style="
                  display:block;
                  font-size:12px;
                  font-weight:600;
                  color:#475569;
                  margin-bottom:5px;
                ">
                  Message
                </label>

                <textarea
                  id="projectDiscussionMessage"
                  rows="5"
                  placeholder="Enter the opening message..."
                  style="
                    width:100%;
                    box-sizing:border-box;
                    padding:10px;
                    border:1px solid #DBE3EC;
                    border-radius:6px;
                    font-size:14px;
                    resize:vertical;
                  "
                ></textarea>

              </div>


              <div style="
                display:flex;
                justify-content:flex-end;
                gap:8px;
              ">

                <button
                  type="button"
                  onclick="
                    window.hideNewProjectDiscussion &&
                    window.hideNewProjectDiscussion();
                  "
                  style="
                    border:1px solid #DBE3EC;
                    border-radius:6px;
                    background:#FFFFFF;
                    color:#475569;
                    padding:8px 14px;
                    cursor:pointer;
                  "
                >
                  Cancel
                </button>


                <button
                  type="button"
                  id="saveProjectDiscussionButton"
                  onclick="
                    window.saveNewProjectDiscussion &&
                    window.saveNewProjectDiscussion();
                  "
                  style="
                    border:none;
                    border-radius:6px;
                    background:#19304B;
                    color:#FFFFFF;
                    padding:8px 14px;
                    font-weight:600;
                    cursor:pointer;
                  "
                >
                  Start Discussion
                </button>

              </div>

            </div>
          `
          : ''
      }


      <!-- =================================
           THREAD LIST
           ================================= -->

      <div>

        ${
          currentProjectDiscussion.length
            ? currentProjectDiscussion
                .map(
                  discussion =>
                    renderDiscussionThreadCard(
                      discussion
                    )
                )
                .join('')
            : `
              <div style="
                background:#FFFFFF;
                border:1px solid #DBE3EC;
                border-radius:8px;
                padding:24px;
                text-align:center;
                color:#64748B;
              ">
                No discussion threads yet.
              </div>
            `
        }

      </div>

    </div>

  `;

}


// ========================================
// DISCUSSION THREAD CARD
// ========================================

function renderDiscussionThreadCard(
  discussion
){

  const title =
    escapeProjectHtml(
      discussion.title ||
      'Untitled Discussion'
    );


  const creator =
    discussion.creator?.full_name ||
    discussion.creator?.username ||
    discussion.creator?.email ||
    'Project Member';


  const replyCount =
    Number(
      discussion.reply_count || 0
    );


  const updated =
    formatNoteDate(
      discussion.updated_at ||
      discussion.created_at
    );


  return `

    <div
      onclick="
        window.openProjectDiscussion &&
        window.openProjectDiscussion(
          ${Number(discussion.id)}
        );
      "
      style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:16px 18px;
        margin-bottom:10px;
        cursor:pointer;
        transition:box-shadow .15s ease;
      "
    >

      <div style="
        display:flex;
        justify-content:space-between;
        gap:16px;
        align-items:flex-start;
      ">

        <div style="
          min-width:0;
        ">

          <div style="
            font-size:15px;
            font-weight:600;
            color:#19304B;
            margin-bottom:5px;
          ">
            ${title}
          </div>

          <div style="
            font-size:12px;
            color:#64748B;
          ">
            Started by
            ${escapeProjectHtml(creator)}
          </div>

        </div>


        <div style="
          flex-shrink:0;
          font-size:12px;
          color:#64748B;
          text-align:right;
        ">

          <div>
            ${
              replyCount === 1
                ? '1 post'
                : `${replyCount} posts`
            }
          </div>

          <div style="
            margin-top:3px;
          ">
            ${escapeProjectHtml(updated)}
          </div>

        </div>

      </div>

    </div>

  `;

}


// ========================================
// SHOW NEW DISCUSSION
// ========================================

function showNewProjectDiscussion(){

  const editor =
    document.getElementById(
      'projectDiscussionEditor'
    );

  const title =
    document.getElementById(
      'projectDiscussionTitle'
    );

  const message =
    document.getElementById(
      'projectDiscussionMessage'
    );


  if(editor){

    editor.style.display =
      'block';

  }


  if(title){

    title.value =
      '';

    title.focus();

  }


  if(message){

    message.value =
      '';

  }

}


// ========================================
// HIDE NEW DISCUSSION
// ========================================

function hideNewProjectDiscussion(){

  const editor =
    document.getElementById(
      'projectDiscussionEditor'
    );


  if(editor){

    editor.style.display =
      'none';

  }

}


// ========================================
// SAVE NEW DISCUSSION
// ========================================

async function saveNewProjectDiscussion(){

  const titleInput =
    document.getElementById(
      'projectDiscussionTitle'
    );

  const messageInput =
    document.getElementById(
      'projectDiscussionMessage'
    );

  const button =
    document.getElementById(
      'saveProjectDiscussionButton'
    );


  const title =
    String(
      titleInput?.value || ''
    ).trim();


  const messageText =
    String(
      messageInput?.value || ''
    ).trim();


  if(!title){

    alert(
      'Please enter a discussion title.'
    );

    titleInput?.focus();

    return;

  }


  if(!messageText){

    alert(
      'Please enter a discussion message.'
    );

    messageInput?.focus();

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

    if(button){

      button.disabled =
        true;

      button.textContent =
        'Starting...';

    }


    const response =
      await fetch(
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/discussions`,
        {
          method:'POST',

          headers:{
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' + token
          },

          body:JSON.stringify({

            title:
              title,

            message_text:
              messageText

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
        'Failed to start discussion.'
      );

    }


    currentProjectDiscussion =
      await loadProjectDiscussion();


    renderDiscussionTab();


  }catch(error){

    console.error(
      'Failed to create discussion:',
      error
    );


    alert(
      error.message ||
      'Unable to start discussion.'
    );


  }finally{

    if(button){

      button.disabled =
        false;

      button.textContent =
        'Start Discussion';

    }

  }

}


// ========================================
// OPEN DISCUSSION THREAD
// ========================================

async function openProjectDiscussion(
  discussionId
){

  if(
    !currentProject ||
    !currentProject.id
  ){

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


  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  content.innerHTML = `

    <div style="
      background:#FFFFFF;
      border:1px solid #DBE3EC;
      border-radius:8px;
      padding:24px;
      color:#64748B;
      text-align:center;
    ">
      Loading discussion...
    </div>

  `;


  try{

    const response =
      await fetch(
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/discussions/${discussionId}`,
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
        'Failed to load discussion.'
      );

    }


    renderProjectDiscussionThread(
      result.discussion,
      result.posts || []
    );


  }catch(error){

    console.error(
      'Failed to open discussion:',
      error
    );


    alert(
      error.message ||
      'Unable to open discussion.'
    );


    currentProjectDiscussion =
      await loadProjectDiscussion();

    renderDiscussionTab();

  }

}


// ========================================
// RENDER DISCUSSION THREAD
// ========================================

function renderProjectDiscussionThread(
  discussion,
  posts
){

  const canEdit =
    currentUserCanEditProject();


  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  const title =
    escapeProjectHtml(
      discussion?.title ||
      'Discussion'
    );


  content.innerHTML = `

    <div>

      <!-- =================================
           BACK
           ================================= -->

      <button
        type="button"
        onclick="
          window.renderProjectDiscussionList &&
          window.renderProjectDiscussionList();
        "
        style="
          border:none;
          background:transparent;
          color:#19304B;
          padding:0;
          margin-bottom:16px;
          cursor:pointer;
          font-size:13px;
          font-weight:600;
        "
      >
        ← Back to Discussion
      </button>


      <!-- =================================
           THREAD HEADER
           ================================= -->

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:18px;
        margin-bottom:12px;
      ">

        <div style="
          font-size:18px;
          font-weight:600;
          color:#19304B;
          margin-bottom:5px;
        ">
          ${title}
        </div>

        <div style="
          font-size:12px;
          color:#64748B;
        ">
          ${
            escapeProjectHtml(
              discussion?.creator?.full_name ||
              discussion?.creator?.username ||
              discussion?.creator?.email ||
              'Project Member'
            )
          }
        </div>

      </div>


      <!-- =================================
           POSTS
           ================================= -->

      ${
        posts.length
          ? posts
              .map(
                post =>
                  renderDiscussionPost(
                    post
                  )
              )
              .join('')
          : `
            <div style="
              background:#FFFFFF;
              border:1px solid #DBE3EC;
              border-radius:8px;
              padding:20px;
              color:#64748B;
            ">
              No posts in this discussion.
            </div>
          `
      }


      <!-- =================================
           REPLY
           ================================= -->

      ${
        canEdit
          ? `
            <div style="
              background:#FFFFFF;
              border:1px solid #DBE3EC;
              border-radius:8px;
              padding:18px;
              margin-top:12px;
            ">

              <div style="
                font-size:14px;
                font-weight:600;
                color:#19304B;
                margin-bottom:8px;
              ">
                Reply
              </div>

              <textarea
                id="projectDiscussionReply"
                rows="4"
                placeholder="Add a reply..."
                style="
                  width:100%;
                  box-sizing:border-box;
                  padding:10px;
                  border:1px solid #DBE3EC;
                  border-radius:6px;
                  font-size:14px;
                  resize:vertical;
                "
              ></textarea>


              <div style="
                display:flex;
                justify-content:flex-end;
                margin-top:10px;
              ">

                <button
                  type="button"
                  id="projectDiscussionReplyButton"
                  onclick="
                    window.saveProjectDiscussionReply &&
                    window.saveProjectDiscussionReply(
                      ${Number(discussion.id)}
                    );
                  "
                  style="
                    border:none;
                    border-radius:6px;
                    background:#19304B;
                    color:#FFFFFF;
                    padding:8px 14px;
                    font-weight:600;
                    cursor:pointer;
                  "
                >
                  Post Reply
                </button>

              </div>

            </div>
          `
          : ''
      }

    </div>

  `;

}


// ========================================
// RENDER DISCUSSION POST
// ========================================

function renderDiscussionPost(
  post
){

  const author =
    post?.author?.full_name ||
    post?.author?.username ||
    post?.author?.email ||
    'Project Member';


  return `

    <div style="
      background:#FFFFFF;
      border:1px solid #DBE3EC;
      border-radius:8px;
      padding:16px 18px;
      margin-bottom:10px;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:8px;
      ">

        <div style="
          font-size:13px;
          font-weight:600;
          color:#19304B;
        ">
          ${escapeProjectHtml(author)}
        </div>

        <div style="
          font-size:12px;
          color:#64748B;
        ">
          ${escapeProjectHtml(
            formatNoteDate(
              post.created_at
            )
          )}
        </div>

      </div>


      <div style="
        color:#334155;
        line-height:1.6;
        white-space:pre-wrap;
      ">
        ${escapeProjectHtml(
          post.message_text
        )}
      </div>

    </div>

  `;

}


// ========================================
// SAVE DISCUSSION REPLY
// ========================================

async function saveProjectDiscussionReply(
  discussionId
){

  const textarea =
    document.getElementById(
      'projectDiscussionReply'
    );

  const button =
    document.getElementById(
      'projectDiscussionReplyButton'
    );


  const messageText =
    String(
      textarea?.value || ''
    ).trim();


  if(!messageText){

    alert(
      'Please enter a reply.'
    );

    textarea?.focus();

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

    if(button){

      button.disabled =
        true;

      button.textContent =
        'Posting...';

    }


    const response =
      await fetch(
        `${PROJECTS_API_BASE}/api/projects/${currentProject.id}/discussions/${discussionId}/posts`,
        {
          method:'POST',

          headers:{
            'Content-Type':
              'application/json',

            'Authorization':
              'Bearer ' + token
          },

          body:JSON.stringify({

            message_text:
              messageText

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
        'Failed to add reply.'
      );

    }


    await openProjectDiscussion(
      discussionId
    );


  }catch(error){

    console.error(
      'Failed to save discussion reply:',
      error
    );


    alert(
      error.message ||
      'Unable to add reply.'
    );


  }finally{

    if(button){

      button.disabled =
        false;

      button.textContent =
        'Post Reply';

    }

  }

}


// ========================================
// RENDER DISCUSSION TAB
// ========================================

function renderDiscussionTab(){

  const content =
    document.getElementById(
      'projectWorkspaceContent'
    );


  if(!content){

    return;

  }


  content.innerHTML =
    renderDiscussion();

}


// ========================================
// LOAD AND RENDER DISCUSSION
// ========================================

async function openDiscussionTab(){

  try{

    currentProjectDiscussion =
      await loadProjectDiscussion();

    renderDiscussionTab();

  }catch(error){

    console.error(
      'Failed to load discussion:',
      error
    );


    alert(
      error.message ||
      'Unable to load discussion.'
    );

  }

}


// ========================================
// RETURN TO DISCUSSION LIST
// ========================================

async function renderProjectDiscussionList(){

  try{

    currentProjectDiscussion =
      await loadProjectDiscussion();

    renderDiscussionTab();

  }catch(error){

    console.error(
      'Failed to reload discussions:',
      error
    );


    alert(
      error.message ||
      'Unable to load discussion threads.'
    );

  }

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

  currentProjectTasks =
    [];

  currentProjectDiscussion =
    [];

  editingProjectTaskId =
    null;

  showArchivedProjectTasks =
    false;

}


// ========================================
// END PART 3
// ========================================

// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.openProjectWorkspace =
  openProjectWorkspace;


window.closeProjectWorkspace =
  closeProjectWorkspace;


window.selectProjectTab =
  selectProjectTab;


// ----------------------------------------
// NOTES
// ----------------------------------------

window.showProjectNoteEditor =
  showProjectNoteEditor;


window.hideProjectNoteEditor =
  hideProjectNoteEditor;


window.saveProjectNote =
  saveProjectNote;


// ----------------------------------------
// TASKS
// ----------------------------------------

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

window.showNewProjectDiscussion =
  showNewProjectDiscussion;

window.hideNewProjectDiscussion =
  hideNewProjectDiscussion;

window.saveNewProjectDiscussion =
  saveNewProjectDiscussion;

window.openProjectDiscussion =
  openProjectDiscussion;

window.saveProjectDiscussionReply =
  saveProjectDiscussionReply;

window.renderProjectDiscussionList =
  renderProjectDiscussionList;


// ----------------------------------------
// DISCUSSION
// ----------------------------------------

window.saveProjectDiscussion =
  saveProjectDiscussion;


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


// ========================================
// FORMAT PROJECT DATES
// ========================================

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


// ========================================
// FORMAT DATE / TIME
// ========================================

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


// ========================================
// CAPITALIZE
// ========================================

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


// ========================================
// END PROJECT WORKSPACE
// ========================================
