/*
==============================================================================
 NDOW Volunteer Portal
 Projects API
------------------------------------------------------------------------------
 Module      : projects-api.js
 Layer       : Frontend API

 Purpose:
    Project workspace API communication.

 Initial Responsibilities:
    • Load projects for the authenticated user
    • Return project membership permission

==============================================================================
*/

'use strict';


// ========================================
// API BASE
// ========================================

const PROJECTS_API_BASE =
  'https://ndow-calendar-server.onrender.com';


// ========================================
// GET MY PROJECTS
// ========================================

export async function loadMyProjects(){

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


  return Array.isArray(
    result.projects
  )
    ? result.projects
    : [];

}

// ========================================
// CREATE PROJECT
// ========================================

export async function createProject({

  project_name,
  description = '',
  start_date = null,
  end_date = null,
  status = 'Active'

}){

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
      `${PROJECTS_API_BASE}/api/projects`,
      {
        method:'POST',

        headers:{
          'Content-Type':
            'application/json',

          'Authorization':
            'Bearer ' + token
        },

        body:JSON.stringify({

          project_name,

          description,

          start_date,

          end_date,

          status

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
      result.error ||
      result.message ||
      'Failed to create project.'
    );

  }


  return result.project;

}

export async function updateProject(
  projectId,
  {
    project_name,
    description,
    start_date,
    end_date,
    status
  }
){

  const token =
    localStorage.getItem('token');

  const response =
    await fetch(
      `${PROJECTS_API_BASE}/api/projects/${projectId}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
          'Authorization':
            `Bearer ${token}`
        },

        body: JSON.stringify({
          project_name,
          description,
          start_date,
          end_date,
          status
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok || !data.success){
    throw new Error(
      data.error ||
      'Failed to update project'
    );
  }

  return data.project;
}
