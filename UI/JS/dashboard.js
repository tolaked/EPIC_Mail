const composeBox = document.querySelector(".compose-box");
const inboxMessage = document.querySelector(".inbox-list");
const sentMessage = document.querySelector(".sent-list");
const draftMessage = document.querySelector(".draft-list");
const groupMenu = document.querySelector("group-content");
const inboxButton = document.querySelector(".inbox");
const sentButton = document.querySelector(".sent");
const draftButton = document.querySelector(".draft");
const groupButton = document.querySelector(".groups");
const readEmail = document.querySelector(".main-new-inbox-body");
const inboxMessageContent = document.querySelector("inbox-messageContent");
const composeButton = document.querySelector(".compose");
const closeIcon = document.querySelector(".close");
const header = document.querySelector(".header");
const mainBody = document.querySelector(".main-body");
const deleteIcon = document.querySelector(".delete-icon");
const createGroupOverlay = document.querySelector(".create-group-form");
const createGroup = document.querySelector(".create-group");
const cancelForm = document.querySelector(".cancel-message-wrapper");
const dropdownContent = document.querySelector(".dropdownContent");

document.querySelector(".time-received").textContent = new Date().toUTCString();

/* When user clicks on the button, it hides and shows the content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it

cancelForm.addEventListener("click", () => {
  createGroupOverlay.style.display = "none";
});

createGroup.addEventListener("click", () => {
  createGroupOverlay.style.display = "block";
});
closeIcon.addEventListener("click", () => {
  composeBox.style.display = "none";
  inboxMessage.style.display = "block";
});

inboxMessage.addEventListener("click", () => {
  readEmail.style.display = "block";
  inboxMessage.style.display = "none";
  header.style.display = "none";
  mainBody.style.display = "none";
  draftMessage.style.display = "none";
});

sentButton.addEventListener("click", () => {
  sentMessage.style.display = "block";
  inboxMessage.style.display = "none";
  draftMessage.style.display = "none";

  readEmail.style.display = "none";
  composeBox.style.display = "none";
});

inboxButton.addEventListener("click", () => {
  sentMessage.style.display = "none";
  inboxMessage.style.display = "block";
  draftMessage.style.display = "none";

  readEmail.style.display = "none";
  composeBox.style.display = "none";
});

draftButton.addEventListener("click", () => {
  sentMessage.style.display = "none";
  inboxMessage.style.display = "none";
  draftMessage.style.display = "block";
  // groupMenu.style.display = "none";
  readEmail.style.display = "none";
  composeBox.style.display = "none";
});

composeButton.addEventListener("click", () => {
  composeBox.style.display = "block";
  sentMessage.style.display = "none";
  inboxMessage.style.display = "none";
  draftMessage.style.display = "none";
});
document.addEventListener("click", e => {
  if (e.target.className == "close") {
    composeBox.style.display = "none";
  }

  if (e.target.classList[0] == "inbox") {
    draftButton.classList.remove("active");
    sentButton.classList.remove("active");
    inboxButton.classList.add("active");
    groupButton.classList.remove("active");
  }
  if (e.target.classList[0] == "sent") {
    draftButton.classList.remove("active");
    sentButton.classList.add("active");
    inboxButton.classList.remove("active");
    groupButton.classList.remove("active");
  }
  if (e.target.classList[0] == "draft") {
    draftButton.classList.add("active");
    sentButton.classList.remove("active");
    inboxButton.classList.remove("active");
    groupButton.classList.remove("active");
  }
  if (e.target.classList[0] == "groups") {
    draftButton.classList.remove("active");
    sentButton.classList.remove("active");
    inboxButton.classList.remove("active");
    groupButton.classList.add("active");
  }
});

window.onload = () => {
  inboxButton.classList.add("active");
};
