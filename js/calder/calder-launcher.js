/* Calder launcher and first live calendar-hours connection. */
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
        '<div class="calder-message"><strong>Hi! I’m Calder.</strong><br>I can help with your volunteer-hours summary. Ask me how many hours you have recorded.</div>' +
      '</div>' +
      '<div class="calder-status">Connected to the NDOW volunteer-hours summary service.</div>' +
      '<form class="calder-composer">' +
        '<input type="text" name="message" aria-label="Message Calder" placeholder="Ask about your volunteer hours…" autocomplete="off">' +
        '<button type="submit">Send</button>' +
      '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const closeButton = panel.querySelector(".calder-close");
    const messages = panel.querySelector(".calder-messages");
    const form = panel.querySelector(".calder-composer");
    const input = form.querySelector('input[name="message"]');
    const sendButton = form.querySelector('button[type="submit"]');

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      launcher.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
      else launcher.focus();
    }

    function addMessage(text, kind) {
      const message = document.createElement("div");
      message.className = "calder-message" + (kind ? " " + kind : "");
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function formatNumber(value, digits) {
      return Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: digits || 0,
        maximumFractionDigits: digits || 0
      });
    }

    async function answerHoursQuestion() {
      const token = localStorage.getItem("token");
      if (!token) {
        addMessage("Please sign in to the NDOW Volunteer Calendar first. I need your existing sign-in session to look up your hours.", "calder-error");
        return;
      }

      sendButton.disabled = true;
      input.disabled = true;
      addMessage("Let me check your current-year volunteer hours…", "calder-reply");

      try {
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/my-hours/summary", {
          method: "GET",
          headers: { "Authorization": "Bearer " + token }
        });

        const body = await response.json().catch(function () { return {}; });
        if (!response.ok) {
          throw new Error(body.message || body.error || "The NDOW service returned HTTP " + response.status + ".");
        }

        const year = body.year || new Date().getFullYear();
        const summary =
          "Your volunteer-hours summary (report-aligned):\n" +
          "Events recorded: " + formatNumber(body.events) + "\n" +
          "Event hours: " + formatNumber(body.eventHours ?? body.volunteerHours, 2) + "\n" +
          "Travel hours: " + formatNumber(body.travelHours, 2) + "\n" +
          "Total hours (event + travel): " + formatNumber(body.totalHours ?? (Number((body.eventHours ?? body.volunteerHours) || 0) + Number(body.travelHours || 0)), 2) + "\n" +
          "Miles: " + formatNumber(body.mileage, 2) + "\n" +
          "Estimated service value: $" + formatNumber(body.serviceValue, 2);
        addMessage(summary, "calder-reply");
      } catch (error) {
        console.error("Calder hours request failed:", error);
        addMessage("I couldn't retrieve your hours right now. Please try again in a moment. If the problem continues, the NDOW hours service needs attention.", "calder-error");
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
      }
    }

    launcher.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });
    closeButton.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) setOpen(false);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage(question, "calder-user");
      input.value = "";

      if (/\b(hours?|mileage|miles|service value|volunteer time|how much have i volunteered)\b/i.test(question)) {
        answerHoursQuestion();
      } else {
        addMessage("I can currently look up your current-year volunteer-hours summary. More calendar and event questions will be added as those connections are completed.", "calder-reply");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalder, { once: true });
  } else {
    buildCalder();
  }
})();