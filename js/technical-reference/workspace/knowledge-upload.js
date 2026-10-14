
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
                    placeholder="Describe the purpose and scope of this article."
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

function handleKnowledgeUploadSelection(event) {
    const file = event.target.files?.[0];

    const info = document.getElementById(
        'knowledgeUploadFileInfo'
    );

    const message = document.getElementById(
        'knowledgeUploadMessage'
    );

    const preview = document.getElementById(
        'knowledgeUploadPreview'
    );

    if (!file) {
        knowledgeUploadState.file = null;
        info.textContent = 'No document selected.';
        return;
    }

    const validExtension = /\.docx$/i.test(file.name);

    if (!validExtension) {
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

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    info.textContent =
        `${file.name} · ${sizeMB} MB`;

    message.style.display = 'none';

    document.getElementById(
        'knowledgeUploadTitle'
    ).value = file.name.replace(/\.docx$/i, '')
        .replace(/[_-]+/g, ' ');

    preview.textContent =
        'Document selected. Server-side DOCX conversion must be connected before the formatted preview can be displayed.';

    showKnowledgeUploadMessage(
        'Document selected. No information has been uploaded or registered.',
        'success'
    );
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

window.openKnowledgeUpload = openKnowledgeUpload;
