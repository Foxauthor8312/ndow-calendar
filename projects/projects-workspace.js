/*
==============================================================================
 NDOW Volunteer Portal
 Project Workspace
------------------------------------------------------------------------------
 Module      : projects-workspace.js
 Layer       : Frontend Workspace

 Purpose:
    Individual project workspace.

 Initial Responsibilities:
    • Open selected project
    • Establish workspace shell

==============================================================================
*/

'use strict';


// ========================================
// OPEN PROJECT
// ========================================

export function openProjectWorkspace(
  projectId
){

  console.log(
    'Opening project:',
    projectId
  );


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

    <div style="
      max-width:1200px;
      margin:0 auto;
      padding:24px;
    ">

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
          margin-bottom:20px;
        "
      >
        ← Back to Projects
      </button>


      <div style="
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        padding:24px;
      ">

        <div style="
          font-size:24px;
          font-weight:700;
          color:#19304B;
        ">
          Project Workspace
        </div>

        <div style="
          margin-top:8px;
          color:#64748B;
        ">
          Project ID:
          ${Number(projectId)}
        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    workspace
  );

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

}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.openProjectWorkspace =
  openProjectWorkspace;

window.closeProjectWorkspace =
  closeProjectWorkspace;
