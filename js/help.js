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

      if(!search){
        renderHelpTopicList(topicArray);
        return;
      }

      // Translate everyday instructor wording into related Help terms.
      // This improves article discovery without changing article content or database fields.
      const searchAliases = [
        { pattern: /\\bfind my events?\\b|\\bshow me my events?\\b|\\bmy upcoming events?\\b|\\bevents? i('?m| am) teaching\\b/, terms: ['filter my events', 'calendar', 'instructor', 'events'] },
        { pattern: /\\bhow many (hours|hours have i|service hours)\\b|\\bmy hours\\b|\\bvolunteer time\\b|\\bservice time\\b/, terms: ['volunteer hours', 'entering hours', 'hour calculations', 'hours submitted'] },
        { pattern: /\\bwhen am i teaching\\b|\\bmy next class\\b|\\bnext event\\b|\\bupcoming class\\b/, terms: ['calendar', 'events', 'filter my events'] },
        { pattern: /\\bhow do i (enter|record|log) (my )?hours\\b|\\bsubmit my hours\\b/, terms: ['entering volunteer hours', 'logging hours', 'volunteer management'] },
        { pattern: /\\bhow do i find\\b|\\bwhere do i find\\b|\\bshow me\\b/, terms: ['calendar', 'filter', 'using', 'find'] },
        { pattern: /\\brequest to teach\\b|\\binstructor request\\b|\\brequest status\\b/, terms: ['instructor request', 'submitting a request', 'status'] },
        { pattern: /\\bstudents registered\\b|\\bclass roster\\b|\\battendance\\b/, terms: ['communications', 'registered students', 'event attendance', 'roster'] }
      ];

      const expandedTerms = new Set([search]);
      searchAliases.forEach(alias => {
        if(alias.pattern.test(search)){
          alias.terms.forEach(term => expandedTerms.add(term));
        }
      });

      const terms = Array.from(expandedTerms)
        .flatMap(term => term.split(/\\s+/))
        .filter(term => term.length > 2 && !['the','and','for','how','does','are','you','can','with','what','where'].includes(term));

      const scored = topicArray.map(topic => {
        const title = (topic.title || '').toLowerCase();
        const category = (topic.category || '').toLowerCase();
        const content = (topic.content || '').toLowerCase();
        const searchable = title + ' ' + category + ' ' + content;
        let score = 0;

        if(title.includes(search)) score += 12;
        if(category.includes(search)) score += 6;
        if(content.includes(search)) score += 4;

        terms.forEach(term => {
          if(title.includes(term)) score += 5;
          else if(category.includes(term)) score += 3;
          else if(content.includes(term)) score += 1;
        });

        return { topic, score, searchable };
      }).filter(result => result.score > 0)
        .sort((a,b) => b.score - a.score || (a.topic.title || '').localeCompare(b.topic.title || ''));

      renderHelpTopicList(scored.map(result => result.topic));

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

function formatHelpContent(
  content,
  topicTitle = ''
){

  if(!content){
    return '';
  }

  const lines =
    content
      .split('\n')
      .map(line => line.trim());

  let html = '';

  let startIndex = 0;

  if(
    topicTitle &&
    lines.length > 0 &&
    lines[0].toLowerCase() ===
      topicTitle.toLowerCase()
  ){

    html += `
      <div style="
        font-size:22px;
        font-weight:700;
        color:#19304B;
        margin-bottom:16px;
      ">
        ${lines[0]}
      </div>
    `;

    startIndex = 1;

  }

  let inList = false;

  const sectionHeadings = [
    'overview',
    'requirements',
    'steps',
    'additional notes',
    'purpose',
    'request statuses',
    'request filters',
    'request details',
    'archiving requests',
    'administrative recommendations',
    'question',
    'answer',
    'warnings',
    'changes',
    'effective date',
    'additional information'
  ];

  for(
    let i = startIndex;
    i < lines.length;
    i++
  ){

    const line = lines[i];

    if(!line){

      if(inList){

        html += '</ul>';
        inList = false;

      }

      continue;

    }

    if(line.startsWith('* ')){

      if(!inList){

        html += `
          <ul style="
            margin:6px 0 10px 20px;
            font-size:14px;
            line-height:1.5;
          ">
        `;

        inList = true;

      }

      html += `
        <li>
          ${line.substring(2)}
        </li>
      `;

      continue;

    }

    if(inList){

      html += '</ul>';
      inList = false;

    }

    if(
      sectionHeadings.includes(
        line.toLowerCase()
      )
    ){

      html += `
        <div style="
          font-size:14px;
          font-weight:700;
          color:#19304B;
          margin-top:16px;
          margin-bottom:6px;
          border-bottom:1px solid #DBE3EC;
          padding-bottom:4px;
        ">
          ${line}
        </div>
      `;

      continue;

    }

    html += `
      <div style="
        font-size:14px;
        font-weight:400;
        color:#374151;
        line-height:1.6;
        margin-bottom:8px;
      ">
        ${line}
      </div>
    `;

  }

  if(inList){

    html += '</ul>';

  }

  return html;

}

function renderHelpTopicList(topics){

  const topicList =
    document.getElementById('helpTopicList');

  const helpContent =
    document.getElementById('helpContentArea');

  if(!topicList || !helpContent){
    return;
  }

  topicList.innerHTML = '';

  const grouped = new Map();

  topics.forEach(topic => {
    const category = (topic.category || 'Uncategorized').trim();
    if(!grouped.has(category)){
      grouped.set(category, []);
    }
    grouped.get(category).push(topic);
  });

  const categoryNames = Array.from(grouped.keys()).sort((a,b) => {
    const aOrder = helpCategoryOrders[a] ?? 9999;
    const bOrder = helpCategoryOrders[b] ?? 9999;
    return aOrder - bOrder || a.localeCompare(b);
  });

  let firstArticleButton = null;

  categoryNames.forEach(category => {
    const articles = grouped.get(category);
    const section = document.createElement('section');
    section.style.borderBottom = '1px solid #DBE3EC';

    const heading = document.createElement('button');
    heading.type = 'button';
    heading.style.cssText = 'width:100%;display:flex;justify-content:space-between;align-items:center;padding:11px 12px;border:0;background:#F8FAFC;color:#19304B;font-weight:700;text-align:left;cursor:pointer;';
    heading.setAttribute('aria-expanded', 'true');

    const label = document.createElement('span');
    label.textContent = category;

    const marker = document.createElement('span');
    marker.textContent = '−';
    marker.setAttribute('aria-hidden', 'true');

    heading.append(label, marker);

    const articleList = document.createElement('div');
    articleList.style.padding = '2px 0 6px 0';

    heading.onclick = () => {
      const expanded = heading.getAttribute('aria-expanded') === 'true';
      heading.setAttribute('aria-expanded', String(!expanded));
      articleList.style.display = expanded ? 'none' : 'block';
      marker.textContent = expanded ? '+' : '−';
    };

    articles.forEach(topic => {
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = topic.title || 'Untitled article';
      item.style.cssText = 'display:block;width:100%;padding:8px 12px 8px 24px;border:0;border-left:4px solid transparent;background:transparent;color:#19304B;font-size:13px;font-weight:600;text-align:left;cursor:pointer;';

      item.onclick = () => {
        topicList.querySelectorAll('[data-help-article="true"]').forEach(el => {
          el.style.background = 'transparent';
          el.style.borderLeftColor = 'transparent';
          el.setAttribute('aria-current', 'false');
        });

        item.style.background = '#EEF4FF';
        item.style.borderLeftColor = '#19304B';
        item.setAttribute('aria-current', 'true');

        helpContent.innerHTML = `
          <div style="padding:16px;max-width:900px;">
            <div style="line-height:1.8;font-size:15px;color:#374151;">
              ${formatHelpContent(topic.content, topic.title)}
            </div>
          </div>
        `;
      };

      item.dataset.helpArticle = 'true';
      item.setAttribute('aria-current', 'false');
      articleList.appendChild(item);

      if(!firstArticleButton){
        firstArticleButton = item;
      }
    });

    section.append(heading, articleList);
    topicList.appendChild(section);
  });

  if(firstArticleButton){
    firstArticleButton.click();
  } else {
    helpContent.innerHTML = '<div style="padding:16px;color:#64748b;">No help articles match your search.</div>';
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

      <div style="
        line-height:1.8;
        font-size:15px;
        color:#374151;
      ">
		${formatHelpContent(
		  topic.content,
		  topic.title
)}
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

  const topicItems =
    document.querySelectorAll(
      '#helpTopicList > div'
    );

  const matchingItem =
    Array.from(topicItems)
      .find(
        item =>
          item.innerText.trim() ===
          topic.title
      );

  if(matchingItem){

    matchingItem.click();

  } else {

    openHelpTopic(topic);

  }

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
		
      help_type: 'help',

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

  'Communications':600,

  'Announcements':700,

  'Reports & Analytics':800,

  'Administration':900,

  'Troubleshooting':1000,

  'FAQ':1100,

  'Help System':1200,

  'System Updates':1300

};

const helpTemplates = {

  'Getting Started':
`Summary

Overview

Requirements

Steps

Additional Notes`,

  'Calendar & Events':
`Summary

Overview

Purpose

Steps

Additional Notes`,

  'Instructor Management':
`Summary

Purpose

Requirements

Steps

Additional Notes`,

  'Volunteer Management':
`Summary

Overview

Requirements

Steps

Additional Notes`,

  'User Accounts':
`Summary

Overview

Steps

Administrator Notes`,

  'Communications':
`Summary

Purpose

Workflow

Important Notes

Troubleshooting`,

  'Announcements':
`Summary

Announcement Purpose

Audience

Message Content

Additional Notes`,

  'Reports & Analytics':
`Summary

Purpose

Available Reports

Steps

Additional Notes`,

  'Administration':
`Summary

Purpose

Required Permissions

Procedure

Warnings

Additional Notes`,

  'Troubleshooting':
`Summary

Problem

Possible Causes

Resolution Steps

Additional Information`,

  'FAQ':
`Summary

Question

Answer

Additional Information`,

  'Help System':
`Summary

Purpose

Steps

Examples

Additional Notes`,

  'System Updates':
`Summary

Update Summary

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

    const selectedCategory =
      document.getElementById('helpCategory')?.value || '';

    const visibleTopics = selectedCategory
      ? topics.filter(topic => topic.category === selectedCategory)
      : topics;

    visibleTopics.forEach(topic => {

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
