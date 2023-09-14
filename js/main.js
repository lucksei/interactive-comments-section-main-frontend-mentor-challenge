// query selectors
const $ = {
  commentSection: document.querySelector('[data-id="comment-container"]'),
};

//*
// load files
//*

const data = await fetch("/data.json").then((response) => {
  return response.json();
});

const commentTemplate = await fetch("/templates/comment.html").then(
  (response) => {
    return response.text();
  }
);

//*
// main code
//*

const commentNode = elementFromHTML(commentTemplate);
const currentUser = data["currentUser"];
traverseData(data["comments"], $.commentSection);

//*
// helper functions
//*

function traverseData(comments, commentSection) {
  comments.forEach((comment) => {
    // create comment
    let newCommentNode = commentNode.cloneNode(true);
    buildComment(newCommentNode, comment, currentUser);
    commentSection.appendChild(newCommentNode);

    if (comment["replies"] != undefined && comment["replies"].length > 0) {
      // create reply section
      const replySection = document.createElement("div");
      replySection.classList.add("reply-section");
      commentSection.appendChild(replySection);

      // recursiveness
      traverseData(comment["replies"], replySection);
    }
  });
}

function buildComment(commentNode, commentData, currentUser) {
  // query selector
  const image = commentNode.querySelector('[data-id="image"]');
  const username = commentNode.querySelector('[data-id="username"]');
  const youSign = commentNode.querySelector('[data-id="you-sign"]');
  const createdAt = commentNode.querySelector('[data-id="created-at"]');
  const content = commentNode.querySelector('[data-id="content"]');
  const score = commentNode.querySelector('[data-id="score"]');

  const upvoteBtn = commentNode.querySelector('[data-id="upvote-btn"]');
  const downvoteBtn = commentNode.querySelector('[data-id="downvote-btn"]');
  const deleteBtn = commentNode.querySelector('[data-id="delete-btn"]');
  const editBtn = commentNode.querySelector('[data-id="edit-btn"]');
  const replyBtn = commentNode.querySelector('[data-id="reply-btn"]');

  // change simple stuff
  image.src = commentData["user"]["image"]["webp"];
  username.innerText = commentData["user"]["username"];
  createdAt.innerText = commentData["createdAt"];
  score.innerText = commentData["score"];

  // modify the text content of the comment
  if (commentData["replyingTo"] != undefined) {
    const hashtag = document.createElement("span");
    hashtag.classList.add("mention");
    hashtag.innerText = "@" + commentData["replyingTo"];
    content.replaceChildren(hashtag);
  }
  content.append(" " + commentData["content"]);

  // delete/hide unused elements (for current user/other user)
  if (commentData["user"]["username"] != currentUser["username"]) {
    youSign.remove();
    deleteBtn.remove();
    editBtn.remove();
  } else {
    replyBtn.remove();
  }

  // add event listeners for the buttons
  upvoteBtn.addEventListener("click", () => {
    console.log("upvote");
  });
  downvoteBtn.addEventListener("click", () => {
    console.log("downvote");
  });
  deleteBtn.addEventListener("click", () => {
    console.log("delete");
  });
  editBtn.addEventListener("click", () => {
    console.log("edit");
  });
  replyBtn.addEventListener("click", () => {
    console.log("reply");
  });
}

// create an HTML element from text
function elementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild.cloneNode(true);
}
