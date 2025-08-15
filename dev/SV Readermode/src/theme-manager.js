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