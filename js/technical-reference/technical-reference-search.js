/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center
------------------------------------------------------------------------------
 Module      : technical-reference-search.js
 Purpose     : Engineering Knowledge Center search UI and API integration.
==============================================================================
*/

'use strict';


/*
------------------------------------------------------------------------------
 Search state
------------------------------------------------------------------------------
*/

let technicalReferenceSearchResults = [];

let technicalReferenceSearchQuery = '';

let technicalReferenceSearchState = {

  active: false,

  index: -1

};


/*
------------------------------------------------------------------------------
 Search Knowledge Center
------------------------------------------------------------------------------
*/

async function searchTechnicalReference(query) {

  const searchTerm =
    String(query || '').trim();

  if (!searchTerm) {

    technicalReferenceSearchResults = [];
    technicalReferenceSearchQuery = '';

    renderTechnicalReferenceSearchResults();

    return;

  }


  technicalReferenceSearchQuery =
    searchTerm;


  const container =
    document.getElementById(
      'technicalReferenceSearchResults'
    );

  if (container) {

    container.innerHTML = `
      <div style="
        padding:24px;
        text-align:center;
        color:#64748B;
      ">
        Searching Engineering Knowledge Center...
      </div>
    `;

  }


  try {

    const token =
      localStorage.getItem('token');

    const response =
      await fetch(
        `${TECHNICAL_REFERENCE_API.BASE}/api/knowledge/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`
              }
            : {}
        }
      );


    if (!response.ok) {

      throw new Error(
        `Search request failed: ${response.status}`
      );

    }


    const data =
      await response.json();


    if (!data.success) {

      throw new Error(
        data.error ||
        'Search failed.'
      );

    }


    technicalReferenceSearchResults =
      data.results || [];


    renderTechnicalReferenceSearchResults();


  } catch (error) {

    console.error(
      'Engineering Knowledge Center search failed:',
      error
    );


    if (container) {

      container.innerHTML = `
        <div style="
          padding:24px;
          color:#DC2626;
        ">
          Unable to search the Engineering Knowledge Center.
        </div>
      `;

    }

  }

}


/*
------------------------------------------------------------------------------
 Render search results
------------------------------------------------------------------------------
*/

function renderTechnicalReferenceSearchResults() {

  const container =
    document.getElementById(
      'technicalReferenceSearchResults'
    );

  if (!container) {
    return;
  }


  if (
    !technicalReferenceSearchQuery
  ) {

    container.innerHTML = `
      <div style="
        padding:24px;
        color:#64748B;
      ">
        Enter a search term to search the Engineering Knowledge Center.
      </div>
    `;

    return;

  }


  if (
    !technicalReferenceSearchResults.length
  ) {

    container.innerHTML = `
      <div style="
        padding:24px;
        color:#64748B;
      ">
        No results found for
        <strong>
          ${escapeTechnicalReferenceSearch(
            technicalReferenceSearchQuery
          )}
        </strong>.
      </div>
    `;

    return;

  }


  container.innerHTML = `

    <div style="
      padding:16px 20px;
      border-bottom:1px solid #DBE3EC;
      color:#475569;
      font-size:13px;
    ">
      ${technicalReferenceSearchResults.length}
      result${technicalReferenceSearchResults.length === 1 ? '' : 's'}
      for
      <strong>
        ${escapeTechnicalReferenceSearch(
          technicalReferenceSearchQuery
        )}
      </strong>
    </div>


    ${technicalReferenceSearchResults
      .map(
        (result, index) =>
          renderTechnicalReferenceSearchResult(
            result,
            index
          )
      )
      .join('')}

  `;

}


/*
------------------------------------------------------------------------------
 Render one result
------------------------------------------------------------------------------
*/

function renderTechnicalReferenceSearchResult(
  result,
  index
) {

  const topic =
    escapeTechnicalReferenceSearch(
      result.topic || 'Untitled Topic'
    );

  const summary =
    escapeTechnicalReferenceSearch(
      result.summary || ''
    );

  const center =
    escapeTechnicalReferenceSearch(
      result.center || ''
    );

  const category =
    escapeTechnicalReferenceSearch(
      result.category || ''
    );

  const chapter =
    escapeTechnicalReferenceSearch(
      result.chapter || ''
    );

  const section =
    escapeTechnicalReferenceSearch(
      result.section || ''
    );

  const documentTitle =
    escapeTechnicalReferenceSearch(
      result.documentTitle || ''
    );


  return `

    <div
      class="technical-reference-search-result"
      data-result-index="${index}"
      style="
        padding:20px;
        margin:0 0 12px 0;
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        cursor:pointer;
        transition:box-shadow .15s ease;
      "
      onclick="
        openTechnicalReferenceSearchResult(
          ${index}
        )
      "
    >

      <div style="
        font-size:17px;
        font-weight:600;
        color:#19304B;
        margin-bottom:8px;
      ">
        ${topic}
      </div>


      ${
        summary
          ? `
            <div style="
              font-size:14px;
              line-height:1.5;
              color:#475569;
              margin-bottom:12px;
            ">
              ${summary}
            </div>
          `
          : ''
      }


      <div style="
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-bottom:12px;
      ">

        ${
          center
            ? `
              <span style="
                padding:4px 8px;
                border-radius:4px;
                background:#F1F5F9;
                color:#19304B;
                font-size:12px;
              ">
                ${center}
              </span>
            `
            : ''
        }


        ${
          category
            ? `
              <span style="
                padding:4px 8px;
                border-radius:4px;
                background:#F1F5F9;
                color:#475569;
                font-size:12px;
              ">
                ${category}
              </span>
            `
            : ''
        }


        ${
          chapter
            ? `
              <span style="
                padding:4px 8px;
                border-radius:4px;
                background:#F8FAFC;
                border:1px solid #DBE3EC;
                color:#475569;
                font-size:12px;
              ">
                Chapter ${chapter}
                ${section ? ` · § ${section}` : ''}
              </span>
            `
            : ''
        }

      </div>


      ${
        documentTitle
          ? `
            <div style="
              font-size:12px;
              color:#64748B;
            ">
              Source:
              ${documentTitle}
            </div>
          `
          : ''
      }

    </div>

  `;

}


/*
------------------------------------------------------------------------------
 Open selected search result
------------------------------------------------------------------------------
*/

function openTechnicalReferenceSearchResult(
  index
) {

  const result =
    technicalReferenceSearchResults[index];

  if (!result) {
    return;
  }

 /*
------------------------------------------------------------------------------
 Preserve Search State
------------------------------------------------------------------------------
*/

technicalReferenceSearchState.active =
  true;

technicalReferenceSearchState.index =
  index;

  /*
    The documentKey is the authoritative connection
    to the existing Technical Reference document viewer.
  */

  if (
    typeof openTechnicalReferenceDocument ===
    'function'
) {

    openTechnicalReferenceDocument(
        result.documentKey
    );

    return;

}


console.warn(
    'openTechnicalReferenceDocument() is not available.'
);

}


/*
------------------------------------------------------------------------------
 Escape HTML
------------------------------------------------------------------------------
*/

function escapeTechnicalReferenceSearch(value) {

  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

}

/*
------------------------------------------------------------------------------
 Show Search View
------------------------------------------------------------------------------
*/

function showTechnicalReferenceSearch() {

  const panel =
    document.getElementById(
      'technicalReferenceContent'
    );

  if (!panel) {
    return;
  }


  /*
  --------------------------------------------------------------------------
  Navigation Header
  --------------------------------------------------------------------------
  */

  const header =
    document.getElementById(
      'technicalReferenceNavigationHeader'
    );

  if (header) {

    header.textContent =
      'Knowledge Center Search';

  }


  /*
  --------------------------------------------------------------------------
  Search Interface
  --------------------------------------------------------------------------
  */

  panel.innerHTML = `

<div
  style="
    max-width:1100px;
    margin:0 auto;
  "
>

  <div
    style="
      margin-bottom:28px;
    "
  >

    <div
      style="
        font-size:28px;
        font-weight:600;
        color:#19304B;
        margin-bottom:8px;
      "
    >
      Search Engineering Knowledge Center
    </div>

    <div
      style="
        font-size:14px;
        color:#64748B;
        line-height:1.6;
      "
    >
      Search technical topics, systems, configuration,
      troubleshooting information, and engineering references.
    </div>

  </div>


  <!-- ==========================================================
       Search Box
  =========================================================== -->

  <div
    style="
      display:flex;
      gap:10px;
      margin-bottom:24px;
    "
  >

    <input
      id="technicalReferenceSearchInput"
      type="search"
      placeholder="Search the Engineering Knowledge Center..."
      autocomplete="off"
      style="
        flex:1;
        min-width:0;
        padding:12px 14px;
        border:1px solid #DBE3EC;
        border-radius:7px;
        background:#FFFFFF;
        color:#19304B;
        font-family:'IBM Plex Sans',sans-serif;
        font-size:14px;
        outline:none;
      "
    >

    <button
      type="button"
      class="technical-nav-button primary"
      style="
        width:auto;
        margin:0;
        padding:10px 20px;
      "
      id="technicalReferenceSearchButton"
    >
      Search
    </button>

  </div>


  <!-- ==========================================================
       Results
  =========================================================== -->

  <div
    id="technicalReferenceSearchResults"
  >

    <div
      style="
        padding:24px;
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:8px;
        color:#64748B;
        font-size:14px;
      "
    >
      Enter a search term to search the Engineering Knowledge Center.
    </div>

  </div>

</div>

`;


  /*
  --------------------------------------------------------------------------
  Search Controls
  --------------------------------------------------------------------------
  */

  const input =
    document.getElementById(
      'technicalReferenceSearchInput'
    );

  const button =
    document.getElementById(
      'technicalReferenceSearchButton'
    );


  if (!input || !button) {
    return;
  }


  /*
  --------------------------------------------------------------------------
  Execute Search
  --------------------------------------------------------------------------
  */

  const executeSearch = () => {

    searchTechnicalReference(
      input.value
    );

  };


  button.onclick =
    executeSearch;


  input.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter'
      ) {

        executeSearch();

      }

    }
  );


  /*
  --------------------------------------------------------------------------
  Focus Search Box
  --------------------------------------------------------------------------
  */

  input.focus();

}

/*
------------------------------------------------------------------------------
 Return to Current Search
------------------------------------------------------------------------------
*/

function returnToTechnicalReferenceSearch() {

  showTechnicalReferenceSearch();

  const input =
    document.getElementById(
      'technicalReferenceSearchInput'
    );

  if (input) {

    input.value =
      technicalReferenceSearchQuery;

  }

  renderTechnicalReferenceSearchResults();

}


/*
------------------------------------------------------------------------------
 Global API
------------------------------------------------------------------------------
*/

window.searchTechnicalReference =
  searchTechnicalReference;

window.showTechnicalReferenceSearch =
  showTechnicalReferenceSearch;

window.renderTechnicalReferenceSearchResults =
  renderTechnicalReferenceSearchResults;

window.openTechnicalReferenceSearchResult =
  openTechnicalReferenceSearchResult;

window.returnToTechnicalReferenceSearch =
  returnToTechnicalReferenceSearch;
