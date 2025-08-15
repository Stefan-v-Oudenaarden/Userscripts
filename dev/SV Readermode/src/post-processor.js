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