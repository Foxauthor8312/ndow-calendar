
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center — Article Classification
------------------------------------------------------------------------------
 Module : workspace/knowledge-metadata.js

 Purpose:
    Match an intake article against the existing EKC taxonomy.

 Responsibilities:
    - Load existing active topics.
    - Score topic matches using article text.
    - Display suggested matches for human review.
    - Track accepted and rejected suggestions locally.

 Safety:
    - No taxonomy creation or modification.
    - No document registration.
    - No publication.
==============================================================================
*/

'use strict';

(function () {

    const API_BASE =
        'https://ndow-calendar-server.onrender.com/api';

    let topics = [];
    let selectedTopicIds = new Set();
    let rejectedTopicIds = new Set();
    let lastSuggestions = [];
    let loading = false;

    /*
    ==========================================================================
     Authentication
    ==========================================================================
    */

    function getToken() {

        if (typeof authToken !== 'undefined' && authToken) {
            return authToken;
        }

        return (
            localStorage.getItem('token') ||
            localStorage.getItem('authToken') ||
            ''
        );
    }

    /*
    ==========================================================================
     Load Existing Taxonomy
    ==========================================================================
    */

    async function loadKnowledgeMetadataTopics() {

        if (topics.length) {
            return topics;
        }

        if (loading) {
            return [];
        }

        loading = true;

        try {

            const token = getToken();

            if (!token) {
                throw new Error(
                    'Your login token was not found. Please sign in again.'
                );
            }

            const response = await fetch(
                `${API_BASE}/knowledge/topics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error ||
                    `Unable to load EKC topics (${response.status}).`
                );
            }

            topics = Array.isArray(result.topics)
                ? result.topics.filter(topic => topic.active === true)
                : [];

            return topics;

        } finally {
            loading = false;
        }
    }

    /*
    ==========================================================================
     Read Article Text
    ==========================================================================
    */

    function getArticleText() {

        const title =
            document.getElementById('knowledgeUploadTitle')?.value || '';

        const description =
            document.getElementById(
                'knowledgeUploadDescription'
            )?.value || '';

        const preview =
            document.getElementById('knowledgeUploadPreview');

        // Use rendered preview text, not HTML markup.
        const bodyText = preview?.innerText || '';

        return {
            title: title.trim(),
            description: description.trim(),
            bodyText: bodyText.trim(),
            combined: [
                title,
                description,
                bodyText
            ].join(' ').toLowerCase()
        };
    }

    /*
    ==========================================================================
     Tokenize Text
    ==========================================================================
    */

    function tokenize(value) {

        return new Set(
            String(value || '')
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, ' ')
                .split(/[\s-]+/)
                .filter(word =>
                    word.length > 2 &&
                    ![
                        'the', 'and', 'for', 'with', 'from',
                        'that', 'this', 'are', 'was', 'were',
                        'into', 'your', 'you', 'use', 'used',
                        'using', 'have', 'has', 'had'
                    ].includes(word)
                )
        );
    }

    /*
    ==========================================================================
     Score Existing Topics
    ==========================================================================
    */

    function scoreTopic(topic, article) {

        const titleWords = tokenize(article.title);
        const descriptionWords = tokenize(article.description);
        const bodyWords = tokenize(article.bodyText);

        const topicName = String(topic.topic || '');
        const aliases = Array.isArray(topic.aliases)
            ? topic.aliases
            : typeof topic.aliases === 'string'
                ? topic.aliases.split(/[,;|]/)
                : [];

        const phrases = [
            topicName,
            ...aliases.map(String)
        ].filter(Boolean);

        const searchableText = [
            topic.summary || '',
            topic.definition || ''
        ].join(' ');

        const topicWords = tokenize(
            `${phrases.join(' ')} ${searchableText}`
        );

        let score = 0;
        const reasons = [];

        // Exact topic or alias phrase is a strong signal.
        for (const phrase of phrases) {

            const normalizedPhrase = phrase.trim().toLowerCase();

            if (
                normalizedPhrase.length > 2 &&
                article.title.toLowerCase().includes(normalizedPhrase)
            ) {
                score += 12;
                reasons.push('Phrase found in title');
                break;
            }

            if (
                normalizedPhrase.length > 2 &&
                article.description.toLowerCase().includes(normalizedPhrase)
            ) {
                score += 7;
                reasons.push('Phrase found in summary');
                break;
            }
        }

        let titleHits = 0;
        let descriptionHits = 0;
        let bodyHits = 0;

        for (const word of topicWords) {

            if (titleWords.has(word)) {
                titleHits++;
            }

            if (descriptionWords.has(word)) {
                descriptionHits++;
            }

            if (bodyWords.has(word)) {
                bodyHits++;
            }
        }

        score += Math.min(titleHits * 4, 16);
        score += Math.min(descriptionHits * 2, 10);
        score += Math.min(bodyHits, 8);

        if (titleHits) {
            reasons.push(`${titleHits} title keyword match(es)`);
        }

        if (descriptionHits) {
            reasons.push(`${descriptionHits} summary keyword match(es)`);
        }

        if (bodyHits) {
            reasons.push(`${bodyHits} article keyword match(es)`);
        }

        return {
            score,
            reasons,
            topic,
            category: topic.knowledge_categories || null
        };
    }

    /*
    ==========================================================================
     Match Suggestions
    ==========================================================================
    */

    function findKnowledgeMetadataMatches(article, limit = 15) {

        return topics
            .map(topic => scoreTopic(topic, article))
            .filter(match => match.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(match => ({
                ...match,
                confidence:
                    match.score >= 20 ? 'Strong' :
                    match.score >= 10 ? 'Possible' :
                    'Review required'
            }));
    }

    /*
    ==========================================================================
     Render Classification Interface
    ==========================================================================
    */

    async function renderKnowledgeMetadata(container) {

        if (!container) {
            console.error(
                'EKC classifier: destination container not found.'
            );
            return;
        }

        container.replaceChildren();

        const status = document.createElement('p');
        status.textContent = 'Loading existing EKC topics…';
        status.style.color = '#64748B';
        container.appendChild(status);

        try {

            await loadKnowledgeMetadataTopics();

            const article = getArticleText();
            lastSuggestions = findKnowledgeMetadataMatches(article);

            container.replaceChildren();

            const panel = document.createElement('section');
            panel.style.cssText = `
                padding:24px;
                border:1px solid #DBE3EC;
                border-radius:8px;
                background:#FFFFFF;
            `;

            const heading = document.createElement('h2');
            heading.textContent = 'Classify Article';
            heading.style.cssText = `
                margin:0 0 8px;
                color:#19304B;
                font-size:20px;
            `;

            const description = document.createElement('p');
            description.textContent =
                'Review suggested matches from the existing EKC taxonomy. ' +
                'Suggestions are not saved automatically.';
            description.style.cssText = `
                margin:0 0 18px;
                color:#64748B;
                font-size:14px;
                line-height:1.6;
            `;

            const articleTitle = document.createElement('p');
            articleTitle.style.cssText =
                'margin:0 0 16px;color:#334155;font-size:13px;';

            articleTitle.textContent = article.title
                ? `Article: ${article.title}`
                : 'Enter an article title on the Document tab before classifying.';

            const results = document.createElement('div');
            results.id = 'knowledgeMetadataResults';

            const selectionStatus = document.createElement('p');
            selectionStatus.id = 'knowledgeMetadataSelectionStatus';
            selectionStatus.style.cssText =
                'margin:16px 0 0;color:#64748B;font-size:13px;';

            panel.append(
                heading,
                description,
                articleTitle,
                results,
                selectionStatus
            );

            container.appendChild(panel);

            renderSuggestions(results, selectionStatus);

        } catch (error) {

            container.replaceChildren();

            const message = document.createElement('p');
            message.textContent =
                `Unable to load classification suggestions: ${error.message}`;
            message.style.color = '#B91C1C';

            container.appendChild(message);

            console.error('EKC classification failed:', error);
        }
    }

    /*
    ==========================================================================
     Render Suggestion Cards
    ==========================================================================
    */

    function renderSuggestions(container, selectionStatus) {

        container.replaceChildren();

        if (!lastSuggestions.length) {

            const empty = document.createElement('p');
            empty.textContent =
                'No keyword matches were found. Try adding a more descriptive ' +
                'title or summary. No taxonomy records have been changed.';
            empty.style.cssText =
                'padding:14px;background:#F8FAFC;color:#64748B;' +
                'border-radius:6px;font-size:13px;';

            container.appendChild(empty);

            updateSelectionStatus(selectionStatus);
            return;
        }

        for (const match of lastSuggestions) {

            const topic = match.topic;
            const category = match.category;

            const card = document.createElement('article');
            card.style.cssText = `
                margin-top:12px;
                padding:16px;
                border:1px solid #DBE3EC;
                border-radius:8px;
                background:#FFFFFF;
            `;

            const row = document.createElement('div');
            row.style.cssText = `
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:12px;
                flex-wrap:wrap;
            `;

            const nameBlock = document.createElement('div');
            nameBlock.style.flex = '1';

            const name = document.createElement('h3');
            name.textContent = topic.topic || 'Untitled topic';
            name.style.cssText =
                'margin:0 0 6px;color:#19304B;font-size:16px;';

            const hierarchy = document.createElement('p');
            hierarchy.textContent = category
                ? `${category.name || 'Existing category'} · Center ID ${category.center_id ?? 'unknown'}`
                : 'Category details unavailable';
            hierarchy.style.cssText =
                'margin:0 0 8px;color:#64748B;font-size:12px;';

            const summary = document.createElement('p');
            summary.textContent =
                topic.summary || topic.definition || 'No topic description available.';
            summary.style.cssText =
                'margin:0;color:#475569;font-size:13px;line-height:1.6;';

            nameBlock.append(name, hierarchy, summary);

            const badge = document.createElement('span');
            badge.textContent = match.confidence;
            badge.style.cssText = `
                padding:5px 8px;
                border-radius:5px;
                background:${
                    match.confidence === 'Strong'
                        ? '#DCFCE7'
                        : match.confidence === 'Possible'
                            ? '#FEF3C7'
                            : '#F1F5F9'
                };
                color:#334155;
                font-size:11px;
                white-space:nowrap;
            `;

            row.append(nameBlock, badge);

            const reasons = document.createElement('p');
            reasons.textContent = match.reasons.join(' · ') ||
                'Limited keyword evidence; verify manually.';
            reasons.style.cssText =
                'margin:12px 0;color:#64748B;font-size:12px;';

            const actions = document.createElement('div');
            actions.style.cssText =
                'display:flex;gap:8px;flex-wrap:wrap;';

            const accept = document.createElement('button');
            accept.type = 'button';
            accept.textContent = selectedTopicIds.has(topic.id)
                ? '✓ Selected'
                : 'Accept suggestion';
            accept.style.cssText = `
                padding:8px 11px;
                border:1px solid #7A9E7F;
                border-radius:5px;
                background:${
                    selectedTopicIds.has(topic.id) ? '#DCFCE7' : '#FFFFFF'
                };
                color:#19304B;
                cursor:pointer;
            `;

            accept.addEventListener('click', () => {

                if (selectedTopicIds.has(topic.id)) {
                    selectedTopicIds.delete(topic.id);
                } else {
                    selectedTopicIds.add(topic.id);
                    rejectedTopicIds.delete(topic.id);
                }

                renderSuggestions(container, selectionStatus);
            });

            const reject = document.createElement('button');
            reject.type = 'button';
            reject.textContent = rejectedTopicIds.has(topic.id)
                ? 'Rejected'
                : 'Reject';
            reject.style.cssText = `
                padding:8px 11px;
                border:1px solid #DBE3EC;
                border-radius:5px;
                background:#FFFFFF;
                color:#475569;
                cursor:pointer;
            `;

            reject.addEventListener('click', () => {

                selectedTopicIds.delete(topic.id);
                rejectedTopicIds.add(topic.id);

                // Keep rejected items visible but clearly marked.
                card.style.opacity = '0.55';
                reject.textContent = 'Rejected';

                renderSuggestions(container, selectionStatus);
            });

            if (rejectedTopicIds.has(topic.id)) {
                card.style.opacity = '0.55';
            }

            actions.append(accept, reject);
            card.append(row, reasons, actions);
            container.appendChild(card);
        }

        updateSelectionStatus(selectionStatus);
    }

    /*
    ==========================================================================
     Selection Summary
    ==========================================================================
    */

    function updateSelectionStatus(element) {

        if (!element) {
            return;
        }

        element.textContent =
            `${selectedTopicIds.size} topic(s) accepted · ` +
            `${rejectedTopicIds.size} suggestion(s) rejected. ` +
            'Selections are temporary and have not been saved.';
    }

    /*
    ==========================================================================
     Public API
    ==========================================================================
    */

    window.renderKnowledgeMetadata = renderKnowledgeMetadata;

    window.getKnowledgeMetadataSelection = function () {
        return {
            topicIds: [...selectedTopicIds],
            rejectedTopicIds: [...rejectedTopicIds]
        };
    };

    window.resetKnowledgeMetadataSelection = function () {
        selectedTopicIds.clear();
        rejectedTopicIds.clear();
        lastSuggestions = [];
    };

})();

