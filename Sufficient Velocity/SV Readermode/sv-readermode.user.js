// ==UserScript==
// @name         SV Readermode
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  Add reading mode buttons to invididual posts on SV letting. This reader mode uses a solarized light colour scheme and respects SV colours and glows. It reveals invisitext and makes clear it was invisible with a slight change in colour and a dotted underline.
// @author       You
// @match        https://forums.sufficientvelocity.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sufficientvelocity.com
// @grant        none
// ==/UserScript==

// Add CSS for the fullscreen div, close button, and open button
const css = `
        .fullscreen-div {
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


            overflow: scroll;
        }

        .close-button {
            position: fixed;
            top: 10px;
            right: 30px;
            width: 35px;
            height: 35px;
            font-size: 30px;
            background-color: var(--close-button-background-color, transparent);
            color: var(--close-button-color, black);
            border: none;            
            cursor: pointer;
            z-index: 9001;
        }

        .text-wrapper{
            width: clamp(800px, 66%, 2500px);
            margin: auto;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .insertion-point{
            background-color: var(--fullscreen-background-color);
            color: var(--fullscreen-text-color);

        }

        .insertion-point h1{
            margin-bottom: 50px;
        }

        .insertion-point .bbWrapper{
            font-size: 1.2rem !important;
        }

        .insertion-point .bbCodeBlock {
            background-color: var(--fullscreen-background-color);
            color: var(--fullscreen-text-color);

            border: 1px solid;
            border-radius: 16px;
        }

        .insertion-point .bbCodeBlock-shrinkLink, .insertion-point .bbCodeBlock-expandLink
        {
          background: unset;
          
        }
        
        .insertion-point .bbCodeBlock-shrinkLink a, .insertion-point .bbCodeBlock-expandLink a
        {
          background-color: var(--fullscreen-background-color);
          color: var(--fullscreen-text-color);
        }

        .insertion-point .bbCodeBlock-title
        {
          background: var(--header-background-color);
          color: var(--fullscreen-text-color);
        }

        .insertion-point .seperator
        {
          margin: 25px 0px 25px 0px;
          height: 1px;
          background: var(--fullscreen-text-color);
        }

        .open-button {
            cursor: pointer;                        
        }

        .open-button:hover {

            text-decoration: none;
            color: #28a1dd;
            
        }
        
        *[style*="color:transparent"] {
            text-decoration: underline dotted !important;
            color: unset !important;
            opacity: 0.66;
        }

    `;

// Define the HTML structure
const html = `
            <div class="fullscreen-div">
                <button class="close-button close-reader-button"><i class="close-reader-button fa--xf far fa-times" aria-hidden="true"></i></button>
                <!-- Add more HTML content here -->
                <div class="text-wrapper">
                    <div class="insertion-point">

                    </div>
                </div>                
            </div>
        `;

function updateCSSVariables(cssProperties) {
  for (const key in cssProperties) {
    if (cssProperties.hasOwnProperty(key)) {
      const fullPropertyName = `--${key}`;
      const value = cssProperties[key];
      document.documentElement.style.setProperty(fullPropertyName, value);
    }
  }
}

// Function to initialize the fullscreen div and close button
function initializeFullscreenDiv() {
  "use strict";

  document.body.innerHTML += html;

  const closeButton = document.querySelector(".close-reader-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      hideReader();
    });
  }
}

// Function to add an open button to a specified element
function addOpenButton(container) {
  "use strict";

  const toolBarElements = container.getElementsByClassName("message-attribution-opposite--list");
  let toolBar;

  if (toolBarElements.length > 0) {
    toolBar = toolBarElements[0];
  }

  if (!toolbar) {
    return;
  }

  const listItemContent = '<i class="open-button fa--xf far fa-book-open" aria-hidden="true"></i>';

  var newListItem = document.createElement("li");
  newListItem.innerHTML = listItemContent;

  toolBar.appendChild(newListItem);

  const openButton = toolBar.querySelector(".open-button");
  if (openButton) {
    openButton.addEventListener("click", () => {
      openFullscreenDiv(container);
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
      openFullscreenDivForPage();
    });
  }
}

function showReader() {
  "use strict";

  document.body.style = "overflow: hidden !important";
  document.querySelector(".fullscreen-div").style.display = "block";
}

function hideReader() {
  "use strict";

  document.body.style = "overflow: scroll !important";
  document.querySelector(".fullscreen-div").style.display = "none";
}

// New method to handle opening the fullscreen div with the container element
function openFullscreenDiv(container) {
  "use strict";

  const insertionPoint = document.querySelector(".insertion-point");
  if (!insertionPoint) {
    return;
  }

  insertionPoint.innerHTML = "";

  addArticleToReader(container);
  showReader();
}

// New method to handle opening the fullscreen div with the container element
function openFullscreenDivForPage() {
  "use strict";

  const insertionPoint = document.querySelector(".insertion-point");
  if (!insertionPoint) {
    return;
  }

  insertionPoint.innerHTML = "";

  const articles = document.getElementsByClassName("message--post");

  if (articles) {
    for (let article of articles) {
      addArticleToReader(article);

      var horizontalRule = document.createElement("hr");
      horizontalRule.classList = "seperator";
      insertionPoint.appendChild(horizontalRule);
    }
  }
  showReader();
}

function addArticleToReader(container) {
  const insertionPoint = document.querySelector(".insertion-point");
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
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  document.head.appendChild(style);

  updateCSSVariables({
    "fullscreen-text-color": "#2a2a2a",
    "fullscreen-background-color": "#f4ecd8",
    "header-background-color": "#dec588",
    "close-button-background-color": "transparent",
    "close-button-color": "black",
    "open-button-background-color": "grey",
  });

  initializeFullscreenDiv();

  const readerModeButtonGroups = document.getElementsByClassName("threadmarks-reader");
  for (const group of readerModeButtonGroups) {
    console.log(group);
    addPageViewButton(group);
  }

  const articles = document.getElementsByClassName("message--post");

  if (articles) {
    for (let article of articles) {
      addOpenButton(article);
    }
  }
})();
