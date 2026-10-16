
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center Review
------------------------------------------------------------------------------
 Module      : knowledge-review.js

 Purpose:
    Review article metadata, classifications, and references before
    registration. Registration is handled separately.
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

        const strong = createElement('strong', `${label}: `, paragraph);

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
            'Review the article and your selections before registration. ' +
            'New articles must remain Draft and inactive until approved.',
            container
        );

        const upload = getUploadData();
        const classifications = getClassificationSelection();
        const references = getReferenceSelection();

        const documentSection = addSection(
            container,
            'Document Details'
        );

        addLine(documentSection, 'Title', upload.title);
        addLine(documentSection, 'Description', upload.description);
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

        const referenceSection = addSection(
            container,
            'Accepted References'
        );

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
            const list = createElement(
                'ul',
                undefined,
                referenceSection
            );

            acceptedReferences.forEach(reference => {
                createElement(
                    'li',
                    reference.title || `Document ID ${reference.id}`,
                    list
                );
            });
        }

        const readinessSection = addSection(
            container,
            'Readiness Checks'
        );

        const checks = [
            {
                label: 'Article title provided',
                passed: Boolean(String(upload.title || '').trim())
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

        const note = createElement(
            'p',
            'Complete the final review before registering this article as active EKC content. ' +
            'Registration will use the existing EKC taxonomy and relationships.',
            container
        );

        note.style.cssText =
            'margin-top:16px;color:#64748B;font-size:13px;line-height:1.6;';
    }

    window.renderKnowledgeReview = renderKnowledgeReview;

})();

