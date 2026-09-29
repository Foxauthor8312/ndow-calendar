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
// OPEN EMERGENCY REFERENCES
// ========================================

async function openInstructorEmergencyReferences(){

  await openInstructorReferenceLibrary();

  openInstructorReferenceCategory(
    'Emergency Procedures'
  );

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
                    type="button"
                    onclick="openInstructorReferenceCategory('${category.name}')"
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


  /*
  --------------------------------------------------
  Emergency Procedures has no folders.
  Show documents directly.
  --------------------------------------------------
  */

  if(
    category ===
    'Emergency Procedures'
  ){

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
                    No emergency reference documents
                    are currently available.
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
            openEditInstructorReference(
              ${Number(document.id)}
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
          Edit
        </button>

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

    return;
  }


  /*
  --------------------------------------------------
  All other categories use folders.
  --------------------------------------------------
  */

  const folders = [
    {
      name:'Lessons',
      description:
        'Lesson plans and instructional materials.'
    },
    {
      name:'Worksheets',
      description:
        'Student worksheets and activity materials.'
    },
    {
      name:'Flyers & Handouts',
      description:
        'Flyers, handouts, and printable materials.'
    },
    {
      name:'Resources',
      description:
        'Additional instructor reference resources.'
    }
  ];


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

          <div
            style="
              font-size:14px;
              color:#475569;
              margin-bottom:20px;
            "
          >
            Select a reference folder.
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
              folders.map(
                folder => {

                  const count =
                    documents.filter(
                      document =>
                        document.folder ===
                        folder.name
                    ).length;

                    return `

                    <button
                      type="button"
                      class="instructor-reference-folder-button"
                      data-category="${escapeInstructorReferenceHtml(category)}"
                      data-folder="${escapeInstructorReferenceHtml(folder.name)}"
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
                        ${folder.name}
                      </div>

                      <div
                        style="
                          font-size:13px;
                          line-height:1.45;
                          color:#64748B;
                          min-height:38px;
                        "
                      >
                        ${folder.description}
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

  root
    .querySelectorAll(
      '.instructor-reference-folder-button'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            openInstructorReferenceFolder(
              button.dataset.category,
              button.dataset.folder
            );

          }
        );

      }
    );

}
// ========================================
// OPEN REFERENCE FOLDER
// ========================================


  const documents =
    instructorReferenceDocuments.filter(
      document =>
        document.category === category &&
        document.folder === folder
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
  type="button"
  id="instructorReferenceBackButton"
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
  ← ${escapeInstructorReferenceHtml(category)}
</button>

          <div
            style="
              font-size:20px;
              font-weight:700;
            "
          >
            ${escapeInstructorReferenceHtml(folder)}
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
                  available in this folder.
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
            openEditInstructorReference(
              ${Number(document.id)}
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
          Edit
        </button>

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
// TOGGLE ADD REFERENCE FOLDER
// ========================================

function toggleInstructorReferenceFolder(
  select
){

  const folderGroup =
    document.getElementById(
      'instructorReferenceFolderGroup'
    );

  const folderSelect =
    document.getElementById(
      'instructorReferenceFolder'
    );

  if(
    !folderGroup ||
    !folderSelect
  ){

    return;

  }

  if(
    select.value ===
    'Emergency Procedures'
  ){

    folderGroup.style.display =
      'none';

    folderSelect.value =
      '';

    return;

  }

  if(select.value){

    folderGroup.style.display =
      'block';

  }else{

    folderGroup.style.display =
      'none';

    folderSelect.value =
      '';

  }

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

  const folderInput =
    document.getElementById(
      'instructorReferenceFolder'
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

  const folder =
    folderInput
      ? folderInput.value
      : '';


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

  if(
    category !==
    'Emergency Procedures' &&
    !folder
  ){

    alert(
      'Please select a reference folder.'
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

  if(
    category !==
    'Emergency Procedures'
  ){

    formData.append(
      'folder',
      folder
    );

  }


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

    if(folderInput){

      folderInput.value =
        '';

    }

    const folderGroup =
      document.getElementById(
        'instructorReferenceFolderGroup'
      );

    if(folderGroup){

      folderGroup.style.display =
        'none';

    }


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
// EDIT REFERENCE DOCUMENT
// ========================================

function openEditInstructorReference(
  documentId
){

  const referenceDocument =
    instructorReferenceDocuments.find(
      item =>
        Number(item.id) ===
        Number(documentId)
    );

  if(!referenceDocument){

    alert(
      'Reference document could not be found.'
    );

    return;

  }


  let modal =
    document.getElementById(
      'instructorReferenceEditModal'
    );


  if(!modal){

    modal =
      document.createElement(
        'div'
      );

    modal.id =
      'instructorReferenceEditModal';

    modal.style.cssText = `
      position:fixed;
      inset:0;
      z-index:99999;
      display:flex;
      align-items:center;
      justify-content:center;
      background:rgba(0,0,0,.55);
      padding:20px;
    `;

    modal.innerHTML = `

      <div
        style="
          width:min(560px,100%);
          background:#ffffff;
          border-radius:12px;
          padding:24px;
          box-shadow:0 20px 60px rgba(0,0,0,.30);
        "
      >

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:20px;
          "
        >

          <h2
            style="
              margin:0;
              color:#19304B;
            "
          >
            Edit Reference Document
          </h2>

          <button
            type="button"
            onclick="closeEditInstructorReference()"
            style="
              border:0;
              background:none;
              font-size:22px;
              cursor:pointer;
            "
          >
            ✕
          </button>

        </div>


        <label
          style="
            display:block;
            margin-bottom:6px;
            font-weight:600;
          "
        >
          Document Title
        </label>

        <input
          id="instructorReferenceEditTitle"
          type="text"
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px;
            margin-bottom:18px;
          "
        />


        <label
          style="
            display:block;
            margin-bottom:6px;
            font-weight:600;
          "
        >
          Category
        </label>

        <select
          id="instructorReferenceEditCategory"
          onchange="
            toggleInstructorReferenceEditFolder(this);
          "
          style="
            width:100%;
            box-sizing:border-box;
            padding:10px;
            margin-bottom:18px;
          "
        >

          <option value="">
            Select category
          </option>

          <option value="Emergency Procedures">
            Emergency Procedures
          </option>

          <option value="NDOW Policies">
            NDOW Policies
          </option>

          <option value="Angling Education">
            Angling Education
          </option>

          <option value="Hunter Education">
            Hunter Education
          </option>

          <option value="Wildlife Discovery">
            Wildlife Discovery
          </option>

        </select>


        <div
          id="instructorReferenceEditFolderGroup"
          style="
            display:none;
            margin-bottom:20px;
          "
        >

          <label
            style="
              display:block;
              margin-bottom:6px;
              font-weight:600;
            "
          >
            Folder
          </label>

          <select
            id="instructorReferenceEditFolder"
            style="
              width:100%;
              box-sizing:border-box;
              padding:10px;
            "
          >

            <option value="">
              Select folder
            </option>

            <option value="Lessons">
              Lessons
            </option>

            <option value="Worksheets">
              Worksheets
            </option>

            <option value="Flyers & Handouts">
              Flyers & Handouts
            </option>

            <option value="Resources">
              Resources
            </option>

          </select>

        </div>


        <div
          style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
            margin-top:24px;
          "
        >

          <button
            type="button"
            onclick="
              closeEditInstructorReference();
            "
            style="
              padding:10px 18px;
              cursor:pointer;
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onclick="
              saveInstructorReferenceEdit();
            "
            style="
              padding:10px 18px;
              cursor:pointer;
            "
          >
            Save Changes
          </button>

        </div>

      </div>

    `;

    document.body.appendChild(
      modal
    );

  }


  const titleInput =
    document.getElementById(
      'instructorReferenceEditTitle'
    );

  const categoryInput =
    document.getElementById(
      'instructorReferenceEditCategory'
    );

  const folderInput =
    document.getElementById(
      'instructorReferenceEditFolder'
    );


  titleInput.value =
    referenceDocument.title ||
    '';

  categoryInput.value =
    referenceDocument.category ||
    '';

  folderInput.value =
    referenceDocument.folder ||
    '';


  modal.dataset.documentId =
    referenceDocument.id;


  toggleInstructorReferenceEditFolder(
    categoryInput
  );


  modal.style.display =
    'flex';

}


// ========================================
// TOGGLE EDIT FOLDER
// ========================================

function toggleInstructorReferenceEditFolder(
  select
){

  const folderGroup =
    document.getElementById(
      'instructorReferenceEditFolderGroup'
    );

  const folderSelect =
    document.getElementById(
      'instructorReferenceEditFolder'
    );

  if(
    !folderGroup ||
    !folderSelect
  ){

    return;

  }


  if(
    select.value ===
    'Emergency Procedures'
  ){

    folderGroup.style.display =
      'none';

    folderSelect.value =
      '';

    return;

  }


  if(select.value){

    folderGroup.style.display =
      'block';

  }else{

    folderGroup.style.display =
      'none';

    folderSelect.value =
      '';

  }

}


// ========================================
// CLOSE EDIT REFERENCE
// ========================================

function closeEditInstructorReference(){

  const modal =
    document.getElementById(
      'instructorReferenceEditModal'
    );

  if(!modal){
    return;
  }

  modal.style.display =
    'none';

}


// ========================================
// SAVE EDIT REFERENCE
// ========================================

async function saveInstructorReferenceEdit(){

  const modal =
    document.getElementById(
      'instructorReferenceEditModal'
    );

  if(!modal){

    return;

  }


  const documentId =
    modal.dataset.documentId;


  const titleInput =
    document.getElementById(
      'instructorReferenceEditTitle'
    );

  const categoryInput =
    document.getElementById(
      'instructorReferenceEditCategory'
    );

  const folderInput =
    document.getElementById(
      'instructorReferenceEditFolder'
    );


  const title =
    titleInput.value.trim();

  const category =
    categoryInput.value;

  const folder =
    folderInput.value;


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


  if(
    category !==
    'Emergency Procedures' &&
    !folder
  ){

    alert(
      'Please select a reference folder.'
    );

    return;

  }


  try{

    const token =
      localStorage.getItem(
        'token'
      );


    const response =
      await fetch(
        `${INSTRUCTOR_REFERENCE_API}/${documentId}`,
        {
          method:'PATCH',

          headers:{
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body:
            JSON.stringify({

              title,

              category,

              folder:
                category ===
                'Emergency Procedures'
                  ? null
                  : folder

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
        'Unable to update reference document.'
      );

    }


    closeEditInstructorReference();


    await loadInstructorReferenceLibrary();


    /*
    ------------------------------------
    Return to the document's new location
    ------------------------------------
    */

    if(
      category ===
      'Emergency Procedures'
    ){

      openInstructorReferenceCategory(
        category
      );

    }else{

      openInstructorReferenceCategory(
        category
      );

      openInstructorReferenceFolder(
        category,
        folder
      );

    }


    alert(
      'Reference document updated successfully.'
    );


  }catch(error){

    console.error(
      'Reference document edit error:',
      error
    );

    alert(
      error.message ||
      'Unable to update reference document.'
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
// GLOBAL REFERENCE FUNCTIONS
// ========================================

window.openAddInstructorReference =
  openAddInstructorReference;

window.closeAddInstructorReference =
  closeAddInstructorReference;

window.toggleInstructorReferenceFolder =
  toggleInstructorReferenceFolder;

window.openEditInstructorReference =
  openEditInstructorReference;

window.toggleInstructorReferenceEditFolder =
  toggleInstructorReferenceEditFolder;

window.closeEditInstructorReference =
  closeEditInstructorReference;

window.saveInstructorReferenceEdit =
  saveInstructorReferenceEdit;


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.openInstructorReferenceLibrary =
  openInstructorReferenceLibrary;

window.openInstructorEmergencyReferences =
  openInstructorEmergencyReferences;

window.closeInstructorReferenceLibrary =
  closeInstructorReferenceLibrary;

window.openInstructorReferenceCategory =
  openInstructorReferenceCategory;

window.openInstructorReferenceFolder =
  openInstructorReferenceFolder;

window.openInstructorReferenceDocument =
  openInstructorReferenceDocument;

window.toggleInstructorReferenceStatus =
  toggleInstructorReferenceStatus;

window.toggleInstructorReferenceFolder =
  toggleInstructorReferenceFolder;

window.openAddInstructorReference =
  openAddInstructorReference;

window.closeAddInstructorReference =
  closeAddInstructorReference;

window.uploadInstructorReference =
  uploadInstructorReference;
