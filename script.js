let feedArray = [];

const form = document.querySelector("#newPost form");
const userName = document.querySelector("#userName");
const content = document.querySelector("#content");
const feed = document.querySelector("#feed");
const emptyFeedMessage = document.querySelector("#emptyFeedMessage");
const sortOrder = document.querySelector("#sortOrder");
const searchUserBtn = document.querySelector(".searchUser");
const searchBar = document.querySelector(".searchBar");
let activeSort = "newest";
let searchedUsername = "";

function addPost(username, postContent, timestamp = Date.now()) {
    const newPost = {
    id: feedArray.length + 1,
    username: username,
    content: postContent,
    likes: 0,
    timestamp: timestamp
    };

    feedArray.push(newPost);
}

function likePost(postId) {
    const post = feedArray.find((post) => post.id === postId);

    if (!post) {
    return;
    }

    post.likes++;
    renderFeed();
}

function deletePost(postId) {
    feedArray = feedArray.filter((post) => post.id !== postId);
    renderFeed();
}

function getFeed() {
    return feedArray;
}

function sortByNewest(posts = feedArray) {
    return [...posts].sort((a, b) => b.timestamp - a.timestamp);
}

function sortByLikes(posts = feedArray) {
    return [...posts].sort((a, b) => b.likes - a.likes);
}

function getPostsByUser(username) {
    return feedArray.filter((post) => {
        return post.username.toLowerCase() === username.toLowerCase();
    });
}

function renderFeed() {
    feed.replaceChildren();

    const matchingPosts = searchedUsername
        ? getPostsByUser(searchedUsername)
        : feedArray;
    const posts = activeSort === "likes"
        ? sortByLikes(matchingPosts)
        : sortByNewest(matchingPosts);

    if (posts.length === 0) {
        feed.appendChild(emptyFeedMessage);
        return;
    }

    posts.forEach((post) => {
    const postElement = document.createElement("article");
    postElement.classList.add("posts");

    const postContent = document.createElement("h3");
    postContent.classList.add("content");
    postContent.textContent = post.content;

    const postInfo = document.createElement("div");
    postInfo.classList.add("Username");

    const postUser = document.createElement("p");
    postUser.classList.add("Username");
    postUser.textContent = `${post.username},`;

    const postLikes = document.createElement("p");
    postLikes.classList.add("likes")
    postLikes.textContent = `${post.likes} likes`;

    const likeButton = document.createElement("button");
    likeButton.classList.add("buttons");
    likeButton.textContent = "Like Post";
    likeButton.addEventListener("click", () => likePost(post.id));

    const delButton = document.createElement("button");
    delButton.classList.add("buttons")
    delButton.textContent = "Delete Post"
    delButton.addEventListener("click", () => deletePost(post.id));

    postInfo.append(postUser, postLikes, likeButton, delButton);
    postElement.append(postContent, postInfo);
    feed.appendChild(postElement);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = userName.value.trim();
    const postContent = content.value.trim();

    if (username === "" || postContent === "") {
    return;
    }

    addPost(username, postContent);
    renderFeed();

    form.reset();
});

sortOrder.addEventListener("change", (event) => {
    activeSort = event.target.value;
    renderFeed();
});

searchUserBtn.addEventListener("click", (event) => {
    event.preventDefault();
    searchedUsername = searchBar.value.trim();
    renderFeed();
});

renderFeed();
