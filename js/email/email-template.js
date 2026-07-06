/*
==============================================================================
 NDOW Volunteer Portal
 Email Template
------------------------------------------------------------------------------
 Module      : email-template.js
 Layer       : Shared

 Responsibilities

    • Generate HTML email body
    • Centralize branding
    • Personalize recipient information

==============================================================================
*/

export function renderEmailTemplate({

    event,

    recipient,

    message

}){

    return `

<div style="
font-family:Arial,sans-serif;
color:#333;
max-width:700px;
margin:auto;
border:1px solid #d1d5db;
border-radius:8px;
overflow:hidden;
">

<div style="
background:#19304B;
padding:24px;
text-align:center;
">

<img
src="https://your-logo-url-here"
alt="NDOW"
style="
max-width:220px;
">

</div>

<div style="
padding:28px;
">

<h2 style="
margin-top:0;
color:#19304B;
">

Hello ${recipient.student_name},

</h2>

${message
    .replace(/\n/g,'<br>')}

<hr style="
margin:28px 0;
">

<table style="
width:100%;
border-collapse:collapse;
">

<tr>

<td style="
font-weight:bold;
width:160px;
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
">

Location

</td>

<td>

${event.location}

</td>

</tr>

</table>

<p style="
margin-top:28px;
">

We look forward to seeing you.

</p>

</div>

<div style="
background:#f3f4f6;
padding:18px;
font-size:12px;
color:#6b7280;
">

This email was sent by the
Nevada Department of Wildlife
Volunteer Portal.

<br><br>

This message may contain information
intended only for the registered
recipient.

</div>

</div>

`;

}
