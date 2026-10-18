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
        '<div class="calder-message"><strong>Hi! I’m Calder.</strong><br>I can help with your current-year volunteer-hours summary. Ask me how many hours you have this year.</div>' +
      '</div>' +
      '<div class="calder-status">Connected to the NDOW hours summary service for supported hours questions.</div>' +
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

    let calendarEventsPromise = null;

    async function loadCalendarEvents() {
      if (!calendarEventsPromise) {
        calendarEventsPromise = fetch(
          "https://foxauthor8312.github.io/ndow-calendar/events.json?t=" + Date.now()
        ).then(function (response) {
          if (!response.ok) throw new Error("Calendar feed returned HTTP " + response.status);
          return response.json();
        }).then(function (payload) {
          return Array.isArray(payload) ? payload : (payload.events || []);
        }).catch(function (error) {
          calendarEventsPromise = null;
          throw error;
        });
      }
      return calendarEventsPromise;
    }

    function eventDateValue(event) {
      const raw = event.date || event.event_date || event.startDate || "";
      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatEventDate(event) {
      const date = eventDateValue(event);
      if (!date) return event.date || "Date not listed";
      return date.toLocaleDateString(undefined, {
        weekday: "short", month: "short", day: "numeric", year: "numeric"
      });
    }

    async function answerCalendarQuestion(question) {
      sendButton.disabled = true;
      input.disabled = true;
      addMessage("I’ll check the published NDOW calendar…", "calder-reply");
      try {
        const events = await loadCalendarEvents();
        const q = question.toLowerCase();
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const upcomingOnly = /\b(upcoming|coming up|next events|future|this week|next week|what'?s next)\b/.test(q);
        const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];
        const requestedMonth = monthNames.findIndex(function (month) { return q.includes(month); });
        const terms = q.replace(/\b(show|find|list|search|tell|me|about|what|which|are|is|the|a|an|for|of|in|on|at|calendar|event|events|upcoming|coming|up|next|please|do|we|have|there|any|this|week|month|near|around)\b/g, " ")
          .replace(/[^a-z0-9\s-]/g, " ")
          .split(/\s+/).filter(function (term) { return term.length > 2; });

        let matches = events.filter(function (event) {
          const date = eventDateValue(event);
          if (upcomingOnly && date && date < now) return false;
          if (requestedMonth >= 0 && date && date.getMonth() !== requestedMonth) return false;
          const searchable = [
            event.title, event.program, event.category, event.location,
            event.county, event.region, event.description
          ].filter(Boolean).join(" ").toLowerCase();
          return terms.length === 0 || terms.some(function (term) { return searchable.includes(term); });
        });

        matches.sort(function (a, b) {
          const da = eventDateValue(a), db = eventDateValue(b);
          if (da && db) return da - db;
          if (da) return -1;
          if (db) return 1;
          return String(a.title || "").localeCompare(String(b.title || ""));
        });

        if (!matches.length) {
          addMessage("I couldn’t find a matching event in the published calendar. Try a program, event title, location, or month. I can’t confirm personal instructor assignments from the public calendar alone.", "calder-reply");
          return;
        }

        const shown = matches.slice(0, 5);
        const lines = shown.map(function (event, index) {
          const title = event.title || event.program || "NDOW event";
          const location = event.location || event.county || "Location not listed";
          const time = event.time ? " · " + event.time : "";
          return (index + 1) + ". " + title + "\n   " + formatEventDate(event) + time + "\n   " + location;
        });
        let reply = "I found " + matches.length + " matching calendar event" + (matches.length === 1 ? "" : "s") + ". Here are " + shown.length + ":\n\n" + lines.join("\n\n");
        if (matches.length > shown.length) reply += "\n\nThere are more matches. Narrow the search by program, month, or location.";
        addMessage(reply, "calder-reply");
      } catch (error) {
        console.error("Calder calendar request failed:", error);
        addMessage("I couldn’t load the published calendar right now. Please try again shortly.", "calder-error");
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
      }
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
          "Your " + year + " volunteer-hours summary:\n" +
          "Events recorded: " + formatNumber(body.events) + "\n" +
          "Volunteer hours: " + formatNumber(body.volunteerHours, 2) + "\n" +
          "Travel hours: " + formatNumber(body.travelHours, 2) + "\n" +
          "Miles: " + formatNumber(body.mileage, 1) + "\n" +
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
      } else if (/\b(events?|calendar|fishing|hunter|archery|boating|programs?|classes|workshops?|where|when|upcoming|coming up|next week|this week|instructor|location|county|region|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(question)) {
        answerCalendarQuestion(question);
      } else {
        addMessage("Try asking about your volunteer hours, upcoming events, a program, event title, location, or month. Personal instructor assignments will require your signed-in account data.", "calder-reply");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalder, { once: true });
  } else {
    buildCalder();
  }
})();