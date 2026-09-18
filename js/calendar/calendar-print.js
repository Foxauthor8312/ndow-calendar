/*
==============================================================================
 NDOW Volunteer Portal
 Calendar Print
------------------------------------------------------------------------------
 Module      : calendar-print.js
 Layer       : Frontend UI

 Purpose:
    Provides a clean printable version of the currently displayed month.

 Responsibilities:
    • Print the currently selected calendar month
    • Preserve the current month/year
    • Provide a dedicated print layout
    • Exclude normal portal controls from printed output

==============================================================================
*/

'use strict';


// ========================================
// PRINT CURRENT MONTH
// ========================================

window.printCurrentMonth = function () {

  const monthLabel =
    document.getElementById(
      'monthLabel'
    );

  if (!monthLabel) {

    console.error(
      'CALENDAR PRINT: Month label not found.'
    );

    return;

  }


  const monthTitle =
    monthLabel.innerText.trim();


  const printWindow =
    window.open(
      '',
      '_blank',
      'width=1200,height=900'
    );


  if (!printWindow) {

    alert(
      'Please allow pop-ups to print the calendar.'
    );

    return;

  }


  const calendar =
    document.getElementById(
      'calendar'
    );


  if (!calendar) {

    printWindow.close();

    console.error(
      'CALENDAR PRINT: Calendar element not found.'
    );

    return;

  }


  printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8">

  <title>
    NDOW Instructor Event Calendar - ${monthTitle}
  </title>


  <style>

    @page {

      size: landscape;
      margin: 0.4in;

    }


    * {

      box-sizing: border-box;

    }


    body {

      margin: 0;

      font-family:
        "IBM Plex Sans",
        Arial,
        sans-serif;

      color: #19304B;

      background: #FFFFFF;

    }


    .print-header {

      display: flex;

      justify-content: space-between;

      align-items: flex-end;

      border-bottom:
        2px solid #19304B;

      padding-bottom: 10px;

      margin-bottom: 14px;

    }


    .print-title {

      font-size: 20px;

      font-weight: 700;

    }


    .print-month {

      font-size: 16px;

      font-weight: 600;

    }


    .calendar-print {

      display: grid;

      grid-template-columns:
        repeat(7, 1fr);

      border-top:
        1px solid #DBE3EC;

      border-left:
        1px solid #DBE3EC;

    }


    .calendar-print
    .day-name {

      min-height: 28px;

      display: flex;

      align-items: center;

      justify-content: center;

      background: #F8FAFC;

      border-right:
        1px solid #DBE3EC;

      border-bottom:
        1px solid #DBE3EC;

      font-size: 11px;

      font-weight: 700;

      color: #19304B;

    }


    .calendar-print
    .day {

      min-height: 105px;

      padding: 5px;

      border-right:
        1px solid #DBE3EC;

      border-bottom:
        1px solid #DBE3EC;

      overflow: hidden;

    }


    .calendar-print
    .day-number {

      font-size: 11px;

      font-weight: 700;

      margin-bottom: 4px;

    }


    .calendar-print
    .event {

      padding: 4px 5px;

      margin-bottom: 3px;

      border-radius: 3px;

      font-size: 9px;

      line-height: 1.25;

      color: #FFFFFF;

      font-weight: 600;

    }


    .print-footer {

      margin-top: 10px;

      font-size: 9px;

      color: #64748b;

      display: flex;

      justify-content: space-between;

    }


  </style>

</head>


<body>


  <div class="print-header">

    <div class="print-title">

      NDOW Instructor Event Calendar

    </div>


    <div class="print-month">

      ${monthTitle}

    </div>

  </div>


  <div
    class="calendar-print"
    id="printCalendar"
  >

    ${calendar.innerHTML}

  </div>


  <div class="print-footer">

    <div>
      Official NDOW Event Calendar
    </div>

    <div>
      Printed ${new Date().toLocaleString()}
    </div>

  </div>


</body>

</html>

  `);


  printWindow.document.close();


  printWindow.focus();


  setTimeout(
    function () {

      printWindow.print();

    },
    300
  );

};
