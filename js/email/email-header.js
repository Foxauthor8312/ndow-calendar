/*
==============================================================================
 NDOW Volunteer Portal
 Email Header
------------------------------------------------------------------------------
 Module      : email-header.js
 Layer       : Shared

 Responsibilities

    • Render standard NDOW email header
    • Display NDOW branding
    • Display Volunteer Portal title

==============================================================================
*/
const LOGO_URL =
    'https://foxauthor8312.github.io/ndow-calendar/ndow-new-logo.png';
export function renderEmailHeader(){

    return `

<div style="
background:#19304B;
padding:28px;
text-align:center;
border-bottom:4px solid #8C6E4A;
">

<a
    href="https://nevada.events.licensing.app/em/programs"
    target="_blank"
    rel="noopener noreferrer"
    style="text-decoration:none;"
>

    <img
        src="${LOGO_URL}"
        alt="Nevada Department of Wildlife"
        style="
          max-width:140px;
          height:auto;
          display:block;
          margin:0 auto;
    "
    >

</a>

<div style="
margin-top:18px;
font-size:26px;
font-weight:700;
color:#ffffff;
">

Volunteer Portal

</div>

<div style="
margin-top:8px;
font-size:15px;
color:#dbe8f3;
">

Event Communications

</div>

</div>

`;

}
