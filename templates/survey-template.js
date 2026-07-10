import renderEmailHeader
from './email-header.js';

import renderEmailFooter
from './email-footer.js';

export default function renderSurveyTemplate(data){

    return `

${renderEmailHeader()}

<h2>

Thank You for Attending

</h2>

<p>

Thank you for attending

<strong>

${data.eventTitle}

</strong>.

</p>

<p>

Your feedback helps the Nevada Department of Wildlife improve future programs.

</p>

<p>

Please take about one minute to complete our survey.

</p>

<div style="text-align:center;margin:30px 0;">

<a
    href="${data.surveyUrl}"
    class="email-button"
>

Take Survey

</a>

</div>

${renderEmailFooter()}

`;

}
