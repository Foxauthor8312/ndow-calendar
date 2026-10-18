/* ==========================================================================
   Calder Assistant — interface prototype
   Searches existing NDOW Help topics and EKC search results.
   This version retrieves information; it does not generate AI answers or
   persist conversations. Those are deliberate future steps.
   ========================================================================== */
(function () {
  'use strict';

  if (document.getElementById('calderAssistant')) return;

  const API_BASE = 'https://ndow-calendar-server.onrender.com';
  // Add the approved Calder portrait here when its final repository path is ready.
  const CALDER_PORTRAIT = '';

  const root = document.createElement('section');
  root.id = 'calderAssistant';
  root.setAttribute('aria-label', 'Calder Volunteer Assistant');
  root.innerHTML = `
    <div class="calder-panel" role="dialog" aria-label="Chat with Calder" aria-modal="false">
      <div class="calder-header">
        <div class="calder-header-avatar" data-calder-avatar aria-hidden="true">C</div>
        <div class="calder-heading">
          <div class="calder-name">Calder</div>
          <div class="calder-subtitle">NDOW Volunteer Assistant</div>
        </div>
        <button class="calder-close" type="button" aria-label="Close Calder">×</button>
      </div>
      <div class="calder-messages" aria-live="polite" aria-relevant="additions"></div>
      <form class="calder-compose">
        <textarea class="calder-input" rows="1" maxlength="1200" aria-label="Ask Calder a question" placeholder="Ask about the calendar, hours, or help…"></textarea>
        <button class="calder-send" type="submit" aria-label="Send question">↑</button>
      </form>
      <div class="calder-disclaimer">Calder searches existing Help and EKC content. Search results are references, not a generated answer.</div>
    </div>
    <button class="calder-launcher" type="button" aria-label="Open Calder assistant" aria-expanded="false">C</button>
  `;

  document.body.appendChild(root);

  function setAvatar(container) {
    if (!CALDER_PORTRAIT) return;
    const image = document.createElement('img');
    image.src = CALDER_PORTRAIT;
    image.alt = '';
    image.onerror = () => image.remove();
    container.replaceChildren(image);
  }
  setAvatar(root.querySelector('[data-calder-avatar]'));
  // If a portrait is configured, apply it to the launcher too.
  const launcher = root.querySelector('.calder-launcher');
  if (CALDER_PORTRAIT) setAvatar(launcher);

  const panel = root.querySelector('.calder-panel');
  const closeButton = root.querySelector('.calder-close');
  const form = root.querySelector('.calder-compose');
  const input = root.querySelector('.calder-input');
  const send = root.querySelector('.calder-send');
  const messages = root.querySelector('.calder-messages');

  function openPanel() {
    root.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePanel() {
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', () => {
    root.classList.contains('is-open') ? closePanel() : openPanel();
  });
  closeButton.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.classList.contains('is-open')) closePanel();
  });

  function addMessage(text, type) {
    const item = document.createElement('div');
    item.className = 'calder-message' + (type ? ' ' + type : '');
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addWelcome() {
    const item = addMessage('Hi! I’m Calder. I can search the existing portal Help topics and Engineering Knowledge Center. Ask me a question and I’ll show you relevant material.', 'assistant');
    const suggestions = document.createElement('div');
    suggestions.className = 'calder-suggestions';
    [
      'How do I enter volunteer hours?',
      'Find help with calendar events',
      'Search the Engineering Knowledge Center'
    ].forEach(label => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'calder-suggestion';
      button.textContent = label;
      button.addEventListener('click', () => submitQuestion(label));
      suggestions.appendChild(button);
    });
    item.appendChild(suggestions);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function renderResults(container, title, rows, getTitle, getSummary, getMeta) {
    const heading = document.createElement('p');
    heading.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = title;
    heading.appendChild(strong);
    container.appendChild(heading);

    if (!rows.length) {
      const none = document.createElement('p');
      none.textContent = 'No matching results found in this source.';
      container.appendChild(none);
      return;
    }

    rows.slice(0, 5).forEach(row => {
      const result = document.createElement('div');
      result.className = 'calder-result';

      const resultTitle = document.createElement('div');
      resultTitle.className = 'calder-result-title';
      resultTitle.textContent = getTitle(row) || 'Untitled result';
      result.appendChild(resultTitle);

      const summaryText = getSummary(row);
      if (summaryText) {
        const summary = document.createElement('p');
        summary.textContent = summaryText.length > 340 ? summaryText.slice(0, 337) + '…' : summaryText;
        result.appendChild(summary);
      }

      const metaText = getMeta(row);
      if (metaText) {
        const meta = document.createElement('div');
        meta.className = 'calder-result-meta';
        meta.textContent = metaText;
        result.appendChild(meta);
      }
      container.appendChild(result);
    });
  }

  async function safeJson(response) {
    if (!response.ok) throw new Error('Request failed (' + response.status + ')');
    return response.json();
  }

  async function searchHelp(query) {
    const response = await fetch(API_BASE + '/api/help/topics?help_type=help');
    const data = await safeJson(response);
    const topics = Array.isArray(data) ? data : (data.topics || []);
    const terms = normalize(query).split(' ').filter(Boolean);
    return topics.map(topic => {
      const title = normalize(topic.title);
      const category = normalize(topic.category);
      const content = normalize(topic.content);
      const score = terms.reduce((total, term) =>
        total + (title.includes(term) ? 4 : 0) +
          (category.includes(term) ? 2 : 0) +
          (content.includes(term) ? 1 : 0), 0);
      return { topic, score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.topic);
  }

  async function searchKnowledge(query) {
    const url = API_BASE + '/api/knowledge/search?q=' + encodeURIComponent(query) + '&limit=8';
    const response = await fetch(url);
    const data = await safeJson(response);
    return data.results || [];
  }

  async function submitQuestion(rawQuestion) {
    const question = String(rawQuestion || '').trim();
    if (!question || send.disabled) return;

    input.value = '';
    addMessage(question, 'user');
    send.disabled = true;
    const loading = addMessage('I’m searching the existing Help topics and EKC…', 'assistant');

    try {
      const outcomes = await Promise.allSettled([
        searchHelp(question),
        searchKnowledge(question)
      ]);

      loading.textContent = '';
      const helpRows = outcomes[0].status === 'fulfilled' ? outcomes[0].value : [];
      const ekcRows = outcomes[1].status === 'fulfilled' ? outcomes[1].value : [];

      if (outcomes.every(outcome => outcome.status === 'rejected')) {
        loading.textContent = 'I couldn’t reach the Help or EKC search services just now. Please try again in a moment.';
        return;
      }

      renderResults(
        loading, 'Help topics', helpRows,
        row => row.title,
        row => row.content,
        row => [row.category, row.topic_key].filter(Boolean).join(' · ')
      );
      renderResults(
        loading, 'Engineering Knowledge Center', ekcRows,
        row => row.documentTitle || row.topic,
        row => row.summary || row.definition,
        row => [row.category, row.center, row.chapter, row.section].filter(Boolean).join(' · ')
      );

      const note = document.createElement('p');
      note.textContent = 'These are keyword-based search matches. I haven’t generated or verified a conversational answer yet.';
      loading.appendChild(note);
    } catch (error) {
      loading.textContent = 'I couldn’t complete that search. Please try again.';
      console.error('Calder search error:', error);
    } finally {
      send.disabled = false;
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    submitQuestion(input.value);
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  addWelcome();
  window.CalderAssistant = { open: openPanel, close: closePanel };
})();
