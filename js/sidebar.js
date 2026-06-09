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
        <div id="usersWorkspaceContainer">
            Loading users...
        </div>
    `;

} else if (title === "Requests") {

    overlayContent.innerHTML = `
        <div id="instructorRequestsList">
            Loading requests...
        </div>
    `;

} else if (title === "Updates") {

    overlayContent.innerHTML = `
        <div id="updatesWorkspaceContainer">
            Updates workspace coming next...
        </div>
    `;

} else if (title === "Contacts") {

    overlayContent.innerHTML = `
        <div id="contactsWorkspaceContainer">
            Contacts workspace coming next...
        </div>
    `;

} else if (title === "Help") {

    overlayContent.innerHTML = `
        <div id="helpWorkspaceContainer">
            Help workspace coming next...
        </div>
    `;

} else if (title === "Analytics") {

    overlayContent.innerHTML = `
        <div id="analyticsWorkspaceContainer">
            Analytics workspace coming next...
        </div>
    `;

} else if (title === "Categories") {

    overlayContent.innerHTML = `
        <div id="categoriesWorkspaceContainer">
            Categories workspace coming next...
        </div>
    `;

} else if (title === "System") {

    overlayContent.innerHTML = `
        <div id="systemWorkspaceContainer">
            System workspace coming next...
        </div>
    `;

}
}

overlay.style.display = "flex";

if (title === "Users") {

    loadUsersForWorkspace();

}

if (title === "Requests") {

    loadInstructorRequests();

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
                </button>>

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
