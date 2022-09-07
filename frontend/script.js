const newTabBtn = document.querySelector('#new-tab-btn');
const tabsContainer = document.querySelector('.tabs-container');
const bodyText = document.querySelector('#body-text')


class TabController {
  
  constructor() {
    this.tabs = [];
    this.currentId = 0;
  }

  addTab() {
    let tab = {
      id: this.currentId++, // moved to top to make strings start from 1
      tabTitle: "tab " + this.currentId,
      bodyText: "test body " + this.currentId,
      
    }

    this.tabs.push(tab);
    this.renderTabButtons();
  }

  renderTabButtons() {
    // for each tab in the tab array, create a button and append to dom
    // but first, clean up the old buttons
    while (tabsContainer.firstChild) {
      tabsContainer.removeChild(tabsContainer.firstChild)
    }

    this.tabs.forEach(tab => {

      let newTab = document.createElement('button');
      newTab.textContent = tab.tabTitle;
      newTab.classList.add('tab');
      if (this.tabs.at(-1) === tab) {
        newTab.classList.add('active');
        this.setBodyContent(tab.id);
      }
      
      newTab.setAttribute('data-id', tab.id);
      newTab.addEventListener('click', this.handleTabClick.bind(this));

      tabsContainer.appendChild(newTab);
    })
  }
  
  setTabActive(tabId) {
    // remove active from all tabs before adding active to event target
    let tabNodes = tabsContainer.childNodes;
    tabNodes.forEach(tab => tab.classList.remove('active'))
    document.querySelector(`button[data-id="${tabId}"]`).classList.add('active');
  }

  setBodyContent(tabId) {
    
    console.log(tabId)
    let tab = this.tabs.find(tab => tab.id == tabId); // not strict because num/str comparison(?)
    console.log(tab)
    bodyText.textContent = tab.bodyText;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-tab');
    deleteButton.setAttribute('data-id', tabId);
    deleteButton.addEventListener('click', this.handleRemoveTabClick.bind(this));
    bodyText.appendChild(deleteButton);
  }

  removeTab(tabId) {
    let tabIndex = this.tabs.findIndex(tab => tab.id == tabId); // also not strict, I should fix this later
    this.tabs.splice(tabIndex, 1);
    this.renderTabButtons();
  }

  handleTabClick(event) {
    let tabId = event.target.getAttribute('data-id');
    this.setTabActive(tabId);
    this.setBodyContent(tabId);
  }

  handleNewTabClick(event) {
    this.addTab();
  }

  handleRemoveTabClick(event) {
    let tabId = event.target.getAttribute('data-id');
    console.log("removing", tabId);
    this.removeTab(tabId);
  }

  

}

const tabController = new TabController();

newTabBtn.onclick = () => {
  tabController.addTab();
};