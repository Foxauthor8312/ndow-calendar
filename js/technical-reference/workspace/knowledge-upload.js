
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center — Article Intake
------------------------------------------------------------------------------
 Module : workspace/knowledge-upload.js

 Purpose:
    Provides the initial article intake interface.
    Supports DOCX selection, review fields, and HTML preview.

 Important:
    Server-side DOCX conversion and automatic EKC matching are not yet
    implemented by this module. Do not register until those steps exist.
==============================================================================
*/

'use strict';

let knowledgeUploadState = {
    file: null,
    html: '',
    text: ''
};

function openKnowledgeUpload() {

    // Apply the standard EKC article typography.
    if (!document.getElementById('ekcArticleTypography')) {
        const style = document.createElement('style');
        style.id = 'ekcArticleTypography';

        style.textContent = `
            .ekc-article-content {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10pt;
                font-weight: 400;
                line-height: 1.65;
                color: #19304B;
            }

            .ekc-article-content h1,
            .ekc-article-content h2,
            .ekc-article-content h3 {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 14pt;
                font-weight: 600;
                line-height: 1.4;
                color: #19304B;
            }

            .ekc-article-content h4,
            .ekc-article-content h5,
            .ekc-article-content h6 {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 12pt;
                font-weight: 600;
                line-height: 1.4;
                color: #19304B;
            }

            .ekc-article-content p,
            .ekc-article-content li,
            .ekc-article-content td,
            .ekc-article-content th {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10pt;
                color: #19304B;
            }

            .ekc-article-content table {
                width: 100%;
                border-collapse: collapse;
            }

            .ekc-article-content th,
            .ekc-article-content td {
                border: 1px solid #DBE3EC;
                padding: 8px;
                text-align: left;
                vertical-align: top;
            }

            .ekc-article-content th {
                background: #F1F5F9;
            }
        `;

        document.head.appendChild(style);
    }

    const panel = document.getElementById(
        'technicalReferenceContent'
    );

    

    if (!panel) {
        console.error('EKC content panel was not found.');
        return;
    }

    knowledgeUploadState = {
        file: null,
        html: '',
        text: ''
    };

    panel.innerHTML = `
        <div style="
            max-width:1100px;
            margin:0 auto;
            color:#334155;
            font-family:'IBM Plex Sans',sans-serif;
        ">
            <div style="
                display:flex;
                align-items:center;
                gap:14px;
                margin-bottom:24px;
            ">
                <div style="
                    width:46px;
                    height:46px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:10px;
                    background:#E8F1FA;
                    color:#19304B;
                    font-size:23px;
                ">↥</div>

                <div>
                    <h1 style="
                        margin:0;
                        color:#19304B;
                        font-size:26px;
                    ">Upload New Article</h1>

                    <p style="
                        margin:5px 0 0;
                        color:#64748B;
                        font-size:14px;
                    ">
                        Prepare a technical document for the
                        Engineering Knowledge Center.
                    </p>
                </div>
            </div>

            <div style="
                padding:18px 22px;
                margin-bottom:22px;
                border:1px solid #DBE3EC;
                border-radius:10px;
                background:#FFFFFF;
            ">
                <strong style="color:#19304B;">
                    Article intake workflow
                </strong>

                <div style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-top:12px;
                ">
                    ${[
                        '1. Select document',
                        '2. Convert and preview',
                        '3. Match EKC knowledge',
                        '4. Review and register'
                    ].map(step => `
                        <span style="
                            padding:7px 10px;
                            border-radius:6px;
                            background:#F1F5F9;
                            font-size:12px;
                        ">${step}</span>
                    `).join('')}
                </div>
            </div>

            <div style="
                padding:24px;
                margin-bottom:22px;
                border:1px solid #DBE3EC;
                border-radius:10px;
                background:#FFFFFF;
            ">
                <h2 style="
                    margin:0 0 8px;
                    color:#19304B;
                    font-size:19px;
                ">1. Select a source document</h2>

                <p style="
                    margin:0 0 18px;
                    color:#64748B;
                    font-size:13px;
                    line-height:1.6;
                ">
                    Select a Microsoft Word document (.docx).
                    The document will not be registered at this stage.
                </p>

                <input
                    id="knowledgeUploadFile"
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style="
                        display:block;
                        width:100%;
                        box-sizing:border-box;
                        padding:14px;
                        border:1px dashed #589FD6;
                        border-radius:8px;
                        background:#F8FAFC;
                    "
                >

                <div
                    id="knowledgeUploadFileInfo"
                    style="
                        margin-top:12px;
                        font-size:13px;
                        color:#64748B;
                    "
                    aria-live="polite"
                >
                    No document selected.
                </div>

                <div
                    id="knowledgeUploadMessage"
                    style="
                        display:none;
                        margin-top:16px;
                        padding:12px;
                        border-radius:6px;
                        font-size:13px;
                    "
                    role="status"
                    aria-live="polite"
                ></div>
            </div>

            <div style="
                padding:24px;
                margin-bottom:22px;
                border:1px solid #DBE3EC;
                border-radius:10px;
                background:#FFFFFF;
            ">
                <h2 style="
                    margin:0 0 8px;
                    color:#19304B;
                    font-size:19px;
                ">2. Article information</h2>

                <p style="
                    margin:0 0 18px;
                    color:#64748B;
                    font-size:13px;
                ">
                    Review and complete these fields after conversion.
                </p>

                <label for="knowledgeUploadTitle"
                    style="display:block;margin-bottom:6px;font-weight:600;">
                    Article title
                </label>

                <input
                    id="knowledgeUploadTitle"
                    type="text"
                    maxlength="250"
                    placeholder="Article title"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:11px 12px;
                        margin-bottom:16px;
                        border:1px solid #DBE3EC;
                        border-radius:6px;
                        font:inherit;
                    "
                >

                <label for="knowledgeUploadDescription"
                    style="display:block;margin-bottom:6px;font-weight:600;">
                    Summary / description
                </label>

                <textarea
                    id="knowledgeUploadDescription"
                    rows="4"
                    placeholder="Required: 2–4 sentences. A proposed summary may be filled from the document; review and edit it before continuing."
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:11px 12px;
                        margin-bottom:16px;
                        border:1px solid #DBE3EC;
                        border-radius:6px;
                        font:inherit;
                        resize:vertical;
                    "
                ></textarea>

                <div style="
                    padding:14px;
                    border-radius:8px;
                    background:#FFF7ED;
                    color:#9A3412;
                    font-size:13px;
                    line-height:1.6;
                ">
                    <strong>Not registered yet.</strong>
                    DOCX conversion, existing-topic matching,
                    duplicate detection, and reference selection
                    must be completed before registration is enabled.
                </div>
            </div>

            <div style="
                padding:24px;
                border:1px solid #DBE3EC;
                border-radius:10px;
                background:#FFFFFF;
            ">
                <h2 style="
                    margin:0 0 8px;
                    color:#19304B;
                    font-size:19px;
                ">3. HTML preview</h2>

                <p style="
                    margin:0 0 16px;
                    color:#64748B;
                    font-size:13px;
                ">
                    The converted article will appear here for review.
                </p>

                <div
                    id="knowledgeUploadPreview"
                   
                style="
                    min-height:180px;
                    max-height:60vh;
                    overflow-y:auto;
                    box-sizing:border-box;
                    padding:18px;
                    border:1px solid #DBE3EC;
                    border-radius:8px;
                    background:#F8FAFC;
                    line-height:1.7;
                    overflow-wrap:anywhere;
                 "

                >
                    <span style="color:#94A3B8;">
                        Select a DOCX document to begin.
                        Conversion is not yet connected.
                    </span>
                </div>
            </div>
        </div>
    `;

    const fileInput = document.getElementById(
        'knowledgeUploadFile'
    );

    fileInput.addEventListener('change', handleKnowledgeUploadSelection);

    window.scrollTo({ top: 0, behavior: 'auto' });
}



/*
==============================================================================
 Summary Helpers
------------------------------------------------------------------------------
 Prefer an authored Summary section. If absent, create a transparent extractive
 draft from the document text; the author must review/edit it before saving.
==============================================================================
*/
function extractKnowledgeSummary(html, text) {
    if (html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const headings = [...parsed.body.querySelectorAll('h1,h2,h3,h4,strong,b')];
        const heading = headings.find(node =>
            /^summary\s*:?$/i.test((node.textContent || '').trim())
        );

        if (heading) {
            const chunks = [];
            let node = heading.closest('p,div,section') || heading;
            node = node.nextElementSibling;
            while (node && !/^H[1-4]$/.test(node.tagName)) {
                const value = (node.textContent || '').replace(/\s+/g, ' ').trim();
                if (value) chunks.push(value);
                node = node.nextElementSibling;
            }
            const authored = chunks.join(' ').trim();
            if (authored) return { text: authored, source: 'document' };
        }
    }

    const cleaned = String(text || '')
        .replace(/Proposed document key:\s*[^.\n]+/gi, '')
        .replace(/Version\s+\d+(?:\.\d+)*\s*[|•-]?/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const selected = sentences
        .map(sentence => sentence.trim())
        .filter(sentence =>
            sentence.length >= 45 &&
            !/^(summary|purpose|scope|prerequisites|main content|references|revision notes)\s*:?$/i.test(sentence) &&
            !/^\[.*\]$/.test(sentence)
        )
        .slice(0, 3);
    return {
        text: selected.join(' '),
        source: selected.length ? 'extractive-draft' : 'none'
    };
}

async function handleKnowledgeUploadSelection(event) {
    const file = event.target.files?.[0];

    const info = document.getElementById(
        'knowledgeUploadFileInfo'
    );

    const preview = document.getElementById(
        'knowledgeUploadPreview'
    );

    if (!file) {
        knowledgeUploadState.file = null;
        info.textContent = 'No document selected.';
        return;
    }

    if (!/\.docx$/i.test(file.name)) {
        event.target.value = '';
        knowledgeUploadState.file = null;
        info.textContent = 'No document selected.';

        showKnowledgeUploadMessage(
            'Please select a Microsoft Word .docx file.',
            'error'
        );

        return;
    }

    knowledgeUploadState.file = file;
    knowledgeUploadState.html = '';
    knowledgeUploadState.text = '';

    info.textContent =
        `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`;

   
    const titleElement = document.getElementById(
        'knowledgeUploadTitle'
    );

    titleElement.value = file.name
        .replace(/\.docx$/i, '')
        .replace(/[_-]+/g, ' ');

    knowledgeUploadState.title = titleElement.value.trim();
    knowledgeUploadState.description = '';


    preview.textContent = 'Converting DOCX to HTML…';

    showKnowledgeUploadMessage(
        'Sending the document for conversion. Nothing will be registered.',
        'success'
    );

    try {
        /*
         * Use the portal's existing API configuration.
         */
        const apiBase =
            typeof API_BASE !== 'undefined'
                ? API_BASE
                : 'https://ndow-calendar-server.onrender.com/api';

        /*
         * Reuse the portal's existing authentication token.
         * Do not invent or send a new token.
         */
        let token = null;

        if (typeof authToken !== 'undefined' && authToken) {
            token = authToken;
        } else if (typeof localStorage !== 'undefined') {
            token =
                localStorage.getItem('token') ||
                localStorage.getItem('authToken');
        }

        if (!token) {
            throw new Error(
                'Your login token was not found. Please sign in again.'
            );
        }

        const formData = new FormData();
        formData.append('document', file);

        const response = await fetch(
            `${apiBase.replace(/\/$/, '')}/knowledge/convert-docx`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.error || `Conversion failed (${response.status}).`
            );
        }

        knowledgeUploadState.html = result.html || '';

        const textDocument = new DOMParser().parseFromString(
            knowledgeUploadState.html,
            'text/html'
        );
        
        knowledgeUploadState.text =
            textDocument.body.textContent || '';

        // Prefill the editable Summary field. Existing authored summary wins;
        // otherwise provide a clearly identified extractive draft for review.
        const summaryField = document.getElementById(
            'knowledgeUploadDescription'
        );
        if (summaryField && !summaryField.value.trim()) {
            const proposedSummary = extractKnowledgeSummary(
                knowledgeUploadState.html,
                knowledgeUploadState.text
            );
            if (proposedSummary.text) {
                summaryField.value = proposedSummary.text;
                knowledgeUploadState.description = proposedSummary.text;
                showKnowledgeUploadMessage(
                    proposedSummary.source === 'document'
                        ? 'Summary extracted from the document. Review it before continuing.'
                        : 'A draft summary was assembled from the document text. Please review and edit it before continuing.',
                    'success'
                );
            } else {
                showKnowledgeUploadMessage(
                    'No Summary section or suitable summary text was found. Enter a summary before registration.',
                    'warning'
                );
            }
        }
     
        if (!knowledgeUploadState.html.trim()) {
            preview.textContent =
                'Conversion completed, but no HTML content was returned.';
        } else {
            /*
             * Mammoth output is intended for document rendering.
             * Remove active elements and event-handler attributes
             * before displaying the preview.
             */
            const parsed = new DOMParser().parseFromString(
                knowledgeUploadState.html,
                'text/html'
            );

            parsed.querySelectorAll(
                'script, iframe, object, embed, form'
            ).forEach(element => element.remove());

            parsed.body.querySelectorAll('*').forEach(element => {
                [...element.attributes].forEach(attribute => {
                    if (
                        /^on/i.test(attribute.name) ||
                        (
                            ['href', 'src'].includes(attribute.name) &&
                            /^\s*javascript:/i.test(attribute.value)
                        )
                    ) {
                        element.removeAttribute(attribute.name);
                    }
                });
            });

       // Apply consistent EKC article typography to the preview.
          const articlePreview = document.createElement('article');
          
          articlePreview.className = 'ekc-article-content';
          articlePreview.innerHTML = parsed.body.innerHTML;
          
          preview.replaceChildren(articlePreview);
         }

        const warnings = Array.isArray(result.messages)
            ? result.messages.length
            : 0;

        showKnowledgeUploadMessage(
            warnings
                ? `Conversion succeeded with ${warnings} conversion message(s). Review the preview carefully. Nothing has been registered.`
                : 'Conversion succeeded. Review the HTML preview. Nothing has been registered.',
            'success'
        );

        console.info('EKC DOCX conversion complete.', {
            filename: result.filename,
            htmlCharacters: result.html.length,
            conversionMessages: result.messages || [],
            registered: result.registered
        });

    } catch (error) {
        console.error('EKC DOCX conversion failed:', error);

        preview.textContent =
            'The HTML preview could not be generated.';

        showKnowledgeUploadMessage(
            error.message || 'Unable to convert the selected document.',
            'error'
        );
    }
}


function showKnowledgeUploadMessage(text, type) {
    const message = document.getElementById(
        'knowledgeUploadMessage'
    );

    if (!message) {
        return;
    }

    message.textContent = text;
    message.style.display = 'block';

    message.style.background =
        type === 'error' ? '#FEF2F2' : '#F0FDF4';

    message.style.color =
        type === 'error' ? '#B91C1C' : '#166534';

    message.style.border =
        type === 'error'
            ? '1px solid #FECACA'
            : '1px solid #BBF7D0';
}

window.getKnowledgeUploadData = function () {
    const titleElement =
        document.getElementById('knowledgeUploadTitle');

    const descriptionElement =
        document.getElementById('knowledgeUploadDescription');

    const html = String(knowledgeUploadState.html || '');
    const previewElement =
        document.getElementById('knowledgeUploadPreview');

    let text = String(knowledgeUploadState.text || '').trim();

    if (!text && html) {
        const parsed = new DOMParser().parseFromString(
            html,
            'text/html'
        );

        text = (parsed.body.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (!text && previewElement) {
        text = (previewElement.innerText || '').trim();
    }

    // Use the entered description first.
   
    let description = String(
        descriptionElement?.value ||
        knowledgeUploadState.description ||
        ''
    ).trim();


    // If blank, extract the first Summary section from converted HTML.
    if (!description && html) {
        const parsed = new DOMParser().parseFromString(
            html,
            'text/html'
        );

        const headings = [
            ...parsed.body.querySelectorAll('h1, h2, h3, h4')
        ];

        const summaryHeading = headings.find(heading =>
            /^summary\s*$/i.test(heading.textContent.trim())
        );

        if (summaryHeading) {
            const paragraphs = [];
            let sibling = summaryHeading.nextElementSibling;

            while (sibling && !/^H[1-4]$/.test(sibling.tagName)) {
                if (sibling.tagName === 'P') {
                    const paragraphText =
                        sibling.textContent.trim();

                    if (paragraphText) {
                        paragraphs.push(paragraphText);
                    }
                }

                sibling = sibling.nextElementSibling;
            }

            description = paragraphs.join(' ').trim();
        }
    }


    return {
        file: knowledgeUploadState.file,
        html,
        text,
        title: String(
            titleElement?.value ||
            knowledgeUploadState.title ||
            ''
        ).trim(),
        description
    };
};

window.openKnowledgeUpload = openKnowledgeUpload;
window.openKnowledgeUploadForm = openKnowledgeUpload;

