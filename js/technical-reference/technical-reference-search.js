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
    The documentKey is the authoritative connection
    to the existing Technical Reference document viewer.
  */

  if (
    typeof loadTechnicalTopic ===
    'function'
  ) {

    loadTechnicalTopic(
      result.documentKey
    );

    return;

  }


  console.warn(
    'loadTechnicalTopic() is not available.'
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
 Global API
------------------------------------------------------------------------------
*/

window.searchTechnicalReference =
  searchTechnicalReference;

window.renderTechnicalReferenceSearchResults =
  renderTechnicalReferenceSearchResults;

window.openTechnicalReferenceSearchResult =
  openTechnicalReferenceSearchResult;
