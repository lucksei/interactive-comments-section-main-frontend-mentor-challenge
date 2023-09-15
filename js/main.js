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

const replyTemplate = await fetch("/templates/reply-comment.html").then(
  (response) => {
    return response.text();
  }
);

//*
// main code
//*

const commentNodeTemplate = elementFromHTML(commentTemplate);
const replyNodeTemplate = elementFromHTML(replyTemplate);
const currentUser = data["currentUser"];

let commentNode = buildComment(commentNodeTemplate, data.comments[0]);
$.commentSection.appendChild(commentNode);
let replyNode = buildReply(replyNodeTemplate, 1);
$.commentSection.appendChild(replyNode);

traverseData(data["comments"], $.commentSection);

//*
// helper functions
//*

function traverseData(comments, commentSection) {
  comments.forEach((comment) => {
    // create comment
    let commentNode = buildComment(commentNodeTemplate, comment);
    commentSection.appendChild(commentNode);

    if (comment["replies"] != undefined && comment["replies"].length > 0) {
      // create reply section
      const replySection = document.createElement("div");
      replySection.id = `#reply-${comment.user.username}`;
      replySection.classList.add("reply-section");
      commentSection.appendChild(replySection);

      // recursiveness
      traverseData(comment["replies"], replySection);
    }
  });
}

function buildComment(commentNodeTemplate, commentData) {
  const commentNode = commentNodeTemplate.cloneNode(true);

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
  commentNode.id = commentData.id;
  image.src = commentData.user.image.webp;
  username.innerText = commentData.user.username;
  createdAt.innerText = commentData.createdAt;
  score.innerText = commentData.score;

  // modify the text content of the comment
  if (commentData.replyingTo != undefined) {
    const hashtag = document.createElement("a");
    hashtag.href = "#"; // TODO go to the reply
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
    console.log("upvote: " + commentData.id);
  });
  downvoteBtn.addEventListener("click", () => {
    console.log("downvote: " + commentData.id);
  });
  deleteBtn.addEventListener("click", () => {
    console.log("delete: " + commentData.id);
  });
  editBtn.addEventListener("click", () => {
    console.log("edit: " + commentData.id);
  });
  replyBtn.addEventListener("click", () => {
    console.log("reply: " + commentData.id);
  });

  return commentNode;
}

function buildReply(replyNodeTemplate, replyToId) {
  const replyNode = replyNodeTemplate.cloneNode(true);

  // query selectors
  const image = replyNode.querySelector('[data-id="image"]');
  const textArea = replyNode.querySelector('[data-id="text-area"]');
  const sendReplyBtn = replyNode.querySelector('[data-id="send-reply-btn"]');

  // change simple stuff
  replyNode.id = `add-reply-${replyToId}`;
  image.src = currentUser.image.webp;
  textArea.placeholder = "Add a reply...";
  sendReplyBtn.innerText = "REPLY";

  // add event listeners
  sendReplyBtn.addEventListener("click", () => {
    console.log("reply something");
  });

  return replyNode;
}

// create an HTML element from text
function elementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild.cloneNode(true);
}
