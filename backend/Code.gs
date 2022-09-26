/**
 * @OnlyCurrentDoc
 */
// The JsDoc annotation above is used to force the authorization dialog to ask only for access to files in which the add-on or script is used, rather than all of a user's spreadsheets, documents, or forms. 

// Custom menu
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu('Options')
  .addItem('Create new order', 'newOrder')
  .addItem('Clear invoice', 'clearInvoice')
  .addToUi();
}

// Returns list of print types from 'In Progress' sheet
function getPrintTypeList() {
  const printType = SpreadsheetApp.getActive().getSheetByName("In Progress").getRange('$B$2:$B').getValues(); // get values from 'Print Type' column
  const filterPrintType = printType.filter(String); // filter out empty values from 'Print Type' column
  const mergePrintType = [].concat.apply([], filterPrintType); // merge list of values into one list
  return mergePrintType;
};

// Returns list of model names from 'In Progress' sheet
function getModelNameList() {
  const modelName = SpreadsheetApp.getActive().getSheetByName("In Progress").getRange('$C$2:$C').getValues(); // get values from 'Print Type' column
  const filterModelName = modelName.filter(String); // filter out empty values from 'Print Type' column
  const mergeModelName = [].concat.apply([], filterModelName); // merge list of values into one list
  return mergeModelName;
}

// Template options based on print type
function getTemplateType(printType) {
  switch (printType) {
    case "Filament":
      return "Filament Template";
      break;
    case "Laser":
      return "Laser Template";
      break;
    case "Resin":
      return "Resin Template";
      break;
    default:
      return "No Template Found";
  }
}

// Create tab for each model based on print type in 'In Progress' sheet
function createModelTab(newOrderSpreadsheetId) {
  const newOrderSpreadsheet = SpreadsheetApp.openById(newOrderSpreadsheetId); 

  for (i=0; i<getPrintTypeList().length; i++) {
    const printType = getPrintTypeList()[i];
    const templateType = getTemplateType(printType); // get template based on print type input
    const modelName = getModelNameList()[i];
    const spreadsheet = SpreadsheetApp.getActive();
    const sheet = spreadsheet.getSheetByName(templateType);
    
    // Copy template, set tab name to model name, and show sheet because templates are hidden
    sheet.copyTo(newOrderSpreadsheet).setName(modelName).showSheet();
    newOrderSpreadsheet.getSheetByName(modelName).getRange('B2').setValue(modelName);
    //console.log('New ' + getTemplateType(printType)+ ' for ' + modelName);
  }
  
  copyToLog(newOrderSpreadsheet);
}

// Alert if emails in 'In Progress' sheet do not match with option to continue if false
function emailMatchAlert(emailAsFolderName) {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
     'Emails do not match across all orders',
     'Do you still wish to continue?',
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    // user clicks "Yes"
    ui.alert('Creating new order folder(s)...');
    createFolderAndFiles(emailAsFolderName); // create new order folder
  } else {
    // user clicks "No"
    ui.alert('Action Terminated');
  }
}

// Create new order folder under 'Orders' folder, add new spreadsheet, add model tabs to spreadsheet
function createFolderAndFiles(emailAsFolderName) {
  const orderFolder = DriveApp.getFolderById('1geXqYDOUX9t1fU6Wjn87CpW2FMf-C6vD'); // get parent folder (using id for 'Orders' folder)
  const newFolder = orderFolder.createFolder(emailAsFolderName); // create new subfolder in parent folder
  const spreadsheet = SpreadsheetApp.create('New Quote'); // create new spreadsheet (by default saved to Drive root folder)
  const blankSheet = spreadsheet.getSheetByName('Sheet1'); // NEED TO DELETE THIS SHEET AFTER MODEL TABS ARE CREATED

  const newOrderSpreadsheetId = spreadsheet.getId();
  DriveApp.getFileById(newOrderSpreadsheetId).moveTo(newFolder); // move new spreadsheet to subfolder
  createModelTab(newOrderSpreadsheetId);
}

// Check email(s) before creating new order; run alert if email mismatch
function newOrder() {
  const email = SpreadsheetApp.getActive().getSheetByName("In Progress").getRange('$A$2:$A').getValues(); // get values from 'Print Type' column
  const filterEmail = email.filter(String); // filter out empty values from 'Print Type' column
  const mergeEmails = [].concat.apply([], filterEmail); // merge list of values into one list
  const sameEmail = mergeEmails.every((val, i, arr) => val === arr[0]);
  const emailAsFolderName = mergeEmails[0]; // first element of email list to be used as new order folder name

  if (sameEmail === true) {
    // emails match
    createFolderAndFiles(emailAsFolderName);
  } else {
    // emails do not match
    emailMatchAlert(emailAsFolderName);
  }
}

function copyToLog(newOrderSpreadsheet) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const inProgressSheet = spreadsheet.getSheetByName('In Progress');
  
  const sourceRange = inProgressSheet.getDataRange();
  const sourceValues = sourceRange.getValues();
  sourceValues.shift(); // remove header column names

  const rowCount = sourceValues.length;
  const columnCount = sourceValues[0].length;
  
  const logSheet = spreadsheet.getSheetByName('Log');
  const targetRange = logSheet.getRange(logSheet.getLastRow()+1, 1, rowCount, columnCount);
  
  const fileLink = newOrderSpreadsheet.getUrl();

  for (i=0; i < sourceValues.length; i++) {
    sourceValues[i][10] = 'Created';
    sourceValues[i][12] = fileLink;
    targetRange.setValues(sourceValues);
  }
} 

function buildSummary() {
// .setFormula("=TRANSPOSE({"+modelName+"!$B$1:$B$7})")

}

// Clear invoice
function clearInvoice() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const invoiceSheet = spreadsheet.getSheetByName('Invoice');

  const invoiceNum = invoiceSheet.getRange('$E$5'); // get invoice number cell
  const lineItems = invoiceSheet.getRange('$B$18:$D$36'); // get invoice line items range
  const invoiceNumFormula = invoiceNum.getFormulas(); // get formula for invoice number cell 

  lineItems.clearContent(); // clear invoice line items
  invoiceNum.setFormulas(invoiceNumFormula); // clear invoice number cell and reapply formula
}

// Sidebar form in 'Clients' sheet
function sidebarClientForm () {
  const widget = HtmlService.createHtmlOutputFromFile('client.html');
  widget.setTitle('Add New Client');
  SpreadsheetApp.getUi().showSidebar(widget);
}

// Populate 'Clients' sheet with form input
function appendClientsSheet(form) {
 const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
 const clients = spreadsheet.getSheetByName('Clients');
 
 const lastRow = clients.getLastRow();
 const colID = clients.getRange(lastRow, 1).getValue() + 1;

 const taxRate = .07500; // appears as 7.500% with sheet column formatting
 const row = [colID, form.company, form.bill, form.address1, form.address2, form.note, taxRate,'','ACTIVE', form.email];
 clients.appendRow(row);
}

// Move order between 'Queue' and 'In Progress' sheets based on order status (Pending/In Progress)
function onEdit(event) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetEvent = event.source.getActiveSheet();
  const rangeEvent = event.source.getActiveRange();
  if(sheetEvent.getName() == "Queue" && rangeEvent.getColumn() == 11 && rangeEvent.getValue() == "In Progress") {
    let row = rangeEvent.getRow();
    let numColumns = sheetEvent.getLastColumn();
    let targetSheet = spreadsheet.getSheetByName("In Progress");
    let target = targetSheet.getRange(targetSheet.getLastRow() + 1, 1);
    sheetEvent.getRange(row, 1, 1, numColumns).moveTo(target);
    sheetEvent.deleteRow(row);
  }
  if(sheetEvent.getName() == "In Progress" && rangeEvent.getColumn() == 11 && rangeEvent.getValue() == "Pending") {
    let row = rangeEvent.getRow();
    let numColumns = sheetEvent.getLastColumn();
    let targetSheet = spreadsheet.getSheetByName("Queue");
    let target = targetSheet.getRange(targetSheet.getLastRow() + 1, 1);
    sheetEvent.getRange(row, 1, 1, numColumns).moveTo(target);
    sheetEvent.deleteRow(row);
  }
}

