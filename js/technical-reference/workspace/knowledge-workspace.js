
/*
==============================================================================
 NDOW Volunteer Portal
 Engineering Knowledge Center — Intake Workspace
------------------------------------------------------------------------------
 Module : workspace/knowledge-workspace.js

 Purpose:
    Coordinate the four-stage EKC article intake workflow.

 Stages:
    1. Document
    2. Classify
    3. References
    4. Review

 Design:
    - Reuses the existing knowledge-upload.js interface.
    - Does not perform registration.
    - Does not publish documents.
    - Keeps stage-specific logic in separate modules.
==============================================================================
*/

'use strict';

(function () {

    const STAGES = [
        { id: 'document', label: '1. Document' },
        { id: 'classify', label: '2. Classify' },
        { id: 'references', label: '3. References' },
        { id: 'review', label: '4. Review' }
    ];

    let activeStage = 'document';
    let workspaceInitialized = false;
    let documentPane = null;

    /*
    ==========================================================================
     Open Intake Workspace
    ==========================================================================
    */

    function openKnowledgeIntakeWorkspace() {

        const host = document.getElementById(
            'technicalReferenceContent'
        );

        if (!host) {
            console.error(
                'EKC intake: technicalReferenceContent was not found.'
            );
            return;
        }

        // Preserve the current session if the workspace is already open.
        if (workspaceInitialized) {
            host.querySelector(
                '#knowledgeIntakeWorkspace'
            )?.scrollIntoView({ block: 'start' });

            return;
        }

        // Reuse the existing upload interface without rewriting its module.
   if (typeof window.openKnowledgeUploadForm !== 'function') {
    console.error(
        'EKC intake: openKnowledgeUploadForm() is unavailable.'
    );
    return;
}

window.openKnowledgeUploadForm();

        // Move the upload interface into its own Document-stage container.
        documentPane = document.createElement('div');
        documentPane.id = 'knowledgeIntakeDocumentPane';

        while (host.firstChild) {
            documentPane.appendChild(host.firstChild);
        }

        // Build the intake shell.
        host.innerHTML = `
            <section
                id="knowledgeIntakeWorkspace"
                style="
                    max-width:1400px;
                    margin:0 auto;
                    padding:12px;
                    color:#334155;
                    font-family:'IBM Plex Sans',sans-serif;
                "
            >
            

                <nav
                    id="knowledgeIntakeTabs"
                    aria-label="Article intake stages"
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:8px;
                        margin-bottom:20px;
                        border-bottom:1px solid #DBE3EC;
                        padding-bottom:12px;
                    "
                >
                    ${STAGES.map(stage => `
                        <button
                            type="button"
                            data-intake-stage="${stage.id}"
                            aria-controls="knowledgeIntakeStageContent"
                            aria-selected="${stage.id === activeStage}"
                            role="tab"
                            style="
                                padding:10px 14px;
                                border:1px solid ${
                                    stage.id === activeStage
                                        ? '#F29647'
                                        : '#DBE3EC'
                                };
                                border-radius:6px;
                                background:${
                                    stage.id === activeStage
                                        ? '#FFF7ED'
                                        : '#FFFFFF'
                                };
                                color:#19304B;
                                font:inherit;
                                font-size:13px;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >
                            ${stage.label}
                        </button>
                    `).join('')}
                </nav>

                <div
                    id="knowledgeIntakeStageContent"
                    role="tabpanel"
                    style="min-height:300px;"
                ></div>

                <footer style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:12px;
                    margin-top:22px;
                    padding-top:16px;
                    border-top:1px solid #DBE3EC;
                ">
                    <button
                        id="knowledgeIntakeBack"
                        type="button"
                        style="
                            padding:9px 14px;
                            border:1px solid #DBE3EC;
                            border-radius:6px;
                            background:#FFFFFF;
                            color:#19304B;
                            font:inherit;
                            cursor:pointer;
                        "
                    >
                        Previous
                    </button>

                    <span
                        id="knowledgeIntakeStageStatus"
                        aria-live="polite"
                        style="font-size:12px;color:#64748B;"
                    ></span>

                    <button
                        id="knowledgeIntakeNext"
                        type="button"
                        style="
                            padding:9px 14px;
                            border:0;
                            border-radius:6px;
                            background:#19304B;
                            color:#FFFFFF;
                            font:inherit;
                            cursor:pointer;
                        "
                    >
                        Next
                    </button>
                </footer>
            </section>
        `;

        const content = host.querySelector(
            '#knowledgeIntakeStageContent'
        );

        content.appendChild(documentPane);

        // Register navigation handlers once.
        host.querySelectorAll('[data-intake-stage]').forEach(button => {
            button.addEventListener('click', () => {
                showKnowledgeIntakeStage(
                    button.dataset.intakeStage
                );
            });
        });

        host.querySelector('#knowledgeIntakeBack')
            .addEventListener('click', () => moveStage(-1));

        host.querySelector('#knowledgeIntakeNext')
            .addEventListener('click', () => moveStage(1));

        workspaceInitialized = true;

        showKnowledgeIntakeStage('document');
    }

    /*
    ==========================================================================
     Display Stage
    ==========================================================================
    */

    function showKnowledgeIntakeStage(stageId) {

        if (!STAGES.some(stage => stage.id === stageId)) {
            return;
        }

        activeStage = stageId;

        const host = document.getElementById(
            'technicalReferenceContent'
        );

        const content = host?.querySelector(
            '#knowledgeIntakeStageContent'
        );

        if (!content) {
            return;
        }

        // Keep the upload form alive when moving between stages.
        if (documentPane && documentPane.parentElement) {
            documentPane.remove();
        }

        content.replaceChildren();

        if (stageId === 'document') {
            if (documentPane) {
                content.appendChild(documentPane);
            }
        } else {
            const descriptions = {
                classify: {
                    title: 'Classify Article',
                    message:
                        'Classification is not connected yet. The next module will match the article against existing Centers, Categories, and Topics.'
                },
                references: {
                    title: 'References and Relationships',
                    message:
                        'Reference matching is not connected yet. The next module will identify existing documents and proposed topic relationships.'
                },
                review: {
                    title: 'Review and Register',
                    message:
                        'Final validation and registration are not connected yet. No document will be registered or published from this placeholder.'
                }
            };

         
        if (stageId === 'classify') {
            if (typeof window.renderKnowledgeMetadata === 'function') {
                window.renderKnowledgeMetadata(content);
            } else {
                const message = document.createElement('p');
                message.textContent =
                    'The EKC classification module has not loaded.';
                message.style.color = '#B91C1C';
                content.appendChild(message);
            }

        } else if (stageId === 'references') {
            if (typeof window.renderKnowledgeRelationships === 'function') {
                window.renderKnowledgeRelationships(content);
            } else {
                const message = document.createElement('p');
                message.textContent =
                    'The EKC References module has not loaded.';
                message.style.color = '#B91C1C';
                content.appendChild(message);
            }

        } else {
            const details = descriptions[stageId];

            const panel = document.createElement('section');
            panel.style.cssText = `
                padding:24px;
                border:1px solid #DBE3EC;
                border-radius:8px;
                background:#FFFFFF;
            `;

            const heading = document.createElement('h2');
            heading.textContent = details.title;
            heading.style.cssText = `
                margin:0 0 12px;
                color:#19304B;
                font-size:20px;
            `;

            const message = document.createElement('p');
            message.textContent = details.message;
            message.style.cssText = `
                margin:0;
                color:#64748B;
                font-size:14px;
                line-height:1.7;
            `;

            panel.append(heading, message);
            content.appendChild(panel);
        }

        }

        // Update active-tab appearance and accessibility state.
        host.querySelectorAll('[data-intake-stage]').forEach(button => {
            const active =
                button.dataset.intakeStage === stageId;

            button.setAttribute('aria-selected', String(active));
            button.style.borderColor = active
                ? '#F29647'
                : '#DBE3EC';
            button.style.background = active
                ? '#FFF7ED'
                : '#FFFFFF';
        });

        const index = STAGES.findIndex(
            stage => stage.id === stageId
        );

        host.querySelector('#knowledgeIntakeBack').disabled =
            index === 0;

        host.querySelector('#knowledgeIntakeNext').disabled =
            index === STAGES.length - 1;

        host.querySelector('#knowledgeIntakeStageStatus')
            .textContent =
                `Stage ${index + 1} of ${STAGES.length}`;

    }

    /*
    ==========================================================================
     Previous / Next Navigation
    ==========================================================================
    */

    function moveStage(direction) {

        const currentIndex = STAGES.findIndex(
            stage => stage.id === activeStage
        );

        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= STAGES.length) {
            return;
        }

        showKnowledgeIntakeStage(
            STAGES[nextIndex].id
        );
    }

    /*
    ==========================================================================
     Public Entry Point
    ==========================================================================
    */

    window.openKnowledgeIntakeWorkspace =
        openKnowledgeIntakeWorkspace;

})();


