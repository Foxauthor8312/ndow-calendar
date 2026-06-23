// ========================================
// INSTRUCTOR REQUEST CENTER
// ========================================

const ASSIGNMENT_API =
  'https://ndow-calendar-server.onrender.com/api';

// ========================================
// LOAD ASSIGNMENT REQUESTS
// ========================================

window.loadAssignmentRequests =
  async function(){

    try {

      const token =
        localStorage.getItem('token');

      const response =
        await fetch(
          `${ASSIGNMENT_API}/assignment-requests`,
          {
            headers:{
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const result =
        await response.json();

      if(!result.success){

        throw new Error(
          result.message ||
          'Failed to load requests'
        );

      }
document.getElementById(
  'assignmentRequestRows'
);

      if(!container){
        return;
      }

      if(
        !result.requests ||
        result.requests.length === 0
      ){

        container.innerHTML = `
          <div class="empty-state">
            No assignment requests found.
          </div>
        `;

        return;

      }

      container.innerHTML =
        result.requests.map(request => `

          <div
            class="request-row"
            onclick="
              openAssignmentRequestDetails(
                ${request.id}
              )
            "
          >

            <div>
              #${request.id}
            </div>

            <div>
              ${request.title || ''}
            </div>

            <div>
              ${request.region || ''}
            </div>

            <div>
              ${request.priority || ''}
            </div>

            <div>
              ${request.status || ''}
            </div>

          </div>

        `).join('');

    } catch(err){

      console.error(
        'loadAssignmentRequests',
        err
      );

    }

  };

// ========================================
// OPEN CREATE REQUEST
// ========================================

window.openCreateAssignmentRequest =
  function(){

    const modal =
      document.getElementById(
        'createAssignmentRequestModal'
      );

    if(modal){

      modal.classList.remove(
        'hidden'
      );

    }

  };

// ========================================
// SAVE ASSIGNMENT REQUEST
// ========================================

window.saveAssignmentRequest =
  async function(){

    try {

      const token =
        localStorage.getItem('token');

      const title =
        document.getElementById(
          'assignmentRequestTitle'
        )?.value?.trim();

      const notes =
        document.getElementById(
          'assignmentRequestNotes'
        )?.value?.trim();

      const priority =
        document.getElementById(
          'assignmentRequestPriority'
        )?.value;

      const region =
        document.getElementById(
          'assignmentRequestRegion'
        )?.value;

      const programId =
        document.getElementById(
          'assignmentRequestProgram'
        )?.value;

      const selectedEvents =
        window.selectedAssignmentEvents || [];

      if(
        !title ||
        selectedEvents.length === 0
      ){

        alert(
          'Title and at least one event are required.'
        );

        return;

      }

      const response =
        await fetch(
          `${ASSIGNMENT_API}/assignment-requests`,
          {
            method:'POST',

            headers:{
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`
            },

            body:JSON.stringify({

              title,

              notes,

              priority,

              region,

              program_id:
                programId,

              events:
                selectedEvents

            })
          }
        );

      const result =
        await response.json();

      if(!result.success){

        throw new Error(
          result.message
        );

      }

      alert(
        'Assignment request created.'
      );

      await loadAssignmentRequests();

      const modal =
        document.getElementById(
          'createAssignmentRequestModal'
        );

      if(modal){

       closeCreateAssignmentRequest();

      }

    } catch(err){

      console.error(
        'saveAssignmentRequest',
        err
      );

      alert(
        err.message ||
        'Unable to save request.'
      );

    }

  };

// ========================================
// OPEN REQUEST DETAILS
// ========================================

window.openAssignmentRequestDetails =
  async function(requestId){

    try {

      const token =
        localStorage.getItem('token');

      const response =
        await fetch(
          `${ASSIGNMENT_API}/assignment-requests/${requestId}`,
          {
            headers:{
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const result =
        await response.json();

      if(!result.success){

        throw new Error(
          result.message
        );

      }

      console.log(
        'Assignment Request',
        result
      );

      // Next phase:
      // populate request details modal

    } catch(err){

      console.error(
        'openAssignmentRequestDetails',
        err
      );

    }

  };

// ========================================
// CLOSE CREATE REQUEST
// ========================================

window.closeCreateAssignmentRequest =
  function(){

    const modal =
      document.getElementById(
        'createAssignmentRequestModal'
      );

    if(modal){

      modal.classList.add(
        'hidden'
      );

    }

  };
// ========================================
// INITIALIZE REQUEST CENTER
// ========================================

window.initializeInstructorRequests =
  async function(){

    try {

      await loadAssignmentRequests();

    } catch(err){

      console.error(
        'initializeInstructorRequests',
        err
      );

    }

  };
