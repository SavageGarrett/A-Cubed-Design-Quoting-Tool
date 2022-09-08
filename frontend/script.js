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
      bodyText: "test body " + this.currentId,

      // testing simple math
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

    bodyText.setAttribute('data-id', tab.id);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-tab');
    deleteButton.setAttribute('data-id', tabId);
    deleteButton.addEventListener('click', this.handleRemoveTabClick.bind(this));
    bodyText.appendChild(deleteButton);


    // testing form creation below - this method is getting huge, I'll refactor later

    //<label for="input-one">First Operand:</label>
    let label = document.createElement('label');
    label.setAttribute('for', 'num-one');
    label.textContent = 'First Operand:';
    bodyText.appendChild(label);

    //<input type="text" name="input-one" id="input-one">
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'num-one');
    input.setAttribute('id', 'num-one');
    input.value = tab.numOne;
    input.oninput = this.handleInputChange.bind(this);
    bodyText.appendChild(input);

    //<label for="input-two">Second Operand:</label>
    label = document.createElement('label');
    label.setAttribute('for', 'num-two');
    label.textContent = 'Second Operand:';
    bodyText.appendChild(label);

    //<input type="text" name="input-two" id="input-two">
    let inputTwo = document.createElement('input');
    inputTwo.setAttribute('type', 'text');
    inputTwo.setAttribute('name', 'num-two');
    inputTwo.setAttribute('id', 'num-two');
    inputTwo.value = tab.numTwo;
    inputTwo.oninput = this.handleInputChange.bind(this);
    bodyText.appendChild(inputTwo);

    let result = document.createElement('p');
    result.classList.add('result');
    result.textContent = `${tab.numOne} + ${tab.numTwo} = ${parseInt(tab.numOne) + parseInt(tab.numTwo)}`;
    bodyText.appendChild(result);
  }
  
  handleInputChange(event) {
    let tabId = event.target.parentNode.getAttribute('data-id');
    // console.log(tabId);
    let tab = this.tabs.find(tab => tab.id == tabId);
    console.log(tab)
    if (event.target.id == 'num-one') {
      tab.numOne = event.target.value;
    } else if (event.target.id == 'num-two') {
      tab.numTwo = event.target.value;
    }


    let result = `${tab.numOne} + ${tab.numTwo} = ${parseInt(tab.numOne) + parseInt(tab.numTwo)}`;
    document.querySelector('.result').textContent = result;
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