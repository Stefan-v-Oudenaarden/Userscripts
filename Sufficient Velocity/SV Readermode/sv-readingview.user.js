// ==UserScript==
// @name         SV Reading View
// @namespace    http://tampermonkey.net/
// @version      2025-08-15
// @description  Add reading mode buttons to individual posts on SV forums. This reader mode uses a solarized light colour scheme and respects SV colours and glows. It reveals invisitext and makes clear it was invisible with a slight change in colour and a dotted underline.
// @author       Stefan van Oudenaarden
// @match        https://forums.sufficientvelocity.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sufficientvelocity.com
// @downloadURL  https://raw.githubusercontent.com/Stefan-v-Oudenaarden/Userscripts/refs/heads/main/Sufficient%20Velocity/SV%20Readermode/sv-readingview.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


// #region Options and Themes
const availableThemes = [
  {
    "name": "Day",
    "fullscreen-text-color": "#2a2a2a",
    "fullscreen-background-color": "#f4ecd8",
    "header-background-color": "#dec588",
    "selected-background": "rgba(0, 97, 224, 0.3)",
  },
  {
    "name": "Night",
    "fullscreen-text-color": "#f4ecd8",
    "fullscreen-background-color": "#2a2a2a",
    "header-background-color": "#5e5e5e",
    "selected-background": "rgba(97, 0, 224, 0.3)",
  },
  {
    "name": "Light",
    "fullscreen-text-color": "#000000",
    "fullscreen-background-color": "#FFFFFF",
    "header-background-color": "#DDDDDD",
    "selected-background": "rgba(0, 128, 0, 0.3)",
  },
  {
    "name": "Dark",
    "fullscreen-text-color": "rgb(230, 230, 230)",
    "fullscreen-background-color": "rgba(10, 10, 10, 1)",
    "header-background-color": "#053262",
    "selected-background": "rgba(0, 97, 224, 0.3)",
  },
  {
    "name": "Cold",
    "fullscreen-text-color": "#000000",
    "fullscreen-background-color": "#E0E0E0",
    "header-background-color": "#87CEEB",
    "selected-background": "rgba(0, 0, 255, 0.3)",
  },
];

const availableFonts = [
  { name: "Calibri", value: "Calibri, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times", value: "Times, serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Monaco", value: "Monaco, monospace" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Palatino", value: "Palatino, serif" },
  { name: "Open Dyslexic", value: "'Open-Dyslexic', 'Comic Sans MS', sans-serif" },
];

let selectedWidth = GM_getValue("selectedWidth", 66);
let selectedTheme = GM_getValue("selectedTheme", "Day");
let selectedLineSpacing = GM_getValue("selectedLineSpacing", 1);
let selectedFontSize = GM_getValue("selectedFontSize", 1.2);
let selectedFont = GM_getValue("selectedFont", "Calibri, sans-serif");
// #endregion

// #region CSS and HTML Artifacts
const css = `@import url("https://fonts.cdnfonts.com/css/open-dyslexic");

.rm-text-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
  display: none; /* Initially hidden */
  justify-content: center;
  align-items: center;
  z-index: 9000;

  align-items: flex-start;
  overflow: scroll;
}

.rm-button-container {
  position: fixed;
  top: 10px;
  right: 30px;
  display: flex;
  flex-direction: column;
  z-index: 9001;
}

.rm-button-container .rm-button {
  width: 35px;
  height: 35px;
  font-size: 30px;
  background-color: transparent;
  color: var(--fullscreen-text-color, black);
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.rm-text-wrapper {
  width: clamp(800px, var(--text-column-width), 2500px);

  margin-top: 75px;
  margin-bottom: 50px;
  margin-right: 80px;
}

.rm-insertion-point {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
  line-height: var(--line-spacing);
  margin-block: var(--paragraph-spacing);
}

.rm-insertion-point ::selection {
  background-color: var(--selected-background);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point h1 {
  margin-bottom: 50px;
}

.rm-insertion-point blockquote {
  margin-bottom: 11px;
  margin-bottom: 22px;
}

.rm-insertion-point .bbWrapper {
  font-size: var(--rm-font-size) !important;
  font-family: var(--rm-font-family) !important;
}

.rm-insertion-point .bbCodeSpoiler-button {
  background-color: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .bbCodeSpoiler-button:hover {
  background-color: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.tooltip .tooltip-content {
  background-color: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .bbCodeBlock {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);

  border: 1px solid;
  border-radius: 8px;
}

.rm-insertion-point .tally-block {
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.rm-insertion-point .bbCodeBlock-title {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
  border-top-left-radius: 8px;
}

.rm-insertion-point .bbCodeInline {
  background-color: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .bbCodeBlock-shrinkLink,
.rm-insertion-point .bbCodeBlock-expandLink {
  background: unset;
}

.rm-insertion-point .bbCodeBlock-shrinkLink a,
.rm-insertion-point .bbCodeBlock-expandLink a {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .bbCodeBlock-title {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .seperator {
  margin: 25px 0px 25px 0px;
  height: 1px;
  background: var(--fullscreen-text-color);
}

.rm-insertion-point .tabs--standalone {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .tabs-pane dt {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .sv-accordion {
  border-radius: 8px;
}

.rm-insertion-point .sv-accordion dt {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .sv-tabs {
  border-radius: 8px;
}

.rm-insertion-point .sv-tabs .sv-tabs-tabs {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .sv-encadre {
  border-radius: 8px;
}

.rm-insertion-point .sv-encadre--title {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.rm-insertion-point .sv-encadre--content {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.rm-insertion-point .block-header {
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.rm-insertion-point .blockMessage {
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.rm-open-button {
  cursor: pointer;
}

.rm-open-button:hover {
  text-decoration: none;
  color: #28a1dd;
}

*[style*="color:transparent"] {
  text-decoration: underline dotted !important;
  color: unset !important;
  opacity: 0.66;
}

.rm-config-panel {
  position: fixed;
  top: 50px;
  right: 30px;
  width: 200px;
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
  padding: 10px;
  border: 1px solid var(--header-background-color);
  display: none;
  z-index: 9002;
}

.rm-config-panel input,
.rm-config-panel select {
  margin-top: 10px;
  width: 100%;
  padding: 5px;
  border: 1px solid var(--header-background-color);

  background-color: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-config-panel select {
  margin-bottom: 15px;
}
`;

const html = `<div class="rm-text-viewer">
  <div class="rm-button-container">
    <button class="rm-button close-button close-reader-button"><i class="close-reader-button fa--xf far fa-times" aria-hidden="true"></i></button>
    <button class="rm-button config-button"><i class="config-button fa--xf far fa-tasks" aria-hidden="true"></i></button>
  </div>

  <div class="rm-text-wrapper">
      <div class="rm-insertion-point">

      </div>
  </div>

  <div class="rm-config-panel">
    <h2>Configuration</h2>

    <label for="theme">Theme:</label>
    <select id="theme">
        ${generateThemeOptions()}
    </select>

    <label for="font-family">Font:</label>
    <select id="font-family">
        ${generateFontOptions()}
    </select>

    <label for="font-size">Font Size:</label>
    <input type="range" id="font-size" min="0.5" max="3" step="0.1" value="${selectedFontSize}">

    <label for="width">Width:</label>
    <input type="range" id="width" min="50" max="100" value="${selectedWidth}">

    <label for="line-spacing">Line Spacing:</label>
    <input type="range" id="line-spacing" min="0.8" max="3" step="0.05" value="${selectedLineSpacing}">
  </div>
</div>`;

// #endregion

// #region helper methods
function addQueryParam(key, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url);
}

function removeQueryParam(key) {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState({}, "", url);
}

function applyCSSVariablesToDocument(cssProperties) {
  "use strict";

  for (const key in cssProperties) {
    if (cssProperties.hasOwnProperty(key)) {
      const fullPropertyName = `--${key}`;
      const value = cssProperties[key];
      document.documentElement.style.setProperty(fullPropertyName, value);
    }
  }
}

function getPostIdFromArticle(article) {
  const shareButton = article.querySelector(".message-attribution-gadget");
  if (!shareButton || !shareButton.href) {
    return 0;
  }

  const hrefParts = shareButton.href.split("post-");

  if (hrefParts.length < 2) {
    return 0;
  }

  return hrefParts[1];
}
// #endregion

function updateTheme() {
  "use strict";

  applyCSSVariablesToDocument({
    "text-column-width": `${selectedWidth}%`,
    "line-spacing": selectedLineSpacing,
    "rm-font-size": `${selectedFontSize}rem`,
    "rm-font-family": selectedFont,
  });

  let currentTheme = availableThemes.find((theme) => theme.name === selectedTheme);
  if (!currentTheme) {
    currentTheme = availableThemes.find((theme) => theme.name === "Day");
  }
  applyCSSVariablesToDocument(currentTheme);
}

function generateThemeOptions() {
  return availableThemes.map((theme) => 
    `<option value="${theme.name}" ${theme.name === selectedTheme ? "selected" : ""}>${theme.name}</option>`
  ).join("");
}

function generateFontOptions() {
  return availableFonts.map((font) => 
    `<option value="${font.value}" ${font.value === selectedFont ? "selected" : ""}>${font.name}</option>`
  ).join("");
}

function addReaderModeUI() {
  "use strict";

  const RMDiv = document.createElement("div");
  RMDiv.innerHTML = html;

  document.querySelector("body").appendChild(RMDiv);

  const closeButton = document.querySelector(".close-reader-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const configPanel = document.querySelector(".rm-config-panel");
      if (configPanel && configPanel.style.display === "block") {
        OpenCloseConfig();
      } else {
        hideTextViewer();
      }
    });
  }

  const configButton = document.querySelector(".config-button");
  if (configButton) {
    configButton.addEventListener("click", () => {
      OpenCloseConfig();
    });
  }

  const widthInput = document.getElementById("width");
  if (widthInput) {
    widthInput.addEventListener("input", () => {
      selectedWidth = parseInt(widthInput.value, 10);
      GM_setValue("selectedWidth", selectedWidth);
      updateTheme();
    });
  }

  const themeSelect = document.getElementById("theme");
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      selectedTheme = themeSelect.value;
      GM_setValue("selectedTheme", selectedTheme);
      updateTheme();
    });
  }

  const fontSizeInput = document.getElementById("font-size");
  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", () => {
      selectedFontSize = parseFloat(fontSizeInput.value);
      GM_setValue("selectedFontSize", selectedFontSize);
      updateTheme();
    });
  }

  const fontFamilySelect = document.getElementById("font-family");
  if (fontFamilySelect) {
    fontFamilySelect.addEventListener("change", () => {
      selectedFont = fontFamilySelect.value;
      GM_setValue("selectedFont", selectedFont);
      updateTheme();
    });
  }

  const lineSpacingInput = document.getElementById("line-spacing");
  if (lineSpacingInput) {
    lineSpacingInput.addEventListener("input", () => {
      selectedLineSpacing = parseFloat(lineSpacingInput.value);
      GM_setValue("selectedLineSpacing", selectedLineSpacing);
      updateTheme();
    });
  }
}

function OpenCloseConfig() {
  "use strict";

  const configPanel = document.querySelector(".rm-config-panel");
  const configButton = document.querySelector(".config-button");
  
  if (configPanel) {
    if (configPanel.style.display === "block") {
      // Close config panel
      configPanel.style.display = "none";
      if (configButton) configButton.style.display = "block";
    } else {
      // Open config panel
      configPanel.style.display = "block";
      if (configButton) configButton.style.display = "none";
    }
  }
}

function addPostViewButton(container) {
  "use strict";

  const toolBarElements = container.getElementsByClassName("message-attribution-opposite--list");
  let toolBar;

  if (toolBarElements.length > 0) {
    toolBar = toolBarElements[0];
  }

  if (!toolBar) {
    return;
  }

  const listItemContent = '<i class="rm-open-button fa--xf far fa-book-open" aria-hidden="true"></i>';

  var newListItem = document.createElement("li");
  newListItem.innerHTML = listItemContent;

  toolBar.appendChild(newListItem);

  const openButton = toolBar.querySelector(".rm-open-button");
  if (openButton) {
    openButton.addEventListener("click", () => {
      viewSinglePost(container);
    });
  }
}

function addPageViewButton(container) {
  "use strict";

  if (!container) {
    return;
  }

  var pageViewButton = document.createElement("a");
  pageViewButton.classList = "button--link button page-view-button";
  pageViewButton.text = "Reader View";

  container.appendChild(pageViewButton);

  if (pageViewButton) {
    pageViewButton.addEventListener("click", () => {
      viewPage();
    });
  }
}

function showTextViewer() {
  "use strict";

  document.body.style = "overflow: hidden !important";
  document.querySelector(".rm-text-viewer").style.display = "flex";
}

function hideTextViewer() {
  "use strict";

  document.body.style = "overflow: scroll !important";
  document.querySelector(".rm-text-viewer").style.display = "none";

  removeQueryParam("rm-viewpage");
  removeQueryParam("rm-viewpost");
}

function viewSpecificPost(id) {
  console.log(id);
  const articles = document.getElementsByClassName("message--post");
  var post = undefined;

  for (const article of articles) {
    const postId = getPostIdFromArticle(article);

    if (postId === id) {
      post = article;
      console.log(article);
      break;
    }
  }

  if (post !== undefined) {
    viewSinglePost(post);
  }
}

function viewSinglePost(container) {
  "use strict";

  const insertionPoint = document.querySelector(".rm-insertion-point");
  if (!insertionPoint) {
    return;
  }

  insertionPoint.innerHTML = "";

  addPostToViewer(container);
  showTextViewer();

  const postId = getPostIdFromArticle(container);

  if (postId !== 0) {
    addQueryParam("rm-viewpost", postId);
  }
}

function viewPage() {
  "use strict";

  const insertionPoint = document.querySelector(".rm-insertion-point");
  if (!insertionPoint) {
    return;
  }

  insertionPoint.innerHTML = "";

  const articles = document.getElementsByClassName("message--post");

  if (articles) {
    for (let article of articles) {
      addPostToViewer(article);

      var horizontalRule = document.createElement("hr");
      horizontalRule.classList = "seperator";
      insertionPoint.appendChild(horizontalRule);
    }
  }

  showTextViewer();
  addQueryParam("rm-viewpage", true);
}

function addPostToViewer(container) {
  "use strict";

  const insertionPoint = document.querySelector(".rm-insertion-point");
  if (!insertionPoint) {
    return;
  }

  const bbWrappers = container.getElementsByClassName("bbWrapper");
  if (!bbWrappers.length > 0) {
    return;
  }

  const text = bbWrappers[0].cloneNode(true);
  if (!text) {
    return;
  }

  text.style.fontSize = "";
  const threadmarkLabels = container.getElementsByClassName("threadmarkLabel");

  let postTitle = "";
  let threadmarkTitle = "";

  if (threadmarkLabels.length > 0) {
    threadmarkTitle = threadmarkLabels[0].innerText;
    if (threadmarkTitle === undefined || threadmarkTitle === "undefined") {
      threadmarkTitle = "";
    }
  }

  let name = "Unknown User";
  const nameElements = container.getElementsByClassName("message-name");
  if (nameElements.length > 0) {
    name = nameElements[0].innerText;
  }

  postTitle = `${name} posted ${threadmarkTitle}`.trim();

  if (postTitle) {
    const titleHeader = document.createElement("h1");
    titleHeader.textContent = postTitle;

    insertionPoint.appendChild(titleHeader);
  }

  if (text) {
    insertionPoint.appendChild(text);
  }
}

(function () {
  "use strict";

  //Insert the css artifact
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  document.head.appendChild(style);

  //Custom CSS Variables
  applyCSSVariablesToDocument({
    "close-button-background-color": "transparent",
    "close-button-color": "black",
  });

  updateTheme();

  //Insert the html artifact into the page
  addReaderModeUI();

  //Add buttons to show the whole page in reader view
  const readerModeButtonGroups = document.getElementsByClassName("threadmarks-reader");
  for (const group of readerModeButtonGroups) {
    addPageViewButton(group);
  }

  //Add buttons to show single posts in reader view
  const articles = document.getElementsByClassName("message--post");
  for (const article of articles) {
    addPostViewButton(article);
  }

  //Process query params.
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("rm-viewpage")) {
    viewPage();
  } else if (urlParams.has("rm-viewpost")) {
    viewSpecificPost(urlParams.get("rm-viewpost"));
  }
})();
