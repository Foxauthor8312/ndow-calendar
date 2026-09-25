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
  loadMyProjects
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
