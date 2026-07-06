/*
==============================================================================
 NDOW Volunteer Portal
 Event Communications UI
------------------------------------------------------------------------------
 Renders the communications modal and recipient list.
==============================================================================
*/

export function renderRecipientList(
    roster,
    selectedRecipients
){

    const list =
        document.getElementById(
            'recipient-list'
        );

    list.innerHTML = '';

    roster.forEach(student=>{

        const checked =
            selectedRecipients.some(

                r=>

                    r.customer_id===

                    student.customer_id

            )

            ? 'checked'

            : '';

        list.insertAdjacentHTML(

            'beforeend',

`
<label style="
display:block;
margin-bottom:8px;
">

<input
type="checkbox"
${checked}
onchange="toggleRecipient(${student.customer_id})"
>

${student.student_name}

<span style="
color:#6b7280;
font-size:12px;
">

(${student.student_email})

</span>

</label>
`

        );

    });

}

export function updateRecipientCount(
    count
){

    document.getElementById(
        'selected-count'
    ).textContent = count;

}
