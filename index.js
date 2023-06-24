import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://marker-c5f09-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "messages")
const nameInput = document.getElementById('name-input')

document.addEventListener('click', function(e){
    if(e.target.id === 'message-btn'){
        handleMessageBtnClick()
    }
})

function handleMessageBtnClick(){
    const messageInput = document.getElementById('message-input')
    if(messageInput.value){
        push(messagesInDB, {
            messageName: nameInput.value,
            messageText: messageInput.value,
        })
    messageInput.value = ''
    saveNameToLocalStorage()
    }

}


// Save the name to local storage
function saveNameToLocalStorage() {
    const messageName = nameInput.value;
    localStorage.setItem('messageName', messageName);
}


// Load the name from local storage
function loadNameFromLocalStorage() {
    const messageName = localStorage.getItem('messageName');
    if (messageName) {
        nameInput.value = messageName;
    }
}


function scrollToBottom() {
    const body = document.querySelector('body');
    body.scrollTop = body.scrollHeight;
  }

onValue(messagesInDB, function(snapshot) {
    
    let feedHtml = ``
    
    snapshot.forEach(function(childSnapshot) {
    //var messageKey = childSnapshot.key
    var messageData = childSnapshot.val()
    var messageName = messageData.messageName
    var messageText = messageData.messageText
    
    feedHtml += `
    <div class="message">
        <div class="message-inner">
            <div>
                <p class="message-name">${messageName}</p>
                <p class="message-text">${messageText}</p>
            </div>            
        </div>   
    </div>
    `

    });
    document.getElementById('feed').innerHTML = feedHtml
    scrollToBottom()
})
loadNameFromLocalStorage()