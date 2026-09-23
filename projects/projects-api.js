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
