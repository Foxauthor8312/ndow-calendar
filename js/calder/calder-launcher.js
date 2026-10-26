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
        '<button class="calder-close" type="button" aria-label="Exit Calder chat">Exit Chat</button>' +
      '</div>' +
      '<div class="calder-messages" aria-live="polite">' +
        '<div class="calder-message">I’m Calder, your Volunteer AI Assistant. Ask me what you need to know.</div>' +
      '</div>' +
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

    const welcomeMessage =
      '<div class="calder-message">I’m Calder, your Volunteer AI Assistant. Ask me what you need to know.</div>';

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      launcher.setAttribute("aria-expanded", String(open));
      if (open) input.focus();
      else launcher.focus();
    }

    function closeCalderChat() {
      pendingCalendarQuestion = "";
      input.value = "";
      messages.innerHTML = welcomeMessage;
      setOpen(false);
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
    let pendingWeatherQuestion = "";

    function hasCalendarTimeframe(question) {
      const q = question.toLowerCase();
      return /\b(this week|next week|this month|next month|upcoming|coming up|next events|future|this year|all year|year-round|any time|anytime|all dates|any year|20\d{2})\b/.test(q) ||
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(q);
    }


    function isCurrentUserAssigned(event) {
      if (!event) return false;
      let currentUser = {};
      try {
        currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      } catch (_) {
        currentUser = {};
      }
      const customerId = String(currentUser.ndow_customer_id || "").trim();
      const email = String(currentUser.email || "").trim().toLowerCase();
      const instructors = Array.isArray(event.instructors) ? event.instructors : [];
      return instructors.some(function (instructor) {
        const instructorId = String(instructor && instructor.customerId || "").trim();
        const instructorEmail = String(instructor && instructor.email || "").trim().toLowerCase();
        return Boolean(
          (customerId && instructorId && customerId === instructorId) ||
          (email && instructorEmail && email === instructorEmail)
        );
      });
    }

    function resolveAssignmentRange(question) {
      const q = String(question || "").toLowerCase();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());
      let start = null;
      let end = null;
      let label = "";
      if (q.includes("this week")) {
        start = new Date(sunday);
        end = new Date(sunday);
        end.setDate(end.getDate() + 6);
        label = "this week";
      } else if (q.includes("next week")) {
        start = new Date(sunday);
        start.setDate(start.getDate() + 7);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        label = "next week";
      } else if (q.includes("last week")) {
        end = new Date(sunday);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
        label = "last week";
      } else if (q.includes("this month")) {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        label = "this month";
      } else if (q.includes("next month")) {
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        label = "next month";
      } else if (q.includes("last month")) {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        label = "last month";
      } else if (q.includes("this year")) {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        label = "this year";
      } else if (q.includes("last year")) {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        label = "last year";
      }
      return start && end ? { start: start, end: end, label: label } : null;
    }

    async function answerAssignmentsQuestion(question) {
      sendButton.disabled = true;
      input.disabled = true;
      const range = resolveAssignmentRange(question);
      addMessage("I’ll check the published Volunteer Calendar for events assigned to you" +
        (range ? " for " + range.label : " across all dates") + "…", "calder-reply");
      try {
        const events = await loadPublishedEvents();
        const matches = events.filter(function (event) {
          if (!isCurrentUserAssigned(event)) return false;
          if (!range) return true;
          const date = eventDate(event);
          if (!date) return false;
          const day = new Date(date);
          day.setHours(0, 0, 0, 0);
          return day >= range.start && day <= range.end;
        });
        matches.sort(function (a, b) {
          const da = eventDate(a);
          const db = eventDate(b);
          if (da && db) return da - db;
          if (da) return -1;
          if (db) return 1;
          return String(a.title || "").localeCompare(String(b.title || ""));
        });
        if (!matches.length) {
          addMessage("I couldn’t find instructor assignments matching your signed-in ID or email in the published calendar" +
            (range ? " for " + range.label : "") +
            ". I checked the event instructor details only; I did not access the external NDOW assignment service. If the calendar’s My Events filter shows your events, those assignments may be stored in the separate assignment feed and are not included in this lookup yet.", "calder-reply");
          return;
        }
        const shown = matches.slice(0, 12);
        const lines = shown.map(function (event, index) {
          const date = eventDate(event);
          const dateLabel = date ? date.toLocaleDateString(undefined, {
            weekday: "short", month: "short", day: "numeric", year: "numeric"
          }) : "Date not listed";
          const location = event.location || event.county || event.region || "Location not listed";
          const time = event.time ? event.time + " · " : "";
          return (index + 1) + ". " + (event.title || event.program || "Calendar event") +
            "\n   " + dateLabel + "\n   " + time + location;
        });
        let reply = "I found " + matches.length + " event(s) assigned to you" +
          (range ? " for " + range.label : "") + ":\n\n" + lines.join("\n\n");
        if (matches.length > shown.length) {
          reply += "\n\nShowing " + shown.length + " results. Narrow the search by date range to see fewer events.";
        }
        addMessage(reply, "calder-reply");
      } catch (error) {
        console.error("Calder assignment lookup failed:", error);
        addMessage("I couldn’t load the published Volunteer Calendar to check your assignments. Please try again shortly.", "calder-error");
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

    function resolveHoursRange(question) {
      const q = String(question || "").toLowerCase();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let start = null;
      let end = null;
      let label = "";

      // The NDOW calendar is Sunday-first: weeks run Sunday through Saturday.
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());

      if (q.includes("this week")) {
        start = new Date(sunday);
        end = new Date(sunday);
        end.setDate(end.getDate() + 6);
        label = "this week";
      } else if (q.includes("next week")) {
        start = new Date(sunday);
        start.setDate(start.getDate() + 7);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        label = "next week";
      } else if (q.includes("last week")) {
        end = new Date(sunday);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
        label = "last week";
      } else if (q.includes("this month")) {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        label = "this month";
      } else if (q.includes("last month")) {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        label = "last month";
      } else if (q.includes("this year")) {
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        label = "this year";
      } else if (q.includes("last year")) {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        label = "last year";
      }

      function isoDate(date) {
        return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
      }
      return start && end ? { start: isoDate(start), end: isoDate(end), label: label } : null;
    }

    async function answerHelpQuestion(question) {
      const token = localStorage.getItem("token");
      if (!token) {
        addMessage("Please sign in to the NDOW Volunteer Calendar so I can find the right Help article.", "calder-error");
        return;
      }

      input.disabled = true;
      sendButton.disabled = true;
      addMessage("I'll look through the Help articles for you…", "calder-reply");

      try {
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/help/topics", {
          headers: { "Authorization": "Bearer " + token }
        });
        const body = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(body.error || "Help articles could not be loaded.");

        const topics = Array.isArray(body) ? body : (body.topics || []);
        const q = String(question || "").toLowerCase().replace(/[^a-z0-9\\s']/g, " ").replace(/\\s+/g, " ").trim();
        const aliases = [
          { pattern: /how do i (enter|record|log) (my )?hours|submit my hours|where do i put my hours/, terms: ["entering volunteer hours", "entering hours", "logging hours", "volunteer management", "break", "mileage"] },
          { pattern: /find my events|show me my events|events i('?m| am) teaching|my upcoming events/, terms: ["filter my events", "calendar", "events", "instructor"] },
          { pattern: /how many hours|my hours|volunteer time|service time/, terms: ["volunteer hour calculations", "entering volunteer hours", "hours submitted", "volunteer management"] },
          { pattern: /when am i teaching|my next class|next event|upcoming class/, terms: ["calendar", "events", "filter my events"] },
          { pattern: /request to teach|instructor request|request status/, terms: ["submitting a request", "instructor request", "status"] },
          { pattern: /student roster|registered students|attendance|email my students/, terms: ["communications", "registered students", "event attendance", "roster"] }
        ];
        const searchTerms = new Set(q.split(" ").filter(function (word) { return word.length > 2; }));
        aliases.forEach(function (alias) {
          if (alias.pattern.test(q)) alias.terms.forEach(function (term) {
            term.toLowerCase().split(" ").forEach(function (word) { if (word.length > 2) searchTerms.add(word); });
          });
        });

        const ranked = topics.map(function (topic) {
          const title = String(topic.title || "").toLowerCase();
          const category = String(topic.category || "").toLowerCase();
          const content = String(topic.content || "").toLowerCase();
          const tags = (Array.isArray(topic.tags) ? topic.tags : [])
            .map(function (tag) { return String(tag).toLowerCase(); });
          let score = 0;
          if (title.includes(q)) score += 20;
          if (content.includes(q)) score += 5;
          if (tags.some(function (tag) { return tag.includes(q); })) score += 15;
          searchTerms.forEach(function (term) {
            if (title.includes(term)) score += 6;
            else if (tags.some(function (tag) { return tag.split(/[^a-z0-9]+/).includes(term); })) score += 5;
            else if (category.includes(term)) score += 3;
            else if (content.includes(term)) score += 1;
          });
          return { topic: topic, score: score };
        }).filter(function (result) { return result.score > 0; })
          .sort(function (a, b) { return b.score - a.score; });

        const status = messages.querySelector(".calder-message.calder-reply:last-child");
        if (status && status.textContent === "I'll look through the Help articles for you…") status.remove();

        if (!ranked.length) {
          addMessage("I couldn't find a Help article that clearly answers that yet. Try asking another way, or tell me a little more about what you're trying to do.", "calder-reply");
          return;
        }

        const matches = ranked.slice(0, 4).filter(function (result, index) {
          return index === 0 || result.score >= ranked[0].score * 0.45;
        });

        addMessage("I found these Help articles that may help. Select one to read it:", "calder-reply");

        const resultsCard = document.createElement("div");
        resultsCard.className = "calder-message calder-reply calder-help-results";
        resultsCard.style.cssText = "display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:0;background:transparent;border:0;border-radius:0;";

        matches.forEach(function (result) {
          const topic = result.topic;
          const articleButton = document.createElement("button");
          articleButton.type = "button";
          articleButton.style.cssText = "display:block;width:100%;padding:2px 0;text-align:left;background:transparent;color:#2563eb;border:0;border-radius:0;cursor:pointer;font:inherit;text-decoration:underline;";
          articleButton.textContent = topic.title || "Help article";
          articleButton.addEventListener("click", function () {
            if (typeof window.openHelpArticleById === "function" && topic.id != null) {
              window.openHelpArticleById(topic.id);
              addMessage("Opening the Help system to: " + (topic.title || "the selected article") + ". You can close Calder whenever you're ready.", "calder-reply");
            } else {
              addMessage("I found the article, but the Help system isn't ready to open it yet. Please open Help from the calendar menu.", "calder-error");
            }
          });
          resultsCard.appendChild(articleButton);
        });

        messages.appendChild(resultsCard);
        messages.scrollTop = messages.scrollHeight;
      } catch (error) {
        console.error("Calder Help search failed:", error);
        addMessage("I couldn't load the Help articles right now. Please try again shortly.", "calder-error");
      } finally {
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    }

    async function answerKnowledgeQuestion(question, searchTerms) {
      const token = localStorage.getItem("token");
      if (!token) {
        addMessage("Please sign in to the NDOW Volunteer Calendar so I can check which knowledge resources are available to you.", "calder-error");
        return;
      }

      input.disabled = true;
      sendButton.disabled = true;
      addMessage("I'll look for relevant knowledge articles…", "calder-reply");

      try {
        const query = String(searchTerms || question || "").trim();
        const response = await fetch(
          "https://ndow-calendar-server.onrender.com/api/knowledge/search?q=" + encodeURIComponent(query) + "&limit=5",
          { headers: { "Authorization": "Bearer " + token } }
        );
        const body = await response.json().catch(function () { return {}; });
        const status = messages.querySelector(".calder-message.calder-reply:last-child");
        if (status && status.textContent === "I'll look for relevant knowledge articles…") status.remove();

        if (response.status === 403 && body.code === "EKC_ROLE_RESTRICTED") {
          addMessage("The Engineering Knowledge Center is reserved for technical and administrative personnel. I can still help you with portal questions—here are some Help articles that may be useful.", "calder-reply");
          await answerHelpQuestion(question);
          return;
        }

        if (!response.ok || !body.success) {
          throw new Error(body.error || "Knowledge search failed.");
        }

        const results = Array.isArray(body.results) ? body.results.slice(0, 5) : [];
        if (!results.length) {
          addMessage("I couldn't find a relevant EKC article for that question yet. You could try different wording or ask me to look for related documentation.", "calder-reply");
          return;
        }

        addMessage("I found these EKC articles that may help. Select a title to open it:", "calder-reply");

        const resultsCard = document.createElement("div");
        resultsCard.className = "calder-message calder-reply calder-knowledge-results";
        resultsCard.style.cssText = "display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:0;background:transparent;border:0;border-radius:0;";

        results.forEach(function (result) {
          const title = result.topic || result.documentTitle || result.documentKey || "EKC article";
          const articleButton = document.createElement("button");
          articleButton.type = "button";
          articleButton.style.cssText = "display:block;width:100%;padding:2px 0;text-align:left;background:transparent;color:#2563eb;border:0;border-radius:0;cursor:pointer;font:inherit;text-decoration:underline;";
          articleButton.textContent = title;
          articleButton.addEventListener("click", async function () {
            if (result.documentKey && typeof window.openTechnicalReferenceDocument === "function") {
              if (typeof window.openTechnicalReference === "function") {
                await window.openTechnicalReference();
              }
              window.openTechnicalReferenceDocument(result.documentKey);
              addMessage("Opening the EKC article: " + title + ".", "calder-reply");
            } else {
              addMessage("I found the article, but the EKC document viewer isn't available right now. Please open the Engineering Knowledge Center to read it.", "calder-error");
            }
          });
          resultsCard.appendChild(articleButton);
        });

        messages.appendChild(resultsCard);
        messages.scrollTop = messages.scrollHeight;
      } catch (error) {
        console.error("Calder EKC search failed:", error);
        const status = messages.querySelector(".calder-message.calder-reply:last-child");
        if (status && status.textContent === "I'll look for relevant knowledge articles…") status.remove();
        addMessage("I couldn't search the Engineering Knowledge Center right now. Please try again shortly.", "calder-error");
      } finally {
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    }

    async function answerHoursQuestion(question) {
      const token = localStorage.getItem("token");
      if (!token) {
        addMessage("Please sign in to the NDOW Volunteer Calendar first. I need your existing sign-in session to look up your hours.", "calder-error");
        return;
      }

      sendButton.disabled = true;
      input.disabled = true;
      const range = resolveHoursRange(question);
      addMessage("Let me check your volunteer hours" + (range ? " for " + range.label + " (" + range.start + " to " + range.end + ")" : " across all recorded dates") + "…", "calder-reply");

      try {
        const summaryUrl = new URL("https://ndow-calendar-server.onrender.com/api/my-hours/summary");
        if (range) {
          summaryUrl.searchParams.set("start_date", range.start);
          summaryUrl.searchParams.set("end_date", range.end);
        }
        const response = await fetch(summaryUrl.toString(), {
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
    closeButton.addEventListener("click", closeCalderChat);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) closeCalderChat();
    });

    async function answerNDOWQuestion(question, searchTerms) {
      const token = localStorage.getItem("token");
      if (!token) { addMessage("Please sign in to the NDOW Volunteer Calendar first.", "calder-error"); return; }
      sendButton.disabled = true; input.disabled = true;
      addMessage("I'll check the official NDOW website for you…", "calder-reply");
      try {
        const query = String(searchTerms || question || "").trim();
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/calder/sources/ndow-search?q=" + encodeURIComponent(query), { headers: { "Authorization": "Bearer " + token } });
        const body = await response.json().catch(function () { return {}; });
        const status = messages.querySelector(".calder-message.calder-reply:last-child");
        if (status && status.textContent === "I'll check the official NDOW website for you…") status.remove();
        if (!response.ok || !body.success) throw new Error(body.error || "NDOW source search failed.");
        const results = Array.isArray(body.results) ? body.results : [];
        if (!results.length) {
          addMessage("I couldn't find a reliable answer in the official NDOW website pages I checked. I’m not authorized to search general web sources. Try different wording or contact NDOW directly.", "calder-reply");
          return;
        }
        addMessage("Here’s what I found in official NDOW material. Open a source to review the original page:", "calder-reply");
        const card = document.createElement("div");
        card.className = "calder-message calder-reply calder-ndow-results";
        card.style.cssText = "display:flex;flex-direction:column;align-items:stretch;gap:10px;";
        results.forEach(function (item) {
          const section = document.createElement("div");
          section.style.cssText = "padding:8px 0;border-bottom:1px solid #DBE3EC;";
          const link = document.createElement("a");
          link.href = item.url; link.target = "_blank"; link.rel = "noopener noreferrer";
          link.textContent = item.title || "Official NDOW page";
          link.style.cssText = "font-weight:600;color:#19304B;";
          const excerpt = document.createElement("p");
          excerpt.textContent = String(item.excerpt || "").slice(0, 850);
          excerpt.style.cssText = "margin:6px 0 0;white-space:pre-wrap;";
          section.appendChild(link); section.appendChild(excerpt); card.appendChild(section);
        });
        messages.appendChild(card); messages.scrollTop = messages.scrollHeight;
        addMessage("Source: NDOW official website • Retrieved " + new Date(body.retrievedAt || Date.now()).toLocaleString(), "calder-reply");
      } catch (error) {
        console.error("Calder NDOW lookup failed:", error);
        addMessage("I couldn't retrieve official NDOW information right now. Please try again later. I won't search other websites.", "calder-error");
      } finally { sendButton.disabled = false; input.disabled = false; input.focus(); }
    }

    async function answerWeatherQuestion(question, searchTerms) {
      const token = localStorage.getItem("token");
      if (!token) { addMessage("Please sign in to the NDOW Volunteer Calendar first.", "calder-error"); return; }
      const sourceQuestion = String(question || "").trim();
      const locationMatch = sourceQuestion.match(/\b(?:in|for|near|at)\s+(?:(?:the\s+)?(?:town|city|village|community)\s+of\s+)?(.+?)(?=\s+(?:for\s+)?(?:tomorrow|today|tonight|this\s+afternoon|this\s+evening|this\s+weekend|next\s+week|on\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b|[?.!]|$)/i);
      let location = locationMatch ? locationMatch[1].trim() : "";
      location = location.replace(/^(?:the\\s+)?(?:town|city|village|community)\\s+of\\s+/i, "").replace(/^(?:the\\s+)?(?:weather|forecast)\\s+/i, "").replace(/\\s+/g, " ").trim();
      if (!location || /^(?:weather|forecast|tomorrow|today|tonight)$/i.test(location)) {
        pendingWeatherQuestion = sourceQuestion;
        addMessage("Which town, city, park, or lake should I check? Please include the state if the name might be ambiguous.", "calder-reply");
        return;
      }
      sendButton.disabled = true; input.disabled = true;
      addMessage("I'll look up " + location + " and check the National Weather Service forecast…", "calder-reply");
      try {
        const response = await fetch("https://ndow-calendar-server.onrender.com/api/calder/sources/weather?location=" + encodeURIComponent(location), { headers: { "Authorization": "Bearer " + token } });
        const body = await response.json().catch(function () { return {}; });
        const status = messages.querySelector(".calder-message.calder-reply:last-child");
        if (status && status.textContent.indexOf("I'll check the National Weather Service for ") === 0) status.remove();
        if (!response.ok || !body.success) { addMessage(body.error || "I couldn't retrieve a verified forecast right now.", "calder-reply"); return; }
        const lines = ["National Weather Service forecast for " + body.location + ":"];
        (body.forecast || []).slice(0, 4).forEach(function (period) {
          lines.push(period.name + ": " + period.shortForecast + "; " + period.temperature + "°" + period.temperatureUnit + "; wind " + period.windSpeed + " " + period.windDirection + ".");
        });
        if (body.alerts && body.alerts.length) {
          lines.push("", "Active weather alerts:");
          body.alerts.forEach(function (alert) { lines.push("• " + alert.event + (alert.headline ? ": " + alert.headline : "") + (alert.ends ? " (ends " + new Date(alert.ends).toLocaleString() + ")" : "")); });
        } else { lines.push("", "No active NWS alerts were returned for this location."); }
        addMessage(lines.join("\n"), "calder-reply");
        const sourceLink = document.createElement("a");
        sourceLink.href = body.publicUrl || "https://www.weather.gov/";
        sourceLink.target = "_blank"; sourceLink.rel = "noopener noreferrer";
        sourceLink.textContent = "Open official National Weather Service forecast";
        sourceLink.style.cssText = "display:block;margin:4px 0 8px;color:#19304B;font-weight:600;";
        messages.appendChild(sourceLink);
        addMessage("Retrieved " + new Date(body.retrievedAt || Date.now()).toLocaleString() + ". Forecasts can change; check the official source for updates.", "calder-reply");
      } catch (error) {
        console.error("Calder weather lookup failed:", error);
        addMessage("The National Weather Service data is temporarily unavailable. I don't have a verified forecast right now.", "calder-error");
      } finally { sendButton.disabled = false; input.disabled = false; input.focus(); }
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage(question, "calder-user");
      input.value = "";

      if (pendingWeatherQuestion) {
        const originalWeatherQuestion = pendingWeatherQuestion;
        pendingWeatherQuestion = "";
        answerWeatherQuestion(originalWeatherQuestion + " " + question, originalWeatherQuestion + " " + question);
        return;
      }

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
          answerHoursQuestion(question + " " + (plan.timeframe || ""));
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
          answerAssignmentsQuestion(question + " " + (plan.timeframe || ""));
        } else if (plan.intent === "help_search") {
          answerHelpQuestion(question);
        } else if (plan.intent === "knowledge_search") {
          answerKnowledgeQuestion(question, plan.search_terms);
        } else if (plan.intent === "ndow_public_knowledge") {
          answerNDOWQuestion(question, plan.search_terms);
        } else if (plan.intent === "weather") {
          answerWeatherQuestion(question, plan.search_terms);
        } else {
          addMessage("I am not authorized to access general information from the web except NDOW information from that site and weather information.", "calder-reply");
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