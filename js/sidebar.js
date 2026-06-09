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
        overlayContent.innerHTML =
            "<p>Workspace placeholder</p>";
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
