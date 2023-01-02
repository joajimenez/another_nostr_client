const tabs = document.querySelector('.tabs');
const tabList = tabs.querySelector('ul');
const tabItems = tabList.querySelectorAll('li');

tabList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    tabItems.forEach((tab) => tab.classList.remove('active'));
    event.target.classList.add('active');
  }
});
