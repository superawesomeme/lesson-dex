/**
 * ============================================================================
 * LESSON DEX - PRESENTATION PLAYER & STUDIO ENGINE
 * Strict Vanilla JavaScript (ES6+) • UK English Edition
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Local Tabler SVG Icons Dictionary (No Emojis)
  // --------------------------------------------------------------------------
  const ICONS = {
    eye: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>`,
    eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10" /></svg>`,
    bulb: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /><line x1="9.7" y1="17" x2="14.3" y2="17" /></svg>`,
    help: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 17v.01" /><path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -2" /></svg>`,
    grip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1" fill="currentColor" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="9" cy="19" r="1" fill="currentColor" /><circle cx="15" cy="5" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="19" r="1" fill="currentColor" /></svg>`,
    maximize: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /></svg>`,
    minimize: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h4v-4" /><path d="M3 3l6 6" /><path d="M5 15h4v4" /><path d="M3 21l6 -6" /><path d="M19 9h-4v-4" /><path d="M15 9l6 -6" /><path d="M19 15h-4v4" /><path d="M15 15l6 6" /></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><line x1="3" y1="6" x2="3" y2="19" /><line x1="12" y1="6" x2="12" y2="19" /><line x1="21" y1="6" x2="21" y2="19" /></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4v.01" /><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.76 2.75" /></svg>`,
    circleCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2l4 -4" /></svg>`,
    pin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" /><line x1="9" y1="15" x2="4.5" y2="19.5" /><line x1="14.5" y1="4" x2="20" y2="9.5" /></svg>`,
    pinOff: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="3" x2="21" y2="21" /><path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.18m1.43 -2.568l3.25 -3.252" /><line x1="9" y1="15" x2="4.5" y2="19.5" /><line x1="14.5" y1="4" x2="20" y2="9.5" /></svg>`
  };

  // --------------------------------------------------------------------------
  // 1. Application State
  // --------------------------------------------------------------------------
  const state = {
    slides: [],
    currentIndex: 0,
    defaultLessonData: null,
    isFullscreen: false,
    isPinned: false, // Default: UI auto-hides for cinema classroom stage
    isMouseOverBars: false,
    autoHideTimeout: null,
    interactiveStates: {
      revealedGaps: new Set(),
      totalGapsOnSlide: 0,
      answerRevealed: false,
      matchedPairs: new Set(),
      selectedMatchSource: null,
      isTranscriptBlurred: true
    }
  };

  // --------------------------------------------------------------------------
  // 2. DOM Elements Cache
  // --------------------------------------------------------------------------
  const DOM = {
    // Header & Auto-hide
    appHeader: document.getElementById('app-header'),
    lessonTitle: document.getElementById('header-lesson-title'),
    slideHeading: document.getElementById('header-slide-name'),
    btnAutohideToggle: document.getElementById('btn-autohide-toggle'),
    autohideIcon: document.getElementById('autohide-icon'),
    btnShortcuts: document.getElementById('btn-shortcuts'),
    btnPrint: document.getElementById('btn-print'),
    btnStudioToggle: document.getElementById('btn-studio-toggle'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    fullscreenIcon: document.getElementById('fullscreen-icon'),

    // Stage Canvas & Arrows
    stageWrapper: document.getElementById('stage-wrapper'),
    stageCanvas: document.getElementById('stage-canvas'),
    slideViewport: document.getElementById('slide-viewport'),
    stagePrevBtn: document.getElementById('stage-prev-btn'),
    stageNextBtn: document.getElementById('stage-next-btn'),

    // Progression Bar
    progressionBar: document.getElementById('progression-bar'),
    slideCounter: document.getElementById('slide-counter'),
    slideTypeTag: document.getElementById('slide-type-tag'),
    progressionTrack: document.getElementById('progression-track'),
    footerPrevBtn: document.getElementById('footer-prev-btn'),
    footerNextBtn: document.getElementById('footer-next-btn'),

    // Studio Modal & Editor
    studioModal: document.getElementById('studio-modal'),
    studioCloseBtn: document.getElementById('btn-studio-close'),
    studioResetBtn: document.getElementById('btn-studio-reset'),
    studioFormatBtn: document.getElementById('btn-studio-format'),
    studioExportBtn: document.getElementById('btn-studio-export'),
    studioApplyBtn: document.getElementById('btn-studio-apply'),
    studioFileInput: document.getElementById('studio-file-input'),
    studioEditor: document.getElementById('studio-json-editor'),
    studioFeedback: document.getElementById('studio-feedback'),
    studioFeedbackText: document.getElementById('studio-feedback-text'),

    // Shortcuts Modal
    shortcutsModal: document.getElementById('shortcuts-modal'),
    shortcutsCloseBtn: document.getElementById('btn-shortcuts-close'),

    // Print & Toast Containers
    printContainer: document.getElementById('print-container'),
    toastContainer: document.getElementById('toast-container')
  };

  // --------------------------------------------------------------------------
  // 3. UI Auto-Hide Engine
  // --------------------------------------------------------------------------
  function resetAutoHideTimer() {
    if (state.isPinned) {
      document.body.classList.remove('bars-hidden');
      return;
    }

    // Always reveal bars when mouse moves
    document.body.classList.remove('bars-hidden');

    if (state.autoHideTimeout) {
      clearTimeout(state.autoHideTimeout);
    }

    // Schedule hide after 2.5s of inactivity if not hovering over UI chrome or modal
    state.autoHideTimeout = setTimeout(() => {
      const isModalOpen = !DOM.studioModal.classList.contains('hidden') || !DOM.shortcutsModal.classList.contains('hidden');
      if (!state.isPinned && !state.isMouseOverBars && !isModalOpen) {
        document.body.classList.add('bars-hidden');
      }
    }, 2500);
  }

  function togglePinUI() {
    state.isPinned = !state.isPinned;
    DOM.btnAutohideToggle.classList.toggle('is-active', state.isPinned);
    DOM.autohideIcon.innerHTML = state.isPinned ? ICONS.pin : ICONS.pinOff;
    DOM.btnAutohideToggle.setAttribute('title', state.isPinned ? 'UI Pinned (Click to enable Auto-hide)' : 'Toggle Auto-hide UI (H)');

    if (state.isPinned) {
      if (state.autoHideTimeout) clearTimeout(state.autoHideTimeout);
      document.body.classList.remove('bars-hidden');
      showToast('UI chrome pinned to screen', 'info');
    } else {
      showToast('Auto-hide enabled (Hides when idle)', 'info');
      resetAutoHideTimer();
    }
  }

  // --------------------------------------------------------------------------
  // 4. Lesson Data Loader (Fetch with Embedded Fallback)
  // --------------------------------------------------------------------------
  async function loadInitialLesson() {
    try {
      const response = await fetch('lesson.json');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      state.defaultLessonData = JSON.parse(JSON.stringify(data));
      setLessonData(data);
    } catch (err) {
      console.warn('Could not fetch lesson.json directly. Loading embedded fallback...', err);
      const fallback = getEmbeddedFallbackLesson();
      state.defaultLessonData = JSON.parse(JSON.stringify(fallback));
      setLessonData(fallback);
    }
  }

  function setLessonData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      showToast('The JSON file must contain a non-empty array of slides.', 'error');
      return false;
    }

    state.slides = data;
    state.currentIndex = 0;
    resetInteractiveStates();

    DOM.studioEditor.value = JSON.stringify(state.slides, null, 2);

    buildProgressionTrack();
    buildPrintSheets();

    renderCurrentSlide();
    showToast(`Lesson loaded (${state.slides.length} slides)`, 'success');
    return true;
  }

  function resetInteractiveStates() {
    state.interactiveStates.revealedGaps.clear();
    state.interactiveStates.totalGapsOnSlide = 0;
    state.interactiveStates.answerRevealed = false;
    state.interactiveStates.matchedPairs.clear();
    state.interactiveStates.selectedMatchSource = null;
    state.interactiveStates.isTranscriptBlurred = true;
  }

  // --------------------------------------------------------------------------
  // 5. Navigation System
  // --------------------------------------------------------------------------
  function goToSlide(index) {
    if (index < 0 || index >= state.slides.length) return;
    if (index === state.currentIndex) return;

    state.currentIndex = index;
    resetInteractiveStates();
    renderCurrentSlide();
  }

  function nextSlide() {
    if (state.currentIndex < state.slides.length - 1) {
      goToSlide(state.currentIndex + 1);
    }
  }

  function prevSlide() {
    if (state.currentIndex > 0) {
      goToSlide(state.currentIndex - 1);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Progression Track Rendering & UI Sync
  // --------------------------------------------------------------------------
  function buildProgressionTrack() {
    DOM.progressionTrack.innerHTML = '';

    state.slides.forEach((slide, idx) => {
      const stepBtn = document.createElement('button');
      stepBtn.className = 'track-step';
      stepBtn.setAttribute('role', 'tab');
      stepBtn.setAttribute('aria-selected', idx === state.currentIndex ? 'true' : 'false');
      
      const title = slide.title || slide.heading || `Slide ${idx + 1}`;
      stepBtn.setAttribute('title', `${idx + 1}. [${slide.type}] ${title}`);

      stepBtn.addEventListener('click', () => goToSlide(idx));
      DOM.progressionTrack.appendChild(stepBtn);
    });

    updateProgressionUI();
  }

  function updateProgressionUI() {
    const total = state.slides.length;
    const current = state.currentIndex;
    const currentSlide = state.slides[current];

    if (!currentSlide) return;

    DOM.slideCounter.textContent = `Slide ${current + 1} of ${total}`;
    DOM.slideTypeTag.textContent = currentSlide.type;

    const titleText = currentSlide.title || currentSlide.heading || `Slide ${current + 1}`;
    DOM.slideHeading.textContent = `${current + 1}. ${titleText}`;

    const isFirst = current === 0;
    const isLast = current === total - 1;

    DOM.stagePrevBtn.disabled = isFirst;
    DOM.footerPrevBtn.disabled = isFirst;

    DOM.stageNextBtn.disabled = isLast;
    DOM.footerNextBtn.disabled = isLast;

    const stepElements = DOM.progressionTrack.querySelectorAll('.track-step');
    stepElements.forEach((step, idx) => {
      step.classList.toggle('is-active', idx === current);
      step.classList.toggle('is-visited', idx < current);
      step.setAttribute('aria-selected', idx === current ? 'true' : 'false');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Slide Render Engine (The 11 Layouts)
  // Notes data is STRICTLY excluded from the DOM in Player Mode!
  // Content font size >= 22px for back-of-class visibility.
  // --------------------------------------------------------------------------
  function renderCurrentSlide() {
    const slide = state.slides[state.currentIndex];
    if (!slide) return;

    DOM.slideViewport.innerHTML = '';

    const slideElement = document.createElement('div');
    slideElement.className = `slide slide-${slide.type}`;
    slideElement.setAttribute('data-slide-id', slide.slideId || `slide-${state.currentIndex + 1}`);

    switch (slide.type) {
      case 'intro':
        renderIntroSlide(slide, slideElement);
        break;
      case 'objectives':
        renderObjectivesSlide(slide, slideElement);
        break;
      case 'homework':
        renderHomeworkSlide(slide, slideElement);
        break;
      case 'one-panel':
        renderOnePanelSlide(slide, slideElement);
        break;
      case 'two-panel':
        renderTwoPanelSlide(slide, slideElement);
        break;
      case 'fill-gap':
        renderFillGapSlide(slide, slideElement);
        break;
      case 'question':
        renderQuestionSlide(slide, slideElement);
        break;
      case 'match':
        renderMatchSlide(slide, slideElement);
        break;
      case 'listen':
        renderListenSlide(slide, slideElement);
        break;
      case 'reading':
        renderReadingSlide(slide, slideElement);
        break;
      case 'conjugation':
        renderConjugationSlide(slide, slideElement);
        break;
      default:
        renderUnknownSlide(slide, slideElement);
        break;
    }

    DOM.slideViewport.appendChild(slideElement);
    updateProgressionUI();
  }

  // --------------------------------------------------------------------------
  // Layout 1: INTRO
  // --------------------------------------------------------------------------
  function renderIntroSlide(slide, container) {
    if (slide.backgroundImage) {
      container.style.backgroundImage = `url('${slide.backgroundImage}')`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'intro-overlay';

    if (slide.badge) {
      const badge = document.createElement('span');
      badge.className = 'intro-badge';
      badge.textContent = slide.badge;
      overlay.appendChild(badge);
    }

    const title = document.createElement('h1');
    title.className = 'intro-title';
    title.textContent = slide.title || 'Lesson Title';
    overlay.appendChild(title);

    if (slide.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'intro-subtitle';
      subtitle.textContent = slide.subtitle;
      overlay.appendChild(subtitle);
    }

    const hint = document.createElement('div');
    hint.className = 'intro-start-hint';
    hint.innerHTML = '<span>Press</span> <kbd>→</kbd> <span>or</span> <kbd>Space</kbd> <span>to begin</span>';
    overlay.appendChild(hint);

    container.appendChild(overlay);
  }

  // --------------------------------------------------------------------------
  // Layout 2: OBJECTIVES
  // --------------------------------------------------------------------------
  function renderObjectivesSlide(slide, container) {
    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Learning Goals</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Lesson Objectives')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-objectives-grid">
          <div class="objectives-card">
            <div class="objectives-lead">
              ${ICONS.bulb}
              <span>${escapeHtml(slide.leftStaticText || 'Today we will...')}</span>
            </div>
            <ul class="objectives-list">
              ${(slide.items || []).map(item => `
                <li>
                  <span class="objective-check-icon">${ICONS.check}</span>
                  <span>${escapeHtml(item)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="media-frame">
            <img src="${escapeHtml(slide.image || 'media/spain_cafe.svg')}" alt="${escapeHtml(slide.alt || 'Objectives')}" onerror="this.src='media/spain_cafe.svg'">
            ${slide.caption ? `<div class="media-caption">${escapeHtml(slide.caption)}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Layout 3: HOMEWORK
  // --------------------------------------------------------------------------
  function renderHomeworkSlide(slide, container) {
    const tasks = slide.tasks || (slide.content && slide.content.tasks) || [];
    const badge = slide.badge || (slide.content && slide.content.badge) || 'Independent Study';
    const title = slide.title || (slide.content && slide.content.title) || 'Homework Assignment';
    const tip = slide.tip || (slide.content && slide.content.tip) || '';

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Assignment</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Homework')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-homework-grid">
          <div class="homework-card">
            <span class="homework-badge">${escapeHtml(badge)}</span>
            <h3 class="homework-title">${escapeHtml(title)}</h3>
            <ul class="homework-tasks">
              ${tasks.map((task, i) => `
                <li>
                  <span class="homework-task-num">${i + 1}</span>
                  <span>${escapeHtml(task)}</span>
                </li>
              `).join('')}
            </ul>
            ${tip ? `<div class="homework-tip">${ICONS.bulb} <span>${escapeHtml(tip)}</span></div>` : ''}
          </div>
          <div class="media-frame">
            <img src="${escapeHtml(slide.image || 'media/homework_study.svg')}" alt="${escapeHtml(slide.alt || 'Homework')}" onerror="this.src='media/homework_study.svg'">
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Layout 4: ONE-PANEL
  // --------------------------------------------------------------------------
  function renderOnePanelSlide(slide, container) {
    const c = slide.content || {};
    const panelType = slide.panelType || c.panelType || 'text';

    let contentHtml = '';
    if (panelType === 'image') {
      contentHtml = `
        <div class="media-frame" style="max-height: 420px;">
          <img src="${escapeHtml(c.src || slide.src || 'media/madrid_puerta_sol.svg')}" alt="${escapeHtml(c.alt || 'Panel')}" onerror="this.src='media/madrid_puerta_sol.svg'">
          ${c.caption ? `<div class="media-caption">${escapeHtml(c.caption)}</div>` : ''}
        </div>
      `;
    } else if (panelType === 'video') {
      contentHtml = `
        <div class="media-frame" style="max-height: 420px;">
          <video controls poster="media/madrid_puerta_sol.svg" src="${escapeHtml(c.src || slide.src || 'media/sample_video.mp4')}">
            Your browser does not support HTML5 video.
          </video>
        </div>
      `;
    } else {
      contentHtml = `
        <div class="one-panel-card">
          ${c.tag ? `<span class="one-panel-tag">${escapeHtml(c.tag)}</span>` : ''}
          ${c.lead ? `<p class="one-panel-lead">${escapeHtml(c.lead)}</p>` : ''}
          ${c.formula ? `<div class="formula-box">${escapeHtml(c.formula)}</div>` : ''}
          ${Array.isArray(c.dialogue) ? `
            <div class="dialogue-box">
              ${c.dialogue.map(line => `<div>${escapeHtml(line)}</div>`).join('')}
            </div>
          ` : ''}
          ${c.caution ? `<div class="caution-note">${ICONS.warning} <span>${escapeHtml(c.caution)}</span></div>` : ''}
        </div>
      `;
    }

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Core Concept</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Overview')}</h2>
      </header>
      <div class="slide-body">
        <div class="one-panel-container">
          ${contentHtml}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Layout 5: TWO-PANEL
  // --------------------------------------------------------------------------
  function renderTwoPanelSlide(slide, container) {
    function renderColumn(panel, accentClass) {
      if (!panel) return '<div class="panel-card"></div>';

      if (panel.type === 'image') {
        return `
          <div class="media-frame">
            <img src="${escapeHtml(panel.src || 'media/spain_cafe.svg')}" alt="${escapeHtml(panel.alt || 'Panel')}" onerror="this.src='media/spain_cafe.svg'">
            ${panel.caption ? `<div class="media-caption">${escapeHtml(panel.caption)}</div>` : ''}
          </div>
        `;
      }
      if (panel.type === 'video') {
        return `
          <div class="media-frame">
            <video controls src="${escapeHtml(panel.src || 'media/sample_video.mp4')}">Video</video>
          </div>
        `;
      }

      return `
        <div class="panel-card ${accentClass}">
          <div class="panel-header">
            <h3 class="panel-title">${escapeHtml(panel.title || '')}</h3>
            ${panel.badge ? `<span class="badge ${accentClass === 'panel-accent-left' ? 'lesson-badge' : 'badge-studio'}">${escapeHtml(panel.badge)}</span>` : ''}
          </div>
          ${panel.lead ? `<p style="font-size: 22px; color: #475569; margin-bottom: 0.5rem;">${escapeHtml(panel.lead)}</p>` : ''}
          ${Array.isArray(panel.points) ? `
            <ul class="panel-points">
              ${panel.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
            </ul>
          ` : (panel.body ? `<p style="white-space: pre-line; font-size: 22px; line-height: 1.6;">${escapeHtml(panel.body)}</p>` : '')}
        </div>
      `;
    }

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Comparison</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Two Panels')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-two-panel-grid">
          ${renderColumn(slide.leftPanel, 'panel-accent-left')}
          ${renderColumn(slide.rightPanel, 'panel-accent-right')}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Layout 6: FILL-GAP (Click to Reveal + Single Eye/Eye-Off Toggle Button)
  // --------------------------------------------------------------------------
  function renderFillGapSlide(slide, container) {
    const rawText = slide.gapText || slide.sentence || '';
    
    const gapRegex = /\[(.*?)\]/g;
    let gapIndex = 0;
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = gapRegex.exec(rawText)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', val: rawText.substring(lastIndex, match.index) });
      }
      tokens.push({ type: 'gap', index: gapIndex, answer: match[1] });
      gapIndex++;
      lastIndex = gapRegex.lastIndex;
    }
    if (lastIndex < rawText.length) {
      tokens.push({ type: 'text', val: rawText.substring(lastIndex) });
    }

    state.interactiveStates.totalGapsOnSlide = gapIndex;
    const allRevealed = state.interactiveStates.revealedGaps.size === gapIndex && gapIndex > 0;

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Practice Activity</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Fill in the Blanks')}</h2>
        <div class="slide-instructions-banner">
          ${ICONS.bulb}
          <span>${escapeHtml(slide.instructions || 'Click each blank space to reveal the missing word.')}</span>
        </div>
      </header>
      <div class="slide-body">
        <div class="fill-gap-container">
          <div class="fill-gap-card">
            <p class="gap-sentence" id="gap-sentence-wrapper"></p>
          </div>
          <div class="fill-gap-actions">
            <button id="btn-toggle-gaps" class="btn-action-toggle ${allRevealed ? 'is-active' : ''}">
              <span class="icon">${allRevealed ? ICONS.eyeOff : ICONS.eye}</span>
              <span class="toggle-label">${allRevealed ? 'Hide All' : 'Reveal All'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const sentenceWrapper = container.querySelector('#gap-sentence-wrapper');
    const toggleBtn = container.querySelector('#btn-toggle-gaps');

    tokens.forEach(tok => {
      if (tok.type === 'text') {
        sentenceWrapper.appendChild(document.createTextNode(tok.val));
      } else {
        const isRevealed = state.interactiveStates.revealedGaps.has(tok.index);
        const blank = document.createElement('button');
        blank.className = `gap-blank ${isRevealed ? 'revealed' : ''}`;
        blank.setAttribute('data-gap-idx', tok.index);
        blank.setAttribute('title', isRevealed ? 'Revealed' : 'Click to reveal');
        blank.textContent = isRevealed ? tok.answer : `[ ? ]`;

        blank.addEventListener('click', () => {
          if (!state.interactiveStates.revealedGaps.has(tok.index)) {
            state.interactiveStates.revealedGaps.add(tok.index);
            blank.classList.add('revealed');
            blank.textContent = tok.answer;
            playChime(600);
            updateFillGapToggleState();
          }
        });

        sentenceWrapper.appendChild(blank);
      }
    });

    function updateFillGapToggleState() {
      const isComplete = state.interactiveStates.revealedGaps.size === state.interactiveStates.totalGapsOnSlide;
      toggleBtn.classList.toggle('is-active', isComplete);
      toggleBtn.querySelector('.icon').innerHTML = isComplete ? ICONS.eyeOff : ICONS.eye;
      toggleBtn.querySelector('.toggle-label').textContent = isComplete ? 'Hide All' : 'Reveal All';
    }

    toggleBtn.addEventListener('click', () => {
      const isComplete = state.interactiveStates.revealedGaps.size === state.interactiveStates.totalGapsOnSlide;
      
      if (isComplete) {
        state.interactiveStates.revealedGaps.clear();
        sentenceWrapper.querySelectorAll('.gap-blank').forEach(btn => {
          btn.classList.remove('revealed');
          btn.textContent = `[ ? ]`;
        });
        updateFillGapToggleState();
      } else {
        tokens.filter(t => t.type === 'gap').forEach(tok => state.interactiveStates.revealedGaps.add(tok.index));
        sentenceWrapper.querySelectorAll('.gap-blank').forEach((btn, idx) => {
          const gapTok = tokens.filter(t => t.type === 'gap')[idx];
          if (gapTok) {
            btn.classList.add('revealed');
            btn.textContent = gapTok.answer;
          }
        });
        playChime(750);
        updateFillGapToggleState();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Layout 7: QUESTION (Single Eye/Eye-Off Toggle Button)
  // --------------------------------------------------------------------------
  function renderQuestionSlide(slide, container) {
    const isAnswerRevealed = state.interactiveStates.answerRevealed;

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Quick Question</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Check Your Understanding')}</h2>
        ${slide.instructions ? `
          <div class="slide-instructions-banner">
            ${ICONS.bulb}
            <span>${escapeHtml(slide.instructions)}</span>
          </div>
        ` : ''}
      </header>
      <div class="slide-body">
        <div class="question-container">
          <div class="question-card">
            <div class="question-prompt">
              <span class="question-icon-badge">${ICONS.help}</span>
              <span>${escapeHtml(slide.question || 'What would you say in this situation?')}</span>
            </div>

            <button id="btn-toggle-answer" class="btn-action-toggle ${isAnswerRevealed ? 'is-active' : ''}">
              <span class="icon">${isAnswerRevealed ? ICONS.eyeOff : ICONS.eye}</span>
              <span class="toggle-label">${isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
            </button>

            <div id="answer-box" class="answer-card" style="display: ${isAnswerRevealed ? 'block' : 'none'};">
              <div class="answer-lead">
                ${ICONS.circleCheck}
                <span>Answer & Explanation</span>
              </div>
              <p class="answer-text">${escapeHtml(slide.answer || 'Answer...')}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const toggleBtn = container.querySelector('#btn-toggle-answer');
    const answerBox = container.querySelector('#answer-box');

    toggleBtn.addEventListener('click', () => {
      state.interactiveStates.answerRevealed = !state.interactiveStates.answerRevealed;
      const revealed = state.interactiveStates.answerRevealed;
      answerBox.style.display = revealed ? 'block' : 'none';
      toggleBtn.classList.toggle('is-active', revealed);
      toggleBtn.querySelector('.icon').innerHTML = revealed ? ICONS.eyeOff : ICONS.eye;
      toggleBtn.querySelector('.toggle-label').textContent = revealed ? 'Hide Answer' : 'Reveal Answer';
      if (revealed) playChime(680);
    });
  }

  // --------------------------------------------------------------------------
  // Layout 8: MATCH (Drag and Drop + Touch/Click Fallback)
  // --------------------------------------------------------------------------
  function renderMatchSlide(slide, container) {
    const pairs = slide.pairs || [];

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Matching Activity</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Match Items')}</h2>
        <div class="slide-instructions-banner">
          ${ICONS.bulb}
          <span>${escapeHtml(slide.instructions || 'Drag each item from the left and drop it onto its matching target on the right.')}</span>
        </div>
      </header>
      <div class="slide-body">
        <div class="match-layout-grid">
          <div class="match-column" id="match-sources-col">
            <div class="match-column-title">Phrases / Expressions (Drag or Click)</div>
          </div>
          <div class="match-column" id="match-targets-col">
            <div class="match-column-title">Meanings / Targets (Drop Here)</div>
          </div>
        </div>
      </div>
    `;

    const sourcesCol = container.querySelector('#match-sources-col');
    const targetsCol = container.querySelector('#match-targets-col');

    pairs.forEach((pair) => {
      const isMatched = state.interactiveStates.matchedPairs.has(pair.id);
      const sourceEl = document.createElement('div');
      sourceEl.className = `match-drag-item ${isMatched ? 'matched' : ''}`;
      sourceEl.setAttribute('draggable', !isMatched);
      sourceEl.setAttribute('data-pair-id', pair.id);

      sourceEl.innerHTML = `
        <span class="drag-grip">${ICONS.grip}</span>
        <span>${escapeHtml(pair.source)}</span>
      `;

      sourceEl.addEventListener('dragstart', (e) => {
        sourceEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', pair.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      sourceEl.addEventListener('dragend', () => {
        sourceEl.classList.remove('dragging');
      });

      sourceEl.addEventListener('click', () => {
        if (state.interactiveStates.matchedPairs.has(pair.id)) return;
        sourcesCol.querySelectorAll('.match-drag-item').forEach(el => el.style.borderColor = '');
        state.interactiveStates.selectedMatchSource = pair.id;
        sourceEl.style.borderColor = '#4f46e5';
      });

      sourcesCol.appendChild(sourceEl);
    });

    pairs.forEach((pair) => {
      const isMatched = state.interactiveStates.matchedPairs.has(pair.id);
      const targetEl = document.createElement('div');
      targetEl.className = `match-drop-target ${isMatched ? 'matched-correct' : ''}`;
      targetEl.setAttribute('data-target-id', pair.id);

      targetEl.innerHTML = `
        <span class="match-target-text">${escapeHtml(pair.target)}</span>
        <span class="match-status-badge">${isMatched ? `${ICONS.check} Matched` : 'Drop slot'}</span>
      `;

      targetEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        targetEl.classList.add('drag-over');
      });

      targetEl.addEventListener('dragleave', () => {
        targetEl.classList.remove('drag-over');
      });

      targetEl.addEventListener('drop', (e) => {
        e.preventDefault();
        targetEl.classList.remove('drag-over');
        const droppedId = e.dataTransfer.getData('text/plain');
        handlePairMatch(droppedId, pair.id, targetEl);
      });

      targetEl.addEventListener('click', () => {
        if (state.interactiveStates.selectedMatchSource) {
          handlePairMatch(state.interactiveStates.selectedMatchSource, pair.id, targetEl);
          state.interactiveStates.selectedMatchSource = null;
        }
      });

      targetsCol.appendChild(targetEl);
    });

    function handlePairMatch(sourceId, targetId, targetElement) {
      if (sourceId === targetId) {
        state.interactiveStates.matchedPairs.add(sourceId);
        targetElement.classList.add('matched-correct');
        targetElement.querySelector('.match-status-badge').innerHTML = `${ICONS.check} Matched`;

        const sourceEl = sourcesCol.querySelector(`[data-pair-id="${sourceId}"]`);
        if (sourceEl) {
          sourceEl.classList.add('matched');
          sourceEl.setAttribute('draggable', 'false');
          sourceEl.style.borderColor = '';
        }

        playChime(880);
        showToast('Correct match!', 'success');
      } else {
        targetElement.style.borderColor = '#ef4444';
        targetElement.style.background = '#fef2f2';
        setTimeout(() => {
          targetElement.style.borderColor = '';
          targetElement.style.background = '';
        }, 500);
        showToast('Try again', 'error');
      }
    }
  }

  // --------------------------------------------------------------------------
  // Layout 9: LISTEN (Single Eye/Eye-Off Toggle Button)
  // --------------------------------------------------------------------------
  function renderListenSlide(slide, container) {
    const isBlurred = state.interactiveStates.isTranscriptBlurred;

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Listening Practice</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Listen and Comprehend')}</h2>
        ${slide.instructions ? `
          <div class="slide-instructions-banner">
            ${ICONS.bulb}
            <span>${escapeHtml(slide.instructions)}</span>
          </div>
        ` : ''}
      </header>
      <div class="slide-body">
        <div class="layout-listen-grid">
          <div class="listen-left-col">
            <div class="listen-image-container">
              <img src="${escapeHtml(slide.image || 'media/phone_call.svg')}" alt="${escapeHtml(slide.alt || 'Audio')}" onerror="this.src='media/phone_call.svg'">
            </div>
            <div class="listen-audio-card">
              <span class="listen-audio-label">Audio Track</span>
              <audio controls class="listen-audio-player">
                <source src="${escapeHtml(slide.audioSrc || 'media/quedar_audio.mp3')}" type="audio/mpeg">
                <source src="${escapeHtml(slide.audioSrcWav || 'media/quedar_audio.wav')}" type="audio/wav">
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          <div class="listen-right-col">
            <div class="transcript-wrapper" id="transcript-wrapper">
              <div class="transcript-header">
                <span class="transcript-title">Transcript</span>
                <button id="btn-toggle-blur" class="btn-action-toggle ${!isBlurred ? 'is-active' : ''}">
                  <span class="icon">${isBlurred ? ICONS.eye : ICONS.eyeOff}</span>
                  <span class="toggle-label">${isBlurred ? 'Reveal' : 'Hide'}</span>
                </button>
              </div>

              <div id="transcript-body" class="transcript-body ${isBlurred ? 'is-blurred' : ''}">
                ${escapeHtml(slide.transcript || 'Transcript not available.')}
              </div>

              ${isBlurred ? `
                <div class="transcript-overlay-hint" id="transcript-hint">
                  ${ICONS.eye}
                  <span>Click to reveal transcript</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    const transcriptBody = container.querySelector('#transcript-body');
    const toggleBlurBtn = container.querySelector('#btn-toggle-blur');
    const transcriptHint = container.querySelector('#transcript-hint');

    function toggleBlur() {
      state.interactiveStates.isTranscriptBlurred = !state.interactiveStates.isTranscriptBlurred;
      const blurred = state.interactiveStates.isTranscriptBlurred;
      transcriptBody.classList.toggle('is-blurred', blurred);
      toggleBlurBtn.classList.toggle('is-active', !blurred);
      toggleBlurBtn.querySelector('.icon').innerHTML = blurred ? ICONS.eye : ICONS.eyeOff;
      toggleBlurBtn.querySelector('.toggle-label').textContent = blurred ? 'Reveal' : 'Hide';
      if (transcriptHint) {
        transcriptHint.style.display = blurred ? 'flex' : 'none';
      }
    }

    transcriptBody.addEventListener('click', toggleBlur);
    toggleBlurBtn.addEventListener('click', toggleBlur);
  }

  // --------------------------------------------------------------------------
  // Layout 10: READING
  // --------------------------------------------------------------------------
  function renderReadingSlide(slide, container) {
    const text = slide.readingText || '';
    const paragraphs = text.split('\n\n');
    const vocab = slide.vocabulary || [];

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Reading Comprehension</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Text in Context')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-reading-grid">
          <div class="reading-text-pane">
            ${paragraphs.map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')}
          </div>
          <div class="vocabulary-pane">
            <div class="vocab-pane-header">
              ${ICONS.book}
              <span>Vocabulary & Key Phrases</span>
            </div>
            <div class="vocab-table-wrapper">
              <table class="vocab-table">
                <thead>
                  <tr>
                    <th>Phrase / Word</th>
                    <th>English Translation</th>
                  </tr>
                </thead>
                <tbody>
                  ${vocab.map(item => `
                    <tr>
                      <td class="vocab-word">${escapeHtml(item.word)}</td>
                      <td>${escapeHtml(item.translation)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Layout 11: CONJUGATION
  // --------------------------------------------------------------------------
  function renderConjugationSlide(slide, container) {
    const conj = slide.conjugationData || { headers: [], rows: [] };
    const headers = conj.headers || ['Pronoun', 'Verb Form', 'English', 'Example'];
    const rows = conj.rows || [];

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Grammar & Morphology</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Verb Conjugation')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-conjugation-grid">
          <div class="conjugation-notes-pane">
            <p class="conjugation-lead">${escapeHtml(slide.explanation || 'Explanation of verb usage and reflexive pronouns.')}</p>
            <div class="peninsular-focus-box">
              <strong>Peninsular Spanish Focus:</strong> In Spain, the informal plural <em>vosotros / vosotras</em> is standard and essential for daily communication.
            </div>
          </div>
          <div class="conjugation-table-pane">
            <div class="tense-title-bar">${escapeHtml(conj.tense || 'Conjugation')}</div>
            <table class="conjugation-table">
              <thead>
                <tr>
                  ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${rows.map(row => {
                  const isVosotros = row[0] && row[0].includes('Vosotros');
                  return `
                    <tr class="${isVosotros ? 'verb-vosotros' : ''}">
                      <td><strong>${escapeHtml(row[0] || '')}</strong></td>
                      <td class="verb-form">${escapeHtml(row[1] || '')}</td>
                      <td>${escapeHtml(row[2] || '')}</td>
                      <td><em>${escapeHtml(row[3] || '')}</em></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderUnknownSlide(slide, container) {
    container.innerHTML = `
      <header class="slide-header">
        <h2 class="slide-heading">${escapeHtml(slide.heading || slide.title || 'Slide')}</h2>
      </header>
      <div class="slide-body">
        <div class="one-panel-card">
          <p>Unrecognised slide type: <code>${escapeHtml(slide.type)}</code></p>
          <pre style="font-size: 18px; overflow: auto; background: #f1f5f9; padding: 1rem; border-radius: 8px;">${escapeHtml(JSON.stringify(slide, null, 2))}</pre>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 8. Print Mode Engine (@media print A4 Sheets + Teacher Notes)
  // --------------------------------------------------------------------------
  function buildPrintSheets() {
    DOM.printContainer.innerHTML = '';

    state.slides.forEach((slide, idx) => {
      const page = document.createElement('div');
      page.className = 'print-slide-page';

      const title = slide.title || slide.heading || `Slide ${idx + 1}`;
      
      page.innerHTML = `
        <div class="print-slide-header">
          <span class="print-brand">Lesson Dex • Teacher Handout</span>
          <span class="print-slide-num">Page ${idx + 1} of ${state.slides.length} (${slide.type})</span>
        </div>

        <div class="print-slide-content">
          <h2 style="font-size: 16pt; margin-bottom: 4mm; color: #0f172a;">${escapeHtml(title)}</h2>
          ${renderPrintBody(slide)}
        </div>

        <div class="print-teacher-notes">
          <div class="print-teacher-notes-title">Teacher Notes & Guidance:</div>
          <div class="print-teacher-notes-body">${escapeHtml(slide.notes || 'No teacher notes provided for this slide.')}</div>
        </div>
      `;

      DOM.printContainer.appendChild(page);
    });
  }

  function renderPrintBody(slide) {
    switch (slide.type) {
      case 'intro':
        return `<p style="font-size: 13pt; color: #475569;">${escapeHtml(slide.subtitle || '')}</p>`;
      case 'objectives':
        return `
          <p><strong>${escapeHtml(slide.leftStaticText || 'Objectives:')}</strong></p>
          <ul style="margin-left: 6mm; margin-top: 2mm;">
            ${(slide.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        `;
      case 'homework':
        const hwTasks = slide.tasks || (slide.content && slide.content.tasks) || [];
        return `
          <ol style="margin-left: 6mm; margin-top: 2mm;">
            ${hwTasks.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
          </ol>
          ${slide.tip ? `<p style="margin-top: 3mm; font-style: italic;">${escapeHtml(slide.tip)}</p>` : ''}
        `;
      case 'fill-gap':
        return `<p style="font-size: 12pt; line-height: 1.8;">${escapeHtml(slide.gapText || slide.sentence || '')}</p>`;
      case 'question':
        return `
          <p style="font-size: 12pt; margin-bottom: 4mm;"><strong>Question:</strong> ${escapeHtml(slide.question || '')}</p>
          <div style="background: #f1f5f9; padding: 4mm; border-left: 4px solid #10b981;">
            <strong>Answer:</strong> ${escapeHtml(slide.answer || '')}
          </div>
        `;
      case 'match':
        return `
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 2mm;">Expression</th><th style="padding: 2mm;">Target Meaning</th></tr></thead>
            <tbody>
              ${(slide.pairs || []).map(p => `<tr><td style="padding: 2mm;">${escapeHtml(p.source)}</td><td style="padding: 2mm;">${escapeHtml(p.target)}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      case 'listen':
        return `
          <div style="margin-top: 3mm; padding: 3mm; background: #f8fafc; border: 1px solid #e2e8f0;">
            <strong>Full Dialogue Transcript:</strong>
            <p style="white-space: pre-line; margin-top: 2mm;">${escapeHtml(slide.transcript || '')}</p>
          </div>
        `;
      case 'reading':
        return `
          <div style="font-size: 11pt; line-height: 1.6; margin-bottom: 4mm;">
            ${(slide.readingText || '').replace(/\n/g, '<br>')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 1.5mm;">Word</th><th style="padding: 1.5mm;">Translation</th></tr></thead>
            <tbody>
              ${(slide.vocabulary || []).map(v => `<tr><td style="padding: 1.5mm;"><strong>${escapeHtml(v.word)}</strong></td><td style="padding: 1.5mm;">${escapeHtml(v.translation)}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      case 'conjugation':
        const rows = (slide.conjugationData && slide.conjugationData.rows) || [];
        return `
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 1.5mm;">Pronoun</th><th style="padding: 1.5mm;">Form</th><th style="padding: 1.5mm;">Translation</th><th style="padding: 1.5mm;">Example</th></tr></thead>
            <tbody>
              ${rows.map(r => `<tr><td style="padding: 1.5mm;">${escapeHtml(r[0])}</td><td style="padding: 1.5mm;"><strong>${escapeHtml(r[1])}</strong></td><td style="padding: 1.5mm;">${escapeHtml(r[2])}</td><td style="padding: 1.5mm;">${escapeHtml(r[3])}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      default:
        return `<p>${escapeHtml(JSON.stringify(slide.content || {}))}</p>`;
    }
  }

  // --------------------------------------------------------------------------
  // 9. Lesson Builder Studio (Maker Mode)
  // --------------------------------------------------------------------------
  function openStudio() {
    DOM.studioEditor.value = JSON.stringify(state.slides, null, 2);
    DOM.studioModal.classList.remove('hidden');
    DOM.studioFeedbackText.textContent = `Editing ${state.slides.length} slides. Press 'Apply to Player' to update.`;
    DOM.studioFeedback.querySelector('.status-indicator').className = 'status-indicator ready';
    DOM.studioEditor.focus();
  }

  function closeStudio() {
    DOM.studioModal.classList.add('hidden');
  }

  function prettifyStudioJSON() {
    try {
      const parsed = JSON.parse(DOM.studioEditor.value);
      DOM.studioEditor.value = JSON.stringify(parsed, null, 2);
      setStudioStatus('JSON formatted successfully.', true);
      showToast('JSON formatted', 'success');
    } catch (err) {
      setStudioStatus(`JSON syntax error: ${err.message}`, false);
      showToast('Invalid JSON syntax', 'error');
    }
  }

  function applyStudioJSON() {
    try {
      const parsed = JSON.parse(DOM.studioEditor.value);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON must be an array containing at least one slide.');
      }

      parsed.forEach((s, idx) => {
        if (!s.type) throw new Error(`Slide at index ${idx} is missing the required 'type' property.`);
      });

      setLessonData(parsed);
      setStudioStatus('Lesson updated and applied to the player successfully!', true);
      showToast('Lesson updated successfully', 'success');
      closeStudio();
    } catch (err) {
      setStudioStatus(`Error applying JSON: ${err.message}`, false);
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  function exportStudioJSON() {
    try {
      const jsonContent = DOM.studioEditor.value || JSON.stringify(state.slides, null, 2);
      JSON.parse(jsonContent);

      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lesson.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Exporting lesson.json', 'success');
    } catch (err) {
      showToast(`Cannot export invalid JSON: ${err.message}`, 'error');
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      try {
        const text = evt.target.result;
        const parsed = JSON.parse(text);
        DOM.studioEditor.value = JSON.stringify(parsed, null, 2);
        setStudioStatus(`File '${file.name}' loaded into editor.`, true);
        showToast(`Loaded: ${file.name}`, 'success');
      } catch (err) {
        setStudioStatus(`Invalid file format: ${err.message}`, false);
        showToast('File does not contain valid JSON', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function resetToDefaultLesson() {
    if (state.defaultLessonData) {
      setLessonData(JSON.parse(JSON.stringify(state.defaultLessonData)));
      setStudioStatus('Default lesson restored.', true);
      showToast('Default lesson restored', 'success');
    }
  }

  function setStudioStatus(msg, isSuccess) {
    DOM.studioFeedbackText.textContent = msg;
    const indicator = DOM.studioFeedback.querySelector('.status-indicator');
    indicator.className = `status-indicator ${isSuccess ? 'ready' : 'error'}`;
  }

  // --------------------------------------------------------------------------
  // 10. Fullscreen & Print Triggers
  // --------------------------------------------------------------------------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        state.isFullscreen = true;
        DOM.fullscreenIcon.innerHTML = ICONS.minimize;
        DOM.stageCanvas.classList.add('is-fullscreen');
        DOM.stageWrapper.classList.add('is-fullscreen-wrapper');
      }).catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        state.isFullscreen = false;
        DOM.fullscreenIcon.innerHTML = ICONS.maximize;
        DOM.stageCanvas.classList.remove('is-fullscreen');
        DOM.stageWrapper.classList.remove('is-fullscreen-wrapper');
      });
    }
  }

  function triggerPrint() {
    buildPrintSheets();
    window.print();
  }

  // --------------------------------------------------------------------------
  // 11. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? ICONS.circleCheck : (type === 'error' ? ICONS.warning : ICONS.bulb);
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  function playChime(freq = 520) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {
      // Audio context silenced or blocked
    }
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str ?? '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 12. Keyboard Shortcuts & Global Event Listeners
  // --------------------------------------------------------------------------
  function initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      resetAutoHideTimer();

      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') closeStudio();
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(state.slides.length - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          togglePinUI();
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          if (DOM.studioModal.classList.contains('hidden')) {
            openStudio();
          } else {
            closeStudio();
          }
          break;
        case 'p':
        case 'P':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            triggerPrint();
          }
          break;
        case '?':
          e.preventDefault();
          DOM.shortcutsModal.classList.remove('hidden');
          break;
        case 'Escape':
          DOM.studioModal.classList.add('hidden');
          DOM.shortcutsModal.classList.add('hidden');
          break;
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const isFull = !!document.fullscreenElement;
      state.isFullscreen = isFull;
      DOM.fullscreenIcon.innerHTML = isFull ? ICONS.minimize : ICONS.maximize;
      DOM.stageCanvas.classList.toggle('is-fullscreen', isFull);
      DOM.stageWrapper.classList.toggle('is-fullscreen-wrapper', isFull);
    });

    // Auto-hide mouse move & edge sensor listeners
    window.addEventListener('mousemove', (e) => {
      resetAutoHideTimer();
    });

    // Hover tracking for floating bars to avoid hiding while teacher is interacting
    DOM.appHeader.addEventListener('mouseenter', () => { state.isMouseOverBars = true; });
    DOM.appHeader.addEventListener('mouseleave', () => { state.isMouseOverBars = false; resetAutoHideTimer(); });
    DOM.progressionBar.addEventListener('mouseenter', () => { state.isMouseOverBars = true; });
    DOM.progressionBar.addEventListener('mouseleave', () => { state.isMouseOverBars = false; resetAutoHideTimer(); });
  }

  function initUIEventListeners() {
    // Navigation Arrows
    DOM.stagePrevBtn.addEventListener('click', prevSlide);
    DOM.stageNextBtn.addEventListener('click', nextSlide);
    DOM.footerPrevBtn.addEventListener('click', prevSlide);
    DOM.footerNextBtn.addEventListener('click', nextSlide);

    // Header buttons
    DOM.btnAutohideToggle.addEventListener('click', togglePinUI);
    DOM.btnFullscreen.addEventListener('click', toggleFullscreen);
    DOM.btnPrint.addEventListener('click', triggerPrint);
    DOM.btnStudioToggle.addEventListener('click', openStudio);
    DOM.btnShortcuts.addEventListener('click', () => DOM.shortcutsModal.classList.remove('hidden'));

    // Studio controls
    DOM.studioCloseBtn.addEventListener('click', closeStudio);
    DOM.studioResetBtn.addEventListener('click', resetToDefaultLesson);
    DOM.studioFormatBtn.addEventListener('click', prettifyStudioJSON);
    DOM.studioApplyBtn.addEventListener('click', applyStudioJSON);
    DOM.studioExportBtn.addEventListener('click', exportStudioJSON);
    DOM.studioFileInput.addEventListener('change', handleFileUpload);

    // Shortcuts modal close
    DOM.shortcutsCloseBtn.addEventListener('click', () => DOM.shortcutsModal.classList.add('hidden'));

    DOM.studioModal.addEventListener('click', (e) => {
      if (e.target === DOM.studioModal) closeStudio();
    });
    DOM.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === DOM.shortcutsModal) DOM.shortcutsModal.classList.add('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 13. Embedded Fallback Data
  // --------------------------------------------------------------------------
  function getEmbeddedFallbackLesson() {
    return [
      {
        "slideId": "slide-01",
        "type": "intro",
        "title": "Los Secretos del Verbo «Quedar»",
        "subtitle": "Guía práctica de uso coloquial, matices esenciales y expresiones clave en España",
        "backgroundImage": "media/madrid_puerta_sol.svg",
        "badge": "Español Peninsular • Nivel B1-B2",
        "notes": "Teacher notes: Introduce the learning goals. Mention that 'quedar' is one of the top 5 most versatile verbs in Spain."
      },
      {
        "slideId": "slide-02",
        "type": "objectives",
        "heading": "Objetivos de la Sesión",
        "leftStaticText": "Hoy en clase seremos capaces de:",
        "items": [
          "Diferenciar con precisión entre «quedar» (hacer planes, restar) y «quedarse» (permanecer).",
          "Proponer planes naturales y concertar citas como un auténtico madrileño («quedar con / en»).",
          "Opinar sobre cómo sienta la ropa o un peinado usando «quedar bien / mal / genial».",
          "Conjugar con soltura el presente y pretérito indefinido con pronombre reflexivo («vosotros os quedáis»)."
        ],
        "image": "media/spain_cafe.svg",
        "alt": "Cafetería tradicional con terraza en Madrid",
        "caption": "Contexto comunicativo: vida social y planes cotidianos en Madrid",
        "notes": "Teacher notes: Gauge students' prior knowledge of pronominal verbs."
      },
      {
        "slideId": "slide-03",
        "type": "one-panel",
        "heading": "1. Quedar con alguien (Hacer planes y citas)",
        "panelType": "text",
        "content": {
          "tag": "Uso Coloquial Principal",
          "lead": "En España casi nunca se usa «encontrarse con» para citas personales. Se dice siempre «quedar con».",
          "formula": "Fórmula: Quedar + con + [persona] + para + [actividad] / a las + [hora]",
          "dialogue": [
            "— Oye Javi, ¿quedamos este sábado por la tarde para tomar unas cañas?",
            "— ¡Venga, hecho! ¿Dónde quedamos?",
            "— Quedamos a las siete en la estatua del Oso y el Madroño."
          ],
          "caution": "¡Cuidado! No confundir con 'conocer a alguien' (primera vez) ni 'reunirse' (ámbito laboral o formal)."
        },
        "notes": "Teacher notes: Emphasize that 'quedar con' implies agreed rendezvous."
      },
      {
        "slideId": "slide-04",
        "type": "two-panel",
        "heading": "2. Contraste Esencial: Quedar vs. Quedarse",
        "leftPanel": {
          "type": "text",
          "title": "«Quedar» (Sin pronombre)",
          "badge": "Acción no reflexiva",
          "points": [
            "Citarse / Concertar plan: «He quedado con Lucía a las 18:00.»",
            "Estar disponible o restar cantidad: «¿Queda leche en la nevera?» — «No, no queda nada.»",
            "Ajuste estético / ropa: «Esa camisa te queda como un guante.»",
            "Llegar a un acuerdo: «¿En qué quedamos entonces?»"
          ]
        },
        "rightPanel": {
          "type": "text",
          "title": "«Quedarse» (Pronominal / Reflexivo)",
          "badge": "Permanencia o cambio de estado",
          "points": [
            "Permanecer en un sitio: «Hoy llueve mucho, me quedo en casa estudiando.»",
            "Quedarse sin (agotarse algo a alguien): «Me he quedado sin batería en el móvil.»",
            "Cambio de estado emocional o mental: «Al oír la noticia se quedó boquiabierto.»",
            "Apropiarse o elegir: «Entre los dos abrigos, me quedo con el azul.»"
          ]
        },
        "notes": "Teacher notes: Key distinction. Contrast 'quedar' and 'quedarse'."
      },
      {
        "slideId": "slide-05",
        "type": "reading",
        "heading": "3. Lectura Guiada: Un sábado por La Latina",
        "readingText": "Eran casi las doce de la mañana cuando sonó el teléfono. Era Carmen: «¿Quedamos en La Latina? Hace un día primaveral estupendo y el Rastro está a tope de ambiente». Como no tenía planes urgentes, acepté encantado.\n\nQuedamos justo en la salida de metro de Tirso de Molina. Carmen venía con su amiga Bea, a quien no veía desde hace meses. Decidimos buscar una mesa al sol en la Plaza de la Paja para pedir unos pinchos de tortilla.\n\nAl pedir la cuenta, le pregunté al camarero si le quedaba postre casero. Nos dijo con una sonrisa: «Lo siento, no nos queda flan, pero os queda un trozo de tarta de la abuela riquísimo». Nos quedamos en la terraza hasta las cinco de la tarde hablando de viajes.\n\nAntes de despedirnos, Bea nos enseñó una cazadora de cuero que acababa de comprar en una tienda de segunda mano: «¿Cómo me queda? ¿Pensáis que es demasiado llamativa?». Carmen exclamó: «¡Te queda genial, parece hecha a medida!». Al final, todos nos quedamos con ganas de repetir el plan el próximo fin de semana.",
        "vocabulary": [
          { "word": "Estar a tope", "translation": "To be packed / full of energy" },
          { "word": "No nos queda...", "translation": "We don't have any left / We ran out of" },
          { "word": "¿Cómo me queda?", "translation": "How does it look on me? / How does it fit me?" },
          { "word": "Te queda genial", "translation": "It suits you wonderfully" },
          { "word": "Quedarse con ganas", "translation": "To be left wanting more / eager to repeat" },
          { "word": "Terraza", "translation": "Outdoor street seating area of a bar" }
        ],
        "notes": "Teacher notes: Ask students to identify each distinct meaning of quedar used in the text."
      },
      {
        "slideId": "slide-06",
        "type": "fill-gap",
        "heading": "4. Práctica Interactiva: Rellena los huecos",
        "instructions": "Haz clic sobre cada hueco vacío para revelar la forma correcta y su justificación.",
        "gapText": "Ayer [quedé] con Carlos en el centro para comer. Fuimos a la tienda de deportes y las zapatillas rojas le [quedaban] perfectas, pero solo [quedaba] un par de su talla. Después, como estábamos cansadísimos, yo me [quedé] en casa viendo una película y nos [quedamos] dormidos a mitad del documental.",
        "notes": "Teacher notes: Have students justify why the reflexive form is used in each case before clicking."
      },
      {
        "slideId": "slide-07",
        "type": "question",
        "heading": "5. Pregunta Rápida de Comprensión",
        "instructions": "Lee la situación cotidiana, debate tu respuesta con tu compañero y pulsa el botón para verificar.",
        "question": "Tu compañero de piso aparece con unas gafas de sol nuevas y te pregunta: «¿Qué tal? ¿Cómo las ves?». Quieres decirle que le sientan fenomenal y favorecen su rostro. ¿Qué frase es la más idiomática en España?",
        "answer": "«¡Te quedan genial!» o «¡Te quedan de cine / de maravilla!». En España empleamos el verbo 'quedar' como verbo tipo gustar para indicar si una prenda o complemento favorece a alguien.",
        "notes": "Teacher notes: Point out that 'quedar bien/mal' works syntactically like 'gustar'."
      },
      {
        "slideId": "slide-08",
        "type": "conjugation",
        "heading": "6. Tabla de Conjugación: «Quedarse»",
        "explanation": "«Quedar» es un verbo regular de la 1ª conjugación (-ar). Cuando funciona como verbo pronominal («quedarse»), el pronombre reflexivo concuerda siempre con el sujeto. En España es fundamental el uso de «vosotros/as os quedáis».",
        "conjugationData": {
          "tense": "Presente de Indicativo (Quedarse)",
          "headers": ["Pronombre Sujeto", "Pronombre Reflexivo + Verbo", "Equivalente en Inglés", "Ejemplo Práctico"],
          "rows": [
            ["Yo", "me quedo", "I stay", "Yo me quedo aquí esperándote."],
            ["Tú", "te quedas", "you stay (informal sing.)", "¿Te quedas a cenar con nosotros?"],
            ["Él / Ella / Usted", "se queda", "he/she stays, you stay (formal)", "Don Manuel se queda en el hotel."],
            ["Nosotros / Nosotras", "nos quedamos", "we stay", "Nos quedamos hasta las once."],
            ["Vosotros / Vosotras", "os quedáis", "you all stay (Spain informal)", "¿Vosotros os quedáis a la fiesta?"],
            ["Ellos / Ellas / Ustedes", "se quedan", "they stay, you all stay", "Ellos se quedan sin palabras."]
          ]
        },
        "notes": "Teacher notes: Highlight the accent on 'quedáis' for vosotros."
      },
      {
        "slideId": "slide-09",
        "type": "listen",
        "heading": "7. Comprensión Auditiva: Conversación en Madrid",
        "instructions": "Escucha la llamada telefónica entre dos amigos y haz clic en el recuadro difuminado para consultar la transcripción.",
        "audioSrc": "media/quedar_audio.mp3",
        "audioSrcWav": "media/quedar_audio.wav",
        "image": "media/phone_call.svg",
        "alt": "Javi y Carmen hablando por teléfono sobre sus planes de noche",
        "transcript": "— ¡Hola Javi! Oye, ¿al final qué hacemos esta noche? ¿Quedamos en tu casa o en el centro de Madrid?\n— ¡Hola Carmen! Pues mira, mejor quedamos en Alonso Martínez sobre las ocho y media. Es que todavía me queda por terminar un informe de la oficina.\n— Perfecto. Por cierto, ¿queda sitio en el coche de Marcos para ir a la cena?\n— Sí, no te preocupes, le quedan dos plazas libres. ¡Hasta luego y nos vemos allí!",
        "notes": "Teacher notes: Play audio twice before revealing transcript."
      },
      {
        "slideId": "slide-10",
        "type": "match",
        "heading": "8. Emparejamiento: ¿Qué significa «Quedar»?",
        "instructions": "Arrastra cada frase de la columna izquierda y suéltala sobre su significado exacto en la columna derecha.",
        "pairs": [
          {
            "id": "pair-1",
            "source": "Ayer quedé con Marta para merendar churros.",
            "target": "Citarse o reunirse con una persona."
          },
          {
            "id": "pair-2",
            "source": "Ese vestido verde te queda sensacional.",
            "target": "Sentar bien o favorecer una prenda de ropa."
          },
          {
            "id": "pair-3",
            "source": "¿Queda tortilla de patatas o se la han comido?",
            "target": "Restar o sobrar una cantidad de algo."
          },
          {
            "id": "pair-4",
            "source": "Al escuchar el truco de magia se quedó boquiabierto.",
            "target": "Experimentar un cambio de estado repentino."
          },
          {
            "id": "pair-5",
            "source": "¿En qué quedamos sobre la hora de salida?",
            "target": "Llegar a un acuerdo o resolución mutua."
          }
        ],
        "notes": "Teacher notes: Check student pairing accuracy and have them create sentences for each meaning."
      },
      {
        "slideId": "slide-11",
        "type": "homework",
        "heading": "9. Tarea para Casa (Deberes)",
        "badge": "Entrega: Próximo Lunes 23:59h",
        "title": "Redacción y Grabación: Plan de Fin de Semana en Madrid",
        "tasks": [
          "Escribe un diálogo de 8 a 10 intercambios entre dos amigos españoles organizando un plan de sábado.",
          "Debes incluir obligatoriamente al menos 4 usos diferentes de 'quedar' / 'quedarse' estudiados en clase.",
          "Subraya cada uso y anota al margen su significado (reunirse, sentar bien, restar, quedarse en casa).",
          "Graba un audio de 1 minuto leyendo el diálogo con entonación natural y súbelo a la plataforma."
        ],
        "tip": "Consejo lingüístico: Incluye expresiones como «¿A qué hora quedamos?», «No me queda saldo» o «Te queda genial».",
        "image": "media/homework_study.svg",
        "alt": "Checklist de deberes de español",
        "notes": "Teacher notes: Assessment criteria: grammar accuracy (30%), variety of 'quedar' uses (40%), oral presentation (30%)."
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 14. Initialization Bootstrapper
  // --------------------------------------------------------------------------
  function init() {
    initKeyboardListeners();
    initUIEventListeners();
    loadInitialLesson();
    resetAutoHideTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
