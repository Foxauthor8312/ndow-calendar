async function loadHelpTopics(){

  const topicList =
    document.getElementById(
      'helpTopicList'
    );

 const helpContent =
  document.getElementById(
    'helpContentArea'
  );

  if(
    !topicList ||
    !helpContent
  ){
    return;
  }

  topicList.innerHTML = `
    <div style="
      padding:16px;
      color:#6b7280;
      font-size:14px;
    ">
      Loading help topics...
    </div>
  `;

  helpContent.innerHTML = `
    <div style="
      padding:16px;
      overflow-y:auto;
	  max-height:65vh;
      color:#6b7280;
    ">
      Select a help topic from the left.
    </div>
  `;

  try {

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        'https://ndow-calendar-server.onrender.com/api/help/topics',
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const topics =
      await response.json();

	console.log(
	  'HELP TOPICS:',
	  topics
	);
	  
    topicList.innerHTML = '';

const topicArray =
  topics.topics || topics;

window.helpTopics =
  topicArray;

renderHelpTopicList(
  topicArray
);

const searchBox =
  document.getElementById(
    'helpSearch'
  );

if(
  searchBox &&
  !searchBox.dataset.bound
){

  searchBox.dataset.bound =
    'true';

  searchBox.addEventListener(
    'input',
    function(){

      const search =
        this.value
          .toLowerCase()
          .trim();

      const filtered =
        topicArray.filter(
          topic =>
            (topic.title || '')
              .toLowerCase()
              .includes(search)
            ||
            (topic.content || '')
              .toLowerCase()
              .includes(search)
            ||
            (topic.category || '')
              .toLowerCase()
              .includes(search)
        );

      renderHelpTopicList(
        filtered
      );

    }
  );

}


  } catch(err){

    console.error(
      'HELP LOAD FAILED:',
      err
    );

    topicList.innerHTML = `
      <div style="
        padding:16px;
        color:#dc2626;
        font-size:14px;
      ">
        Failed to load help topics.
      </div>
    `;

  }

}

function renderHelpTopicList(
  topics
){

  const topicList =
    document.getElementById(
      'helpTopicList'
    );

  const helpContent =
    document.getElementById(
      'helpContentArea'
    );

  topicList.innerHTML = '';

  topics.forEach(topic => {

    const item =
      document.createElement('div');

    item.style.padding =
      '12px 14px';

    item.style.borderBottom =
      '1px solid #e5e7eb';

    item.style.cursor =
      'pointer';

    item.style.fontWeight =
      '600';

    item.style.fontSize =
      '14px';

    item.style.color =
      '#19304B';

    item.style.borderLeft =
      '4px solid transparent';

    item.innerText =
      topic.title;

    item.onclick = () => {

      document
        .querySelectorAll(
          '#helpTopicList > div'
        )
        .forEach(el => {

          el.style.background =
            '';

          el.style.borderLeft =
            '4px solid transparent';

        });

      item.style.background =
        '#eef4ff';

      item.style.borderLeft =
        '4px solid #19304B';

      helpContent.innerHTML = `
        <div style="
          padding:16px;
          max-width:900px;
        ">

          <h2 style="
            margin-top:0;
            margin-bottom:16px;
            color:#19304B;
          ">
            ${topic.title}
          </h2>

          <div style="
            line-height:1.8;
            font-size:15px;
            color:#374151;
            white-space:pre-wrap;
          ">
            ${topic.content || ''}
          </div>

        </div>
      `;

    };

    topicList.appendChild(item);

  });

  if(
    topics.length > 0 &&
    topicList.firstChild
  ){
    topicList.firstChild.click();
  }

}

function openHelpTopic(topic){

  const helpContent =
    document.getElementById(
      'helpContentArea'
    );

  if(!helpContent){
    return;
  }

  helpContent.innerHTML = `
    <div style="
      padding:16px;
      max-width:900px;
    ">

      <h2 style="
        margin-top:0;
        margin-bottom:16px;
        color:#19304B;
      ">
        ${topic.title}
      </h2>

      <div style="
        line-height:1.8;
        font-size:15px;
        color:#374151;
        white-space:pre-wrap;
      ">
        ${topic.content || ''}
      </div>

    </div>
  `;

}

function showContextHelp(topicKey){

  fetch(
    'https://ndow-calendar-server.onrender.com/api/help/topics'
  )
  .then(response => response.json())
  .then(data => {

    const topics =
      data.topics || data;

    const topic =
      topics.find(
        t => t.topic_key === topicKey
      );

    if(!topic){
      console.log(
        'HELP TOPIC NOT FOUND:',
        topicKey
      );
      return;
    }

   const modal =
  document.getElementById(
    'helpModal'
  );

modal.classList.remove(
  'hidden'
);

modal.style.display =
  'flex';

window.contextHelpActive =
  true;
	  
loadHelpTopics().then(() => {

  openHelpTopic(topic);
window.contextHelpActive =
  false;
});

  })
  .catch(err => {

    console.error(
      'CONTEXT HELP ERROR:',
      err
    );

  });

}	
async function openHelpModal(){

  const modal =
    document.getElementById(
      'helpModal'
    );

  modal.classList.remove('hidden');

  modal.style.display = 'flex';

  await loadHelpTopics();

}

function closeHelpModal(){

  const modal =
    document.getElementById(
      'helpModal'
    );

 modal.classList.add('hidden');

  modal.style.display = 'none';

}

async function saveHelpTopic(){

  try {

    const payload = {

      id:
        document.getElementById(
          'helpEditId'
        ).value,

      category:
        document.getElementById(
          'helpCategory'
        ).value,

      topic_key:
        document.getElementById(
          'helpTopicKey'
        ).value,

      title:
        document.getElementById(
          'helpTitle'
        ).value,

      sort_order:
        document.getElementById(
          'helpSortOrder'
        ).value,

	  visibility_role:
	    document.getElementById(
         'helpVisibilityRole'
         ).value,
		
      content:
        document.getElementById(
          'helpContent'
        ).value

    };

    const response =
      await fetch(
       'https://ndow-calendar-server.onrender.com/api/help/save',
        {
          method:'POST',
          headers:{
            'Content-Type':
              'application/json'
          },
          body:JSON.stringify(payload)
        }
      );

    const data =
      await response.json();

    if(data.success){

      document.getElementById(
        'helpAdminMessage'
      ).innerText =
        'Topic saved';

      await loadHelpTopics();

      renderHelpAdminList();

    }

  } catch(err){

    console.error(err);

  }

}

function newHelpTopic(){

  document.getElementById(
    'helpEditId'
  ).value = '';

  document.getElementById(
    'helpCategory'
  ).value = '';

  document.getElementById(
    'helpTopicKey'
  ).value = '';

  document.getElementById(
    'helpTitle'
  ).value = '';

document.getElementById(
  'helpVisibilityRole'
).value = 'all';

document.getElementById(
  'helpCategory'
).value =
  'Getting Started';

document.getElementById(
  'helpSortOrder'
).value =
  helpCategoryOrders[
    'Getting Started'
  ];

document.getElementById(
  'helpContent'
).value =
  helpTemplates[
    'Getting Started'
  ];

document.getElementById(
  'helpTopicKey'
).value = '';

}

/* PHASE 5 START */

// ========================================
// HELP ADMIN - TEMPLATES
// ========================================

const helpCategoryOrders = {

  'Getting Started':100,

  'Calendar & Events':200,

  'Instructor Management':300,

  'Volunteer Management':400,

  'User Accounts':500,

  'Announcements':600,

  'Help System':700,

  'Administration':800,

  'Troubleshooting':900,

  'FAQ':1000,

  'System Updates':1100

};

const helpTemplates = {

  'Getting Started':
`Overview

Requirements

Steps

Additional Notes`,

  'Calendar & Events':
`Overview

Purpose

Steps

Additional Notes`,

  'Instructor Management':
`Purpose

Requirements

Steps

Additional Notes`,

  'Volunteer Management':
`Overview

Requirements

Steps

Additional Notes`,

  'User Accounts':
`Overview

Requirements

Steps

Administrator Notes`,

  'Announcements':
`Announcement Purpose

Audience

Message Content

Additional Notes`,

  'Help System':
`Purpose

Steps

Examples

Additional Notes`,

  'Administration':
`Purpose

Required Permissions

Procedure

Warnings

Additional Notes`,

  'Troubleshooting':
`Problem

Possible Causes

Resolution Steps

Additional Information`,

  'FAQ':
`Question

Answer

Additional Information`,

  'System Updates':
`Update Summary

Effective Date

Changes

Additional Information`

};

// ========================================
// HELP ADMIN - AUTO GENERATED TOPIC KEY
// ========================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const title =
      document.getElementById(
        'helpTitle'
      );

    if(title){

      title.addEventListener(
        'input',
        function(){

          document.getElementById(
            'helpTopicKey'
          ).value =
            this.value
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                '_'
              )
              .replace(
                /^_|_$/g,
                ''
              );

        }
      );

    }

  }
);

// ========================================
// END HELP ADMIN HELPERS
// ========================================

async function renderHelpAdminList(){

  const container =
    document.getElementById(
      'helpTopicAdminList'
    );

  if(!container){
    return;
  }

  try {

    const token =
      localStorage.getItem(
        'token'
      );

    const response =
      await fetch(
        'https://ndow-calendar-server.onrender.com/api/help/topics',
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    console.log(
      'HELP ADMIN DATA:',
      data
    );

    const topics =
      data.topics || data;

    container.innerHTML = '';

    topics.forEach(topic => {

      const div =
        document.createElement(
          'div'
        );

      div.style.padding =
        '12px';

      div.style.borderBottom =
        '1px solid #e5e7eb';

      div.style.cursor =
        'pointer';

      div.innerHTML = `
        <strong>
          ${topic.title}
        </strong>
        <br>
        <span style="
          color:#6b7280;
          font-size:13px;
        ">
          ${topic.category || ''}
        </span>
      `;

      div.onclick = () => {

        document.getElementById(
          'helpEditId'
        ).value = topic.id;

        document.getElementById(
          'helpCategory'
        ).value =
          topic.category || '';

        document.getElementById(
          'helpTopicKey'
        ).value =
          topic.topic_key || '';

        document.getElementById(
          'helpTitle'
        ).value =
          topic.title || '';

        document.getElementById(
          'helpSortOrder'
        ).value =
          topic.sort_order || 0;

        document.getElementById(
          'helpVisibilityRole'
        ).value =
          topic.visibility_role || 'all';

        document.getElementById(
          'helpContent'
        ).value =
          topic.content || '';

      };

      container.appendChild(
        div
      );

    });

  } catch(err){

    console.error(
      'HELP ADMIN LOAD ERROR:',
      err
    );

  }

}
	
async function deleteHelpTopic(){

  const id =
    document.getElementById(
      'helpEditId'
    ).value;

  if(!id){

    return;

  }

  if(
    !confirm(
      'Delete this help topic?'
    )
  ){

    return;

  }

  try {

    const response =
      await fetch(
        'https://ndow-calendar-server.onrender.com/api/help/delete',
        {
          method:'POST',
          headers:{
            'Content-Type':
              'application/json'
          },
          body:JSON.stringify({
            id
          })
        }
      );

    const data =
      await response.json();

    if(data.success){

      newHelpTopic();

      await loadHelpTopics();

      renderHelpAdminList();

    }

   } catch(err){

    console.error(err);

  }

}

window.loadHelpTopics = loadHelpTopics;
window.showContextHelp = showContextHelp;
window.openHelpTopic = openHelpTopic;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;

window.saveHelpTopic = saveHelpTopic;
window.newHelpTopic = newHelpTopic;
window.renderHelpAdminList = renderHelpAdminList;
window.deleteHelpTopic = deleteHelpTopic;
