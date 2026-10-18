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
        '<div class="calder-message"><strong>Hi! I’m Calder.</strong><br>I can look up your recorded volunteer hours and search the existing NDOW Help and Engineering Knowledge Center.</div>' +
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
          const text = [topic.title, topic.category, topic.topic_key, topic.content]
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