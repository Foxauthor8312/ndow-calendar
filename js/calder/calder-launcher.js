/* Calder launcher and panel. AI/API connection is intentionally a later milestone. */
(function () {
  "use strict";
  if (window.__calderLauncherInitialized) return;
  window.__calderLauncherInitialized = true;

  function buildCalder() {
    if (document.getElementById("calder-launcher")) return;

    const avatarUrl = "assets/calder/calder-master.png";
    const launcher = document.createElement("button");
    launcher.id = "calder-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open Calder, NDOW Volunteer Assistant");
    launcher.setAttribute("aria-controls", "calder-panel");
    launcher.setAttribute("aria-expanded", "false");
    launcher.innerHTML =
      '<img src="' + avatarUrl + '" alt="" loading="eager">' +
      '<span class="calder-launcher-label">Calder</span>';

    const panel = document.createElement("section");
    panel.id = "calder-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Calder Volunteer Assistant");
    panel.setAttribute("aria-modal", "false");
    panel.innerHTML =
      '<div class="calder-header">' +
        '<img src="' + avatarUrl + '" alt="Calder, the NDOW Volunteer Assistant">' +
        '<div class="calder-heading"><strong>Calder</strong><span>NDOW Volunteer Assistant</span></div>' +
        '<button class="calder-close" type="button" aria-label="Close Calder chat">&times;</button>' +
      '</div>' +
      '<div class="calder-messages" aria-live="polite">' +
        '<div class="calder-message"><strong>Hi! I’m Calder.</strong><br>I’m here to help volunteers make a difference. I’m getting my calendar-answering tools ready, so I can open the chat panel now, but I can’t answer live calendar or volunteer-hours questions yet.</div>' +
      '</div>' +
      '<div class="calder-status">Setup stage: chat interface is ready for testing. AI responses are not connected yet.</div>' +
      '<form class="calder-composer">' +
        '<input type="text" name="message" aria-label="Message Calder" placeholder="Ask Calder…" autocomplete="off" disabled>' +
        '<button type="submit" disabled>Send</button>' +
      '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const closeButton = panel.querySelector(".calder-close");
    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      launcher.setAttribute("aria-expanded", String(open));
      if (open) closeButton.focus();
      else launcher.focus();
    }
    launcher.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });
    closeButton.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) setOpen(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalder, { once: true });
  } else {
    buildCalder();
  }
})();