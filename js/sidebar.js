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

            <div class="users-workspace">

                <div class="users-toolbar">

                    <input
                        type="text"
                        placeholder="Search users..."
                        class="users-search"
                    >

                    <button class="admin-button-primary">
                        Add User
                    </button>

                    <button class="admin-button-secondary">
                        Refresh
                    </button>

                </div>

                <div class="users-directory">

    <table class="admin-table">

        <thead>

            <tr>

                <th>Name</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Role</th>

                <th>Status</th>

            </tr>

        </thead>

       <tbody id="usersTableBody">

    <tr>

        <td
            colspan="5"
            style="
                text-align:center;
                padding:40px;
                color:#6B7280;
            "
        >
            Loading users...
        </td>

    </tr>

</tbody>

    </table>

</div>

            </div>

        `;

    } else {

        overlayContent.innerHTML = `
            <h3>${title} Workspace</h3>

            <p>
                This workspace is under construction.
            </p>
        `;
    }
}

    overlay.style.display = "flex";

    if (title === "Users") {

    loadUsersForWorkspace();

}
}
if (title === "Users") {

    loadUsersForWorkspace();

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

    const tbody =
        document.getElementById(
            "usersTableBody"
        );

    if (!tbody) return;

    const token =
        localStorage.getItem(
            "token"
        );

    try {

        const response =
            await fetch(
                "https://ndow-calendar-server.onrender.com/api/admin/users",
                {
                    headers: {
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

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load users
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = "";

        data.users.forEach(user => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${user.full_name || ""}
                    </td>

                    <td>
                        ${user.email || ""}
                    </td>

                    <td>
                        ${user.phone || ""}
                    </td>

                    <td>
                        ${user.role || ""}
                    </td>

                    <td>
                        ${
                            Number(
                                user.disabled || 0
                            ) === 1
                                ? "Disabled"
                                : "Active"
                        }
                    </td>

                </tr>

            `;

        });

    } catch (err) {

        console.error(
            "WORKSPACE USER LOAD ERROR:",
            err
        );

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Error loading users
                </td>
            </tr>
        `;
    }

}
