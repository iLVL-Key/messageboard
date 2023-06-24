import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://marker-c5f09-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "messages")

document.addEventListener('click', function(e){
    if(e.target.id === 'message-btn'){
        handleMessageBtnClick()
    }
})

function handleMessageBtnClick(){
    const messageInput = document.getElementById('message-input')
    const nameInput = document.getElementById('name-input')
    if(messageInput.value){
        push(messagesInDB, {
            handle: nameInput.value,
            messageText: messageInput.value,
        })
    messageInput.value = ''
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
    var messageHandle = messageData.handle
    var messageText = messageData.messageText
    
    feedHtml += `
    <div class="message">
        <div class="message-inner">
            <div>
                <p class="handle">${messageHandle}</p>
                <p class="message-text">${messageText}</p>
            </div>            
        </div>
        </div>   
    </div>
    `

    });
    document.getElementById('feed').innerHTML = feedHtml
    scrollToBottom()
})