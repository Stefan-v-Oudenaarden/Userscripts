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