// ==UserScript==
// @name         SV OP Highlighting
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  try to take over the world!
// @author       Stefan van Oudenaarden
// @match        https://forums.sufficientvelocity.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sufficientvelocity.com
// @downloadURL  https://github.com/Stefan-v-Oudenaarden/Userscripts/raw/refs/heads/main/Sufficient%20Velocity/SV%20OP%20Highlighting/sv-op-highlighting.user.js
// @grant        none
// ==/UserScript==

(function () {
  const OPName = document.getElementsByClassName("fa-user")[0].parentElement.innerText.split("\n")[2].trim();
  const posts = document.getElementsByClassName("message-name");

  if (OPName && posts) {
    for (let post of posts) {
      if (post.innerText === OPName) {
        post.parentElement.parentElement.parentElement.setAttribute("style", "background: #1B2938;");
      }
    }
  }
})();
