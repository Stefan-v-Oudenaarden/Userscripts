// ==UserScript==
// @name         SV OP Highlighting
// @namespace    http://tampermonkey.net/
// @version      2026-12-03
// @description  try to take over the world!
// @author       Stefan van Oudenaarden
// @include      https://forums.sufficientvelocity.com/threads/*
// @include      https://forums.spacebattles.com/threads/*
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
        if (window.location.href.includes("sufficientvelocity")) {
          post.parentElement.parentElement.parentElement.setAttribute("style", "background: #1B2938;");
        }

        if (window.location.href.includes("spacebattles")) {
          console.log(post.parentElement.parentElement.parentElement);
          post.parentElement.parentElement.parentElement.setAttribute("style", "background: #496898;");
        }
      }
    }
  }
})();
