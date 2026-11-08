# Lesson Dex

A modern, web-native classroom presentation player and offline lesson editor designed to replace PowerPoint in interactive teaching environments.

Built entirely with **strict Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3**.

---

## Key Features

1. **Strict 16:9 Presentation Canvas**:
   - Locked to `aspect-ratio: 16 / 9;`.
   - Scaled using dynamic CSS `min()`, `vw`, and `vh` viewport mathematics.
   - Guaranteed pixel-perfect alignment across projectors, interactive displays, and laptops.
   - Non-overlapping navigation arrows positioned with dedicated clearance outside the slide canvas.

2. **Classroom Visibility Standard (>= 22px text)**:
   - Designed for back-of-class readability.
   - All content text (paragraphs, tables, lists, dialogue, activities) has a minimum size of 22px.
   - Headings, subheadings, and prompts scale up proportionally (32px - 60px).

3. **3 Integrated Operational Modes**:
   - **Player Mode (Default)**: Clean presentation view. Teacher notes are strictly excluded from the player DOM to prevent student eavesdropping.
   - **Print Mode (`@media print` / Print Button)**: Overrides 16:9 constraints, formats slides sequentially as standard A4 pages with page breaks, and explicitly reveals the notes section underneath each slide for handouts or teacher reference.
   - **Lesson Builder Studio (Maker Mode)**: Press `E` or click the Tools icon to open the live JSON editor. Paste AI-generated JSON, format it, validate schema, upload local `.json` files, export to disk, and apply live updates instantly without refreshing.

4. **11 Standardised Layouts**:
   - `intro`: Full-bleed background, dark overlay, category pill, main title, and subtitle.
   - `objectives`: 2-column grid. Left: "Today we will..." static text + checklist. Right: Image frame.
   - `homework`: 2-column grid. Left: Assignment cards & tips. Right: Contextual image.
   - `one-panel`: Single hero container supporting formatted text, images, or HTML5 video.
   - `two-panel`: 2-column equal split supporting any mix of text, images, or video.
   - `fill-gap`: Interactive sentence where missing words are click-to-reveal blanks, with a single toggle button to reveal or reset.
   - `question`: Prominent quiz question with a single toggle button to reveal or hide the answer.
   - `match`: HTML5 drag-and-drop matching with click-to-pair accessibility fallback.
   - `listen`: 2-column grid. Left: Image + native `<audio>` player. Right: Blurred transcript with single reveal/hide toggle.
   - `reading`: 2-column grid. Left: Long-form text passage. Right: Vocabulary lookup table.
   - `conjugation`: 2-column grid. Left: Grammar explanation. Right: Verb conjugation table (featuring Peninsular Spanish *vosotros*).

5. **Pure SVG Icons (No Emojis)**:
   - Sourced and structured using clean Tabler SVG stroke icons saved locally in `icons/`.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `→` or `Space` / `PageDown` | Next slide |
| `←` or `PageUp` | Previous slide |
| `Home` / `End` | Jump to first / last slide |
| `F` | Toggle fullscreen mode |
| `H` | Toggle UI Auto-hide / Pin bars |
| `E` | Open / Close Lesson Builder Studio |
| `P` | Print handouts / Save to PDF |
| `?` | Show keyboard shortcuts modal |
| `Esc` | Close any active modal or overlay |

---

## Project Architecture

```
lesson-dex/
├── index.html            # Semantic application shell & symbols-only UI controls
├── css/
│   └── style.css         # CSS design tokens, 16:9 math, print styles & 11 layouts (>= 22px text)
├── js/
│   └── app.js            # State management, render router, Studio & interactions
├── lesson.json           # Spanish lesson dataset ("El Verbo Quedar")
├── icons/                # Local Tabler SVG icons
│   ├── book.svg
│   ├── check.svg
│   ├── chevron-left.svg
│   ├── chevron-right.svg
│   ├── eye.svg
│   ├── eye-off.svg
│   ├── keyboard.svg
│   ├── maximize.svg
│   ├── minimize.svg
│   ├── printer.svg
│   ├── tools.svg
│   └── ...
├── media/                # Local relative assets (SVGs, audio, video)
│   ├── madrid_puerta_sol.svg
│   ├── spain_cafe.svg
│   ├── phone_call.svg
│   ├── homework_study.svg
│   ├── quedar_audio.mp3
│   ├── quedar_audio.wav
│   └── sample_video.mp4
└── README.md
```

## Running the App

Open `index.html` directly in any modern browser, or serve it using a local static web server:

```bash
# Python 3
python3 -m http.server 8080

# Or npx
npx serve .
```

Navigate to `http://localhost:8080` in your web browser.
