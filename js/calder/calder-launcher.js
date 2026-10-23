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
        '<div class="calder-message"><strong>Hi! I’m Calder.</strong><br>I can look up your recorded volunteer hours, your calendar assignments, published events, and information in the existing Help and Engineering Knowledge Center.</div>' +
      '</div>' +
      '<div class="calder-status">Connected to the NDOW hours summary service for supported hours questions.</div>' +
      '<form class="calder-composer">' +
        '<input type="text" name="message" aria-label="Message Calder" placeholder="Ask about hours, your events, or the calendar…" autocomplete="off">' +
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

    function calendarDate(event) {
      const raw = event.date || event.event_date || event.startDate || "";
      if (!raw) return null;
      const date = new Date(raw);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    function calendarDateLabel(event) {
      const date = calendarDate(event);
      return date ? date.toLocaleDateString(undefined, {
        weekday: "short", month: "short", day: "numeric", year: "numeric"
      }) : (event.date || event.event_date || "Date not listed");
    }

    async function answerMyAssignments() {
      sendButton.disabled = true;
      input.disabled = true;
      addMessage("I’ll check the assignments recorded for your signed-in calendar account…", "calder-reply");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Your calendar session has expired. Please sign in again.");
        const responses = await Promise.all([
          fetch("https://ndow-calendar-server.onrender.com/api/ndow-assignments/mine", {
            headers: { Authorization: "Bearer " + token }
          }),
          loadPublishedEvents()
        ]);
        const assignmentResponse = responses[0];
        const assignmentBody = await assignmentResponse.json().catch(function () { return {}; });
        if (!assignmentResponse.ok || !assignmentBody.success) {
          throw new Error(assignmentBody.error || "Could not load your calendar assignments.");
        }
        const ids = new Set((assignmentBody.eventIds || []).map(function (id) { return String(id).trim(); }));
        const events = responses[1];
        const matches = events.filter(function (event) { return ids.has(String(event.id || event.event_id || "").trim()); });
        matches.sort(function (a, b) {
          const da = calendarDate(a), db = calendarDate(b);
          if (da && db) return da - db;
          if (da) return -1;
          if (db) return 1;
          return 0;
        });
        if (!matches.length) {
          addMessage(ids.size
            ? "Your account has " + ids.size + " recorded assignment ID(s), but I couldn’t match them to events in the published calendar. I haven’t checked the external NDOW system."
            : "I don’t see any instructor assignments recorded for your signed-in calendar account yet. This checks the calendar’s existing records only; it does not log in to external NDOW.", "calder-reply");
          return;
        }
        const shown = matches.slice(0, 10);
        const lines = shown.map(function (event, index) {
          return (index + 1) + ". " + (event.title || event.program || "Calendar event") +
            "\\n   " + calendarDateLabel(event) +
            "\\n   " + (event.location || event.county || event.region || "Location not listed");
        });
        let reply = "Your signed-in calendar account has " + matches.length + " matching instructor assignment(s):\\n\\n" + lines.join("\\n\\n");
        if (matches.length > shown.length) reply += "\\n\\nI’ve shown the first " + shown.length + ". Ask for a month or program to narrow the list.";
        addMessage(reply, "calder-reply");
      } catch (error) {
        console.error("Calder assignment lookup failed:", error);
        addMessage(error.message || "I couldn’t load your calendar assignments right now.", "calder-error");
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
      }
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
        const upcomingOnly = /\\b(upcoming|coming up|next events|future|this week|next week|what'?s next)\\b/.test(q);
        const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];
        const requestedMonth = monthNames.findIndex(function (month) { return q.includes(month); });
        const terms = q.replace(/\\b(show|find|list|search|tell|me|about|what|which|are|is|the|a|an|for|of|in|on|at|calendar|event|events|upcoming|coming|up|next|please|do|we|have|there|any|this|week|month|near|around)\\b/g, " ")
          .replace(/[^a-z0-9\\s-]/g, " ").split(/\\s+/)
          .filter(function (term) { return term.length > 2; });
        let matches = events.filter(function (event) {
          const date = calendarDate(event);
          if (upcomingOnly && date && date < today) return false;
          if (requestedMonth >= 0 && date && date.getMonth() !== requestedMonth) return false;
          const searchable = [event.title, event.program, event.category, event.location, event.county, event.region, event.description]
            .filter(Boolean).join(" ").toLowerCase();
          return terms.length === 0 || terms.some(function (term) { return searchable.includes(term); });
        });
        matches.sort(function (a, b) {
          const da = calendarDate(a), db = calendarDate(b);
          if (da && db) return da - db;
          if (da) return -1;
          if (db) return 1;
          return String(a.title || "").localeCompare(String(b.title || ""));
        });
        if (!matches.length) {
          addMessage("I couldn’t find a matching event in the published Volunteer Calendar. Try a program, title, location, or month. Personal instructor assignments are checked separately against your signed-in account.", "calder-reply");
          return;
        }
        const shown = matches.slice(0, 8);
        const lines = shown.map(function (event, index) {
          return (index + 1) + ". " + (event.title || event.program || "Calendar event") +
            "\\n   " + calendarDateLabel(event) +
            "\\n   " + (event.time ? event.time + " · " : "") +
            (event.location || event.county || event.region || "Location not listed");
        });
        let reply = "I found " + matches.length + " matching published calendar event(s):\\n\\n" + lines.join("\\n\\n");
        if (matches.length > shown.length) reply += "\\n\\nShowing " + shown.length + " results. Narrow by program, month, or location for more specific results.";
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

    async function answerKnowledgeQuestion(question) {
      sendButton.disabled = true;
      input.disabled = true;
      addMessage("I’ll check the existing NDOW Help and Engineering Knowledge Center…", "calder-reply");

      try {
        const base = "https://ndow-calendar-server.onrender.com";
        const query = encodeURIComponent(question);
        const responses = await Promise.all([
          fetch(base + "/api/knowledge/search?q=" + query + "&limit=5"),
          fetch(base + "/api/help/topics?help_type=help")
        ]);

        const knowledgeBody = await responses[0].json().catch(function () { return {}; });
        const helpBody = await responses[1].json().catch(function () { return {}; });

        const knowledgeResults = responses[0].ok && Array.isArray(knowledgeBody.results)
          ? knowledgeBody.results : [];
        const helpTopics = responses[1].ok && Array.isArray(helpBody.topics)
          ? helpBody.topics : [];

        const terms = question.toLowerCase().replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/).filter(function (term) { return term.length > 2; });
        const matchedHelp = helpTopics.filter(function (topic) {
          const text = [topic.title, topic.category, topic.topic_key, topic.summary, topic.content]
            .concat(Array.isArray(topic.tags) ? topic.tags : [])
            .filter(Boolean).join(" ").toLowerCase();
          return terms.some(function (term) { return text.includes(term); });
        }).slice(0, 3);

        const parts = [];
        if (knowledgeResults.length) {
          parts.push("Engineering Knowledge Center:");
          knowledgeResults.slice(0, 4).forEach(function (item, index) {
            const title = item.documentTitle || item.topic || "Knowledge Center result";
            const summary = item.summary || item.definition || item.referenceNotes || "";
            parts.push((index + 1) + ". " + title + (summary ? "\n   " + summary : ""));
            const reference = [item.chapter, item.section, item.subsection].filter(Boolean).join(" · ");
            if (reference) parts.push("   Reference: " + reference);
          });
        }

        if (matchedHelp.length) {
          parts.push("NDOW Help:");
          matchedHelp.forEach(function (topic, index) {
            const content = String(topic.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
            parts.push((index + 1) + ". " + (topic.title || topic.topic_key || "Help topic") +
              (content ? "\n   " + content.slice(0, 650) : ""));
          });
        }

        if (!parts.length) {
          const failures = [];
          if (!responses[0].ok) failures.push("Engineering Knowledge Center search (HTTP " + responses[0].status + ")");
          if (!responses[1].ok) failures.push("NDOW Help (HTTP " + responses[1].status + ")");
          if (failures.length === 2) {
            addMessage("I couldn’t reach the existing Help or Engineering Knowledge Center services just now. Please try again shortly.", "calder-error");
          } else {
            addMessage("I couldn’t find a useful match in the existing Help or Engineering Knowledge Center for that wording. Try a shorter phrase or a key term from the topic.", "calder-reply");
          }
          return;
        }

        addMessage(parts.join("\n\n") + "\n\nI’m showing information returned by the existing NDOW systems; I haven’t verified anything beyond those results.", "calder-reply");
      } catch (error) {
        console.error("Calder Help/EKC request failed:", error);
        addMessage("I couldn’t check the existing NDOW Help and Knowledge Center right now. Please try again shortly.", "calder-error");
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
      addMessage("Let me check your recorded volunteer hours…", "calder-reply");

      try {
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/my-hours/summary", {
          method: "GET",
          headers: { "Authorization": "Bearer " + token }
        });

        const body = await response.json().catch(function () { return {}; });
        if (!response.ok) {
          throw new Error(body.message || body.error || "The NDOW service returned HTTP " + response.status + ".");
        }

        const summary =
          "Your recorded volunteer-hours summary:\n" +
          "Events recorded: " + formatNumber(body.events) + "\n" +
          "Event hours: " + formatNumber(body.eventHours ?? body.volunteerHours, 2) + "\n" +
          "Travel hours: " + formatNumber(body.travelHours, 2) + "\n" +
          "Total hours: " + formatNumber(body.totalHours ?? ((body.eventHours ?? body.volunteerHours ?? 0) + (body.travelHours || 0)), 2) + "\n" +
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

      if (/\b(my events|my assignments|events am i assigned|events am i an instructor|where am i teaching|what am i teaching|my instructor assignments)\b/i.test(question)) {
        answerMyAssignments();
      } else if (/\b(hours?|mileage|miles|service value|volunteer time|how much have i volunteered)\b/i.test(question)) {
        answerHoursQuestion();
      } else if (/\b(email|e-mail|communications?|communicate|registered students|student roster|send a message|email students|attendance|survey|survey results)\b/i.test(question)) {
        answerKnowledgeQuestion(question);
      } else if (/\b(events?|calendar|fishing|hunter|archery|boating|programs?|classes|workshops?|where|when|upcoming|coming up|next week|this week|location|county|region|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(question)) {
        answerCalendarQuestion(question);
      } else {
        answerKnowledgeQuestion(question);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildCalder, { once: true });
  } else {
    buildCalder();
  }
})();