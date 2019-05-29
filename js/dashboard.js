const showMessageContent = (evt) => {
  if (
    evt.target.classList.contains('messages')
    || evt.target.classList.contains('message-details')
  ) {
    const messageContainer = document.querySelectorAll('.message-container');
    messageContainer.forEach((currentElement) => {
      currentElement.style.display = 'none';
    });
    document.querySelector('.main-new-inbox-body').style.display = 'block';
  }
};

const showListContent = (clickedElement) => {
  // hides sidebar if on responsive mode
  if (window.innerWidth <= 600) {
    sidebar.classList.toggle('show-sidebar');
  }

  const allActiveTab = document.querySelectorAll('.active');
  allActiveTab.forEach((currentTab) => {
    currentTab.classList.remove('active');
  });

  const allChildren = mainContent.children;
  const childrenArray = Array.prototype.slice.call(allChildren);
  childrenArray.forEach((currentElement) => {
    currentElement.style.display = 'none';

    if (currentElement.classList.contains(`${clickedElement}-container`)) {
      currentElement.firstElementChild.style.display = 'block';
      document.querySelector(`.${clickedElement}`).classList.add('active');
      currentElement.style.display = 'block';
    }
  });
};

const displaMainContent = (evt) => {
  if (evt.target.classList.contains('inbox')) {
    showListContent('inbox');
  }

  if (evt.target.classList.contains('sent')) {
    showListContent('sent');
  }

  if (evt.target.classList.contains('draft')) {
    showListContent('draft');
  }

  if (evt.target.classList.contains('compose')) {
    const close = document.querySelector('.close');
    close.addEventListener('click', () => {
      document.querySelector('.inbox-container').style.display = 'block';
      document.querySelector('.compose-container').style.display = 'none';
    });
    showListContent('compose');
  }

  if (evt.target.classList.contains('groups')) {
    const groupsContent = document.querySelector('.groups-dropdown-content');
    groupsContent.classList.toggle('show-dropdown-content');
  }

  if (evt.target.classList.contains('create-group')) {
    const createForm = (document.querySelector('.create-group-form').style.display = 'block');
  }
};

const showMobileMenu = (evt) => {
  evt.preventDefault();
  sidebar.classList.toggle('show-sidebar');
};

const createGroupForm = document.querySelector('.create-group-form');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.content');
const menuIcon = document.querySelector('.menu-icon');

mainContent.addEventListener('click', showMessageContent);

sidebar.addEventListener('click', displaMainContent);

menuIcon.addEventListener('click', showMobileMenu);

createGroupForm.addEventListener('click', (evt) => {
  if (evt.target === createGroupForm || evt.target.className === 'cancel-form') {
    createGroupForm.style.display = 'none';
  }
});
document.querySelector('.time-received').textContent = new Date().toUTCString();

