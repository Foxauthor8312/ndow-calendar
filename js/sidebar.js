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

        <tbody>

            <tr>

                <td colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#6B7280;
                    ">
                    No users loaded
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
