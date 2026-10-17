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
            'This read-only screen compares the submitted article with the saved database record and topic relationships. It never repairs, re-registers, or publishes an article.',
            container
        );

        const snapshot = window.knowledgeRegistrationSnapshot;
        if (!snapshot || !snapshot.documentKey || !snapshot.submitted) {
            const message = createElement(
                'p',
                'No successful registration is recorded in this intake session. Register the article from Review & Register first.',
                container
            );
            message.style.color = '#92400E';
            return;
        }

        const status = createElement('p', 'Reading saved record…', container);
        status.setAttribute('role', 'status');
        status.style.cssText = 'font-size:13px;color:#64748B;';
        const resultsBox = addSection(container, 'Verification Results');
        const detailBox = addSection(container, 'Saved Article Details');

        function addResult(label, passed, detail) {
            const line = createElement('p', undefined, resultsBox);
            line.style.cssText = 'margin:8px 0;font-size:13px;line-height:1.5;color:' +
                (passed ? '#166534' : '#B91C1C') + ';';
            createElement('strong', (passed ? 'PASS — ' : 'FAIL — ') + label, line);
            if (detail) createElement('span', ' ' + detail, line);
        }

        function normalizedIds(values) {
            return [...new Set((Array.isArray(values) ? values : [])
                .map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
        }

        function sameIds(a, b) {
            return JSON.stringify(normalizedIds(a)) === JSON.stringify(normalizedIds(b));
        }

        const token =
            window.authToken ||
            window.localStorage.getItem('token') ||
            window.localStorage.getItem('authToken') ||
            '';

        if (!token) {
            status.textContent = 'Verification could not run because the login token is missing. Your intake data is preserved.';
            status.style.color = '#B91C1C';
            return;
        }

        try {
            const response = await fetch(
                'https://ndow-calendar-server.onrender.com/api/knowledge/document/' +
                    encodeURIComponent(snapshot.documentKey) + '/verification',
                { headers: { Authorization: 'Bearer ' + token } }
            );
            const payload = await response.json();
            if (!response.ok || !payload.success || !payload.verification?.document) {
                throw new Error(payload.error || 'Saved document could not be verified.');
            }

            const saved = payload.verification.document;
            const savedTopics = (payload.verification.topic_references || [])
                .filter(item => item.reference_type === 'primary')
                .map(item => Number(item.topic_id));

            addLine(detailBox, 'Title', saved.title);
            addLine(detailBox, 'Summary', saved.description);
            addLine(detailBox, 'Document key', saved.document_key);
            addLine(detailBox, 'Document ID', saved.id);
            addLine(detailBox, 'Status', saved.active === true ? 'Active' : 'Draft');
            addLine(detailBox, 'Engineering Center', payload.verification.engineering_center?.name || 'Record not found');
            addLine(detailBox, 'Engineering Center ID', saved.engineering_center_id);
            addLine(detailBox, 'Category', payload.verification.category?.name || 'Record not found');
            addLine(detailBox, 'Category ID', saved.category_id);
            addLine(detailBox, 'Topic IDs saved', savedTopics.length ? savedTopics.join(', ') : 'None');
            const savedRelated = payload.verification.related_documents || [];
            addLine(
                detailBox,
                'Related documents saved',
                savedRelated.length
                    ? savedRelated.map(item => item.title || ('ID ' + item.id)).join('; ')
                    : 'None'
            );

            const checks = [
                ['Document key matches', saved.document_key === snapshot.documentKey],
                ['Title matches submitted value', String(saved.title || '') === snapshot.submitted.title],
                ['Summary matches edited value', String(saved.description || '') === snapshot.submitted.description],
                ['Readable body matches submitted content', String(saved.body || '').trim() === snapshot.submitted.body],
                ['Formatted HTML matches submitted content', String(saved.body_html || '').trim() === snapshot.submitted.body_html],
                ['Engineering Center matches', Number(saved.engineering_center_id) === snapshot.submitted.engineering_center_id],
                ['Category matches', Number(saved.category_id) === snapshot.submitted.category_id],
                ['Engineering Center record exists and is active', Boolean(payload.verification.engineering_center && payload.verification.engineering_center.active === true)],
                ['Category record exists, is active, and belongs to the selected Center', Boolean(
                    payload.verification.category &&
                    payload.verification.category.active === true &&
                    Number(payload.verification.category.center_id) === Number(saved.engineering_center_id)
                )],
                ['Topic relationships match', sameIds(savedTopics, snapshot.submitted.topic_ids)],
                ['Related document IDs match', sameIds(saved.related_documents, snapshot.submitted.related_documents)],
                ['Related document records all exist', (payload.verification.related_documents || []).length === snapshot.submitted.related_documents.length],
                ['Article remains Draft', saved.active === false && String(saved.review_status || '').toLowerCase() === 'draft']
            ];

            checks.forEach(([label, passed]) => addResult(
                label,
                passed,
                passed ? '' : 'Expected and saved values differ; inspect the details before finishing.'
            ));

            const failed = checks.filter(item => !item[1]);
            status.textContent = failed.length
                ? 'Verification finished with ' + failed.length + ' failed check(s). Keep this session open; no data was changed.'
                : 'All verification checks passed. The article remains Draft and unpublished.';
            status.style.color = failed.length ? '#B91C1C' : '#166534';

            const finish = createElement(
                'button',
                'Finish — Keep Results Visible',
                container
            );
            finish.type = 'button';
            finish.style.cssText = 'margin-top:12px;padding:10px 18px;border:1px solid #19304B;border-radius:6px;background:#FFFFFF;color:#19304B;font-weight:600;cursor:pointer;';
            finish.addEventListener('click', () => {
                finish.disabled = true;
                finish.textContent = 'Verification results retained above';
                createElement(
                    'p',
                    'You may now leave this screen. The results remain visible until you navigate away or close the workspace.',
                    container
                ).style.cssText = 'color:#64748B;font-size:13px;';
            });
        } catch (error) {
            status.textContent = (error.message || 'Verification failed.') +
                ' Your intake session remains open; no automatic retry or duplicate registration was performed.';
            status.style.color = '#B91C1C';
            createElement(
                'p',
                'Document key: ' + snapshot.documentKey,
                detailBox
            );
        }
    }

    window.renderKnowledgeReview = renderKnowledgeReview;
    window.renderKnowledgeVerification = renderKnowledgeVerification;

})();
