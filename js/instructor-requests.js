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

      const container =
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
          <div style="
            color:#6B7280;
            text-align:center;
            padding:40px 20px;
          ">
            No staffing requests found.
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
            style="
              display:grid;
              grid-template-columns:
                70px
                1fr
                120px
                120px
                120px;
              gap:10px;
              padding:10px;
              border-bottom:1px solid #DBE3EC;
              cursor:pointer;
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

    if(!modal){
      return;
    }

    modal.classList.remove(
      'hidden'
    );

    modal.style.display =
      'block';

    modal.style.zIndex =
      '99999';

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

      const priority =
        document.getElementById(
          'assignmentRequestPriority'
        )?.value;

      const region =
        document.getElementById(
          'assignmentRequestRegion'
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
              priority,
              region,

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

      closeCreateAssignmentRequest();

      await loadAssignmentRequests();

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
// REQUEST DETAILS
// ========================================

window.openAssignmentRequestDetails =
  async function(requestId){

    console.log(
      'Open request:',
      requestId
    );

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

    if(!modal){
      return;
    }

    modal.classList.add(
      'hidden'
    );

    modal.style.display =
      'none';

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

// ========================================
// EVENT SELECTION
// ========================================

window.selectedAssignmentEvents =
  [];

console.log(
    'Selected Events:',
    window.selectedAssignmentEvents
);

window.toggleEventSelectionPanel =
  function(){

  const panel =
    document.getElementById(
        'eventSelectionPanel'
    );

if(!panel){
    return;
}

if(
    panel.style.display ===
    'block'
){

    panel.style.display =
        'none';

    document.getElementById(
        'useSelectedEventsButton'
    ).style.display =
        'none';

    return;

}

panel.style.display =
    'block';

document.getElementById(
    'useSelectedEventsButton'
).style.display =
    'block';

const futureEvents =
  events
    .filter(event => {

      return (
        event.date &&
        new Date(event.date) >=
        new Date()
      );

    })
    .sort((a,b) => {

      return (
        new Date(a.date) -
        new Date(b.date)
      );

    });

panel.innerHTML =
    futureEvents.map(event => `

<label style="
    display:block;
    padding:6px 0;
    border-bottom:1px solid #DBE3EC;
">

<input
    type="checkbox"
    class="assignment-event-checkbox"
    data-id="${event.id}"
>

<strong>
    ${event.date}
</strong>

<div style="
    font-size:11px;
    color:#6B7280;
    margin-left:22px;
    line-height:1.3;
">
    ${event.title}
</div>

</label>

`).join('');

    };
window.saveSelectedEvents =
function(){

    const checked =
        document.querySelectorAll(
            '.assignment-event-checkbox:checked'
        );

    const selected =
        [];

    checked.forEach(box => {

        const event =
            events.find(e =>
                String(e.id) ===
                box.dataset.id
            );

        if(event){

            selected.push({

                event_id:
                    event.id,

                event_title:
                    event.title,

                event_date:
                    event.date

            });

        }

    });

    window.selectedAssignmentEvents =
        selected;

    document.getElementById(
        'eventSelectionPanel'
    ).style.display =
        'none';

    document.getElementById(
        'useSelectedEventsButton'
    ).style.display =
        'none';

    const region =
        document.getElementById(
            'assignmentRequestRegion'
        ).value;

    loadAssignmentInstructors(
        region
    );

};

// ========================================
// RENDER SELECTED EVENTS
// ========================================

window.renderSelectedAssignmentEvents =
function(){

    const container =
        document.getElementById(
            'assignmentRequestEvents'
        );

    if(!container){
        return;
    }

    if(
        window.selectedAssignmentEvents.length === 0
    ){

        container.innerHTML =
            'No events selected.';

        return;

    }

    container.innerHTML =
        window.selectedAssignmentEvents
            .map(event => `

<div
    style="
        border:1px solid #DBE3EC;
        border-radius:6px;
        padding:12px;
        margin-bottom:16px;
        background:#FAFBFC;
    "
>

    <div
        style="
            font-size:15px;
            font-weight:600;
            color:#19304B;
            margin-bottom:4px;
        "
    >
        ${event.event_title}
    </div>

    <div
        style="
            font-size:12px;
            color:#6B7280;
            margin-bottom:12px;
        "
    >
        ${event.event_date}
    </div>

    <div
        style="
            display:flex;
            gap:20px;
            margin-bottom:10px;
        "
    >

        <div>

            <label>
                Show Time
            </label>

            <br>

            <input
                type="time"
                class="assignment-show-time"
                data-event="${event.event_id}"
            >

        </div>

        <div>

            <label>
                Instructors Needed
            </label>

            <br>

            <input
                type="number"
                min="1"
                value="1"
                class="assignment-needed"
                data-event="${event.event_id}"
                style="
                    width:70px;
                "
            >

        </div>

    </div>

    <div
        style="
            margin-bottom:12px;
        "
    >

        <label>
            Event Notes
        </label>

        <textarea
            class="assignment-event-notes"
            data-event="${event.event_id}"
            rows="2"
            style="
                width:100%;
                margin-top:4px;
            "
        ></textarea>

    </div>

    <div
        style="
            font-weight:600;
            margin-bottom:8px;
        "
    >
        Assign Instructors
    </div>

    <div>

        ${
            (window.assignmentInstructors || [])
            .map(instructor => `

<label
    style="
        display:block;
        padding:4px 0;
    "
>

<input
    type="checkbox"
    class="assignment-instructor"
    data-event="${event.event_id}"
    data-instructor="${instructor.id}"
>

${instructor.username}

</label>

`)
            .join('')
        }

    </div>

</div>

`)
            .join('');

};

// ========================================
// LOAD ASSIGNMENT INSTRUCTORS
// ========================================

window.loadAssignmentInstructors =
async function(region){

    try{

        const token =
            localStorage.getItem(
                'token'
            );

        const response =
            await fetch(

                `https://ndow-calendar-server.onrender.com/api/assignment-instructors?region=${encodeURIComponent(region)}`,

                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );

        const result =
            await response.json();

        console.log(
            'Assignment Instructors:',
            result
        );

 window.assignmentInstructors =
    result.instructors || [];

renderSelectedAssignmentEvents();

    }

    catch(err){

        console.error(
            'Unable to load instructors',
            err
        );

    }

};
