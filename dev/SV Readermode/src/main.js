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