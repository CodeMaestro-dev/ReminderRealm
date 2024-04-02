const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const enableNotificationsEl = document.getElementById("enable-notifications");
const shoppingListEl = document.getElementById("shopping-list");

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
    // clearShoppingListEl();
    rememberRealmItems.forEach(appendItemToShoppingListEl);
  }
}

// Function to append and remove an item to the shopping list DOM
function appendItemToShoppingListEl(item) {
  let newEl = document.createElement("li");
  newEl.textContent = item;
  newEl.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this item?")) {
      newEl.remove();
      removeItemFromList(item);
    } else {
      return;
    }
  });
  shoppingListEl.appendChild(newEl);
}

// Initialize the shopping list
// if (rememberRealmItems.length === 0) {
//   shoppingListEl.innerHTML = "No items here... yet";
// } else {
//   rememberRealmItems.forEach(appendItemToShoppingListEl);
// }

// Event listener for adding items
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value.trim();
  if (inputValue !== "") {
    addItemToList(inputValue);
    inputFieldEl.value = ""; // Clear input field after adding item
  }
});

enableNotificationsEl.addEventListener("click", askNotificationsPermission);


// if (rememberRealmItems.length === 0) {
//   shoppingListEl.innerHTML = "No items here... yet";
// } else {
//   clearShoppingListEl();
//   rememberRealmItems.forEach(appendItemToShoppingListEl);
// }

if (Notification.permission === 'denied' || Notification.permission === 'default') {
  enableNotificationsEl.style.display = 'block';
} else {
  enableNotificationsEl.style.display = 'none';

}

function askNotificationsPermission() {
  Notification.requestPermission().then((result) => {
    if (result === 'granted') {
      enableNotificationsEl.style.display = 'none';
    }
    console.log(result);
    showNotifications();
  });
}

function showNotifications() {
  const notification = new Notification('RememberRealm', {
    body: `You have somethings to remember about ${rememberRealmItems[0]} `,
    icon: './assets/ReminderRealm.png'
  })
}
