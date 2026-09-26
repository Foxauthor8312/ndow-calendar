// ========================================
// NDOW INSTRUCTOR REFERENCE LIBRARY
// ========================================

const INSTRUCTOR_REFERENCE_API =
  'https://ndow-calendar-server.onrender.com/api/instructor-reference';

let instructorReferenceDocuments = [];


// ========================================
// OPEN LIBRARY
// ========================================

async function openInstructorReferenceLibrary(){

  const workspace =
    document.getElementById(
      'instructorReferenceWorkspace'
    );

  if(!workspace){
    console.error(
      'Instructor Reference Library workspace not found.'
    );

    return;
  }

  workspace.classList.remove(
    'hidden'
  );

  workspace.style.display =
    'flex';

  await loadInstructorReferenceLibrary();

}


// ========================================
// CLOSE LIBRARY
// ========================================

function closeInstructorReferenceLibrary(){

  const workspace =
    document.getElementById(
      'instructorReferenceWorkspace'
    );

  if(!workspace){
    return;
  }

  workspace.classList.add(
    'hidden'
  );

  workspace.style.display =
    'none';

}


// ========================================
// LOAD DOCUMENTS
// ========================================

async function loadInstructorReferenceLibrary(){

  const root =
    document.getElementById(
      'instructorReferenceRoot'
    );

  if(!root){
    console.error(
      'Instructor Reference Library root not found.'
    );

    return;
  }

  root.innerHTML = `
    <div
      style="
        padding:40px;
        color:#19304B;
        font-size:15px;
      "
    >
      Loading Reference Library...
    </div>
  `;

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        INSTRUCTOR_REFERENCE_API,
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.error ||
        'Unable to load Reference Library.'
      );

    }

    instructorReferenceDocuments =
      data.documents || [];

    renderInstructorReferenceLibrary();

  }catch(error){

    console.error(
      'Reference Library load error:',
      error
    );

    root.innerHTML = `
      <div
        style="
          padding:40px;
          color:#DC2626;
          font-weight:600;
        "
      >
        Unable to load the Instructor Reference Library.
      </div>
    `;

  }

}


// ========================================
// RENDER LIBRARY
// ========================================

function renderInstructorReferenceLibrary(){

  const root =
    document.getElementById(
      'instructorReferenceRoot'
    );

  if(!root){
    return;
  }

  const categories = [

    {
      name:'Emergency Procedures',
      description:
        'Emergency response and first-aid reference materials.'
    },

    {
      name:'NDOW Policies',
      description:
        'NDOW policies, procedures, and administrative references.'
    },

    {
      name:'Angling Education',
      description:
        'Angling instruction and educational reference materials.'
    },

    {
      name:'Hunter Education',
      description:
        'Hunter education instructional reference materials.'
    },

    {
      name:'Wildlife Discovery',
      description:
        'Wildlife education and discovery reference materials.'
    }

  ];

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      ) || '{}'
    );

  const isAdmin =
    user.role === 'admin' ||
    user.role === 'superuser';


  root.innerHTML = `

    <div
      style="
        height:100%;
        display:flex;
        flex-direction:column;
        background:#F8FAFC;
      "
    >

      <!-- HEADER -->

      <div
        style="
          background:#19304B;
          color:white;
          padding:16px 22px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          flex-shrink:0;
        "
      >

        <div>

          <div
            style="
              font-size:20px;
              font-weight:700;
            "
          >
            Instructor Reference Library
          </div>

          <div
            style="
              font-size:12px;
              opacity:.82;
              margin-top:3px;
            "
          >
            NDOW instructional reference materials
          </div>

        </div>

        <div
          style="
            display:flex;
            gap:8px;
            align-items:center;
          "
        >

          ${
            isAdmin
              ? `
                <button
                  onclick="
                    openAddInstructorReference();
                  "
                  style="
                    background:white;
                    color:#19304B;
                    border:none;
                    border-radius:6px;
                    padding:8px 14px;
                    cursor:pointer;
                    font-weight:600;
                  "
                >
                  + Add Reference
                </button>
              `
              : ''
          }

          <button
            onclick="
              closeInstructorReferenceLibrary();
            "
            style="
              background:transparent;
              color:white;
              border:1px solid rgba(255,255,255,.55);
              border-radius:6px;
              padding:8px 14px;
              cursor:pointer;
            "
          >
            Close
          </button>

        </div>

      </div>


      <!-- CONTENT -->

      <div
        style="
          flex:1;
          overflow:auto;
          padding:28px;
        "
      >

        <div
          style="
            max-width:1100px;
            margin:0 auto;
          "
        >

          <div
            style="
              font-size:14px;
              color:#475569;
              margin-bottom:20px;
            "
          >
            Select a reference category.
          </div>


          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(
                  auto-fit,
                  minmax(220px,1fr)
                );
              gap:16px;
            "
          >

            ${
              categories.map(
                category => {

                  const count =
                    instructorReferenceDocuments
                      .filter(
                        document =>
                          document.category ===
                          category.name
                      )
                      .length;

                  return `

                    <button
                        onclick='
                          openInstructorReferenceCategory(
                            ${JSON.stringify(category.name)}
                          );
                        '
                      "
                      style="
                        text-align:left;
                        background:white;
                        border:1px solid #DBE3EC;
                        border-radius:8px;
                        padding:20px;
                        cursor:pointer;
                        box-shadow:
                          0 1px 3px
                          rgba(0,0,0,.05);
                      "
                    >

                      <div
                        style="
                          font-size:16px;
                          font-weight:700;
                          color:#19304B;
                          margin-bottom:8px;
                        "
                      >
                        ${category.name}
                      </div>

                      <div
                        style="
                          font-size:13px;
                          line-height:1.45;
                          color:#64748B;
                          min-height:38px;
                        "
                      >
                        ${category.description}
                      </div>

                      <div
                        style="
                          margin-top:14px;
                          font-size:12px;
                          font-weight:600;
                          color:#589FD6;
                        "
                      >
                        ${count}
                        ${
                          count === 1
                            ? ' reference'
                            : ' references'
                        }
                      </div>

                    </button>

                  `;

                }
              ).join('')
            }

          </div>

        </div>

      </div>

    </div>

  `;

}


// ========================================
// OPEN CATEGORY
// ========================================

function openInstructorReferenceCategory(
  category
){

  const documents =
    instructorReferenceDocuments.filter(
      document =>
        document.category ===
        category
    );

  const root =
    document.getElementById(
      'instructorReferenceRoot'
    );

  if(!root){
    return;
  }

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      ) || '{}'
    );

  const isAdmin =
    user.role === 'admin' ||
    user.role === 'superuser';


  root.innerHTML = `

    <div
      style="
        height:100%;
        display:flex;
        flex-direction:column;
        background:#F8FAFC;
      "
    >

      <div
        style="
          background:#19304B;
          color:white;
          padding:16px 22px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        "
      >

        <div>

          <button
            onclick="
              renderInstructorReferenceLibrary();
            "
            style="
              background:transparent;
              color:white;
              border:none;
              padding:0;
              margin-bottom:5px;
              cursor:pointer;
              font-size:12px;
            "
          >
            ← Reference Library
          </button>

          <div
            style="
              font-size:20px;
              font-weight:700;
            "
          >
            ${category}
          </div>

        </div>

        <button
          onclick="
            closeInstructorReferenceLibrary();
          "
          style="
            background:transparent;
            color:white;
            border:1px solid rgba(255,255,255,.55);
            border-radius:6px;
            padding:8px 14px;
            cursor:pointer;
          "
        >
          Close
        </button>

      </div>


      <div
        style="
          flex:1;
          overflow:auto;
          padding:28px;
        "
      >

        <div
          style="
            max-width:1000px;
            margin:0 auto;
          "
        >

          ${
            documents.length === 0
              ? `
                <div
                  style="
                    background:white;
                    border:1px solid #DBE3EC;
                    border-radius:8px;
                    padding:30px;
                    color:#64748B;
                    text-align:center;
                  "
                >
                  No reference documents are currently
                  available in this category.
                </div>
              `
              :
              documents.map(
                document => `

                  <div
                    style="
                      background:white;
                      border:1px solid #DBE3EC;
                      border-radius:8px;
                      padding:16px 18px;
                      margin-bottom:10px;
                      display:flex;
                      align-items:center;
                      justify-content:space-between;
                      gap:16px;
                    "
                  >

                    <div>

                      <div
                        style="
                          font-size:15px;
                          font-weight:700;
                          color:#19304B;
                        "
                      >
                        ${escapeInstructorReferenceHtml(
                          document.title
                        )}
                      </div>

                      <div
                        style="
                          font-size:12px;
                          color:#64748B;
                          margin-top:4px;
                        "
                      >
                        ${escapeInstructorReferenceHtml(
                          document.file_name
                        )}
                      </div>

                    </div>


                    <div
                      style="
                        display:flex;
                        gap:8px;
                        align-items:center;
                        flex-shrink:0;
                      "
                    >

                      <button
                        onclick="
                          openInstructorReferenceDocument(
                            ${Number(document.id)}
                          );
                        "
                        style="
                          background:#19304B;
                          color:white;
                          border:none;
                          border-radius:6px;
                          padding:8px 14px;
                          cursor:pointer;
                          font-weight:600;
                        "
                      >
                        Open PDF
                      </button>

                      ${
                        isAdmin
                          ? `
                            <button
                              onclick="
                                toggleInstructorReferenceStatus(
                                  ${Number(document.id)},
                                  ${document.active}
                                );
                              "
                              style="
                                background:white;
                                color:#19304B;
                                border:1px solid #DBE3EC;
                                border-radius:6px;
                                padding:8px 12px;
                                cursor:pointer;
                              "
                            >
                              ${
                                document.active
                                  ? 'Hide'
                                  : 'Unhide'
                              }
                            </button>
                          `
                          : ''
                      }

                    </div>

                  </div>

                `
              ).join('')
          }

        </div>

      </div>

    </div>

  `;

}


// ========================================
// OPEN PDF
// ========================================

async function openInstructorReferenceDocument(
  documentId
){

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        `${INSTRUCTOR_REFERENCE_API}/${documentId}/view`,
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.error ||
        'Unable to open document.'
      );

    }

    window.open(
      data.url,
      '_blank'
    );

  }catch(error){

    console.error(
      'Reference document open error:',
      error
    );

    alert(
      error.message ||
      'Unable to open reference document.'
    );

  }

}


// ========================================
// TOGGLE HIDDEN STATUS
// ========================================

async function toggleInstructorReferenceStatus(
  documentId,
  currentActive
){

  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        `${INSTRUCTOR_REFERENCE_API}/${documentId}/status`,
        {
          method:'PATCH',

          headers:{
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body:JSON.stringify({
            active:
              !currentActive
          })
        }
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.error ||
        'Unable to update document status.'
      );

    }

    await loadInstructorReferenceLibrary();

  }catch(error){

    console.error(
      'Reference document status error:',
      error
    );

    alert(
      error.message ||
      'Unable to update document status.'
    );

  }

}


// ========================================
// ADD REFERENCE
// ========================================

function openAddInstructorReference(){

  const modal =
    document.getElementById(
      'instructorReferenceUploadModal'
    );

  if(!modal){
    console.error(
      'Reference upload modal not found.'
    );

    return;
  }

  modal.classList.remove(
    'hidden'
  );

  modal.style.display =
    'flex';

}


// ========================================
// CLOSE ADD REFERENCE
// ========================================

function closeAddInstructorReference(){

  const modal =
    document.getElementById(
      'instructorReferenceUploadModal'
    );

  if(!modal){
    return;
  }

  modal.classList.add(
    'hidden'
  );

  modal.style.display =
    'none';

}


// ========================================
// UPLOAD REFERENCE
// ========================================

async function uploadInstructorReference(){

  const fileInput =
    document.getElementById(
      'instructorReferenceFile'
    );

  const titleInput =
    document.getElementById(
      'instructorReferenceTitle'
    );

  const categoryInput =
    document.getElementById(
      'instructorReferenceCategory'
    );

  if(
    !fileInput ||
    !titleInput ||
    !categoryInput
  ){

    alert(
      'Reference upload form is unavailable.'
    );

    return;

  }

  const file =
    fileInput.files[0];

  const title =
    titleInput.value.trim();

  const category =
    categoryInput.value;


  if(!file){

    alert(
      'Please select a PDF file.'
    );

    return;

  }

  if(
    file.type !==
    'application/pdf'
  ){

    alert(
      'Only PDF files are allowed.'
    );

    return;

  }

  if(!title){

    alert(
      'Please enter a document title.'
    );

    return;

  }

  if(!category){

    alert(
      'Please select a category.'
    );

    return;

  }


  const formData =
    new FormData();

  formData.append(
    'file',
    file
  );

  formData.append(
    'title',
    title
  );

  formData.append(
    'category',
    category
  );


  try{

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        INSTRUCTOR_REFERENCE_API,
        {
          method:'POST',

          headers:{
            Authorization:
              `Bearer ${token}`
          },

          body:
            formData
        }
      );

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.success
    ){

      throw new Error(
        data.error ||
        'Unable to upload reference document.'
      );

    }


    closeAddInstructorReference();

    fileInput.value =
      '';

    titleInput.value =
      '';

    categoryInput.value =
      '';


    await loadInstructorReferenceLibrary();

    alert(
      'Reference document added successfully.'
    );

  }catch(error){

    console.error(
      'Reference document upload error:',
      error
    );

    alert(
      error.message ||
      'Unable to upload reference document.'
    );

  }

}


// ========================================
// HTML ESCAPE
// ========================================

function escapeInstructorReferenceHtml(
  value
){

  return String(
    value ?? ''
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
// GLOBAL FUNCTIONS
// ========================================

window.openInstructorReferenceLibrary =
  openInstructorReferenceLibrary;

window.closeInstructorReferenceLibrary =
  closeInstructorReferenceLibrary;

window.openInstructorReferenceCategory =
  openInstructorReferenceCategory;

window.openInstructorReferenceDocument =
  openInstructorReferenceDocument;

window.toggleInstructorReferenceStatus =
  toggleInstructorReferenceStatus;

window.openAddInstructorReference =
  openAddInstructorReference;

window.closeAddInstructorReference =
  closeAddInstructorReference;

window.uploadInstructorReference =
  uploadInstructorReference;
