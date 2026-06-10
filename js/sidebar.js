function openAdminOverlay(title) {

const overlay =
    document.getElementById(
        "adminOverlay"
    );

const overlayTitle =
    document.getElementById(
        "overlayTitle"
    );

const overlayContent =
    document.getElementById(
        "overlayContent"
    );

if (!overlay) return;

if (overlayTitle) {
    overlayTitle.textContent = title;
}

if (overlayContent) {

if (title === "Users") {

    overlayContent.innerHTML = `

        <h2>
            User Management
        </h2>

        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(220px,1fr));
            gap:12px;
            margin-bottom:16px;
        ">

            <input
                id="adminUsername"
                class="contact-input"
                placeholder="Username"
            >

            <input
                id="adminPin"
                class="contact-input"
                placeholder="PIN"
            >

            <input
                id="adminEmail"
                class="contact-input"
                placeholder="Email Address"
            >

            <input
                id="adminPhone"
                class="contact-input"
                placeholder="Mobile Phone"
            >

            <input
                id="adminNdowId"
                class="contact-input"
                placeholder="NDOW ID"
            >

        </div>

        <div style="
            display:flex;
            gap:20px;
            margin-bottom:14px;
        ">

            <label>
                <input
                    type="checkbox"
                    id="adminNotifyEmail"
                    checked
                >
                Email Notifications
            </label>

            <label>
                <input
                    type="checkbox"
                    id="adminNotifySms"
                >
                SMS Notifications
            </label>

        </div>

        <select
            id="adminRole"
            class="contact-select"
            style="margin-bottom:14px;"
        >
            <option value="user">
                User
            </option>

            <option value="admin">
                Admin
            </option>

            <option value="superuser">
                Superuser
            </option>
        </select>

        <button
            class="admin-button-primary"
            onclick="addUser()"
        >
            Create User
        </button>

        <div
            id="adminMessage"
            style="
                margin-top:10px;
                margin-bottom:20px;
            "
        ></div>

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:12px;
        ">

            <h3 style="margin:0;">
                Users
            </h3>

            <label>
                <input
                    type="checkbox"
                    id="showDisabledUsers"
                    onchange="loadUsers()"
                >
                Show Disabled Users
            </label>

        </div>

        <div
            id="userList"
            style="
                border-top:1px solid #e5e7eb;
                padding-top:12px;
            "
        ></div>

    `;

} else if (title === "Requests") {

    overlayContent.innerHTML = `
        <div id="instructorRequestsList">
            Loading requests...
        </div>
    `;

} else if (title === "Updates") {

    overlayContent.innerHTML = `

        <h2>
            Program Updates
        </h2>

        <input
            id="announcementTitleInput"
            class="login-input"
            placeholder="Announcement Title"
            style="margin-top:14px;"
        >

        <textarea
            id="announcementMessageInput"
            style="
                width:100%;
                height:220px;
                margin-top:14px;
                padding:14px;
                border-radius:12px;
                border:1px solid #d1d5db;
                box-sizing:border-box;
            "
        ></textarea>

        <div style="
            margin-top:14px;
            margin-bottom:20px;
        ">

            <button
                class="admin-button-primary"
                onclick="saveAnnouncement()"
            >
                Post Update
            </button>

        </div>

        <div id="announcementAdminList">

            Loading announcements...

        </div>

    `;

} else if (title === "Contacts") {

    overlayContent.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:16px;
        ">

            <h3 style="margin:0;">
                Contacts
            </h3>

            <button
                class="admin-button-primary"
                onclick="openAddContactModal()"
            >
                + Add Contact
            </button>

        </div>

        <div
            id="contactsList"
            style="
                border:1px solid #e2e8f0;
                border-radius:8px;
                padding:16px;
                background:white;
            "
        >
            Loading contacts...
        </div>

    `;

} else if (title === "Help") {

    overlayContent.innerHTML = `

<h2>
  Help Topic Manager
</h2>

<div style="
  color:#6b7280;
  font-size:13px;
  line-height:1.5;
  margin-bottom:14px;
">
  Create, edit, organize, and publish help topics for users and administrators.
</div>

<input
  type="hidden"
  id="helpEditId"
>

<select
  id="helpCategory"
  class="contact-select"
  style="margin-top:14px;"
  onchange="renderHelpAdminList()"
>

  <option value="">
    Select Help Category...
  </option>

  <option value="Getting Started">
    Getting Started
  </option>

  <option value="Calendar">
    Calendar
  </option>

  <option value="Events">
    Events
  </option>

  <option value="Volunteer Management">
    Volunteer Management
  </option>

  <option value="Instructor Management">
    Instructor Management
  </option>

  <option value="Users & Accounts">
    Users & Accounts
  </option>

  <option value="Announcements">
    Announcements
  </option>

  <option value="Administration">
    Administration
  </option>

  <option value="Reports & Analytics">
    Reports & Analytics
  </option>

  <option value="Troubleshooting">
    Troubleshooting
  </option>

  <option value="FAQ">
    FAQ
  </option>

</select>

<div style="
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  margin-top:16px;
">

  <input
    id="helpTopicKey"
    placeholder="Topic Key"
  >

  <input
    id="helpTitle"
    placeholder="Topic Title"
  >

  <input
    id="helpSortOrder"
    type="number"
    placeholder="Display Order"
  >

  <select
    id="helpVisibilityRole"
  >
    <option value="all">
      All Users
    </option>

    <option value="user">
      Standard Users
    </option>

    <option value="admin">
      Admin Only
    </option>
  </select>

</div>

<div style="
  margin-top:16px;
  margin-bottom:6px;
  font-size:12px;
  font-weight:600;
  color:#374151;
">
  Topic Content
</div>

<textarea
  id="helpContent"
  style="
    width:100%;
    height:220px;
    padding:14px;
    border-radius:12px;
    border:1px solid #d1d5db;
    resize:vertical;
    box-sizing:border-box;
  "
></textarea>

<div style="
  display:flex;
  gap:10px;
  margin-top:16px;
">

  <button onclick="saveHelpTopic()">
    Save Topic
  </button>

  <button onclick="newHelpTopic()">
    New Topic
  </button>

  <button
    onclick="deleteHelpTopic()"
    style="background:#dc2626;"
  >
    Delete
  </button>

</div>

<div
  id="helpAdminMessage"
  style="
    margin-top:14px;
    font-size:14px;
  "
></div>

<div style="
  margin-top:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-weight:600;
">
  <span>
    Topics In Selected Category
  </span>

  <span
    id="helpTopicCount"
    style="
      font-size:12px;
      color:#6b7280;
    "
  ></span>
</div>

<div
  id="helpTopicAdminList"
  style="
    margin-top:8px;
    max-height:300px;
    overflow:auto;
    border-top:1px solid #e5e7eb;
    padding-top:14px;
  "
></div>

    `;

} else if (title === "Analytics") {

    overlayContent.innerHTML = `

        <h2>
            Geographic Analytics
        </h2>

        <div style="
            margin-top:18px;
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(220px,1fr));
            gap:16px;
        ">

            <div class="geo-card">

                <div class="geo-title">
                    Event Regions
                </div>

                <select
                    id="geoRegionSelect"
                    class="contact-select"
                    onchange="loadGeoCounties()"
                    style="margin-top:12px;"
                >

                    <option value="ALL">
                        All Regions
                    </option>

                    <option value="Western">
                        Western Nevada
                    </option>

                    <option value="Eastern">
                        Eastern Nevada
                    </option>

                    <option value="Southern">
                        Southern Nevada
                    </option>

                </select>

            </div>

            <div class="geo-card">

                <div class="geo-title">
                    County Analysis
                </div>

                <select
                    id="geoCountySelect"
                    class="contact-select"
                    style="margin-top:12px;"
                    onchange="renderCountyAnalysis()"
                >

                    <option value="">
                        Select County
                    </option>

                </select>

            </div>

            <div class="geo-card">

                <div class="geo-title">
                    Date Range
                </div>

                <input
                    type="date"
                    id="geoStartDate"
                    class="contact-select"
                    style="margin-top:12px;"
                    onchange="loadGeoCounties()"
                >

                <input
                    type="date"
                    id="geoEndDate"
                    class="contact-select"
                    style="margin-top:10px;"
                    onchange="loadGeoCounties()"
                >

                <button
                    class="action-btn"
                    style="
                        margin-top:10px;
                        width:100%;
                    "
                    onclick="clearGeoDates()"
                >
                    Reset Filters
                </button>

            </div>

        </div>

        <div
            id="geoRegionDetails"
            style="
                margin-top:12px;
                background:white;
                border:1px solid #dbe3ec;
                border-radius:16px;
                padding:20px;
                line-height:1.7;
            "
        >

            Select a region to begin geographic analysis.

        </div>

    `;


} else if (title === "Categories") {

    overlayContent.innerHTML = `

        <h2>
            Category Overrides
        </h2>

        <input
            type="text"
            id="overrideSearch"
            placeholder="Search event..."
            oninput="renderOverrides()"
            style="
                width:100%;
                padding:8px;
                margin-bottom:12px;
            "
        >

        <div style="
            margin-bottom:12px;
        ">

            <select
                id="overrideFilter"
                onchange="renderOverrides()"
                style="
                    padding:8px 10px;
                    border-radius:8px;
                    border:1px solid #d1d5db;
                    font-size:13px;
                "
            >

                <option value="ALL">
                    All Categories
                </option>

                <option value="Other">
                    Uncategorized
                </option>

                <option value="Hunter Education">
                    Hunter Education
                </option>

                <option value="Fishing">
                    Fishing
                </option>

                <option value="Advanced Hunter Education">
                    Advanced Hunter Education
                </option>

                <option value="Wildlife">
                    Wildlife
                </option>

                <option value="Urban Wildlife">
                    Urban Wildlife
                </option>

                <option value="Archery">
                    Archery
                </option>

                <option value="Boating">
                    Boating
                </option>

                <option value="School">
                    School
                </option>

                <option value="Volunteer">
                    Volunteer
                </option>

            </select>

        </div>

        <div
            id="overrideList"
            style="
                height:600px;
                overflow-y:auto;
                overflow-x:hidden;
                border-top:1px solid #e5e7eb;
                padding-top:8px;
                padding-right:6px;
            "
        ></div>

    `;

} else if (title === "System") {

    overlayContent.innerHTML = `

        <div style="
            display:flex;
            flex-direction:column;
            gap:12px;
            max-width:500px;
        ">

            <button
                class="admin-button-primary"
                onclick="window.open('https://github.com','_blank')"
            >
                GitHub
            </button>

            <button
                class="admin-button-secondary"
                onclick="window.open('https://dashboard.render.com','_blank')"
            >
                Render Dashboard
            </button>

            <button
                class="admin-button-secondary"
                onclick="window.location.reload()"
            >
                Reload Application
            </button>

            <button
                class="admin-button-secondary"
                onclick="closeAdminOverlay()"
            >
                Close Workspace
            </button>

        </div>

    `;

}
}

overlay.style.display = "flex";

if (title === "Users") {

    loadUsers();

}

if (title === "Requests") {

    loadInstructorRequests();

}

if (title === "Updates") {

    loadAnnouncementAdminList();

}

if (title === "Contacts") {

    loadContacts();

}

if (title === "Categories") {

    renderOverrides();

}

if (title === "Analytics") {

    const geoRegionSelect =
        document.getElementById(
            "geoRegionSelect"
        );

    if (geoRegionSelect) {

        geoRegionSelect.value =
            "ALL";

        loadGeoCounties();

    }

}

if (title === "Help") {

    renderHelpAdminList();

    newHelpTopic();

}

}

function closeAdminOverlay() {

    const overlay =
        document.getElementById(
            "adminOverlay"
        );

    if (overlay) {
        overlay.style.display = "none";
    }

}

async function loadUsersForWorkspace() {

    const container =
        document.getElementById(
            "usersWorkspaceContainer"
        );

    if (!container) return;

    const token =
        localStorage.getItem(
            "token"
        );

    try {

        const response =
            await fetch(
                "https://ndow-calendar-server.onrender.com/api/admin/users",
                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (
            !data.success ||
            !data.users
        ) {

            container.innerHTML =
                "<p>Failed to load users.</p>";

            return;

        }

        let html = `

            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-bottom:16px;
                "
            >

                <input
                    type="text"
                    placeholder="Search users..."
                    style="
                        flex:1;
                        padding:10px;
                        border:1px solid #d1d5db;
                        border-radius:6px;
                    "
                >

                <button
                    class="admin-button-primary"
                    onclick="openAddUserModal()"
                >
                    Add User
                </button>

                <button
                    class="admin-button-secondary"
                    onclick="loadUsersForWorkspace()"
                >
                    Refresh
                </button>

            </div>

        `;

        data.users.forEach(user => {

            const disabled =
                Number(
                    user.disabled || 0
                ) === 1;

            html += `

                <div
                    style="
                        padding:14px;
                        margin-bottom:10px;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        background:
                            ${
                                disabled
                                    ? "#fee2e2"
                                    : "#f8fafc"
                            };
                    "
                >

                    <div
                        style="
                            font-weight:700;
                            font-size:16px;
                            margin-bottom:6px;
                        "
                    >
                        ${user.username}
                    </div>

                    <div>
                        Role:
                        ${user.role}
                    </div>

                    <div>
                        Status:
                        ${
                            disabled
                                ? "Disabled"
                                : "Active"
                        }
                    </div>

                    <div
                        style="
                            margin-top:10px;
                        "
                    >

                        <button
                            onclick="
                                openEditUserModalByUsername(
                                    '${user.username}'
                                )
                            "
                        >
                            Edit
                        </button>

                    </div>

                </div>

            `;

        });

        container.innerHTML =
            html;
} catch(err) {

    console.error(
        "USER WORKSPACE ERROR:",
        err
    );

    container.innerHTML = `
        <pre style="
            color:red;
            white-space:pre-wrap;
        ">
${err}
        </pre>
    `;

}

}

async function loadContactsWorkspace() {

    const container =
        document.getElementById(
            "contactsWorkspaceContainer"
        );

    if (!container) return;

    container.innerHTML =
        "Loading contacts...";

    try {

        await loadDepartmentContacts();

        let html = "";

        departmentContacts
            .filter(contact => contact.active)
            .forEach(contact => {

                html += `

                    <div style="
                        padding:12px;
                        margin-bottom:10px;
                        border:1px solid #dbe3ec;
                        border-radius:8px;
                        background:white;
                    ">

                        <div style="
                            font-weight:700;
                            margin-bottom:4px;
                        ">
                            ${contact.name || ""}
                        </div>

                        <div>
                            Region:
                            ${contact.region || ""}
                        </div>

                        <div>
                            Email:
                            ${contact.email || ""}
                        </div>

                    </div>

                `;

            });

        container.innerHTML =
            html || "<p>No contacts found.</p>";

    } catch (err) {

        console.error(err);

        container.innerHTML =
            "<p>Failed to load contacts.</p>";

    }

}

<div class="account-controls">

<div id="userDisplay" class="user-display">
</div>

<button
  id="dashboardButton"
  class="admin-button"
  onclick="openDashboard()"
>
  My Dashboard
</button>

<button onclick="logout()">
  Logout
</button>

	
</div>
