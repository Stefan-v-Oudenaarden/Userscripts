// ==UserScript==
// @name         SV Readermode
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  Add reading mode buttons to individual posts on SV forums. This reader mode uses a solarized light colour scheme and respects SV colours and glows. It reveals invisitext and makes clear it was invisible with a slight change in colour and a dotted underline.
// @author       You
// @match        https://forums.sufficientvelocity.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sufficientvelocity.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const availableThemes = [
  {
    "name": "day",
    "fullscreen-text-color": "#2a2a2a",
    "fullscreen-background-color": "#f4ecd8",
    "header-background-color": "#dec588",
    "selected-background": "rgba(0, 97, 224, 0.3)",
  },
  {
    "name": "night",
    "fullscreen-text-color": "#f4ecd8",
    "fullscreen-background-color": "#2a2a2a",
    "header-background-color": "#88c5de",
    "selected-background": "rgba(97, 0, 224, 0.3)",
  },
  {
    "name": "light",
    "fullscreen-text-color": "#000000",
    "fullscreen-background-color": "#FFFFFF",
    "header-background-color": "#DDDDDD",
    "selected-background": "rgba(0, 128, 0, 0.3)",
  },
  {
    "name": "dark",
    "fullscreen-text-color": "#FFFFFF",
    "fullscreen-background-color": "#000000",
    "header-background-color": "#333333",
    "selected-background": "rgba(128, 0, 0, 0.3)",
  },
  {
    "name": "stars",
    "fullscreen-text-color": "#000000",
    "fullscreen-background-color": "#E0E0E0",
    "header-background-color": "#87CEEB",
    "selected-background": "rgba(0, 0, 255, 0.3)",
  },
];

// Initialize configuration options with stored values or default values
let selectedWidth = GM_getValue("selectedWidth", 66);
let selectedTheme = GM_getValue("selectedTheme", "night");
let selectedLineSpacing = GM_getValue("selectedLineSpacing", 1); // Default line spacing

const css = `
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

.rm-button-container
{
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

.rm-text-wrapper{
    width: clamp(800px, var(--text-column-width), 2500px);
    
    margin-top: 75px;
    margin-bottom: 50px;
    margin-right: 80px;
}

.rm-insertion-point{
    background-color: var(--fullscreen-background-color);
    color: var(--fullscreen-text-color);
    line-height: var(--line-spacing);
    margin-block: var(--paragraph-spacing);
}

.rm-insertion-point ::selection {
    background-color: var(--selected-background);
    color: var(--fullscreen-text-color);
}

.rm-insertion-point h1{
    margin-bottom: 50px;
}

.rm-insertion-point .bbWrapper{
    font-size: 1.2rem !important;
}

.rm-insertion-point .bbCodeBlock {
    background-color: var(--fullscreen-background-color);
    color: var(--fullscreen-text-color);

    border: 1px solid;
    border-radius: 16px;
}

.rm-insertion-point .bbCodeBlock-shrinkLink, .rm-insertion-point .bbCodeBlock-expandLink
{
  background: unset;
  
}

.rm-insertion-point .bbCodeBlock-shrinkLink a, .rm-insertion-point .bbCodeBlock-expandLink a
{
  background-color: var(--fullscreen-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .bbCodeBlock-title
{
  background: var(--header-background-color);
  color: var(--fullscreen-text-color);
}

.rm-insertion-point .seperator
{
  margin: 25px 0px 25px 0px;
  height: 1px;
  background: var(--fullscreen-text-color);
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

.rm-config-panel input, .rm-config-panel select {
    margin-top: 10px;
    width: 100%;
    padding: 5px;
    border: 1px solid var(--header-background-color);
}

.rm-config-panel .close-config-button {
    margin-top: 10px;
    width: 100%;
    padding: 5px;
    border: 1px solid var(--header-background-color);
    background-color: var(--header-background-color);
    color: var(--fullscreen-text-color);
    cursor: pointer;
}
`;

const html = `
<div class="rm-text-viewer">
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
    <label for="width">Width (%):</label>
    <input type="range" id="width" min="50" max="100" value="${selectedWidth}">
    <label for="theme">Theme:</label>
    <select id="theme">
        ${availableThemes.map((theme) => `<option value="${theme.name}" ${theme.name === selectedTheme ? "selected" : ""}>${theme.name}</option>`).join("")}
    </select>
    <label for="line-spacing">Line Spacing:</label>
    <input type="range" id="line-spacing" min="0.8" max="3" step="0.1" value="${selectedLineSpacing}">
    <label for="paragraph-spacing">Paragraph Spacing:</label>
    
    <button class="rm-button close-config-button">Close</button>
  </div>
</div>
`;

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

function updateTheme() {
  applyCSSVariablesToDocument({
    "text-column-width": `${selectedWidth}%`,
    "line-spacing": selectedLineSpacing,
  });

  let currentTheme = availableThemes.find((theme) => theme.name === selectedTheme);
  applyCSSVariablesToDocument(currentTheme);
}

function addReaderModeUI() {
  "use strict";

  document.body.innerHTML += html;

  const closeButton = document.querySelector(".close-reader-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      hideTextViewer();
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
      GM_setValue("selectedWidth", selectedWidth); // Store the new width
      updateTheme();
    });
  }

  const themeSelect = document.getElementById("theme");
  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      selectedTheme = themeSelect.value;
      GM_setValue("selectedTheme", selectedTheme); // Store the new theme
      updateTheme();
    });
  }

  const lineSpacingInput = document.getElementById("line-spacing");
  if (lineSpacingInput) {
    lineSpacingInput.addEventListener("input", () => {
      selectedLineSpacing = parseFloat(lineSpacingInput.value);
      GM_setValue("selectedLineSpacing", selectedLineSpacing); // Store the new line spacing
      updateTheme();
    });
  }

  const closeConfigButton = document.querySelector(".close-config-button");
  if (closeConfigButton) {
    closeConfigButton.addEventListener("click", () => {
      OpenCloseConfig();
    });
  }
}

function OpenCloseConfig() {
  "use strict";

  const configPanel = document.querySelector(".rm-config-panel");
  if (configPanel) {
    configPanel.style.display = configPanel.style.display === "block" ? "none" : "block";
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

  //Get Threadmark Title
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
  //Insert the css into the page
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  document.head.appendChild(style);

  //Helper CSS Variables
  applyCSSVariablesToDocument({
    "close-button-background-color": "transparent",
    "close-button-color": "black",
  });

  updateTheme();

  //Add the text viewer to the page root
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
})();
