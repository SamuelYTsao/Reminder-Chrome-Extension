var reminderArray = []; //holds reminders

//create button!
const createButton = document.getElementById("Create");

//occurs upon loading
document.addEventListener("DOMContentLoaded", () => {
  const updatedArray = localStorage.getItem("reminderArray");
  reminderArray = JSON.parse(updatedArray);

  //reinserting HTML elements to DOM
  for (let i = 0; i < reminderArray.length; i++) {
    const addedElementData = reminderArray[i]; //this is an object includes the .values and the HTML
    createButton.insertAdjacentHTML("beforebegin", addedElementData.html); //ok so this inserts the HTML but not the content that was stored
  }
  //reinserting input data to DOM
  const reminderList = document.getElementsByClassName("reminder");
  const timeList = document.getElementsByClassName("time");
  for (let j = 0; j < reminderList.length; j++) {
    reminderList[j].value = reminderArray[j].reminderData;
    timeList[j].value = reminderArray[j].timeData;
  }
});

//EVENT DELEGATION
document.body.addEventListener("click", (event) => {
  if (event.target.className === "saveButton") {
    const saveButtonParent = event.target.parentNode;
    const reminderSibling = saveButtonParent.querySelector("#reminder");
    const timeSibling = saveButtonParent.querySelector("#time");
    saveButtonAction(event.target, timeSibling, reminderSibling);
  } else if (event.target.className === "deleteButton") {
    deleteButtonAction(event.target);
  }
});

//THE CREATE EVENT LISTENER
createButton.addEventListener("click", () => {
  //Create new label element
  const newLabel = document.createElement("label");
  const newLabelContent = document.createTextNode("Reminder: ");
  newLabel.appendChild(newLabelContent);

  //create new input element
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "reminder");
  input.classList.add("reminder");

  //create a timer to go with it
  var inputTime = document.createElement("input");
  inputTime.setAttribute("type", "time");
  inputTime.setAttribute("id", "time");
  inputTime.classList.add("time");

  //create a save button to go with this

  var saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.setAttribute("id", "save");
  saveButton.classList.add("saveButton");

  //create a delete button to go with this use the same code as the save button
  var deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";

  deleteButton.setAttribute("id", "delete");
  deleteButton.classList.add("deleteButton");

  //wrap above items in a div

  //creating the div
  const currentDiv = document.createElement("div");
  currentDiv.appendChild(newLabel);
  currentDiv.appendChild(input);
  currentDiv.appendChild(inputTime);
  currentDiv.appendChild(saveButton);
  currentDiv.appendChild(deleteButton);

  document.body.insertBefore(currentDiv, createButton);
}); //where the create button event listener ends

//creates ID to identify reminder
function createUniqueID() {
  return "_" + Math.random().toString(36).substring(2, 9);
}

//MAKING A SAVE FUNCTION
function saveButtonAction(saveButton, inputTime, input) {
  var storedArray = localStorage.getItem("reminderArray");
  reminderArray = JSON.parse(storedArray);

  const parentElement = saveButton.parentNode; //the div container for a reminder
  let elementID = parentElement.getAttribute("data-ID");

  if (!elementID) {
    elementID = createUniqueID();
    parentElement.setAttribute("data-ID", elementID);
  }

  const elementSaved = {
    ID: elementID,
    html: saveButton.parentNode.outerHTML,
    reminderData: input.value,
    timeData: inputTime.value,
  };

  const reminderIndex = reminderArray.findIndex(
    (reminder) => reminder.ID === elementID
  );

  if (reminderIndex != -1) {
    //aka it exists
    reminderArray[reminderIndex] = elementSaved;
  } else {
    reminderArray.push(elementSaved);
  }

  localStorage.setItem("reminderArray", JSON.stringify(reminderArray));

  var reminderTime = inputTime.value;
  let [hours, minutes] = reminderTime.split(":");
  const clock = new Date();
  let targetTime = new Date(
    clock.getFullYear(),
    clock.getMonth(),
    clock.getDate(),
    parseInt(hours, 10),
    parseInt(minutes, 10),
    0,
    0
  );
  const timeUntilTrigger = targetTime.getTime();

  const message = {
    reminder: elementSaved.reminderData,
    time: timeUntilTrigger,
    alarmNumber: elementID,
  };
  console.log(`alarm${message.alarmNumber}:${message.reminder}`);

  //console.log(message.reminder);
  chrome.alarms.create(`alarm${message.alarmNumber}:${message.reminder}`, {
    when: message.time,
  });
}

//MAKING A DELETE FUNCTION
function deleteButtonAction(deleteButton) {
  const myParent = deleteButton.parentNode;

  reminderArray = JSON.parse(localStorage.getItem("reminderArray"));

  const removalIndex = reminderArray.indexOf(myParent.outerHTML); //gets index of this delete buttons element

  reminderArray.splice(removalIndex, 1);

  //third, set the array in the local storage again
  localStorage.setItem("reminderArray", JSON.stringify(reminderArray));

  myParent.remove();
}
