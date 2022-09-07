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
        bodyText.textContent = tab.bodyText
      }
      

      newTab.addEventListener("click", function(e) {
        bodyText.textContent = tab.bodyText

        // remove active from all tabs before adding active to event target
        let tabNodes = tabsContainer.childNodes;
        tabNodes.forEach(tab => tab.classList.remove('active'))
        e.target.classList.add('active');
      })

      tabsContainer.appendChild(newTab);
    })
  }

}

const tabController = new TabController();

newTabBtn.onclick = () => {
  tabController.addTab();
};