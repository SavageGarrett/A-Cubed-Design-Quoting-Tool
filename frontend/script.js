const newTabBtn = document.querySelector('#new-tab-btn');
const tabsContainer = document.querySelector('.tabs-container');
const tabBody = document.querySelector('#body-container')


class TabController {
  
  constructor() {
    this.tabs = [];
    this.currentId = 0;
  }

  addTab() {
    let tab = {
      id: this.currentId++, // moved to top to make strings start from 1
      tabTitle: "tab " + this.currentId,
      tabBody: "Tab " + this.currentId,

      tabType: '', // 'addition', 'multiplication', 'division'

      numOne : 0,
      numTwo : 0,
    }

    this.tabs.push(tab);
    this.renderTabButtons();
  }

  renderTabButtons() {
    // for each tab in the tab array, create a button and append to dom
    // but first, clean up the old buttons.
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
    tabBody.textContent = tab.tabBody;

    this.renderDeleteBtn(tabId);
    
    if (!tab.tabType) {
      console.log('no tab type');

      let typeBtnContainer = document.createElement('div');
      typeBtnContainer.classList.add('type-btn-container');

      let tabTypePrompt = document.createElement('p');
      tabTypePrompt.textContent = 'What type of math problem would you like to solve?';
      tabBody.appendChild(tabTypePrompt);

      this.renderTypeButton(typeBtnContainer, 'Addition');
      this.renderTypeButton(typeBtnContainer, 'Multiplication');
      this.renderTypeButton(typeBtnContainer, 'Division');

      tabBody.appendChild(typeBtnContainer);
      
    } else {
      // if tab type is set, render inputs
      this.renderInputs('Operand One:', 'num-one', tabId);
      this.renderInputs('Operand Two:', 'num-two', tabId);
      tabBody.appendChild(document.createElement('br')); // adding this so renderResults can replace it
      this.renderResults(tab);
    }

  }

  handleTabTypeClick(event) {
    let tabId = document.querySelector('.active').getAttribute('data-id');
    let tab = this.tabs.find(tab => tab.id == tabId);
    tab.tabType = event.target.textContent;
    tab.tabBody += ` - ${tab.tabType}`;
    this.setBodyContent(tabId); // not sure if this is the best way 
  }

  renderInputs(labelText, id, tabId) { // I can probably improve the param names
    let tab = this.tabs.find(tab => tab.id == tabId)
    
    let label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText;
    tabBody.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('name', id);
    input.setAttribute('id', id);
    input.value = (id == 'num-one') ? tab.numOne : tab.numTwo;
    if (input.value == 0) input.value = ''; // stop user from having to delete 0
    
    input.addEventListener('input', this.handleInputChange.bind(this));
    tabBody.appendChild(input);
  }

  renderTypeButton(container, mathType) {
    let typeButton = document.createElement('button');
    typeButton.textContent = mathType;
    typeButton.addEventListener('click', this.handleTabTypeClick.bind(this));
    container.appendChild(typeButton);
  }

  renderResults(tab) {
    let result = document.createElement('p');
    result.classList.add('result');
    if (tab.numOne === '') tab.numOne = 0;
    if (tab.numTwo === '') tab.numTwo = 0;
    tab.numOne = parseFloat(tab.numOne);
    tab.numTwo = parseFloat(tab.numTwo);

    // simple math, this will be removed later
    if (tab.tabType == 'Addition') {
      result.textContent = `${tab.numOne} + ${tab.numTwo} = ${tab.numOne + tab.numTwo}`;
    } else if (tab.tabType == 'Multiplication') {
      result.textContent = `${tab.numOne} * ${tab.numTwo} = ${tab.numOne * tab.numTwo}`;
    } else if (tab.tabType == 'Division') {
      result.textContent = `${tab.numOne} / ${tab.numTwo} = ${Number.parseFloat((tab.numOne / tab.numTwo).toFixed(3))}`;
      if (tab.numTwo == 0) result.textContent = 'Cannot divide by 0';
    }
    tabBody.replaceChild(result, tabBody.lastChild);
  }

  renderDeleteBtn(tabId) {
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-tab');
    deleteBtn.setAttribute('data-id', tabId);
    deleteBtn.addEventListener('click', this.handleRemoveTabClick.bind(this));
    tabBody.appendChild(deleteBtn);
  }

  renderHomePage() {
    tabBody.textContent = ''

    let welcome = document.createElement('p');
    welcome.textContent = 'Welcome to a prototype tabbed calculator!';
    tabBody.appendChild(welcome);

    let instructions = document.createElement('p');
    instructions.textContent = 'Click the plus on the top left to get started!';
    tabBody.appendChild(instructions);


    let homeImg = document.createElement('img');
    homeImg.classList.add('home-img');
    homeImg.setAttribute('src', './img/ACubeWhiteNoText.png');
    homeImg.setAttribute('alt', 'A Cubed Design Logo');
    tabBody.appendChild(homeImg);
  }
  
  handleInputChange(event) {
    let tabId = document.querySelector('.active').getAttribute('data-id');
    let tab = this.tabs.find(tab => tab.id == tabId);
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

    // this probably isn't the best place to do this(?)
    if (this.tabs.length === 0) {
      this.renderHomePage();
      return;
    }
  }

  init() {
    newTabBtn.addEventListener('click', this.handleNewTabClick.bind(this));
    this.renderHomePage();
  }

}

const tabController = new TabController();
tabController.init();