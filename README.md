# Lesson Dex 📖

A modern, web-native classroom presentation player and offline lesson studio designed to replace PowerPoint in interactive teaching environments.

Built entirely with **strict Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3**.

---

## 🚀 Key Features

1. **Strict 16:9 Presentation Canvas**:
   - Locked to `aspect-ratio: 16 / 9;`.
   - Scaled using dynamic CSS `min()`, `vw`, and `vh` viewport math.
   - Guaranteed pixel-perfect alignment across projectors, interactive whiteboards, and laptops.

2. **3 Integrated Operational Modes**:
   - **Player Mode (Default)**: Clean presentation view. Teacher `notes` are strictly excluded from the player DOM to prevent student eavesdropping.
   - **Print Mode (`@media print` / Print Button)**: Overrides 16:9 constraints, formats slides sequentially as standard A4 pages with page breaks, and explicitly reveals the `notes` section underneath each slide for handouts or teacher reference.
   - **Lesson Builder Studio (Maker Mode)**: Press `E` or click **Studio (Maker)** to open the live JSON editor. Paste AI-generated JSON, format it, validate schema, upload local `.json` files, export to disk, and apply live updates instantly without refreshing.

3. **11 Standardized Layout Engine**:
   - `intro`: Full-bleed background, dark overlay, title, subtitle, and badge.
   - `objectives`: 2-column grid. Left: "Today we will..." static text + checklist. Right: Image frame.
   - `homework`: 2-column grid. Left: Assignment cards & tips. Right: Contextual image.
   - `one-panel`: Single hero container supporting formatted text, image, or HTML5 video.
   - `two-panel`: 2-column equal split supporting any mix of text, images, or video.
   - `fill-gap`: Interactive sentence where missing words are click-to-reveal blanks with sound feedback.
   - `question`: Prominent quiz question with an animated "Reveal Answer" toggle.
   - `match`: HTML5 drag-and-drop matching with click-to-pair accessibility fallback.
   - `listen`: 2-column grid. Left: Image + native `<audio>` player. Right: Blurred transcript unblurred on click.
   - `reading`: 2-column grid. Left: Long-form text passage. Right: Vocabulary lookup table.
   - `conjugation`: 2-column grid. Left: Grammar explanation. Right: Verb conjugation table (featuring Peninsular *vosotros*).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `→` or `Space` / `PageDown` | Next slide |
| `←` or `PageUp` | Previous slide |
| `Home` / `End` | Jump to first / last slide |
| `F` | Toggle fullscreen mode |
| `E` | Open / Close Lesson Builder Studio |
| `P` | Print handouts / Save to PDF |
| `?` | Show keyboard shortcuts modal |
| `Esc` | Close any active modal / overlay |

---

## 📂 Project Architecture

```
lesson-dex/
├── index.html            # Semantic application shell & UI controls
├── css/
│   └── style.css         # CSS design tokens, 16:9 math, print styles & 11 layouts
├── js/
│   └── app.js            # State management, render router, Studio & interactions
├── lesson.json           # Peninsular Spanish lesson dataset ("El Verbo Quedar")
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

## 💻 Running the App

You can open `index.html` directly in any modern browser, or serve it using any local static web server:

```bash
# Python 3
python3 -m http.server 8080

# Or npx
npx serve .
```
Navigate to `http://localhost:8080` in your web browser.
