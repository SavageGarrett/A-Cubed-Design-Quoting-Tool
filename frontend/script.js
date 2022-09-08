const newTabBtn = document.querySelector('#new-tab-btn');
const tabsContainer = document.querySelector('.tabs-container');
const bodyText = document.querySelector('#body-container')


class TabController {
  
  constructor() {
    this.tabs = [];
    this.currentId = 0;
  }

  addTab() {
    let tab = {
      id: this.currentId++, // moved to top to make strings start from 1
      tabTitle: "tab " + this.currentId,
      bodyText: "Tab " + this.currentId,

      numOne : 0,
      numTwo : 0,
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
    
    let tab = this.tabs.find(tab => tab.id == tabId); // not strict because num/str comparison(?)
    bodyText.textContent = tab.bodyText;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-tab');
    deleteButton.setAttribute('data-id', tabId);
    deleteButton.addEventListener('click', this.handleRemoveTabClick.bind(this));
    bodyText.appendChild(deleteButton);

    this.renderInputs('First Operand:', 'num-one', tabId);
    this.renderInputs('Second Operand:', 'num-two', tabId);
    bodyText.appendChild(document.createElement('br')); // adding this so renderResults can replace it

    this.renderResults(tab);
  }

  renderInputs(labelText, id, tabId) { // I can probably improve the param names
    let tab = this.tabs.find(tab => tab.id == tabId)
    
    let label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    bodyText.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', id);
    input.setAttribute('id', id);
    input.value = (id == 'num-one') ? tab.numOne : tab.numTwo;
    if (input.value == 0) input.value = ''; // stop user from having to delete 0
    
    input.addEventListener('input', this.handleInputChange.bind(this));
    bodyText.appendChild(input);
  }

  renderResults(tab) {
    let result = document.createElement('p');
    result.classList.add('result');
    result.textContent = `${tab.numOne} + ${tab.numTwo} = ${parseInt(tab.numOne) + parseInt(tab.numTwo)}`;
    // if (tab.numOne == '' || tab.numTwo == '') result.textContent = 'Enter numbers to calculate';
    bodyText.replaceChild(result, bodyText.lastChild);
  }
  
  handleInputChange(event) {
    let tabId = document.querySelector('.active').getAttribute('data-id');
    let tab = this.tabs.find(tab => tab.id == tabId);
    console.log(tab)
    if (event.target.id == 'num-one') {
      tab.numOne = event.target.value;
    } else if (event.target.id == 'num-two') {
      tab.numTwo = event.target.value;
    }

    this.renderResults(tab);
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

  init() {
    newTabBtn.addEventListener('click', this.handleNewTabClick.bind(this));
  }

}

const tabController = new TabController();
tabController.init();