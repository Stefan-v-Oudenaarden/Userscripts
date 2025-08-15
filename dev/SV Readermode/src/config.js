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