let loaded = false;

window.onload = sessionStorage.getItem("token");
if (sessionStorage.getItem("token") === null) {
  window.location.href = `/login.html`;
} else {
  loaded = true;
}

let currentPage = window.location.href;
console.log(currentPage);

const homeIndex = document.getElementById("homeindex");
const aboutIndex = document.getElementById("aboutindex");
const contactIndex = document.getElementById("contactindex");

if (homeIndex.href === currentPage) {
  homeIndex.classList.add("active-page");
}
if (aboutIndex == currentPage) {
  aboutIndex.classList.add("active-page");
}
if (contactIndex == currentPage) {
  contactIndex.classList.add("active-page");
}

let activeName = sessionStorage.getItem("user");

let currentUser = await getUser(activeName);
// console.log(currentUser);
// if (currentUser.length === 0) {
//   window.location.href = `/login.html`;
// } else {
//   currentUser = currentUser[0];
// }

const { userName, firstName, lastName, unionName, localName, title } =
  currentUser;
console.log(userName, firstName, lastName, unionName, localName, title);

const loggedIn = document.getElementById("loggedin");
loggedIn.textContent = `You are logged in as ${activeName}`;

const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  sessionStorage.clear();
  location.reload();
});
