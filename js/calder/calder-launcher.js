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

    async function loadPublishedEvents() {
      const response = await fetch(
        "https://foxauthor8312.github.io/ndow-calendar/events.json?t=" + Date.now()
      );
      if (!response.ok) throw new Error("Calendar feed returned HTTP " + response.status);
      const payload = await response.json();
      return Array.isArray(payload) ? payload : (payload.events || []);
    }

    function eventDate(event) {
      const raw = event.date || event.event_date || event.startDate || "";
      if (!raw) return null;
      const date = new Date(raw);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    let pendingCalendarQuestion = "";

    function hasCalendarTimeframe(question) {
      const q = question.toLowerCase();
      return /\b(this week|next week|this month|next month|upcoming|coming up|next events|future|this year|all year|year-round|any time|anytime|all dates|any year|20\d{2})\b/.test(q) ||
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(q);
    }

    async function answerCalendarQuestion(question) {
      sendButton.disabled = true;
      input.disabled = true;
      addMessage("I’ll search the published Volunteer Calendar…", "calder-reply");

      try {
        const events = await loadPublishedEvents();
        const q = question.toLowerCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingOnly = /\b(upcoming|coming up|next events|future|this week|next week|what'?s next)\b/.test(q);
        const thisWeek = /\bthis week\b/.test(q);
        const nextWeek = /\bnext week\b/.test(q);
        const thisMonth = /\bthis month\b/.test(q);
        const nextMonth = /\bnext month\b/.test(q);
        const yearMatch = q.match(/\b(20\d{2})\b/);
        const requestedYear = yearMatch ? Number(yearMatch[1]) : null;
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        let requestedMonth = monthNames.findIndex(function (month) { return q.includes(month); });
        if (thisMonth || nextMonth) requestedMonth = (today.getMonth() + (nextMonth ? 1 : 0)) % 12;
        const weekStart = new Date(today);
        if (nextWeek) weekStart.setDate(weekStart.getDate() + (8 - (weekStart.getDay() || 7)));
        else if (thisWeek) weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
        const weekEnd = new Date(weekStart);
        if (thisWeek || nextWeek) weekEnd.setDate(weekEnd.getDate() + 7);
        const terms = q.replace(/\b(show|find|list|search|tell|me|about|what|which|are|is|the|a|an|for|of|in|on|at|calendar|event|events|upcoming|coming|up|next|please|do|we|have|there|any|this|week|month|near|around)\b/g, " ")
          .replace(/[^a-z0-9\s-]/g, " ").split(/\s+/)
          .filter(function (term) { return term.length > 2; });

        let matches = events.filter(function (event) {
          const date = eventDate(event);
          if (upcomingOnly && date && date < today) return false;
          if (requestedYear && date && date.getFullYear() !== requestedYear) return false;
          if (requestedMonth >= 0 && date && date.getMonth() !== requestedMonth) return false;
          if ((thisWeek || nextWeek) && date && (date < weekStart || date >= weekEnd)) return false;
          if (thisMonth && date && (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear())) return false;
          if (nextMonth && date) {
            const targetMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            if (date.getMonth() !== targetMonth.getMonth() || date.getFullYear() !== targetMonth.getFullYear()) return false;
          }
          const searchable = [event.title, event.program, event.category, event.location, event.county, event.region, event.description]
            .filter(Boolean).join(" ").toLowerCase();
          return terms.length === 0 || terms.some(function (term) { return searchable.includes(term); });
        });

        matches.sort(function (a, b) {
          const da = eventDate(a), db = eventDate(b);
          if (da && db) return da - db;
          if (da) return -1;
          if (db) return 1;
          return String(a.title || "").localeCompare(String(b.title || ""));
        });

        if (!matches.length) {
          addMessage("I couldn’t find a matching event in the published Volunteer Calendar. Try a program, event title, location, or month.", "calder-reply");
          return;
        }

        const shown = matches.slice(0, 8);
        const lines = shown.map(function (event, index) {
          const date = eventDate(event);
          const dateLabel = date ? date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : (event.date || event.event_date || "Date not listed");
          return (index + 1) + ". " + (event.title || event.program || "Calendar event") +
            "\n   " + dateLabel +
            "\n   " + (event.time ? event.time + " · " : "") +
            (event.location || event.county || event.region || "Location not listed");
        });
        let reply = "I found " + matches.length + " matching published calendar event(s):\n\n" + lines.join("\n\n");
        if (matches.length > shown.length) reply += "\n\nShowing " + shown.length + " results. Narrow by program, month, or location for more specific results.";
        addMessage(reply, "calder-reply");
      } catch (error) {
        console.error("Calder calendar lookup failed:", error);
        addMessage("I couldn’t load the published Volunteer Calendar right now. Please try again shortly.", "calder-error");
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

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage(question, "calder-user");
      input.value = "";

      if (pendingCalendarQuestion) {
        const originalQuestion = pendingCalendarQuestion;
        pendingCalendarQuestion = "";
        answerCalendarQuestion(originalQuestion + " " + question);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        addMessage("Please sign in to the NDOW Volunteer Calendar first so I can securely look up your information.", "calder-error");
        return;
      }

      sendButton.disabled = true;
      input.disabled = true;
      addMessage("Let me understand what you're asking…", "calder-reply");

      try {
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/calder/reason", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ question: question })
        });
        const body = await response.json().catch(function () { return {}; });
        if (!response.ok || !body.success || !body.plan) {
          throw new Error(body.error || body.message || "Calder's reasoning service returned HTTP " + response.status + ".");
        }

        const plan = body.plan;
        const priorStatus = messages.querySelector(".calder-message.calder-reply:last-child");
        if (priorStatus && priorStatus.textContent === "Let me understand what you're asking…") priorStatus.remove();

        if (plan.intent === "my_hours") {
          answerHoursQuestion();
        } else if (plan.intent === "calendar_search") {
          const calendarQuestion = [question, plan.search_terms, plan.timeframe].filter(Boolean).join(" ");
          if (!hasCalendarTimeframe(calendarQuestion)) {
            pendingCalendarQuestion = question;
            addMessage("What time frame would you like? You can say this week, this month, a specific month and year, a year, or all dates.", "calder-reply");
          } else {
            answerCalendarQuestion(calendarQuestion);
          }
        } else if (plan.intent === "clarify" && plan.clarification) {
          addMessage(plan.clarification, "calder-reply");
        } else if (plan.intent === "my_assignments") {
          addMessage("I understand you're asking about your instructor assignments. That lookup isn't connected to Calder yet; we'll add it next.", "calder-reply");
        } else if (plan.intent === "help_search" || plan.intent === "knowledge_search") {
          addMessage("I understand you're looking for help or Engineering Knowledge Center information. That search isn't connected to Calder yet; we'll add it next.", "calder-reply");
        } else {
          addMessage("I can help with your recorded hours and the published Volunteer Calendar. Tell me a little more about what you need.", "calder-reply");
        }
      } catch (error) {
        console.error("Calder reasoning request failed:", error);
        const statusMessages = messages.querySelectorAll(".calder-message.calder-reply");
        const lastStatus = statusMessages[statusMessages.length - 1];
        if (lastStatus && lastStatus.textContent === "Let me understand what you're asking…") lastStatus.remove();
        addMessage("I couldn't interpret that request right now. Please try again. Your calendar and hours records haven't been changed.", "calder-error");
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalder, { once: true });
  } else {
    buildCalder();
  }
})();