const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const enableNotificationsEl = document.getElementById("enable-notifications");
const shoppingListEl = document.getElementById("shopping-list");
const confirmButtonEl = document.getElementById("confirm-button");
const cancelButtonEl = document.getElementById("cancel-button");
const timerEl = document.querySelector('input[type="time"]');

// Things to run on load of page
if (Notification.permission === "granted") {
  enableNotificationsEl.style.display = "none";
} else {
  enableNotificationsEl.style.display = "block";
}

// Retrieve items from local storage or initialize an empty array
let rememberRealmItems =
  JSON.parse(localStorage.getItem("ReminderRealm")) || [];

// Function to update local storage with current items
function updateLocalStorage(items) {
  localStorage.setItem("ReminderRealm", JSON.stringify(items));
}

// Function to add an item to the shopping list
function addItemToList(item) {
  rememberRealmItems.push(item);
  updateLocalStorage(rememberRealmItems);
  appendItemToShoppingListEl(item);
}

// Function to remove an item from the shopping list
function removeItemFromList(item) {
  const index = rememberRealmItems.indexOf(item);
  if (index !== -1) {
    rememberRealmItems.splice(index, 1);
    updateLocalStorage(rememberRealmItems);
    clearShoppingListEl();
    rememberRealmItems.forEach(appendItemToShoppingListEl);
  }
}

// Function to append and remove an item to the shopping list DOM
function appendItemToShoppingListEl(item) {
  if (shoppingListEl.innerHTML === "No items here... yet") {
    clearShoppingListEl();
  }
  let newEl = document.createElement("li");
  newEl.innerHTML = item;
  shoppingListEl.appendChild(newEl);
  newEl.addEventListener("click", function () {
    removeItemFromList(item);   
  })
}

function timer() {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const selectedTime = timerEl.value.split(":");
  const selectedHours = parseInt(selectedTime[0]);
  const selectedMinutes = parseInt(selectedTime[1]);

  // Check if selectedHours or selectedMinutes are NaN
  if (isNaN(selectedHours) || isNaN(selectedMinutes)) {
    return; // Exit the function if time input is invalid
  }

  let hour = selectedHours - currentHours;
  let minute = selectedMinutes - currentMinutes;

  if (hour < 0 || (hour === 0 && minute < 0)) {
    // If the selected time is earlier than the current time
    hour += 24; // Add 24 hours to ensure the timer runs for the next day
  }
  if (minute < 0) {
    // Adjust the hour and minute accordingly if minute is negative
    hour -= 1;
    minute += 60;
  }
  
  console.log(`${hour} hours and ${minute} minutes remaining`);

  // Convert the remaining time to milliseconds
  const millisecondsRemaining = hour * 3600000 + minute * 60000;

  // Set the timeout to trigger the notification after the remaining time
  setTimeout(notifyMe, millisecondsRemaining);

  function notifyMe() {
    new Notification("Remember Realm", {
      body: "It's time to remember something",
      icon: "assets/ReminderRealm.png",
      sound: "./assets/notification-sound.mp3",
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    });
  }

  // Clear the input field after setting the timer
  timerEl.value = "";
}


// Initialize the shopping list
if (rememberRealmItems.length === 0) {
  shoppingListEl.innerHTML = "No items here... yet";
} else {
  rememberRealmItems.forEach(appendItemToShoppingListEl);
}

// Event listener for adding items
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value.trim();
  if (inputValue !== "") {
    addItemToList(inputValue);
    inputFieldEl.value = ""; // Clear input field after adding item
  }
});

addButtonEl.addEventListener("click", timer);

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

enableNotificationsEl.addEventListener("click", enableNotifications);

function enableNotifications() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Remember Realm", {
          body: "You have allowed notifications",
          icon: "assets/ReminderRealm.png",
        });
        window.location.reload();
      }
    });
  }
}
