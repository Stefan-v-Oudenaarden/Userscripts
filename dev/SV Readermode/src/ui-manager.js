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