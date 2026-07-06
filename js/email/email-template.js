/*
==============================================================================
 NDOW Volunteer Portal
 Email Template
------------------------------------------------------------------------------
 Module      : email-template.js
 Layer       : Shared

 Responsibilities

    • Compose complete HTML email
    • Combine header, body and footer
    • Personalize recipient information

==============================================================================
*/

import {

    renderEmailHeader

}

from

'./email-header.js';

import {

    renderEmailFooter

}

from

'./email-footer.js';

export function renderEmailTemplate({

    event,

    recipient,

    subject,

    message

}){

    return `

<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8">

<title>${subject}</title>

</head>

<body style="
margin:0;
padding:30px;
background:#edf2f7;
font-family:Arial,sans-serif;
">

<div style="
max-width:700px;
margin:0 auto;
background:white;
border-radius:8px;
overflow:hidden;
box-shadow:0 2px 8px rgba(0,0,0,.08);
">

${renderEmailHeader()}

<div style="padding:32px;">

<h2 style="
margin-top:0;
color:#19304B;
">

Hello ${recipient.student_name},

</h2>

<p>

${message.replace(/\n/g,'<br>')}

</p>

<hr style="margin:28px 0;">

<h3 style="
margin-bottom:18px;
color:#19304B;
">

Event Information

</h3>

<table style="
width:100%;
border-collapse:collapse;
">

<tr>

<td style="
font-weight:bold;
padding:6px 0;
width:140px;
">

Event

</td>

<td>

${event.title}

</td>

</tr>

<tr>

<td style="
font-weight:bold;
padding:6px 0;
">

Date

</td>

<td>

${event.date}

</td>

</tr>

<tr>

<td style="
font-weight:bold;
padding:6px 0;
">

Location

</td>

<td>

${event.location}

</td>

</tr>

</table>

</div>

${renderEmailFooter()}

</div>

</body>

</html>

`;

}
