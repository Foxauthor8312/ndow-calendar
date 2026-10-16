
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

let selectedCenterId = '';
let selectedCategoryId = '';

let knowledgeCenters = [];
let knowledgeCategories = [];

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
     Prepare Existing Center and Category Choices
    ==========================================================================
    */

    function preparePrimaryClassification() {
        const centersById = new Map();
        const categoriesById = new Map();

        topics.forEach(topic => {
            const category = topic.knowledge_categories;
            const center = category?.knowledge_centers;

            if (category && category.active === true) {
                categoriesById.set(String(category.id), {
                    id: category.id,
                    name: category.name,
                    center_id: category.center_id
                });
            }

            if (center && center.active === true) {
                centersById.set(String(center.id), {
                    id: center.id,
                    name: center.name
                });
            }
        });

        knowledgeCenters = [...centersById.values()]
            .sort((a, b) => a.name.localeCompare(b.name));

        knowledgeCategories = [...categoriesById.values()]
            .sort((a, b) => a.name.localeCompare(b.name));
    }

 
    /*
    ==========================================================================
     Classification Help Popups
    ==========================================================================
    */

    function showClassificationInfo(title, paragraphs) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:10000;
            display:flex;align-items:center;justify-content:center;
            padding:20px;background:rgba(15,23,42,.48);
        `;

        const dialog = document.createElement('section');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', title);
        dialog.style.cssText = `
            width:100%;max-width:520px;max-height:80vh;overflow:auto;
            padding:22px;background:#FFFFFF;border:1px solid #DBE3EC;
            border-radius:10px;box-shadow:0 18px 50px rgba(15,23,42,.25);
            font-family:'IBM Plex Sans',sans-serif;color:#334155;
        `;

        const header = document.createElement('div');
        header.style.cssText =
            'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;';

        const heading = document.createElement('h3');
        heading.textContent = title;
        heading.style.cssText =
            'margin:0 0 12px;color:#19304B;font-size:18px;line-height:1.4;';

        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = '×';
        close.setAttribute('aria-label', 'Close information');
        close.style.cssText =
            'border:1px solid #DBE3EC;border-radius:5px;background:#F8FAFC;' +
            'color:#19304B;font-size:22px;line-height:1;padding:3px 9px;cursor:pointer;';

        const content = document.createElement('div');
        paragraphs.forEach(text => {
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            paragraph.style.cssText =
                'margin:0 0 12px;font-size:14px;line-height:1.65;';
            content.appendChild(paragraph);
        });

        const footer = document.createElement('div');
        footer.style.cssText =
            'display:flex;justify-content:flex-end;margin-top:18px;';

        const done = document.createElement('button');
        done.type = 'button';
        done.textContent = 'Close';
        done.style.cssText =
            'padding:8px 14px;border:1px solid #19304B;border-radius:5px;' +
            'background:#19304B;color:#FFFFFF;cursor:pointer;';

        function closePopup() {
            document.removeEventListener('keydown', onKeyDown);
            overlay.remove();
        }

        function onKeyDown(event) {
            if (event.key === 'Escape') closePopup();
        }

        close.addEventListener('click', closePopup);
        done.addEventListener('click', closePopup);

        overlay.addEventListener('click', event => {
            if (event.target === overlay) closePopup();
        });

        document.addEventListener('keydown', onKeyDown);

        header.append(heading, close);
        footer.appendChild(done);
        dialog.append(header, content, footer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        close.focus();
    }

    function createInfoButton(title, paragraphs) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'ⓘ Info';
        button.setAttribute('aria-label', `Information about ${title}`);
        button.style.cssText = `
            flex:0 0 auto;padding:5px 9px;border:1px solid #589FD6;
            border-radius:5px;background:#FFFFFF;color:#19304B;
            font-size:12px;cursor:pointer;white-space:nowrap;
        `;

        button.addEventListener('click', () => {
            showClassificationInfo(title, paragraphs);
        });

        return button;
    }


    /*
    ==========================================================================
     Read Article Text
    ==========================================================================
    */

    

function getArticleText() {

    const uploadData =
        typeof window.getKnowledgeUploadData === 'function'
            ? window.getKnowledgeUploadData() || {}
            : {};

    const titleElement =
        document.getElementById('knowledgeUploadTitle');

    const descriptionElement =
        document.getElementById('knowledgeUploadDescription');

    const preview =
        document.getElementById('knowledgeUploadPreview');

    const title = String(
        uploadData.title || titleElement?.value || ''
    ).trim();

    const description = String(
        uploadData.description || descriptionElement?.value || ''
    ).trim();

    let bodyText = String(
        uploadData.text || ''
    );

    // If the upload module supplies HTML, extract readable text.
    if (/<[a-z][\s\S]*>/i.test(bodyText)) {
        const parsed = new DOMParser().parseFromString(
            bodyText,
            'text/html'
        );

        bodyText = parsed.body.textContent || '';
    }

    // Fall back to visible preview text when extracted text is unavailable.
    if (!bodyText.trim()) {
        bodyText = preview?.innerText || '';
    }

    bodyText = bodyText
        .replace(/\s+/g, ' ')
        .trim();

    return {
        title,
        description,
        bodyText,
        combined: `${title} ${description} ${bodyText}`.toLowerCase()
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

    const phrases = [topicName, ...aliases]
        .map(value => String(value).trim())
        .filter(Boolean);

    const referenceText = [
        topic.summary || '',
        topic.definition || ''
    ].join(' ');

    const topicWords = tokenize(
        `${phrases.join(' ')} ${referenceText}`
    );

    let score = 0;
    const reasons = [];

    const title = article.title.toLowerCase();
    const description = article.description.toLowerCase();

    if (phrases.some(phrase =>
        phrase.length > 2 && title.includes(phrase.toLowerCase())
    )) {
        score += 15;
        reasons.push('Topic phrase in title');
    } else if (phrases.some(phrase =>
        phrase.length > 2 && description.includes(phrase.toLowerCase())
    )) {
        score += 9;
        reasons.push('Topic phrase in summary');
    }

    let titleHits = 0;
    let summaryHits = 0;
    let bodyHits = 0;

    for (const word of topicWords) {
        if (titleWords.has(word)) titleHits++;
        if (descriptionWords.has(word)) summaryHits++;
        if (bodyWords.has(word)) bodyHits++;
    }

    score += Math.min(titleHits * 5, 20);
    score += Math.min(summaryHits * 3, 12);
    score += Math.min(bodyHits, 5);

    if (titleHits) reasons.push(`${titleHits} title keyword(s)`);
    if (summaryHits) reasons.push(`${summaryHits} summary keyword(s)`);
    if (bodyHits) reasons.push(`${bodyHits} body keyword(s)`);

    return {
        score,
        reasons,
        topic,
        category: topic.knowledge_categories || null
    };
}

/*
==============================================================================
 Find a Concise Relevant Article Excerpt
==============================================================================
*/

function findRelevantExcerpt(article, topic, maxLength = 200) {

    const text = String(article.bodyText || '')
        .replace(/\s+/g, ' ')
        .trim();

    if (!text) {
        return 'No extracted article text is available.';
    }

    const aliases = Array.isArray(topic.aliases)
        ? topic.aliases
        : typeof topic.aliases === 'string'
            ? topic.aliases.split(/[,;|]/)
            : [];

    const topicWords = tokenize([
        topic.topic || '',
        ...aliases,
        topic.summary || '',
        topic.definition || ''
    ].join(' '));

    // Remove generic terms that are unlikely to identify a relevant passage.
    const genericWords = new Set([
        'article', 'system', 'portal', 'application',
        'document', 'information', 'process', 'used',
        'using', 'provides', 'providing', 'current',
        'existing', 'standard', 'standards'
    ]);

    for (const word of genericWords) {
        topicWords.delete(word);
    }

    const sentences =
        text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

    let bestSentence = '';
    let bestScore = 0;

    for (const rawSentence of sentences) {

        const sentence = rawSentence.trim();

        if (!sentence || sentence.length < 20) {
            continue;
        }

        const words = tokenize(sentence);
        let score = 0;

        for (const word of topicWords) {
            if (words.has(word)) {
                score++;
            }
        }

        // Prefer concise passages with multiple meaningful matches.
        if (score > bestScore) {
            bestScore = score;
            bestSentence = sentence;
        }
    }

    if (!bestSentence || bestScore === 0) {
        return 'No specific supporting passage found; verify manually.';
    }

    if (bestSentence.length > maxLength) {
        bestSentence =
            bestSentence.slice(0, maxLength - 1).trimEnd() + '…';
    }

    return bestSentence;
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
            heading.textContent = 'Knowledge Topics & Classification';
            heading.style.cssText = `
                margin:0 0 8px;
                color:#19304B;
                font-size:20px;
            `;

            const description = document.createElement('p');
            description.textContent =
                'Work through the steps in order. First choose where the ' +
                'article belongs, then review the Knowledge Topics that ' +
                'describe its content. The system suggests options, but ' +
                'you make the final selections.';
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

            const primaryClassification = document.createElement('div');
            primaryClassification.id = 'knowledgePrimaryClassification';

           const topicHeading = document.createElement('h3');
            topicHeading.textContent = 'Knowledge Topics';
            topicHeading.style.cssText = `
                margin:0 0 6px;
                color:#19304B;
                font-size:18px;
            `;

           
const topicInfoButton = createInfoButton(
    'What Are Knowledge Topics?',
    [
        'Knowledge Topics are additional labels that help people find an article when searching for a particular subject. They supplement the article’s primary Engineering Center and Category; they do not replace them.',

        'How to review suggestions: Strong means the article contains several matching words or phrases. Check that the topic actually fits. Possible means some wording matches. Read the topic description and decide whether it applies. Review required means the match is limited. Accept it only if the article genuinely covers that subject.',

        'Accept suggestion: Select this when the topic accurately describes something the article explains or covers.',

        'Reject: Select this when the topic is unrelated, misleading, or only happens to share a few words with the article.',

        'You do not need to accept every suggestion. Choose only topics that would help someone find this article for the right reason.',

        'Topic suggestions are based on text matching. They are recommendations for your review, not automatic classifications. Your selections on this screen are temporary until the workflow saves them.'
    ]
);


            const topicHeadingRow = document.createElement('div');
            topicHeadingRow.style.cssText =
                'display:flex;align-items:center;justify-content:space-between;' +
                'gap:12px;flex-wrap:wrap;margin-top:24px;';

            topicHeadingRow.append(topicHeading, topicInfoButton);
            

            const topicInstructions = document.createElement('p');
            topicInstructions.textContent =
                'Review the suggested topics below. Accept only topics ' +
                'that genuinely describe this article. Reject suggestions ' +
                'that do not apply; you do not need to accept them all.';
            topicInstructions.style.cssText = `
                margin:0 0 14px;
                color:#64748B;
                font-size:13px;
                line-height:1.6;
            `;

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
                primaryClassification,
                topicHeadingRow,
                topicInstructions,
                results,
                selectionStatus
            );

            container.appendChild(panel);

            preparePrimaryClassification();
            renderPrimaryClassification(primaryClassification);

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
     Render Primary Center and Category Selection
    ==========================================================================
    */

    function renderPrimaryClassification(container) {
        const section = document.createElement('section');

        section.style.cssText =
            'margin:16px 0;padding:16px;' +
            'border:1px solid #DBE3EC;border-radius:8px;' +
            'background:#F8FAFC;';

        
        const heading = document.createElement('h3');
        heading.textContent = 'Primary Classification';
        heading.style.cssText =
            'margin:0 0 6px;color:#19304B;font-size:16px;';

 
const classificationInfoButton = createInfoButton(
    'Choosing the Right Engineering Center and Category',
    [
        'Every article needs one primary home in the Knowledge Center. Think of the Engineering Center as the main subject area and the Category as the specific subject within that area.',

        'Foundations — The basic knowledge. Choose this when the article explains standards, terminology, design principles, coding practices, accessibility, or other rules and concepts that guide how the system is built. Ask yourself: Does this explain a standard, principle, or fundamental concept?',

        'Architecture — How the system is designed. Choose this when the article explains how the system is structured, how its parts connect, how the database or server is organized, or how security and technical design decisions work. Ask yourself: Does this explain how the system is put together?',

        'Portal Systems — How the application works. Choose this when the article explains a portal feature, a user-facing screen, a module, a workflow, or how volunteers, instructors, and administrators use the application. Ask yourself: Does this explain what the application does or how someone uses it?',

        'Engineering & Operations — How the system is maintained. Choose this when the article explains configuration, deployment, updates, troubleshooting, diagnostics, maintenance, or procedures for keeping the system running. Ask yourself: Does this explain how to build, deploy, fix, or maintain the system?',

        'Choosing the Primary Category: After selecting an Engineering Center, choose the existing Category that most closely matches the article’s main purpose. Only categories belonging to the selected Center will be available.',

        'Important: Choose the home that best represents the article as a whole—not every subject mentioned in it. Use Knowledge Topics to describe additional subjects. This screen does not create new Centers or Categories.'
    ]
);




        const description = document.createElement('p');
        description.textContent =
            'Choose the article’s primary Engineering Center and Category. ' +
            'Accepted topics remain additional classifications.';
        description.style.cssText =
            'margin:0 0 14px;color:#64748B;font-size:13px;line-height:1.5;';

        const centerLabel = document.createElement('label');
        centerLabel.textContent = 'Engineering Center';
        centerLabel.style.cssText =
            'display:block;margin:10px 0 5px;font-weight:600;color:#334155;';

        const centerSelect = document.createElement('select');
        centerSelect.style.cssText =
            'width:100%;max-width:520px;padding:10px;' +
            'border:1px solid #DBE3EC;border-radius:5px;background:white;';

        const centerPlaceholder = new Option(
            'Select an Engineering Center',
            ''
        );
        centerSelect.add(centerPlaceholder);

        knowledgeCenters.forEach(center => {
            centerSelect.add(new Option(center.name, String(center.id)));
        });

        centerSelect.value = selectedCenterId;

        const categoryLabel = document.createElement('label');
        categoryLabel.textContent = 'Primary Category';
        categoryLabel.style.cssText =
            'display:block;margin:14px 0 5px;font-weight:600;color:#334155;';

        const categorySelect = document.createElement('select');
        categorySelect.style.cssText = centerSelect.style.cssText;

        function populateCategories() {
            categorySelect.replaceChildren();

            categorySelect.add(new Option(
                selectedCenterId
                    ? 'Select a Category'
                    : 'Select a Center first',
                ''
            ));

            categorySelect.disabled = !selectedCenterId;

            knowledgeCategories
                .filter(category =>
                    String(category.center_id) === String(selectedCenterId)
                )
                .forEach(category => {
                    categorySelect.add(new Option(
                        category.name,
                        String(category.id)
                    ));
                });

            const validCategory = knowledgeCategories.some(category =>
                String(category.id) === String(selectedCategoryId) &&
                String(category.center_id) === String(selectedCenterId)
            );

            if (validCategory) {
                categorySelect.value = selectedCategoryId;
            } else {
                selectedCategoryId = '';
                categorySelect.value = '';
            }
        }

        centerSelect.addEventListener('change', () => {
            selectedCenterId = centerSelect.value;
            selectedCategoryId = '';
            populateCategories();
        });

        categorySelect.addEventListener('change', () => {
            selectedCategoryId = categorySelect.value;
        });

        populateCategories();


        const classificationHeadingRow = document.createElement('div');
        classificationHeadingRow.style.cssText =
            'display:flex;align-items:center;justify-content:space-between;' +
            'gap:12px;flex-wrap:wrap;margin-bottom:6px;';

        classificationHeadingRow.append(
            heading,
            classificationInfoButton
        );

       
        section.append(
            classificationHeadingRow,
            description,
            centerLabel,
            centerSelect,
            categoryLabel,
            categorySelect
        );

        container.appendChild(section);
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

            
            const excerptLabel = document.createElement('p');
            excerptLabel.textContent = 'Relevant article text';
            excerptLabel.style.cssText =
                'margin:12px 0 4px;color:#64748B;font-size:11px;font-weight:600;';
            
            const excerpt = document.createElement('p');
            excerpt.textContent = findRelevantExcerpt(
                getArticleText(),
                topic,
                200
            );
            excerpt.style.cssText =
                'margin:0;color:#334155;font-size:12px;line-height:1.5;';
            
            card.append(excerptLabel, excerpt);

         
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
    const selectedCenter = knowledgeCenters.find(
        center => String(center.id) === String(selectedCenterId)
    );

    const selectedCategory = knowledgeCategories.find(
        category =>
            String(category.id) === String(selectedCategoryId) &&
            String(category.center_id) === String(selectedCenterId)
    );

    return {
        topicIds: [...selectedTopicIds],
        rejectedTopicIds: [...rejectedTopicIds],
        engineering_center_id: selectedCenterId
            ? Number(selectedCenterId)
            : null,
        engineering_center_name: selectedCenter?.name || null,
        category_id: selectedCategoryId
            ? Number(selectedCategoryId)
            : null,
        category_name: selectedCategory?.name || null
    };
};



    window.resetKnowledgeMetadataSelection = function () {
        selectedTopicIds.clear();
        rejectedTopicIds.clear();
        lastSuggestions = [];
        selectedCenterId = '';
        selectedCategoryId = '';
    };


})();

