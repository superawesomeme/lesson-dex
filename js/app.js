/**
 * ============================================================================
 * LESSON DEX - PRESENTATION PLAYER & STUDIO ENGINE
 * Strict Vanilla JavaScript (ES6+)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Application State
  // --------------------------------------------------------------------------
  const state = {
    slides: [],
    currentIndex: 0,
    defaultLessonData: null,
    isFullscreen: false,
    interactiveStates: {
      revealedGaps: new Set(),
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
    // Header
    lessonTitle: document.getElementById('header-lesson-title'),
    slideHeading: document.getElementById('header-slide-name'),
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
  // 3. Lesson Data Loader (Fetch with Embedded Fallback)
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
      console.warn('Could not fetch lesson.json directly (likely offline file:// context). Loading embedded fallback...', err);
      // Robust fallback dataset matching lesson.json
      const fallback = getEmbeddedFallbackLesson();
      state.defaultLessonData = JSON.parse(JSON.stringify(fallback));
      setLessonData(fallback);
    }
  }

  function setLessonData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      showToast('El archivo JSON debe contener un array no vacío de diapositivas.', 'error');
      return false;
    }

    state.slides = data;
    state.currentIndex = 0;
    resetInteractiveStates();

    // Update Studio Editor content
    DOM.studioEditor.value = JSON.stringify(state.slides, null, 2);

    // Build Progression Track & Print Sheets
    buildProgressionTrack();
    buildPrintSheets();

    // Render First Slide
    renderCurrentSlide();
    showToast(`Lección cargada (${state.slides.length} diapositivas)`, 'success');
    return true;
  }

  function resetInteractiveStates() {
    state.interactiveStates.revealedGaps.clear();
    state.interactiveStates.answerRevealed = false;
    state.interactiveStates.matchedPairs.clear();
    state.interactiveStates.selectedMatchSource = null;
    state.interactiveStates.isTranscriptBlurred = true;
  }

  // --------------------------------------------------------------------------
  // 4. Navigation System
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
  // 5. Progression Track Rendering & UI Sync
  // --------------------------------------------------------------------------
  function buildProgressionTrack() {
    DOM.progressionTrack.innerHTML = '';

    state.slides.forEach((slide, idx) => {
      const stepBtn = document.createElement('button');
      stepBtn.className = 'track-step';
      stepBtn.setAttribute('role', 'tab');
      stepBtn.setAttribute('aria-selected', idx === state.currentIndex ? 'true' : 'false');
      
      const title = slide.title || slide.heading || `Diapositiva ${idx + 1}`;
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

    // Counter badge and type tag
    DOM.slideCounter.textContent = `Diapositiva ${current + 1} / ${total}`;
    DOM.slideTypeTag.textContent = currentSlide.type;

    // Header Slide title
    const titleText = currentSlide.title || currentSlide.heading || `Diapositiva ${current + 1}`;
    DOM.slideHeading.textContent = `${current + 1}. ${titleText}`;

    // Prev / Next button states
    const isFirst = current === 0;
    const isLast = current === total - 1;

    DOM.stagePrevBtn.disabled = isFirst;
    DOM.footerPrevBtn.disabled = isFirst;

    DOM.stageNextBtn.disabled = isLast;
    DOM.footerNextBtn.disabled = isLast;

    // Update track steps active/visited classes
    const stepElements = DOM.progressionTrack.querySelectorAll('.track-step');
    stepElements.forEach((step, idx) => {
      step.classList.toggle('is-active', idx === current);
      step.classList.toggle('is-visited', idx < current);
      step.setAttribute('aria-selected', idx === current ? 'true' : 'false');
    });
  }

  // --------------------------------------------------------------------------
  // 6. Slide Render Engine (The 11 Layouts)
  // Notes data is STRICTLY excluded from the DOM in Player Mode!
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
    title.textContent = slide.title || 'Título de la Lección';
    overlay.appendChild(title);

    if (slide.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'intro-subtitle';
      subtitle.textContent = slide.subtitle;
      overlay.appendChild(subtitle);
    }

    const hint = document.createElement('div');
    hint.className = 'intro-start-hint';
    hint.innerHTML = '<span>Pulsa</span> <kbd>→</kbd> <span>o</span> <kbd>Espacio</kbd> <span>para comenzar</span>';
    overlay.appendChild(hint);

    container.appendChild(overlay);
  }

  // --------------------------------------------------------------------------
  // Layout 2: OBJECTIVES
  // --------------------------------------------------------------------------
  function renderObjectivesSlide(slide, container) {
    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Metas de Aprendizaje</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Objetivos de la Sesión')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-objectives-grid">
          <div class="objectives-card">
            <div class="objectives-lead">
              <span>🎯</span>
              <span>${escapeHtml(slide.leftStaticText || 'Today we will...')}</span>
            </div>
            <ul class="objectives-list">
              ${(slide.items || []).map(item => `
                <li>
                  <span class="objective-check-icon">✓</span>
                  <span>${escapeHtml(item)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="media-frame">
            <img src="${escapeHtml(slide.image || 'media/spain_cafe.svg')}" alt="${escapeHtml(slide.alt || 'Objetivos')}" onerror="this.src='media/spain_cafe.svg'">
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
    const badge = slide.badge || (slide.content && slide.content.badge) || 'Tarea Asignada';
    const title = slide.title || (slide.content && slide.content.title) || 'Deberes para la próxima clase';
    const tip = slide.tip || (slide.content && slide.content.tip) || '';

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Trabajo Autónomo</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Tarea para Casa')}</h2>
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
            ${tip ? `<div class="homework-tip">💡 ${escapeHtml(tip)}</div>` : ''}
          </div>
          <div class="media-frame">
            <img src="${escapeHtml(slide.image || 'media/homework_study.svg')}" alt="${escapeHtml(slide.alt || 'Deberes')}" onerror="this.src='media/homework_study.svg'">
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
            Tu navegador no soporta reproducción de vídeo HTML5.
          </video>
        </div>
      `;
    } else {
      // Default text card
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
          ${c.caution ? `<div class="caution-note">⚠️ ${escapeHtml(c.caution)}</div>` : ''}
        </div>
      `;
    }

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Concepto Central</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Panel Principal')}</h2>
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
            <video controls src="${escapeHtml(panel.src || 'media/sample_video.mp4')}">Vídeo</video>
          </div>
        `;
      }

      // Default: text panel
      return `
        <div class="panel-card ${accentClass}">
          <div class="panel-header">
            <h3 class="panel-title">${escapeHtml(panel.title || '')}</h3>
            ${panel.badge ? `<span class="badge ${accentClass === 'panel-accent-left' ? 'lesson-badge' : 'badge-studio'}">${escapeHtml(panel.badge)}</span>` : ''}
          </div>
          ${panel.lead ? `<p style="font-size: 0.9rem; color: #475569; margin-bottom: 0.4rem;">${escapeHtml(panel.lead)}</p>` : ''}
          ${Array.isArray(panel.points) ? `
            <ul class="panel-points">
              ${panel.points.map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
            </ul>
          ` : (panel.body ? `<p style="white-space: pre-line; font-size: 0.9rem; line-height: 1.6;">${escapeHtml(panel.body)}</p>` : '')}
        </div>
      `;
    }

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Comparativa y Análisis</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Dos Perspectivas')}</h2>
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
  // Layout 6: FILL-GAP (Click to Reveal Interactive)
  // --------------------------------------------------------------------------
  function renderFillGapSlide(slide, container) {
    const rawText = slide.gapText || slide.sentence || '';
    
    // Parse words enclosed in brackets [word]
    const gapRegex = /\[(.*?)\]/g;
    let gapIndex = 0;
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = gapRegex.exec(rawText)) !== null) {
      // Text before gap
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

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Ejercicio Práctico</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Rellena los huecos')}</h2>
        <div class="slide-instructions-banner">
          <span>💡</span>
          <span>${escapeHtml(slide.instructions || 'Haz clic en cada hueco para desvelar la palabra oculta.')}</span>
        </div>
      </header>
      <div class="slide-body">
        <div class="fill-gap-container">
          <div class="fill-gap-card">
            <p class="gap-sentence" id="gap-sentence-wrapper"></p>
          </div>
          <div class="fill-gap-actions">
            <button id="btn-reveal-all-gaps" class="btn btn-sm btn-outline">
              <span>👁️ Desvelar Todos</span>
            </button>
            <button id="btn-reset-gaps" class="btn btn-sm btn-secondary">
              <span>🔄 Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const sentenceWrapper = container.querySelector('#gap-sentence-wrapper');
    tokens.forEach(tok => {
      if (tok.type === 'text') {
        sentenceWrapper.appendChild(document.createTextNode(tok.val));
      } else {
        const isRevealed = state.interactiveStates.revealedGaps.has(tok.index);
        const blank = document.createElement('button');
        blank.className = `gap-blank ${isRevealed ? 'revealed' : ''}`;
        blank.setAttribute('data-gap-idx', tok.index);
        blank.setAttribute('title', isRevealed ? 'Palabra desvelada' : 'Haz clic para descubrir');
        blank.textContent = isRevealed ? tok.answer : `[ ? ]`;

        blank.addEventListener('click', () => {
          if (!state.interactiveStates.revealedGaps.has(tok.index)) {
            state.interactiveStates.revealedGaps.add(tok.index);
            blank.classList.add('revealed');
            blank.textContent = tok.answer;
            playChime(600);
          }
        });

        sentenceWrapper.appendChild(blank);
      }
    });

    // Reveal All button
    container.querySelector('#btn-reveal-all-gaps').addEventListener('click', () => {
      tokens.filter(t => t.type === 'gap').forEach(tok => state.interactiveStates.revealedGaps.add(tok.index));
      sentenceWrapper.querySelectorAll('.gap-blank').forEach((btn, idx) => {
        const gapTok = tokens.filter(t => t.type === 'gap')[idx];
        if (gapTok) {
          btn.classList.add('revealed');
          btn.textContent = gapTok.answer;
        }
      });
      playChime(750);
    });

    // Reset button
    container.querySelector('#btn-reset-gaps').addEventListener('click', () => {
      state.interactiveStates.revealedGaps.clear();
      sentenceWrapper.querySelectorAll('.gap-blank').forEach(btn => {
        btn.classList.remove('revealed');
        btn.textContent = `[ ? ]`;
      });
    });
  }

  // --------------------------------------------------------------------------
  // Layout 7: QUESTION
  // --------------------------------------------------------------------------
  function renderQuestionSlide(slide, container) {
    const isAnswerRevealed = state.interactiveStates.answerRevealed;

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Pregunta Rápida</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Pregunta de Comprensión')}</h2>
        ${slide.instructions ? `
          <div class="slide-instructions-banner">
            <span>🤔</span>
            <span>${escapeHtml(slide.instructions)}</span>
          </div>
        ` : ''}
      </header>
      <div class="slide-body">
        <div class="question-container">
          <div class="question-card">
            <div class="question-prompt">
              <span class="question-mark-icon">?</span>
              <span>${escapeHtml(slide.question || '¿Qué dirías en esta situación?')}</span>
            </div>

            <button id="btn-toggle-answer" class="reveal-answer-btn">
              <span>${isAnswerRevealed ? '🙈 Ocultar Respuesta' : '✨ Revelar Respuesta'}</span>
            </button>

            <div id="answer-box" class="answer-card" style="display: ${isAnswerRevealed ? 'block' : 'none'};">
              <div class="answer-lead">
                <span>✅</span>
                <span>Respuesta y Explicación</span>
              </div>
              <p class="answer-text">${escapeHtml(slide.answer || 'Respuesta...')}</p>
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
      toggleBtn.innerHTML = `<span>${revealed ? '🙈 Ocultar Respuesta' : '✨ Revelar Respuesta'}</span>`;
      if (revealed) playChime(680);
    });
  }

  // --------------------------------------------------------------------------
  // Layout 8: MATCH (HTML5 Drag and Drop + Touch/Click Fallback)
  // --------------------------------------------------------------------------
  function renderMatchSlide(slide, container) {
    const pairs = slide.pairs || [];

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Actividad de Asociación</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Emparejar Elementos')}</h2>
        <div class="slide-instructions-banner">
          <span>🎯</span>
          <span>${escapeHtml(slide.instructions || 'Arrastra cada frase de la izquierda a su significado correspondiente en la derecha.')}</span>
        </div>
      </header>
      <div class="slide-body">
        <div class="match-layout-grid">
          <div class="match-column" id="match-sources-col">
            <div class="match-column-title">Expresiones / Frases (Arrastra o pulsa)</div>
          </div>
          <div class="match-column" id="match-targets-col">
            <div class="match-column-title">Significados / Destinos (Suelta aquí)</div>
          </div>
        </div>
      </div>
    `;

    const sourcesCol = container.querySelector('#match-sources-col');
    const targetsCol = container.querySelector('#match-targets-col');

    // Build Draggable Sources
    pairs.forEach((pair) => {
      const isMatched = state.interactiveStates.matchedPairs.has(pair.id);
      const sourceEl = document.createElement('div');
      sourceEl.className = `match-drag-item ${isMatched ? 'matched' : ''}`;
      sourceEl.setAttribute('draggable', !isMatched);
      sourceEl.setAttribute('data-pair-id', pair.id);

      sourceEl.innerHTML = `
        <span class="drag-grip">⋮⋮</span>
        <span>${escapeHtml(pair.source)}</span>
      `;

      // HTML5 Drag Event Handlers
      sourceEl.addEventListener('dragstart', (e) => {
        sourceEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', pair.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      sourceEl.addEventListener('dragend', () => {
        sourceEl.classList.remove('dragging');
      });

      // Click-to-pair fallback
      sourceEl.addEventListener('click', () => {
        if (state.interactiveStates.matchedPairs.has(pair.id)) return;
        sourcesCol.querySelectorAll('.match-drag-item').forEach(el => el.style.borderColor = '');
        state.interactiveStates.selectedMatchSource = pair.id;
        sourceEl.style.borderColor = '#4f46e5';
      });

      sourcesCol.appendChild(sourceEl);
    });

    // Build Drop Targets
    pairs.forEach((pair) => {
      const isMatched = state.interactiveStates.matchedPairs.has(pair.id);
      const targetEl = document.createElement('div');
      targetEl.className = `match-drop-target ${isMatched ? 'matched-correct' : ''}`;
      targetEl.setAttribute('data-target-id', pair.id);

      targetEl.innerHTML = `
        <span class="match-target-text">${escapeHtml(pair.target)}</span>
        <span class="match-status-badge">${isMatched ? '✅ Correcto' : '⭕ Arrastra aquí'}</span>
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

      // Click-to-pair fallback drop trigger
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
        targetElement.querySelector('.match-status-badge').textContent = '✅ Correcto';

        const sourceEl = sourcesCol.querySelector(`[data-pair-id="${sourceId}"]`);
        if (sourceEl) {
          sourceEl.classList.add('matched');
          sourceEl.setAttribute('draggable', 'false');
          sourceEl.style.borderColor = '';
        }

        playChime(880);
        showToast('¡Emparejamiento correcto!', 'success');
      } else {
        // Mismatch shake feedback
        targetElement.style.borderColor = '#ef4444';
        targetElement.style.background = '#fef2f2';
        setTimeout(() => {
          targetElement.style.borderColor = '';
          targetElement.style.background = '';
        }, 500);
        showToast('Inténtalo de nuevo', 'error');
      }
    }
  }

  // --------------------------------------------------------------------------
  // Layout 9: LISTEN
  // --------------------------------------------------------------------------
  function renderListenSlide(slide, container) {
    const isBlurred = state.interactiveStates.isTranscriptBlurred;

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Comprensión Auditiva</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Escucha y Comprende')}</h2>
        ${slide.instructions ? `
          <div class="slide-instructions-banner">
            <span>🎧</span>
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
              <span class="listen-audio-label">Reproductor de Audio</span>
              <audio controls class="listen-audio-player">
                <source src="${escapeHtml(slide.audioSrc || 'media/quedar_audio.mp3')}" type="audio/mpeg">
                <source src="${escapeHtml(slide.audioSrcWav || 'media/quedar_audio.wav')}" type="audio/wav">
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          </div>

          <div class="listen-right-col">
            <div class="transcript-wrapper" id="transcript-wrapper">
              <div class="transcript-header">
                <span class="transcript-title">Transcripción del Diálogo</span>
                <button id="btn-toggle-blur" class="btn btn-sm btn-outline">
                  ${isBlurred ? '👁️ Desvelar' : '🔒 Difuminar'}
                </button>
              </div>

              <div id="transcript-body" class="transcript-body ${isBlurred ? 'is-blurred' : ''}">
                ${escapeHtml(slide.transcript || 'Transcripción no disponible.')}
              </div>

              ${isBlurred ? `
                <div class="transcript-overlay-hint" id="transcript-hint">
                  <span>👆 Haz clic para revelar la transcripción</span>
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
      toggleBlurBtn.textContent = blurred ? '👁️ Desvelar' : '🔒 Difuminar';
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
        <span class="slide-header-badge">Comprensión Lectora</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Lectura en Contexto')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-reading-grid">
          <div class="reading-text-pane">
            ${paragraphs.map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')}
          </div>
          <div class="vocabulary-pane">
            <div class="vocab-pane-header">📖 Vocabulario & Expresiones</div>
            <div class="vocab-table-wrapper">
              <table class="vocab-table">
                <thead>
                  <tr>
                    <th>Palabra / Expresión</th>
                    <th>Traducción / Significado</th>
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
    const headers = conj.headers || ['Pronombre', 'Forma', 'Traducción', 'Ejemplo'];
    const rows = conj.rows || [];

    container.innerHTML = `
      <header class="slide-header">
        <span class="slide-header-badge">Gramática & Morfología</span>
        <h2 class="slide-heading">${escapeHtml(slide.heading || 'Conjugación Verbal')}</h2>
      </header>
      <div class="slide-body">
        <div class="layout-conjugation-grid">
          <div class="conjugation-notes-pane">
            <p class="conjugation-lead">${escapeHtml(slide.explanation || 'Explicación de las formas verbales.')}</p>
            <div class="peninsular-focus-box">
              <strong>🇪🇸 Enfoque Peninsular:</strong> El uso de <em>vosotros / vosotras</em> es estándar e imprescindible en el español peninsular informal.
            </div>
          </div>
          <div class="conjugation-table-pane">
            <div class="tense-title-bar">${escapeHtml(conj.tense || 'Conjugación')}</div>
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

  // Fallback for unmapped custom layouts
  function renderUnknownSlide(slide, container) {
    container.innerHTML = `
      <header class="slide-header">
        <h2 class="slide-heading">${escapeHtml(slide.heading || slide.title || 'Diapositiva')}</h2>
      </header>
      <div class="slide-body">
        <div class="one-panel-card">
          <p>Tipo de diapositiva desconocido: <code>${escapeHtml(slide.type)}</code></p>
          <pre style="font-size: 0.8rem; overflow: auto; background: #f1f5f9; padding: 1rem; border-radius: 8px;">${escapeHtml(JSON.stringify(slide, null, 2))}</pre>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 7. Print Mode Engine (@media print A4 Sheets + Teacher Notes)
  // Notes are strictly revealed HERE for print reference!
  // --------------------------------------------------------------------------
  function buildPrintSheets() {
    DOM.printContainer.innerHTML = '';

    state.slides.forEach((slide, idx) => {
      const page = document.createElement('div');
      page.className = 'print-slide-page';

      const title = slide.title || slide.heading || `Diapositiva ${idx + 1}`;
      
      page.innerHTML = `
        <div class="print-slide-header">
          <span class="print-brand">Lesson Dex • Peninsular Spanish</span>
          <span class="print-slide-num">Página ${idx + 1} de ${state.slides.length} (${slide.type})</span>
        </div>

        <div class="print-slide-content">
          <h2 style="font-size: 16pt; margin-bottom: 4mm; color: #0f172a;">${escapeHtml(title)}</h2>
          ${renderPrintBody(slide)}
        </div>

        <!-- Teacher Notes explicitly shown under each slide in printout -->
        <div class="print-teacher-notes">
          <div class="print-teacher-notes-title">📝 Notas del Profesor / Guía Didáctica:</div>
          <div class="print-teacher-notes-body">${escapeHtml(slide.notes || 'Sin notas adicionales para esta diapositiva.')}</div>
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
          <p><strong>${escapeHtml(slide.leftStaticText || 'Objetivos:')}</strong></p>
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
          ${slide.tip ? `<p style="margin-top: 3mm; font-style: italic;">💡 ${escapeHtml(slide.tip)}</p>` : ''}
        `;
      case 'fill-gap':
        return `
          <p style="font-size: 11pt; line-height: 1.8;">${escapeHtml(slide.gapText || '')}</p>
        `;
      case 'question':
        return `
          <p style="font-size: 12pt; margin-bottom: 4mm;"><strong>Pregunta:</strong> ${escapeHtml(slide.question || '')}</p>
          <div style="background: #f1f5f9; padding: 4mm; border-left: 4px solid #10b981;">
            <strong>Solución:</strong> ${escapeHtml(slide.answer || '')}
          </div>
        `;
      case 'match':
        return `
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 2mm;">Frase</th><th style="padding: 2mm;">Significado</th></tr></thead>
            <tbody>
              ${(slide.pairs || []).map(p => `<tr><td style="padding: 2mm;">${escapeHtml(p.source)}</td><td style="padding: 2mm;">${escapeHtml(p.target)}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      case 'listen':
        return `
          <div style="margin-top: 3mm; padding: 3mm; background: #f8fafc; border: 1px solid #e2e8f0;">
            <strong>Transcripción completa:</strong>
            <p style="white-space: pre-line; margin-top: 2mm;">${escapeHtml(slide.transcript || '')}</p>
          </div>
        `;
      case 'reading':
        return `
          <div style="font-size: 10pt; line-height: 1.6; margin-bottom: 4mm;">
            ${(slide.readingText || '').replace(/\n/g, '<br>')}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 1.5mm;">Palabra</th><th style="padding: 1.5mm;">Traducción</th></tr></thead>
            <tbody>
              ${(slide.vocabulary || []).map(v => `<tr><td style="padding: 1.5mm;"><strong>${escapeHtml(v.word)}</strong></td><td style="padding: 1.5mm;">${escapeHtml(v.translation)}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      case 'conjugation':
        const rows = (slide.conjugationData && slide.conjugationData.rows) || [];
        return `
          <table style="width: 100%; border-collapse: collapse; margin-top: 3mm;" border="1">
            <thead><tr><th style="padding: 1.5mm;">Pronombre</th><th style="padding: 1.5mm;">Forma</th><th style="padding: 1.5mm;">Traducción</th><th style="padding: 1.5mm;">Ejemplo</th></tr></thead>
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
  // 8. Lesson Builder Studio (Maker Mode)
  // --------------------------------------------------------------------------
  function openStudio() {
    DOM.studioEditor.value = JSON.stringify(state.slides, null, 2);
    DOM.studioModal.classList.remove('hidden');
    DOM.studioFeedbackText.textContent = `Editando ${state.slides.length} diapositivas. Presiona 'Aplicar al Reproductor' para guardar.`;
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
      setStudioStatus('JSON formateado correctamente.', true);
      showToast('JSON formateado', 'success');
    } catch (err) {
      setStudioStatus(`Error de sintaxis JSON: ${err.message}`, false);
      showToast('Error en el formato JSON', 'error');
    }
  }

  function applyStudioJSON() {
    try {
      const parsed = JSON.parse(DOM.studioEditor.value);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('El JSON debe ser un array que contenga al menos una diapositiva.');
      }

      // Check required fields for each slide
      parsed.forEach((s, idx) => {
        if (!s.type) throw new Error(`La diapositiva en el índice ${idx} carece de la propiedad 'type'.`);
      });

      setLessonData(parsed);
      setStudioStatus('¡Lección actualizada y aplicada con éxito al reproductor!', true);
      showToast('Lección actualizada con éxito', 'success');
      closeStudio();
    } catch (err) {
      setStudioStatus(`Error al aplicar: ${err.message}`, false);
      showToast(`Error: ${err.message}`, 'error');
    }
  }

  function exportStudioJSON() {
    try {
      const jsonContent = DOM.studioEditor.value || JSON.stringify(state.slides, null, 2);
      // Validate before export
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

      showToast('Descargando lesson.json', 'success');
    } catch (err) {
      showToast(`No se puede exportar JSON inválido: ${err.message}`, 'error');
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
        setStudioStatus(`Archivo '${file.name}' cargado en el editor.`, true);
        showToast(`Archivo cargado: ${file.name}`, 'success');
      } catch (err) {
        setStudioStatus(`Archivo no válido: ${err.message}`, false);
        showToast('El archivo no contiene un JSON válido', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be re-uploaded
  }

  function resetToDefaultLesson() {
    if (state.defaultLessonData) {
      setLessonData(JSON.parse(JSON.stringify(state.defaultLessonData)));
      setStudioStatus('Lección por defecto restablecida.', true);
      showToast('Lección restablecida a la versión inicial', 'success');
    }
  }

  function setStudioStatus(msg, isSuccess) {
    DOM.studioFeedbackText.textContent = msg;
    const indicator = DOM.studioFeedback.querySelector('.status-indicator');
    indicator.className = `status-indicator ${isSuccess ? 'ready' : 'error'}`;
  }

  // --------------------------------------------------------------------------
  // 9. Fullscreen & Print Triggers
  // --------------------------------------------------------------------------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        state.isFullscreen = true;
        DOM.fullscreenIcon.textContent = '🗗';
        DOM.stageCanvas.classList.add('is-fullscreen');
      }).catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        state.isFullscreen = false;
        DOM.fullscreenIcon.textContent = '⛶';
        DOM.stageCanvas.classList.remove('is-fullscreen');
      });
    }
  }

  function triggerPrint() {
    buildPrintSheets();
    window.print();
  }

  // --------------------------------------------------------------------------
  // 10. Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // Web Audio Tone Synthesis (Subtle audio feedback)
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
      // Audio context silenced or blocked, silently pass
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
  // 11. Keyboard Shortcuts & Global Event Listeners
  // --------------------------------------------------------------------------
  function initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // If typing inside an input or textarea, ignore navigation keys
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
      DOM.fullscreenIcon.textContent = isFull ? '🗗' : '⛶';
      DOM.stageCanvas.classList.toggle('is-fullscreen', isFull);
    });
  }

  function initUIEventListeners() {
    // Navigation Arrows
    DOM.stagePrevBtn.addEventListener('click', prevSlide);
    DOM.stageNextBtn.addEventListener('click', nextSlide);
    DOM.footerPrevBtn.addEventListener('click', prevSlide);
    DOM.footerNextBtn.addEventListener('click', nextSlide);

    // Header buttons
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

    // Close modals on clicking overlay backdrop
    DOM.studioModal.addEventListener('click', (e) => {
      if (e.target === DOM.studioModal) closeStudio();
    });
    DOM.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === DOM.shortcutsModal) DOM.shortcutsModal.classList.add('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 12. Embedded Fallback Data (Self-contained offline guarantee)
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
        "notes": "Profesor: Iniciar la sesión preguntando a los alumnos qué significa 'quedar' para ellos. Advertir que es uno de los verbos con más acepciones diferentes en el español de España."
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
        "notes": "Profesor: Leer los objetivos con el grupo. Pedir a un voluntario que recuerde la diferencia entre verbos pronominales y no pronominales."
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
        "notes": "Profesor: Resaltar que '¿Quedamos?' es la forma estándar e informal más natural de quedar. En Hispanoamérica es más habitual 'verse con' o 'juntarse'."
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
        "notes": "Profesor: Hacer que dos alumnos lean cada lado y propongan un contraejemplo inmediato."
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
        "notes": "Profesor: Clave de lectura. Identificar con los estudiantes los 5 usos distintos de quedar y quedarse que aparecen destacados en el texto."
      },
      {
        "slideId": "slide-06",
        "type": "fill-gap",
        "heading": "4. Práctica Interactiva: Rellena los huecos",
        "instructions": "Haz clic sobre cada hueco vacío para revelar la forma correcta y su justificación.",
        "gapText": "Ayer [quedé] con Carlos en el centro para comer. Fuimos a la tienda de deportes y las zapatillas rojas le [quedaban] perfectas, pero solo [quedaba] un par de su talla. Después, como estábamos cansadísimos, yo me [quedé] en casa viendo una película y nos [quedamos] dormidos a mitad del documental.",
        "notes": "Profesor: Pedir a los alumnos que antes de hacer clic justifiquen por qué se usa la forma pronominal o no pronominal en cada caso."
      },
      {
        "slideId": "slide-07",
        "type": "question",
        "heading": "5. Pregunta Rápida de Comprensión",
        "instructions": "Lee la situación cotidiana, debate tu respuesta con tu compañero y pulsa el botón para verificar.",
        "question": "Tu compañero de piso aparece con unas gafas de sol nuevas y te pregunta: «¿Qué tal? ¿Cómo las ves?». Quieres decirle que le sientan fenomenal y favorecen su rostro. ¿Qué frase es la más idiomática en España?",
        "answer": "«¡Te quedan genial!» o «¡Te quedan de cine / de maravilla!». En España empleamos el verbo 'quedar' como verbo tipo gustar para indicar si una prenda o complemento favorece a alguien.",
        "notes": "Profesor: Explicar que la construcción es idéntica a 'gustar': A mí me queda bien, a ti te queda grande, a ella le queda largo."
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
        "notes": "Profesor: Llamar la atención sobre la tilde en 'quedáis' (vocal abierta 'a' con acento en diptongo decreciente)."
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
        "notes": "Profesor: Reproducir el audio dos veces sin desvelar la transcripción. Preguntar: 1) ¿A qué hora quedan? 2) ¿Por qué no puede antes Javi? 3) ¿Quedan plazas en el coche?"
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
        "notes": "Profesor: Dinámica en parejas: un alumno arrastra y el otro debe inventar una frase parecida con el mismo significado."
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
        "notes": "Profesor: Recordar los criterios de evaluación: corrección gramatical (30%), variedad de usos de quedar (40%), pronunciación y entonación en audio (30%)."
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 13. Initialization Bootstrapper
  // --------------------------------------------------------------------------
  function init() {
    initKeyboardListeners();
    initUIEventListeners();
    loadInitialLesson();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
