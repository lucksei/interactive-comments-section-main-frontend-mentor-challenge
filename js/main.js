// query selectors
const $ = {
  commentSection: document.querySelector('[data-id="comment-container"]'),
};

//*
// load files
//*

const data = await fetch("../data.json").then((response) => {
  return response.json();
});

const commentTemplate = await fetch("/templates/comment.template").then(
  (response) => {
    return response.text();
  }
);

//*
// main code
//*

// const comment = fillTemplate(commentTemplate, [
//   "./images/avatars/image-amyrobson.png",
//   "amyrobson",
//   "1 month ago",
//   "@elis",
//   "Content",
//   "12",
// ]);

const commentNode = elementFromHTML(commentTemplate);
let commentData = data["comments"][1]["replies"][0];
console.log(commentData);
replaceComment(commentNode, commentData);
$.commentSection.appendChild(commentNode.cloneNode(true));
$.commentSection.appendChild(commentNode.cloneNode(true));

//*
// helper functions
//*

function replaceComment(commentNode, commentData) {
  const image = commentNode.querySelector('[data-id="image"]');
  const username = commentNode.querySelector('[data-id="username"]');
  const youSign = commentNode.querySelector('[data-id="you-sign"]');
  const createdAt = commentNode.querySelector('[data-id="created-at"]');
  const content = commentNode.querySelector('[data-id="content"]');
  const score = commentNode.querySelector('[data-id="score"]');

  image.src = commentData["user"]["image"]["webp"];
  username.innerText = commentData["user"]["username"];
  createdAt.innerText = commentData["createdAt"];
  score.innerText = commentData["score"];

  const hashtag = document.createElement("span");
  hashtag.innerText = "@" + commentData["replyingTo"];
  hashtag.classList.add("mention");

  content.innerText = commentData["content"];
  content.appendChild(hashtag);
}

// fill text template with different vars whenever there is a {{ }}
function fillTemplate(template, arrayStrings) {
  let newString = "";
  let arrayIndex = 0;
  let i = 0;
  let j = 0;
  while (j < template.length) {
    if (template[j] == "{" && template[j + 1] == "{") {
      newString += template.substring(i, j); // text before
      i = j;
      while (template[j - 2] != "}" && template[j - 3] != "}") {
        j++;
      }
      newString += arrayStrings[arrayIndex]; // text to replace
      arrayIndex += 1;
      console.log(i + " " + j);

      i = j;
    }
    j++;
  }

  newString += template.substring(i, template.length); // text after

  return newString;
}

// create an HTML element from text
function elementFromHTML(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild.cloneNode(true);
}
