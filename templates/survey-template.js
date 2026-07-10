/*
==============================================================================
 NDOW Volunteer Portal
 Survey Email Template
------------------------------------------------------------------------------
 File        : survey-template.js

 Purpose

    Generates the post-event survey email.

 Dependencies

    email-header.js
    email-footer.js

==============================================================================
*/

import renderEmailHeader
from './email-header.js';

import renderEmailFooter
from './email-footer.js';

export default function renderSurveyTemplate(data){

    return `

${renderEmailHeader()}

<h2
    style="
        color:#19304B;
        margin-bottom:18px;
    "
>

    Thank You for Attending

</h2>

<p>

    Thank you for attending

    <strong>

        ${data.eventTitle}

    </strong>.

</p>

<p>

    We hope you enjoyed your experience with the
    Nevada Department of Wildlife.

</p>

<p>

    Your feedback helps us improve future classes
    and programs.

</p>

<p>

    This survey takes less than one minute to complete.

</p>

<div
    style="
        text-align:center;
        margin:34px 0;
    "
>

<a

href="${data.surveyUrl}"

style="
display:inline-block;
padding:14px 28px;
background:#19304B;
color:white;
text-decoration:none;
border-radius:6px;
font-weight:600;
"

>

Take Survey

</a>

</div>

<p
    style="
        color:#6b7280;
        font-size:13px;
    "
>

Thank you for supporting wildlife education
through the Nevada Department of Wildlife.

</p>

${renderEmailFooter()}

`;

}
