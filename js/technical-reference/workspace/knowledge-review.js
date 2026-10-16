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
            'Choose whether the registered article should remain a Draft or become Active.',
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
        const statusHelp = createElement(
            'p',
            'Draft articles are saved but excluded from active EKC search. ' +
            'An administrator can activate a draft later through the EKC document-status endpoint.',
            statusSection
        );
        statusHelp.style.cssText =
            'margin:0 0 12px;color:#64748B;font-size:13px;line-height:1.5;';

        const statusLabel = createElement(
            'label',
            'Status when registered',
            statusSection
        );
        statusLabel.style.cssText =
            'display:block;margin-bottom:6px;color:#19304B;font-weight:600;';

        const statusSelect = createElement('select', undefined, statusSection);
        statusSelect.setAttribute('aria-label', 'Status when registered');
        statusSelect.style.cssText =
            'padding:9px 12px;border:1px solid #DBE3EC;border-radius:6px;' +
            'background:#FFFFFF;color:#19304B;font:inherit;min-width:180px;';

        [
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' }
        ].forEach(optionData => {
            const option = createElement(
                'option',
                optionData.label,
                statusSelect
            );
            option.value = optionData.value;
        });

        statusSelect.value = 'draft';

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

            const selectedStatus = statusSelect.value;
            registerButton.disabled = true;
            statusSelect.disabled = true;
            registerButton.textContent = 'Registering…';
            registrationStatus.textContent =
                `Registering article as ${selectedStatus === 'draft' ? 'Draft' : 'Active'}…`;

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
                            status: selectedStatus
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error || 'Registration failed (' + response.status + ').'
                    );
                }

                registrationStatus.textContent =
                    `Article registered as ${selectedStatus === 'draft' ? 'Draft' : 'Active'}.` +
                    ' Document key: ' +
                    (result.document?.document_key || documentKey);
                registrationStatus.style.color = '#166534';
                registerButton.textContent =
                    selectedStatus === 'draft' ? 'Draft Saved' : 'Article Registered';
            } catch (error) {
                registrationStatus.textContent =
                    error.message || 'Registration failed. Please try again.';
                registrationStatus.style.color = '#B91C1C';
                registerButton.disabled = false;
                statusSelect.disabled = false;
                registerButton.textContent = 'Register Article';
            }
        });

        const note = createElement(
            'p',
            'The selected status is saved by the backend. Registration uses existing EKC taxonomy and relationships.',
            container
        );
        note.style.cssText =
            'margin-top:16px;color:#64748B;font-size:13px;line-height:1.6;';
    }

    window.renderKnowledgeReview = renderKnowledgeReview;

})();
