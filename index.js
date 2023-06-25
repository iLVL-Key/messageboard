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


// Take control of elements used in multiple functions
const notification = document.getElementById('notification')
const messageInput = document.getElementById('message-input')
const nameInput = document.getElementById('name-input')
const nameSaveChkbx = document.getElementById('name-save')


// Start with the message input field in focus
messageInput.focus()

// Load the stored name when the page is first opened
loadNameFromLocalStorage()


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
    
    let feedHtml = ``
    
    snapshot.forEach(function(childSnapshot) {
    const messageKey = childSnapshot.key //This is the uuid for each message
    const messageData = childSnapshot.val()
    const messageName = messageData.messageName
    const messageText = messageData.messageText
    const messageDateTime = convertToUserTimeZone(messageData.messageDateTime)

    
    feedHtml += `
    <div class="message" title="${messageDateTime}" id="${messageKey}">
        <div>
            <p class="message-name">${messageName}</p>
            <p class="message-text">${messageText}</p>
        </div>            
    </div>
    `
    });

    document.getElementById('feed').innerHTML = feedHtml

    scrollToBottom()
})