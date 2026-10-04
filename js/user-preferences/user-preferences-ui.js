/*
=========================================================
USER PREFERENCES UI
=========================================================
*/

let userPreferencesModalOpen =
  false;


/*
=========================================================
INITIALIZE PREFERENCES UI
=========================================================
*/

function initializeUserPreferencesUI(){

  if(
    document.getElementById(
      'userPreferencesButton'
    )
  ){

    return;

  }


  const myEvents =
    document.getElementById(
      'myEventsOnly'
    );


  if(!myEvents){

    console.warn(
      'User Preferences UI: myEventsOnly not found.'
    );

    return;

  }


  const myEventsLabel =
    myEvents.closest('label');


  if(!myEventsLabel){

    console.warn(
      'User Preferences UI: My Events label not found.'
    );

    return;

  }


  /*
  -----------------------------------------------
  Create button
  -----------------------------------------------
  */

  const button =
    document.createElement('button');


  button.id =
    'userPreferencesButton';

  button.type =
    'button';

  button.title =
    'Choose and manage your saved calendar preferences.';

  button.innerHTML =
    '⚙ Preferences';


  button.style.cssText = `
    margin-left:10px;
    padding:5px 9px;
    border-radius:6px;
    border:1px solid #DBE3EC;
    background:#FFFFFF;
    color:#19304B;
    font-size:11px;
    height:28px;
    cursor:pointer;
    white-space:nowrap;
  `;


  button.onmouseenter =
    () => {

      button.style.background =
        '#F8FAFC';

    };


  button.onmouseleave =
    () => {

      button.style.background =
        '#FFFFFF';

    };


  button.onclick =
    openUserPreferencesModal;


  myEventsLabel.insertAdjacentElement(
    'afterend',
    button
  );


  /*
  -----------------------------------------------
  Create modal
  -----------------------------------------------
  */

  createUserPreferencesModal();

}


/*
=========================================================
CREATE MODAL
=========================================================
*/

function createUserPreferencesModal(){

  if(
    document.getElementById(
      'userPreferencesModal'
    )
  ){

    return;

  }


  const modal =
    document.createElement('div');


  modal.id =
    'userPreferencesModal';


  modal.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    z-index:10000;
    background:rgba(25,48,75,.28);
    align-items:center;
    justify-content:center;
    padding:20px;
  `;


  modal.innerHTML = `

    <div
      id="userPreferencesPanel"
      style="
        width:min(500px, 96vw);
        max-height:88vh;
        overflow:auto;
        background:#FFFFFF;
        border:1px solid #DBE3EC;
        border-radius:10px;
        box-shadow:0 12px 40px rgba(0,0,0,.20);
      "
    >

      <div
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:16px 18px;
          border-bottom:1px solid #DBE3EC;
        "
      >

        <div>

          <div
            style="
              font-size:16px;
              font-weight:600;
              color:#19304B;
            "
          >
            Calendar Preferences
          </div>

          <div
            style="
              margin-top:4px;
              font-size:11px;
              color:#64748B;
            "
          >
            Choose how your calendar opens and filters events.
            Your choices are saved automatically.
          </div>

        </div>


        <button
          type="button"
          onclick="closeUserPreferencesModal()"
          title="Close preferences"
          style="
            border:0;
            background:transparent;
            color:#64748B;
            font-size:20px;
            cursor:pointer;
            padding:2px 6px;
          "
        >
          ×
        </button>

      </div>


      <div
        style="
          padding:18px;
        "
      >

        <!-- REGION -->

        <div
          style="
            margin-bottom:18px;
          "
        >

          <label
            style="
              display:block;
              margin-bottom:6px;
              font-size:12px;
              font-weight:600;
              color:#19304B;
            "
          >
            Default Region
          </label>

          <select
            id="userPreferenceRegion"
            style="
              width:100%;
              padding:8px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              font-size:12px;
            "
          >

            <option value="ALL">
              All Regions
            </option>

            <option value="Western">
              Western
            </option>

            <option value="Eastern">
              Eastern
            </option>

            <option value="Southern">
              Southern
            </option>

          </select>

        </div>


        <!-- EVENT FILTERS -->

        <div
          style="
            padding:12px;
            border:1px solid #DBE3EC;
            border-radius:8px;
            margin-bottom:18px;
          "
        >

          <div
            style="
              font-size:12px;
              font-weight:600;
              color:#19304B;
              margin-bottom:10px;
            "
          >
            Event Filters
          </div>


          <label
            style="
              display:flex;
              align-items:center;
              gap:8px;
              margin-bottom:10px;
              font-size:12px;
              cursor:pointer;
            "
          >

            <input
              type="checkbox"
              id="userPreferenceNeedHours"
            >

            Need Hours

          </label>


          <label
            style="
              display:flex;
              align-items:center;
              gap:8px;
              font-size:12px;
              cursor:pointer;
            "
          >

            <input
              type="checkbox"
              id="userPreferenceMyEvents"
            >

            My Events

          </label>

        </div>


        <!-- CATEGORY FILTERS -->

        <div
          style="
            padding:12px;
            border:1px solid #DBE3EC;
            border-radius:8px;
            margin-bottom:18px;
          "
        >

          <div
            style="
              font-size:12px;
              font-weight:600;
              color:#19304B;
              margin-bottom:4px;
            "
          >
            Category Filters
          </div>

          <div
            style="
              font-size:11px;
              color:#64748B;
              margin-bottom:10px;
            "
          >
            Select the categories you normally use.
          </div>


          <div
            id="userPreferenceCategories"
          ></div>

        </div>


        <!-- ACTIONS -->

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
          "
        >

          <button
            type="button"
            onclick="resetUserCalendarPreferences()"
            style="
              padding:8px 12px;
              border:1px solid #DBE3EC;
              border-radius:6px;
              background:#FFFFFF;
              color:#DC2626;
              font-size:11px;
              cursor:pointer;
            "
          >
            Reset to Defaults
          </button>


          <button
            type="button"
            onclick="closeUserPreferencesModal()"
            style="
              padding:8px 16px;
              border:0;
              border-radius:6px;
              background:#19304B;
              color:#FFFFFF;
              font-size:11px;
              cursor:pointer;
            "
          >
            Done
          </button>

        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  /*
  -----------------------------------------------
  Close when clicking outside panel
  -----------------------------------------------
  */

  modal.addEventListener(
    'click',
    event => {

      if(
        event.target === modal
      ){

        closeUserPreferencesModal();

      }

    }
  );


  /*
  -----------------------------------------------
  Region
  -----------------------------------------------
  */

  document
    .getElementById(
      'userPreferenceRegion'
    )
    ?.addEventListener(
      'change',
      event => {

        const region =
          event.target.value;


        const mainRegion =
          document.getElementById(
            'regionFilter'
          );


        if(mainRegion){

          mainRegion.value =
            region;

        }


        activeRegion =
          region;


        renderCalendar();


        saveCalendarPreferences();

      }
    );


  /*
  -----------------------------------------------
  Need Hours
  -----------------------------------------------
  */

  document
    .getElementById(
      'userPreferenceNeedHours'
    )
    ?.addEventListener(
      'change',
      event => {

        const mainControl =
          document.getElementById(
            'needHoursOnly'
          );


        if(mainControl){

          mainControl.checked =
            event.target.checked;

          mainControl.dispatchEvent(
            new Event('change')
          );

        }

      }
    );


    /*
  -----------------------------------------------
  My Events
  -----------------------------------------------
  */

  document
    .getElementById(
      'userPreferenceMyEvents'
    )
    ?.addEventListener(
      'change',
      event => {

        const mainControl =
          document.getElementById(
            'myEventsOnly'
          );


        if(mainControl){

          mainControl.checked =
            event.target.checked;

          mainControl.dispatchEvent(
            new Event('change')
          );

        }

      }
    );


  /*
  -----------------------------------------------
  Give the calendar filter row enough height
  -----------------------------------------------
  */

  const regionControl =
    document.getElementById(
      'regionFilter'
    );


  const needHoursControl =
    document.getElementById(
      'needHoursOnly'
    );


  const filterRow =
    regionControl?.parentElement;


  if(
    filterRow &&
    needHoursControl &&
    filterRow.contains(
      needHoursControl
    )
  ){

    filterRow.style.minHeight =
      '36px';

    filterRow.style.height =
      'auto';

    filterRow.style.alignItems =
      'center';

    filterRow.style.overflow =
      'visible';

    filterRow.style.flexShrink =
      '0';

  }

}


/*
=========================================================
BUILD CATEGORY LIST
=========================================================
*/

function buildUserPreferenceCategories(){

  const container =
    document.getElementById(
      'userPreferenceCategories'
    );


  if(!container){

    return;

  }


  container.innerHTML = '';


  let categories = [];


  if(
    Array.isArray(
      window.CATEGORY_OPTIONS
    )
  ){

    categories =
      [...window.CATEGORY_OPTIONS];

  }
  else if(
    Array.isArray(
      CATEGORY_OPTIONS
    )
  ){

    categories =
      [...CATEGORY_OPTIONS];

  }
  else {

    document
      .querySelectorAll(
        '.legend-item'
      )
      .forEach(item => {

        const label =
          item.innerText.trim();


        if(label){

          categories.push(
            label
          );

        }

      });

  }


  categories =
    [...new Set(categories)];


  categories.forEach(
    category => {

      const label =
        document.createElement(
          'label'
        );


      label.style.cssText = `
        display:flex;
        align-items:center;
        gap:8px;
        margin-bottom:8px;
        font-size:12px;
        cursor:pointer;
      `;


      const checkbox =
        document.createElement(
          'input'
        );


      checkbox.type =
        'checkbox';


      checkbox.dataset.category =
        category;


      checkbox.checked =
        Array.isArray(
          activeFilters
        ) &&
        activeFilters.includes(
          category
        );


      checkbox.addEventListener(
        'change',
        () => {

          if(
            checkbox.checked
          ){

            if(
              !activeFilters.includes(
                category
              )
            ){

              activeFilters.push(
                category
              );

            }

          }
          else {

            activeFilters =
              activeFilters.filter(
                item =>
                  item !== category
              );

          }


          document
            .querySelectorAll(
              '.legend-item'
            )
            .forEach(item => {

              item.classList.remove(
                'active-filter'
              );


              const label =
                item.innerText.trim();


              if(
                activeFilters.includes(
                  label
                )
              ){

                item.classList.add(
                  'active-filter'
                );

              }

            });


          renderCalendar();

          saveCalendarPreferences();

        }
      );


      label.appendChild(
        checkbox
      );


      const text =
        document.createElement(
          'span'
        );


      text.innerText =
        category;


      label.appendChild(
        text
      );


      container.appendChild(
        label
      );

    }
  );

}


/*
=========================================================
OPEN MODAL
=========================================================
*/

function openUserPreferencesModal(){

  const modal =
    document.getElementById(
      'userPreferencesModal'
    );


  if(!modal){

    return;

  }


  /*
  -----------------------------------------------
  Sync current values
  -----------------------------------------------
  */

  const mainRegion =
    document.getElementById(
      'regionFilter'
    );


  const region =
    document.getElementById(
      'userPreferenceRegion'
    );


  if(region){

    region.value =
      mainRegion?.value ||
      activeRegion ||
      'ALL';

  }


  const mainNeedHours =
    document.getElementById(
      'needHoursOnly'
    );


  const preferenceNeedHours =
    document.getElementById(
      'userPreferenceNeedHours'
    );


  if(preferenceNeedHours){

    preferenceNeedHours.checked =
      mainNeedHours?.checked === true;

  }


  const mainMyEvents =
    document.getElementById(
      'myEventsOnly'
    );


  const preferenceMyEvents =
    document.getElementById(
      'userPreferenceMyEvents'
    );


  if(preferenceMyEvents){

    preferenceMyEvents.checked =
      mainMyEvents?.checked === true;

  }


  buildUserPreferenceCategories();


  modal.style.display =
    'flex';


  userPreferencesModalOpen =
    true;

}


/*
=========================================================
CLOSE MODAL
=========================================================
*/

function closeUserPreferencesModal(){

  const modal =
    document.getElementById(
      'userPreferencesModal'
    );


  if(modal){

    modal.style.display =
      'none';

  }


  userPreferencesModalOpen =
    false;

}


/*
=========================================================
RESET PREFERENCES
=========================================================
*/

async function resetUserCalendarPreferences(){

  const confirmed =
    confirm(
      'Reset your calendar preferences to the default settings?'
    );


  if(!confirmed){

    return;

  }


  const region =
    document.getElementById(
      'regionFilter'
    );


  if(region){

    region.value =
      'ALL';

  }


  activeRegion =
    'ALL';


  const needHours =
    document.getElementById(
      'needHoursOnly'
    );


  if(needHours){

    needHours.checked =
      false;

  }


  const myEvents =
    document.getElementById(
      'myEventsOnly'
    );


  if(myEvents){

    myEvents.checked =
      false;

  }


  activeFilters = [];


  document
    .querySelectorAll(
      '.legend-item'
    )
    .forEach(item => {

      item.classList.remove(
        'active-filter'
      );

    });


  /*
  -----------------------------------------------
  Reset calendar position
  -----------------------------------------------
  */

  currentDate =
    new Date();


  currentDate.setDate(
    1
  );


  /*
  -----------------------------------------------
  Save defaults
  -----------------------------------------------
  */

  if(
    typeof setUserPreferences ===
    'function'
  ){

    setUserPreferences({

      region: 'ALL',

      need_hours_only: false,

      my_events_only: false,

      active_filters: [],

      calendar_year:
        currentDate.getFullYear(),

      calendar_month:
        currentDate.getMonth()

    });

  }


  if(
    typeof persistUserPreferences ===
    'function'
  ){

    await persistUserPreferences();

  }


  renderCalendar();


  openUserPreferencesModal();

}


/*
=========================================================
PUBLIC ACCESS
=========================================================
*/

window.initializeUserPreferencesUI =
  initializeUserPreferencesUI;

window.openUserPreferencesModal =
  openUserPreferencesModal;

window.closeUserPreferencesModal =
  closeUserPreferencesModal;

window.resetUserCalendarPreferences =
  resetUserCalendarPreferences;


/*
=========================================================
AUTO INITIALIZE
=========================================================
*/

function startUserPreferencesUI(){

  /*
  -----------------------------------------------
  Try immediately
  -----------------------------------------------
  */

  if(
    document.getElementById(
      'myEventsOnly'
    )
  ){

    initializeUserPreferencesUI();

    return;

  }


  /*
  -----------------------------------------------
  Calendar controls may not exist yet
  -----------------------------------------------
  */

  setTimeout(
    () => {

      if(
        document.getElementById(
          'myEventsOnly'
        )
      ){

        initializeUserPreferencesUI();

      }

    },
    500
  );

}


/*
=========================================================
START AFTER PAGE LOAD
=========================================================
*/

if(
  document.readyState ===
  'loading'
){

  document.addEventListener(
    'DOMContentLoaded',
    startUserPreferencesUI
  );

}
else {

  startUserPreferencesUI();

}
