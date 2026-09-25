/*
==============================================================================
 NDOW Volunteer Portal
 Projects UI
------------------------------------------------------------------------------
 Module      : projects-ui.js
 Layer       : Frontend UI

 Purpose:
    Projects entry point and project selection.

==============================================================================
*/

'use strict';

import {
  loadMyProjects,
  createProject
} from './projects-api.js';


// ========================================
// OPEN PROJECTS WORKSPACE
// ========================================

export async function openProjectsWorkspace(){

  console.log(
    'Opening Projects Workspace...'
  );


  try{

    const projects =
      await loadMyProjects();


    console.log(
      'Projects loaded:',
      projects
    );


    renderProjectsWorkspace(
      projects
    );


  }catch(error){

    console.error(
      'Failed to open Projects Workspace:',
      error
    );

    alert(
      error.message ||
      'Unable to load Projects.'
    );

  }

}


// ========================================
// RENDER PROJECTS WORKSPACE
// ========================================

function renderProjectsWorkspace(
  projects
){

  let workspace =
    document.getElementById(
      'projectsWorkspace'
    );


  if(!workspace){

    workspace =
      document.createElement(
        'div'
      );

    workspace.id =
      'projectsWorkspace';

    workspace.style.cssText = `
      position:fixed;
      inset:0;
      z-index:10000;
      background:#F8FAFC;
      overflow:auto;
    `;

    document.body.appendChild(
      workspace
    );

  }


  workspace.innerHTML = `

    <div style="
      max-width:1200px;
      margin:0 auto;
      padding:24px;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:24px;
      ">

        <div>

          <div style="
            font-size:24px;
            font-weight:700;
            color:#19304B;
          ">
            Projects
          </div>

          <div style="
            margin-top:4px;
            color:#64748B;
            font-size:14px;
          ">
            Shared project workspaces
          </div>

        </div>

         <div style="
          display:flex;
          gap:8px;
          align-items:center;
        ">

          <button
            type="button"
            onclick="openNewProjectForm()"
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
            + New Project
          </button>

          <button
            type="button"
            onclick="closeProjectsWorkspace()"
            style="
              border:1px solid #DBE3EC;
              background:#FFFFFF;
              color:#19304B;
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Close
          </button>

        </div>

      </div>

      <div id="projectsList"></div>

    </div>

  `;


  const list =
    document.getElementById(
      'projectsList'
    );


  if(!projects.length){

    list.innerHTML = `

      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:24px;
        color:#64748B;
      ">
        You are not currently a member of any projects.
      </div>

    `;

    return;

  }


  list.innerHTML =
    projects
      .map(project => `

        <div
          style="
            background:#FFFFFF;
            border:1px solid #DBE3EC;
            border-radius:8px;
            padding:18px;
            margin-bottom:12px;
            cursor:pointer;
          "
          onclick="
            window.openProjectWorkspace &&
            window.openProjectWorkspace(
              ${Number(project.id)}
            );
          "
        >

          <div style="
            font-size:18px;
            font-weight:600;
            color:#19304B;
          ">
            ${escapeProjectHtml(
              project.project_name
            )}
          </div>

          <div style="
            margin-top:6px;
            color:#64748B;
            font-size:14px;
          ">

            ${formatProjectDates(
              project.start_date,
              project.end_date
            )}

          </div>

        </div>

      `)
      .join('');

}

// ========================================
// NEW PROJECT FORM
// ========================================

function openNewProjectForm(){

  const existing =
    document.getElementById(
      'newProjectModal'
    );

  if(existing){

    existing.remove();

  }


  const modal =
    document.createElement(
      'div'
    );

  modal.id =
    'newProjectModal';

  modal.style.cssText = `
    position:fixed;
    inset:0;
    z-index:11000;
    background:rgba(15,23,42,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
  `;


  modal.innerHTML = `

    <div style="
      width:100%;
      max-width:520px;
      background:#FFFFFF;
      border:1px solid #DBE3EC;
      border-radius:10px;
      box-shadow:0 12px 40px rgba(15,23,42,.20);
      padding:24px;
    ">

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:20px;
      ">

        <div style="
          font-size:20px;
          font-weight:700;
          color:#19304B;
        ">
          New Project
        </div>

        <button
          type="button"
          id="newProjectCloseButton"
          style="
            border:0;
            background:transparent;
            color:#64748B;
            font-size:20px;
            cursor:pointer;
          "
        >
          ✕
        </button>

      </div>


      <div style="margin-bottom:16px;">

        <label style="
          display:block;
          margin-bottom:6px;
          font-size:13px;
          font-weight:600;
          color:#19304B;
        ">
          Project Name
        </label>

        <input
          id="newProjectName"
          type="text"
          maxlength="150"
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px 12px;
            border:1px solid #DBE3EC;
            border-radius:6px;
            font-size:14px;
          "
        >

      </div>


      <div style="margin-bottom:16px;">

        <label style="
          display:block;
          margin-bottom:6px;
          font-size:13px;
          font-weight:600;
          color:#19304B;
        ">
          Description
        </label>

        <textarea
          id="newProjectDescription"
          rows="4"
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px 12px;
            border:1px solid #DBE3EC;
            border-radius:6px;
            font-size:14px;
            resize:vertical;
          "
        ></textarea>

      </div>


      <div style="
        display:flex;
        gap:10px;
        margin-bottom:20px;
      ">

        <div style="flex:1;">

          <label style="
            display:block;
            margin-bottom:6px;
            font-size:13px;
            font-weight:600;
            color:#19304B;
          ">
            Start Date
          </label>

          <input
            id="newProjectStartDate"
            type="date"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px 12px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:14px;
            "
          >

        </div>


        <div style="flex:1;">

          <label style="
            display:block;
            margin-bottom:6px;
            font-size:13px;
            font-weight:600;
            color:#19304B;
          ">
            End Date
          </label>

          <input
            id="newProjectEndDate"
            type="date"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px 12px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:14px;
            "
          >

        </div>

      </div>


      <div style="
        display:flex;
        justify-content:flex-end;
        gap:8px;
      ">

        <button
          type="button"
          id="newProjectCancelButton"
          style="
            border:1px solid #DBE3EC;
            background:#FFFFFF;
            color:#19304B;
            border-radius:6px;
            padding:9px 16px;
            cursor:pointer;
          "
        >
          Cancel
        </button>

        <button
          type="button"
          id="newProjectCreateButton"
          style="
            border:1px solid #19304B;
            background:#19304B;
            color:#FFFFFF;
            border-radius:6px;
            padding:9px 16px;
            cursor:pointer;
            font-weight:600;
          "
        >
          Create Project
        </button>

      </div>

      <div
        id="newProjectError"
        style="
          display:none;
          margin-top:14px;
          color:#DC2626;
          font-size:13px;
        "
      ></div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  document
    .getElementById(
      'newProjectCloseButton'
    )
    .onclick =
      () => modal.remove();


  document
    .getElementById(
      'newProjectCancelButton'
    )
    .onclick =
      () => modal.remove();


  document
    .getElementById(
      'newProjectCreateButton'
    )
    .onclick =
      async () => {

        const nameInput =
          document.getElementById(
            'newProjectName'
          );

        const descriptionInput =
          document.getElementById(
            'newProjectDescription'
          );

        const startDateInput =
          document.getElementById(
            'newProjectStartDate'
          );

        const endDateInput =
          document.getElementById(
            'newProjectEndDate'
          );

        const errorBox =
          document.getElementById(
            'newProjectError'
          );

        const createButton =
          document.getElementById(
            'newProjectCreateButton'
          );


        const projectName =
          nameInput.value.trim();


        if(!projectName){

          errorBox.textContent =
            'Project name is required.';

          errorBox.style.display =
            'block';

          nameInput.focus();

          return;

        }


        errorBox.style.display =
          'none';


        createButton.disabled =
          true;

        createButton.textContent =
          'Creating...';


        try{

          const project =
            await createProject({

              project_name:
                projectName,

              description:
                descriptionInput.value.trim(),

              start_date:
                startDateInput.value ||
                null,

              end_date:
                endDateInput.value ||
                null,

              status:
                'Active'

            });


          console.log(
            'Project created:',
            project
          );


          modal.remove();


          await openProjectsWorkspace();


        }catch(error){

          console.error(
            'Create project failed:',
            error
          );


          errorBox.textContent =
            error.message ||
            'Unable to create project.';

          errorBox.style.display =
            'block';


          createButton.disabled =
            false;

          createButton.textContent =
            'Create Project';

        }

      };

}


window.openNewProjectForm =
  openNewProjectForm;

// ========================================
// CLOSE PROJECTS WORKSPACE
// ========================================

export function closeProjectsWorkspace(){

  const workspace =
    document.getElementById(
      'projectsWorkspace'
    );

  if(workspace){

    workspace.remove();

  }

}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.openProjectsWorkspace =
  openProjectsWorkspace;

window.closeProjectsWorkspace =
  closeProjectsWorkspace;


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

  if(!startDate){

    return '';

  }


  if(!endDate){

    return startDate;

  }


  return `${startDate} – ${endDate}`;

}
