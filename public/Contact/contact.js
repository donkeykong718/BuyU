let currentPage = window.location.href;

const homeIndex = document.getElementById('homeindex')
const aboutIndex = document.getElementById('aboutindex')
const contactIndex = document.getElementById('contactindex')

if (homeIndex.href === currentPage) {
  homeIndex.classList.add("active-page");
}
if (aboutIndex == currentPage) {
  aboutIndex.classList.add("active-page");
}
if (contactIndex == currentPage) {
  contactIndex.classList.add("active-page");
}