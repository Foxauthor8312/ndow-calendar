/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center Review
------------------------------------------------------------------------------
 Module      : knowledge-review.js

 Purpose:
    Review article metadata, classifications, and references before
    registering the article as Draft or Active EKC content.
==============================================================================
*/

'use strict';

(function () {

    function getUploadData() {
        return typeof window.getKnowledgeUploadData === 'function'
            ? window.getKnowledgeUploadData() || {}
            : {};
    }

    function getClassificationSelection() {
        return typeof window.getKnowledgeMetadataSelection === 'function'
            ? window.getKnowledgeMetadataSelection() || {}
            : {};
    }

    function getReferenceSelection() {
        return typeof window.getKnowledgeRelationshipsSelection === 'function'
            ? window.getKnowledgeRelationshipsSelection() || {}
            : {};
    }

    function createElement(tag, text, parent) {
        const element = window.document.createElement(tag);

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        if (parent) {
            parent.appendChild(element);
        }

        return element;
    }

    function addSection(container, title) {
        const section = createElement('section', undefined, container);

        section.style.cssText =
            'padding:16px;margin:12px 0;' +
            'border:1px solid #DBE3EC;border-radius:8px;' +
            'background:#FFFFFF;';

        const heading = createElement('h3', title, section);
        heading.style.cssText =
            'margin:0 0 10px;color:#19304B;font-size:16px;';

        return section;
    }

    function addLine(container, label, value) {
        const paragraph = createElement('p', undefined, container);
        paragraph.style.cssText =
            'margin:6px 0;color:#334155;font-size:14px;';

        createElement('strong', `${label}: `, paragraph);

        createElement(
            'span',
            value === undefined || value === null || value === ''
                ? 'Not provided'
                : String(value),
            paragraph
        );

        return paragraph;
    }

    function renderKnowledgeReview(container) {
        container.replaceChildren();

        const heading = createElement(
            'h2',
            'Review and Register',
            container
        );

        heading.style.cssText =
            'margin:0 0 8px;color:#19304B;font-size:20px;';

        createElement(
            'p',
            'Review the article, summary, classification, and accepted references. ' +
            'Registration saves the article as Draft, then automatically opens Verification.',
            container
        );

        const upload = getUploadData();
        const classifications = getClassificationSelection();
        const references = getReferenceSelection();

        const documentSection = addSection(container, 'Document Details');

        addLine(documentSection, 'Title', upload.title);
        addLine(documentSection, 'Summary', upload.description);
        addLine(
            documentSection,
            'Source file',
            upload.file ? upload.file.name : ''
        );

        const hasHtml =
            typeof upload.html === 'string' && upload.html.trim().length > 0;

        const hasBody =
            typeof upload.text === 'string' && upload.text.trim().length > 0;

        addLine(
            documentSection,
            'Converted content',
            hasHtml || hasBody ? 'Available' : 'Not available'
        );

        const classificationSection = addSection(
            container,
            'Accepted Classifications'
        );

        addLine(
            classificationSection,
            'Engineering Center',
            classifications.engineering_center_name || 'Not selected'
        );
        addLine(
            classificationSection,
            'Primary Category',
            classifications.category_name || 'Not selected'
        );

        const topicIds = Array.isArray(classifications.topicIds)
            ? classifications.topicIds
            : [];

        addLine(
            classificationSection,
            'Accepted topic IDs',
            topicIds.length ? topicIds.join(', ') : 'None selected'
        );

        const referenceSection = addSection(container, 'Accepted References');
        const acceptedReferences =
            Array.isArray(references.acceptedDocuments)
                ? references.acceptedDocuments
                : [];

        if (acceptedReferences.length === 0) {
            createElement(
                'p',
                'No references accepted. You may continue without them.',
                referenceSection
            );
        } else {
            const list = createElement('ul', undefined, referenceSection);

            acceptedReferences.forEach(reference => {
                createElement(
                    'li',
                    reference.title || `Document ID ${reference.id}`,
                    list
                );
            });
        }

        const statusSection = addSection(container, 'Registration Status');
        createElement(
            'p',
            'New articles are registered as Draft first. After registration, use the single status toggle to activate the article when it is ready for active EKC search.',
            statusSection
        ).style.cssText =
            'margin:0;color:#64748B;font-size:13px;line-height:1.5;';

        const readinessSection = addSection(container, 'Readiness Checks');
        const checks = [
            {
                label: 'Article title provided',
                passed: Boolean(String(upload.title || '').trim())
            },
            {
                label: 'Required article summary provided',
                passed: Boolean(String(upload.description || '').trim())
            },
            {
                label: 'DOCX source selected',
                passed: Boolean(upload.file)
            },
            {
                label: 'Converted article content available',
                passed: hasHtml || hasBody
            },
            {
                label: 'Engineering Center selected',
                passed: Boolean(classifications.engineering_center_id)
            },
            {
                label: 'Primary Category selected',
                passed: Boolean(classifications.category_id)
            }
        ];

        checks.forEach(check => {
            const line = createElement(
                'p',
                `${check.passed ? '✓' : '○'} ${check.label}`,
                readinessSection
            );
            line.style.cssText =
                `margin:6px 0;color:${check.passed ? '#166534' : '#92400E'};`;
        });

        const registerButton = createElement(
            'button',
            'Register Article',
            container
        );
        registerButton.type = 'button';
        registerButton.style.cssText =
            'margin-top:12px;padding:10px 18px;border:0;border-radius:6px;' +
            'background:#19304B;color:#FFFFFF;font-weight:600;cursor:pointer;';

        const registrationStatus = createElement('p', '', container);
        registrationStatus.setAttribute('role', 'status');
        registrationStatus.style.cssText =
            'margin-top:10px;font-size:13px;line-height:1.5;';

        const slug = String(upload.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 70) || 'article';
        const documentKey = 'ekc-' + slug + '-' + Date.now().toString(36);

        registerButton.addEventListener('click', async () => {
            const missing = [];
            if (!String(upload.title || '').trim()) missing.push('title');
            if (!String(upload.description || '').trim()) missing.push('summary');
            if (!upload.file) missing.push('DOCX source file');
            if (!hasHtml && !hasBody) missing.push('converted content');
            if (!classifications.engineering_center_id) missing.push('Engineering Center');
            if (!classifications.category_id) missing.push('Category');
            if (!Array.isArray(classifications.topicIds) || classifications.topicIds.length === 0) {
                missing.push('at least one Knowledge Topic');
            }

            if (missing.length) {
                registrationStatus.textContent =
                    'Cannot register yet. Please provide: ' + missing.join(', ') + '.';
                registrationStatus.style.color = '#B45309';
                return;
            }

            const token =
                window.authToken ||
                window.localStorage.getItem('token') ||
                window.localStorage.getItem('authToken') ||
                '';

            if (!token) {
                registrationStatus.textContent =
                    'Your login token was not found. Please sign in again.';
                registrationStatus.style.color = '#B91C1C';
                return;
            }

            registerButton.disabled = true;
            registerButton.textContent = 'Registering…';
            registrationStatus.textContent = 'Registering article as Draft…';

            try {
                const response = await fetch(
                    'https://ndow-calendar-server.onrender.com/api/knowledge/document',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        },
                        body: JSON.stringify({
                            title: String(upload.title).trim(),
                            description: String(upload.description).trim(),
                            document_key: documentKey,
                            document_type: 'Engineering Knowledge Article',
                            version: '1.0',
                            body: String(upload.text || '').trim(),
                            body_html: String(upload.html || '').trim(),
                            engineering_center_id: classifications.engineering_center_id,
                            category_id: classifications.category_id,
                            topic_ids: Array.isArray(classifications.topicIds)
                                ? classifications.topicIds
                                : [],
                            related_documents: acceptedReferences
                                .map(item => Number(item.id))
                                .filter(id => Number.isInteger(id) && id > 0),
                            status: 'draft'
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error || 'Registration failed (' + response.status + ').'
                    );
                }

                const savedKey = result.document?.document_key || documentKey;
                window.knowledgeRegistrationSnapshot = {
                    documentKey: savedKey,
                    submitted: {
                        title: String(upload.title || '').trim(),
                        description: String(upload.description || '').trim(),
                        body: String(upload.text || '').trim(),
                        body_html: String(upload.html || '').trim(),
                        engineering_center_id: Number(classifications.engineering_center_id),
                        category_id: Number(classifications.category_id),
                        topic_ids: Array.isArray(classifications.topicIds)
                            ? classifications.topicIds.map(Number).filter(Number.isFinite)
                            : [],
                        related_documents: acceptedReferences
                            .map(item => Number(item.id))
                            .filter(id => Number.isInteger(id) && id > 0)
                    },
                    registeredResponse: result.document || null,
                    registeredAt: new Date().toISOString()
                };
                registerButton.textContent = 'Registered — Verifying…';
                registrationStatus.textContent =
                    'Registration succeeded. Opening Verification and reading back saved records…';
                registrationStatus.style.color = '#166534';

                if (typeof window.showKnowledgeIntakeStage === 'function') {
                    window.showKnowledgeIntakeStage('verification');
                } else {
                    throw new Error(
                        'Registration succeeded, but the Verification tab is unavailable. ' +
                        'Keep this session open and use the document key to verify the saved record: ' + savedKey
                    );
                }
            } catch (error) {
                registrationStatus.textContent =
                    error.message || 'Registration failed. Please try again.';
                registrationStatus.style.color = '#B91C1C';
                registerButton.disabled = false;
                registerButton.textContent = 'Register Article';
            }
        });

        const note = createElement(
            'p',
            'Registration saves the article as Draft. The next tab verifies the saved record and relationships; it does not publish or modify data.',
            container
        );
        note.style.cssText =
            'margin-top:16px;color:#64748B;font-size:13px;line-height:1.6;';
    }


    /*
    ==========================================================================
     Read-Only Post-Registration Verification
    ==========================================================================
    */
    async function renderKnowledgeVerification(container) {
        container.replaceChildren();

        const heading = createElement('h2', 'Registration Verification', container);
        heading.style.cssText = 'margin:0 0 8px;color:#19304B;font-size:20px;';
        createElement(
            'p',
            'Verification reads the saved document, classifications, relationships, and search-index rows directly from the database. Activation is verified only after a fresh database read confirms the saved status.',
            container
        );

        const snapshot = window.knowledgeRegistrationSnapshot;
        const resultPanel = createElement('section', undefined, container);
        resultPanel.setAttribute('aria-live', 'polite');
        resultPanel.style.cssText =
            'display:flex;align-items:center;gap:12px;padding:18px;margin-top:18px;' +
            'border:1px solid #DBE3EC;border-radius:8px;background:#FFFFFF;';

        const indicator = createElement('span', '…', resultPanel);
        indicator.style.cssText =
            'display:inline-flex;align-items:center;justify-content:center;' +
            'width:34px;height:34px;flex:0 0 34px;border-radius:50%;' +
            'font-size:20px;font-weight:700;background:#E2E8F0;color:#334155;';

        const messageBox = createElement('div', undefined, resultPanel);
        const resultHeading = createElement('strong', 'Verification in progress', messageBox);
        resultHeading.style.cssText = 'display:block;color:#19304B;font-size:15px;';
        const resultMessage = createElement('span', 'Reading saved database records…', messageBox);
        resultMessage.style.cssText = 'display:block;margin-top:4px;color:#475569;font-size:13px;line-height:1.5;';

        const detailSection = addSection(container, 'Database Read-Back Results');
        const activationSection = addSection(container, 'Publication Status');
        let activationMessage = createElement(
            'p',
            'Activation is available after every registration and relationship check passes.',
            activationSection
        );
        activationMessage.style.cssText = 'margin:0;color:#475569;font-size:13px;line-height:1.5;';

        function showResult(passed, message) {
            indicator.textContent = passed ? '✓' : '!';
            indicator.style.background = passed ? '#DCFCE7' : '#FEE2E2';
            indicator.style.color = passed ? '#166534' : '#B91C1C';
            resultPanel.style.borderColor = passed ? '#7A9E7F' : '#DC2626';
            resultHeading.textContent = passed ? 'Verification passed' : 'Verification failed';
            resultHeading.style.color = passed ? '#166534' : '#B91C1C';
            resultMessage.textContent = message;
        }

        function normalizedIds(values) {
            return [...new Set((Array.isArray(values) ? values : [])
                .map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
        }

        function sameIds(a, b) {
            return JSON.stringify(normalizedIds(a)) === JSON.stringify(normalizedIds(b));
        }

        function renderChecks(checks) {
            detailSection.replaceChildren();
            createElement('h3', 'Database Read-Back Results', detailSection).style.cssText =
                'margin:0 0 10px;color:#19304B;font-size:16px;';
            checks.forEach(check => {
                const line = createElement(
                    'p',
                    (check.passed ? '✓ PASS — ' : '✗ FAIL — ') + check.label,
                    detailSection
                );
                line.style.cssText =
                    'margin:6px 0;color:' + (check.passed ? '#166534' : '#B91C1C') +
                    ';font-size:13px;line-height:1.5;';
            });
        }

        if (!snapshot || !snapshot.documentKey || !snapshot.submitted) {
            showResult(false, 'No successful registration is recorded in this intake session. Register an article first.');
            return;
        }

        const token =
            window.authToken ||
            window.localStorage.getItem('token') ||
            window.localStorage.getItem('authToken') ||
            '';

        if (!token) {
            showResult(false, 'Verification could not run because the login token is missing. No data was changed.');
            return;
        }

        async function readVerification() {
            const response = await fetch(
                'https://ndow-calendar-server.onrender.com/api/knowledge/document/' +
                    encodeURIComponent(snapshot.documentKey) + '/verification',
                { headers: { Authorization: 'Bearer ' + token } }
            );

            let payload = {};
            try {
                payload = await response.json();
            } catch (_) {
                throw new Error('The verification service returned an unreadable response.');
            }

            if (!response.ok || !payload.success || !payload.verification?.document) {
                throw new Error(payload.error || 'The saved document or its database relationships could not be read.');
            }
            return payload.verification;
        }

        function buildChecks(verification) {
            const saved = verification.document;
            const submitted = snapshot.submitted;
            const topicReferences = verification.topic_references || [];
            const savedTopics = topicReferences
                .filter(item => item.reference_type === 'primary')
                .map(item => Number(item.topic_id));
            const related = verification.related_documents || [];
            const indexRows = verification.search_index_records || [];
            const expectedTopics = normalizedIds(submitted.topic_ids);
            const indexedTopics = normalizedIds(indexRows.map(item => item.topic_id));
            const relatedIds = normalizedIds(saved.related_documents);
            const actualRelatedIds = normalizedIds(related.map(item => item.id));
            const savedBody = String(saved.body || '').trim();
            const savedHtml = String(saved.body_html || '').trim();
            const center = verification.engineering_center;
            const category = verification.category;
            const statusConsistent =
                (saved.active === true && String(saved.review_status || '').toLowerCase() === 'verified') ||
                (saved.active === false && String(saved.review_status || '').toLowerCase() === 'draft');

            return [
                { label: 'Document row exists and document key matches', passed: saved.document_key === snapshot.documentKey },
                { label: 'Saved title matches submitted title', passed: String(saved.title || '') === submitted.title },
                { label: 'Saved required summary matches submitted summary', passed: String(saved.description || '') === submitted.description },
                { label: 'Saved text body matches submitted content', passed: savedBody === submitted.body },
                { label: 'Saved HTML body matches submitted content', passed: savedHtml === submitted.body_html },
                { label: 'Saved Engineering Center ID matches selection', passed: Number(saved.engineering_center_id) === submitted.engineering_center_id },
                { label: 'Engineering Center row exists and is active', passed: Boolean(center && center.active === true && Number(center.id) === Number(saved.engineering_center_id)) },
                { label: 'Saved Category ID matches selection', passed: Number(saved.category_id) === submitted.category_id },
                { label: 'Category row exists, is active, and belongs to the selected Center', passed: Boolean(category && category.active === true && Number(category.id) === Number(saved.category_id) && Number(category.center_id) === Number(saved.engineering_center_id)) },
                { label: 'Topic relationship rows match all selected topic IDs', passed: sameIds(savedTopics, expectedTopics) },
                { label: 'Related-document IDs match the accepted references', passed: sameIds(relatedIds, submitted.related_documents) },
                { label: 'Every related-document row exists and matches the saved IDs', passed: sameIds(actualRelatedIds, relatedIds) },
                { label: 'Search-index rows exist for every selected topic', passed: expectedTopics.length > 0 && expectedTopics.every(id => indexedTopics.includes(id)) && indexRows.every(row => Number(row.document_id) === Number(saved.id)) },
                { label: 'Search-index row count matches selected topic count', passed: indexRows.length === expectedTopics.length },
                { label: 'Saved publication status and review status are consistent', passed: statusConsistent }
            ];
        }

        function renderActivationControls(verification, checksPassed) {
            activationSection.replaceChildren();
            createElement('h3', 'Publication Status', activationSection).style.cssText =
                'margin:0 0 10px;color:#19304B;font-size:16px;';

            const saved = verification.document;
            createElement(
                'p',
                'Database currently reports: ' + (saved.active ? 'ACTIVE' : 'DRAFT') +
                    ' (review_status: ' + String(saved.review_status || 'unset') + ').',
                activationSection
            ).style.cssText = 'margin:0 0 10px;color:#334155;font-size:13px;line-height:1.5;';

            if (saved.active === true && String(saved.review_status || '').toLowerCase() === 'verified') {
                createElement('p', 'Activation confirmed: a fresh database read reports active=true and review_status=Verified.', activationSection)
                    .style.cssText = 'margin:0;color:#166534;font-size:13px;line-height:1.5;';
                return;
            }

            if (!checksPassed) {
                createElement('p', 'Activation is blocked because one or more verification checks failed. Correct the listed failures before publishing.', activationSection)
                    .style.cssText = 'margin:0;color:#B91C1C;font-size:13px;line-height:1.5;';
                return;
            }

            createElement('p', 'All document, relationship, and index checks passed. You can activate this article now.', activationSection)
                .style.cssText = 'margin:0 0 10px;color:#475569;font-size:13px;line-height:1.5;';

            const activateButton = createElement('button', 'Activate Article', activationSection);
            activateButton.type = 'button';
            activateButton.style.cssText =
                'padding:10px 16px;border:0;border-radius:6px;background:#19304B;color:#FFFFFF;font-weight:600;cursor:pointer;';

            const statusLine = createElement('p', '', activationSection);
            statusLine.setAttribute('role', 'status');
            statusLine.style.cssText = 'margin-top:10px;font-size:13px;line-height:1.5;';

            activateButton.addEventListener('click', async () => {
                activateButton.disabled = true;
                activateButton.textContent = 'Activating…';
                statusLine.textContent = 'Saving Active status, then reading the document back from the database…';
                statusLine.style.color = '#475569';

                try {
                    const response = await fetch(
                        'https://ndow-calendar-server.onrender.com/api/knowledge/document/' +
                            encodeURIComponent(snapshot.documentKey) + '/status',
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + token
                            },
                            body: JSON.stringify({ status: 'active' })
                        }
                    );

                    let result = {};
                    try {
                        result = await response.json();
                    } catch (_) {
                        throw new Error('The activation endpoint returned an unreadable response.');
                    }
                    if (!response.ok || !result.success) {
                        throw new Error(result.error || 'The activation request failed.');
                    }

                    const freshVerification = await readVerification();
                    const freshDocument = freshVerification.document;
                    const confirmed = freshDocument.active === true &&
                        String(freshDocument.review_status || '').toLowerCase() === 'verified';

                    const freshChecks = buildChecks(freshVerification);
                    renderChecks(freshChecks);
                    renderActivationControls(freshVerification, freshChecks.every(item => item.passed));

                    if (!confirmed) {
                        showResult(false, 'The activation request returned, but the fresh database read did not confirm active=true and review_status=Verified. Do not treat activation as successful.');
                        statusLine.textContent = 'Activation NOT confirmed by database read-back.';
                        statusLine.style.color = '#B91C1C';
                        return;
                    }

                    if (!freshChecks.every(item => item.passed)) {
                        showResult(false, 'The database confirms Active status, but one or more integrity checks now fail. Review the listed results; publication status was saved.');
                        statusLine.textContent = 'Active status saved, but verification has failures.';
                        statusLine.style.color = '#B91C1C';
                        return;
                    }

                    showResult(true, 'Database read-back confirms the article is Active and all document, relationship, and search-index checks pass.');
                    statusLine.textContent = 'Activation confirmed by fresh database read-back.';
                    statusLine.style.color = '#166534';
                } catch (error) {
                    showResult(false, (error && error.message ? error.message : 'Activation could not be verified.') + ' Check the saved status before retrying.');
                    statusLine.textContent = 'Activation result is uncertain until the database is read again.';
                    statusLine.style.color = '#B91C1C';
                    activateButton.disabled = false;
                    activateButton.textContent = 'Retry Activation';
                }
            });
        }

        try {
            const verification = await readVerification();
            const checks = buildChecks(verification);
            const passed = checks.every(item => item.passed);
            renderChecks(checks);
            renderActivationControls(verification, passed);

            if (passed) {
                showResult(
                    true,
                    'All ' + checks.length + ' database checks passed. The saved document and all selected relationships and search-index rows were read back.'
                );
            } else {
                const failed = checks.filter(item => !item.passed);
                showResult(
                    false,
                    failed.length + ' of ' + checks.length +
                    ' database checks failed. See the itemized results below. Activation is blocked until these are corrected.'
                );
            }
        } catch (error) {
            showResult(
                false,
                (error && error.message ? error.message : 'Verification could not be completed.') +
                ' The intake session remains open. No automatic retry or duplicate registration was performed.'
            );
            createElement('p', 'No successful database read-back was completed. Do not assume registration or activation succeeded.', detailSection)
                .style.cssText = 'color:#B91C1C;font-size:13px;';
        }
    }

    window.renderKnowledgeReview = renderKnowledgeReview;
    window.renderKnowledgeVerification = renderKnowledgeVerification;

})();
