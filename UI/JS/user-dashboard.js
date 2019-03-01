const sidebarIcons = document.querySelector(".sidebar");
const content = document.querySelector(".content");

sidebarIcons.addEventListener("click", evt => {
  const parentElement = document.querySelector(
    `.${evt.target.className}-content`
  );

  parentElement.style.display = "flex";
});
