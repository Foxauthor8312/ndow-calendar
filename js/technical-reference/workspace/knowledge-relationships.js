
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center Relationships
------------------------------------------------------------------------------
 Module      : knowledge-relationships.js

 Purpose:
    Find existing registered documents that may be related to a new article.
    Allow the reviewer to accept or reject suggested references.
==============================================================================
*/

'use strict';

(function () {

    const API_BASE =
        'https://ndow-calendar-server.onrender.com/api';

    let acceptedDocuments = new Map();
    let rejectedDocumentIds = new Set();
    let currentDocuments = [];

    function getToken() {
        return (
            window.authToken ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('token') ||
            ''
        );
    }

    function getUploadData() {
        return typeof window.getKnowledgeUploadData === 'function'
            ? window.getKnowledgeUploadData() || {}
            : {};
    }

    function getArticleText() {
        const data = getUploadData();
        const title = String(data.title || '').trim();
        const description = String(data.description || '').trim();

        let body = String(data.text || '');

        if (/<[a-z][\s\S]*>/i.test(body)) {
            const parsed = new DOMParser().parseFromString(
                body,
                'text/html'
            );
            body = parsed.body.textContent || '';
        }

        return `${title} ${description} ${body}`
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function getSearchTerms(text) {
        const ignored = new Set([
            'about', 'after', 'also', 'been', 'being', 'between',
            'could', 'does', 'each', 'from', 'have', 'into',
            'more', 'most', 'other', 'over', 'same', 'should',
            'some', 'such', 'than', 'that', 'their', 'there',
            'these', 'they', 'this', 'those', 'through', 'under',
            'using', 'very', 'when', 'where', 'which', 'while',
            'with', 'would', 'your', 'document', 'chapter'
        ]);

        return [...new Set(
            text.match(/[a-z0-9][a-z0-9-]{3,}/g) || []
        )]
            .filter(term => !ignored.has(term))
            .slice(0, 12);
    }

    function scoreDocument(doc, terms) {
        const title = String(doc.title || '').toLowerCase();
        const description =
            String(doc.description || '').toLowerCase();
        const keywords = Array.isArray(doc.keywords)
            ? doc.keywords.join(' ').toLowerCase()
            : '';

        let score = 0;
        const reasons = [];

        terms.forEach(term => {
            if (title.includes(term)) {
                score += 4;
                reasons.push(`Title matches "${term}"`);
            } else if (keywords.includes(term)) {
                score += 3;
                reasons.push(`Keyword matches "${term}"`);
            } else if (description.includes(term)) {
                score += 1;
                reasons.push(`Description matches "${term}"`);
            }
        });

        return {
            score,
            reasons: [...new Set(reasons)].slice(0, 3)
        };
    }

    function renderMessage(container, message) {
        container.replaceChildren();

        const paragraph = window.document.createElement('p');
        paragraph.textContent = message;
        container.appendChild(paragraph);
    }

    function renderDocumentCard(doc, result, container) {
        const card = window.document.createElement('article');
        card.style.cssText =
            'border:1px solid #DBE3EC;border-radius:8px;' +
            'padding:12px;margin:10px 0;background:#fff;';

        const heading = window.document.createElement('h4');
        heading.textContent = doc.title || 'Untitled document';
        heading.style.margin = '0 0 6px';

        const description = window.document.createElement('p');
        description.textContent =
            doc.description || 'No description available.';
        description.style.cssText =
            'margin:0 0 8px;color:#475569;font-size:14px;';

        const matchInfo = window.document.createElement('p');
        matchInfo.textContent = result.reasons.join(' · ');
        matchInfo.style.cssText =
            'margin:0 0 10px;color:#64748B;font-size:12px;';

        const status = window.document.createElement('p');
        status.style.cssText =
            'font-size:13px;font-weight:600;margin:0 0 8px;';

        const actions = window.document.createElement('div');
        actions.style.cssText =
            'display:flex;gap:8px;flex-wrap:wrap;';

        const acceptButton = window.document.createElement('button');
        acceptButton.type = 'button';
        acceptButton.textContent = 'Accept Reference';
        acceptButton.style.cssText =
            'padding:7px 12px;border:0;border-radius:5px;' +
            'background:#19304B;color:#fff;cursor:pointer;';

        const rejectButton = window.document.createElement('button');
        rejectButton.type = 'button';
        rejectButton.textContent = 'Reject';
        rejectButton.style.cssText =
            'padding:7px 12px;border:1px solid #DBE3EC;' +
            'border-radius:5px;background:#fff;cursor:pointer;';

        function updateStatus() {
            if (acceptedDocuments.has(doc.id)) {
                status.textContent = 'Accepted as a reference';
                acceptButton.textContent = 'Remove Acceptance';
            } else if (rejectedDocumentIds.has(doc.id)) {
                status.textContent = 'Rejected';
                acceptButton.textContent = 'Accept Reference';
            } else {
                status.textContent = 'Awaiting review';
                acceptButton.textContent = 'Accept Reference';
            }
        }

        acceptButton.addEventListener('click', () => {
            if (acceptedDocuments.has(doc.id)) {
                acceptedDocuments.delete(doc.id);
            } else {
                acceptedDocuments.set(doc.id, doc);
                rejectedDocumentIds.delete(doc.id);
            }

            updateStatus();
        });

        rejectButton.addEventListener('click', () => {
            acceptedDocuments.delete(doc.id);
            rejectedDocumentIds.add(doc.id);
            updateStatus();
        });

        actions.append(acceptButton, rejectButton);
        card.append(heading, description, matchInfo, status, actions);
        container.appendChild(card);

        updateStatus();
    }

    async function renderKnowledgeRelationships(container) {
        container.replaceChildren();

        const heading = window.document.createElement('h3');
        heading.textContent = 'References and Relationships';

        const introduction = window.document.createElement('p');
        introduction.textContent =
            'Review existing active EKC documents that may be relevant ' +
            'to this article. Accept or reject each suggestion.';

        const results = window.document.createElement('div');
        results.textContent = 'Searching existing documents…';

        container.append(heading, introduction, results);

        const terms = getSearchTerms(getArticleText());

        if (!terms.length) {
            renderMessage(
                results,
                'Add an article title, description, or document text ' +
                'before searching for references.'
            );
            return;
        }

        try {
            const token = getToken();

            if (!token) {
                renderMessage(
                    results,
                    'Your login token was not found. Sign in again ' +
                    'and reopen the References tab.'
                );
                return;
            }

            const searchResults = await Promise.all(
                terms.slice(0, 5).map(async term => {
                    const url = new URL(
                        `${API_BASE}/knowledge/documents`
                    );

                    url.searchParams.set('search', term);
                    url.searchParams.set('limit', '20');

                    const response = await fetch(url, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const payload = await response.json();

                    if (!response.ok || !payload.success) {
                        throw new Error(
                            payload.error ||
                            `Document search failed (${response.status}).`
                        );
                    }

                    return payload.documents || [];
                })
            );

            const uniqueDocuments = new Map();

            searchResults.flat().forEach(doc => {
                if (doc && doc.id != null) {
                    uniqueDocuments.set(doc.id, doc);
                }
            });

            const articleTerms = getSearchTerms(getArticleText());

            currentDocuments = [...uniqueDocuments.values()]
                .map(doc => ({
                    document: doc,
                    ...scoreDocument(doc, articleTerms)
                }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 20);

            if (!currentDocuments.length) {
                renderMessage(
                    results,
                    'No matching active documents were found. ' +
                    'You can continue without adding references.'
                );
                return;
            }

            results.replaceChildren();

            const summary = window.document.createElement('p');
            summary.textContent =
                `Found ${currentDocuments.length} potential references. ` +
                'These are suggestions only; review each one.';
            results.appendChild(summary);

            currentDocuments.forEach(item => {
                renderDocumentCard(
                    item.document,
                    item,
                    results
                );
            });

        } catch (error) {
            console.error('EKC REFERENCE SEARCH ERROR:', error);

            renderMessage(
                results,
                error.message ||
                'Unable to load document reference suggestions.'
            );
        }
    }

    function getKnowledgeRelationshipsSelection() {
        return {
            acceptedDocuments: [...acceptedDocuments.values()],
            rejectedDocumentIds: [...rejectedDocumentIds]
        };
    }

    function resetKnowledgeRelationshipsSelection() {
        acceptedDocuments = new Map();
        rejectedDocumentIds = new Set();
        currentDocuments = [];
    }

    window.renderKnowledgeRelationships =
        renderKnowledgeRelationships;

    window.getKnowledgeRelationshipsSelection =
        getKnowledgeRelationshipsSelection;

    window.resetKnowledgeRelationshipsSelection =
        resetKnowledgeRelationshipsSelection;

})();
