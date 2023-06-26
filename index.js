// Firebase database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://marker-c5f09-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "messages")


let notificationTimeout // Used to display notifications on the screen for a short time
let maxMessagesDisplayed = 30 // Used to limit the display to the last x number of messages


// Take control of elements used in multiple functions
const notification = document.getElementById('notification')
const messageInput = document.getElementById('message-input')
const nameInput = document.getElementById('name-input')
const nameSaveChkbx = document.getElementById('name-save')


// Start with the message input field in focus
messageInput.focus()

// Load the stored name when the page is first opened
loadNameFromLocalStorage()

// Load the stored theme color when the page is first loaded
loadThemeColorFromLocalStorage()

// Listen for clicks on certain things
document.addEventListener('click', function(event){
    
    // Send button is clicked
    if(event.target.id === 'message-btn'){

        // Check that a name has been entered
        if (nameInput.value){
            handleMessageBtnClick()
        }

        // If no name, inform the user
        else {
            nameInput.focus() // Move the cursor to the name input field
            notification.innerText= "Please add a name"
            showNotification()
 
        }
    }

    // Save Name check box is clicked
    else if (event.target.id === 'name-save'){
        handleNameSaveChkbx()
    }

    // Menu icon is clicked
    else if (event.target.id === 'menu-btn'){
        handleMenuBtnClicked()
    }

    // Blue menu button is clicked
    else if (event.target.id === 'menu-blue'){
        changeThemeToBlue()
    }

    // Purple menu button is clicked
    else if (event.target.id === 'menu-purple'){
        changeThemeToPurple()
    }
})


// Hitting Enter while typing inside the message input field will send the message
messageInput.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("message-btn").click()
    }
})


// Click on the Send button
function handleMessageBtnClick(){
    const messageInput = document.getElementById('message-input')

    // Check if there is a message entered
    if(messageInput.value){

        // Push the new message contents to the database
        push(messagesInDB, {
            messageName: nameInput.value,
            messageText: messageInput.value,
            messageDateTime: getCurrentDateTimeAsString()
        })

        // Clear the message textarea after the message is pushed
        messageInput.value = ''

        // Move the focus back to the message input field area
        messageInput.focus()

        // If the Save Name check box is checked, save to the browser
        if (nameSaveChkbx.checked) {
            saveNameToLocalStorage(nameInput.value)
        }

        // If the box is not checked, clear the name textarea
        else {
            nameInput.value = ''
        }

    }
}


// Click on the Name Save Check Box
function handleNameSaveChkbx(){

    // Checked (saves name once Send button is hit)
    if (nameSaveChkbx.checked){
        notification.innerText= "Name Will Be Saved"
    }
    
    // Not checked (save an empty field which clears it out)
    else {
        notification.innerText= "Name Will Not Be Saved"
        saveNameToLocalStorage('')
    }

    showNotification()
}


// Click on the menu button
function handleMenuBtnClicked(){
    document.getElementById('menu').classList.toggle('hidden') // toggle the hidden class
}


// Click on the blue menu button
function changeThemeToBlue(){

    document.getElementById('h1Element').classList.remove('purple-h1')
    document.getElementById('h1Element').classList.add('blue-h1')

    document.getElementById('mainElement').classList.remove('purple-light-bg')
    document.getElementById('mainElement').classList.add('blue-light-bg')

    document.getElementById('headerElement').classList.remove('purple-medium-bg')
    document.getElementById('headerElement').classList.add('blue-medium-bg')

    document.getElementById('footerElement').classList.remove('purple-medium-bg')
    document.getElementById('footerElement').classList.add('blue-medium-bg')

    document.getElementById('menu').classList.remove('purple-medium-bg')
    document.getElementById('menu').classList.add('blue-medium-bg')

    document.getElementById('message-btn').classList.remove('purple-btn')
    document.getElementById('message-btn').classList.add('blue-btn')

    saveThemeColorToLocalStorage('blue')

}


// Click on the purple menu button
function changeThemeToPurple(){

    document.getElementById('h1Element').classList.remove('blue-h1')
    document.getElementById('h1Element').classList.add('purple-h1')
    
    document.getElementById('mainElement').classList.remove('blue-light-bg')
    document.getElementById('mainElement').classList.add('purple-light-bg')

    document.getElementById('headerElement').classList.remove('blue-medium-bg')
    document.getElementById('headerElement').classList.add('purple-medium-bg')

    document.getElementById('footerElement').classList.remove('blue-medium-bg')
    document.getElementById('footerElement').classList.add('purple-medium-bg')

    document.getElementById('menu').classList.remove('blue-medium-bg')
    document.getElementById('menu').classList.add('purple-medium-bg')

    document.getElementById('message-btn').classList.remove('blue-btn')
    document.getElementById('message-btn').classList.add('purple-btn')

    saveThemeColorToLocalStorage('purple')

}


// Display a notification
function showNotification(){
    document.getElementById('notification').classList.remove('hidden') // remove the hidden class
    clearTimeout(notificationTimeout) // clear any current timeout
    notificationTimeout = setTimeout(hideNotification, 3000) // hide the notification after 3 seconds
}


// Hide a notification
function hideNotification(){
    document.getElementById('notification').classList.add('hidden')
}


// Save the name to local storage
function saveNameToLocalStorage(name) {
    localStorage.setItem('messageName', name)
}


// Load the name from local storage (if one exists)
function loadNameFromLocalStorage() {
    const messageName = localStorage.getItem('messageName')
    if (messageName) {
        nameInput.value = messageName
    }
}


// Save the theme color to local storage
function saveThemeColorToLocalStorage(name) {
    localStorage.setItem('themeColor', name)
}


// Load the theme color from local storage (if one exists)
function loadThemeColorFromLocalStorage() {
    const themeColor = localStorage.getItem('themeColor')
    if (themeColor) {
        if (themeColor === 'purple') {
            changeThemeToPurple()
        }

        else {
            changeThemeToBlue()
        }
    }
}


// Scroll the page to the bottom
function scrollToBottom() {
    const body = document.querySelector('body')
    body.scrollTop = body.scrollHeight
}


// Get the current date and time in UTC and return it as a string
function getCurrentDateTimeAsString() {
    const currentDateTime = new Date().toISOString();
    return currentDateTime;
}


// Convert the date and time string to the user's current time zone
function convertToUserTimeZone(dateTimeUTC) {

    const userDateTime = new Date(dateTimeUTC)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const formattedDateTime = userDateTime.toLocaleString('en-US', {
        timeZone: userTimeZone,
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short'
    })

    return formattedDateTime
}


// New message gets posted (realtime)
onValue(messagesInDB, function(snapshot) {
    let feedHtml = ``; // Clear the feed so we can build it from scratch each time
    const messages = []; // Array to store the last 30 messages
  
    snapshot.forEach(function(childSnapshot) {
      const messageKey = childSnapshot.key; // This is the UUID for each message
      const messageData = childSnapshot.val();
      const messageName = messageData.messageName;
      const messageText = messageData.messageText;
      const messageDateTime = convertToUserTimeZone(messageData.messageDateTime);
  
      // Add message to the beginning of the array
      messages.unshift({
        messageKey,
        messageName,
        messageText,
        messageDateTime
      });
  
      // Limit the array to the last x number of messages
      if (messages.length > maxMessagesDisplayed) {
        messages.pop();
      }
    });
  
    // Iterate over messages array in reverse order
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      feedHtml += `
      <div class="message" id="${message.messageKey}">
        <div>
          <p class="message-name">${message.messageName} <span id="message-date">(${message.messageDateTime})</span></p>
          <p class="message-text">${message.messageText}</p>
        </div>            
      </div>
      `;
    }
  
    document.getElementById('feed').innerHTML = feedHtml;
  
    scrollToBottom();
  });