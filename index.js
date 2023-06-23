//import { messagesData } from './data.js'
//import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
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
    if(messageInput.value){
        push(messagesInDB, {
            handle: `@Scrimba`,
            messageText: messageInput.value,
        })
    //render()
    messageInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    messagesInDB.forEach(function(message){
        
         feedHtml += `
        <div class="message">
            <div class="message-inner">
                <img src="${message.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${message.handle}</p>
                    <p class="message-text">${message.messageText}</p>
                </div>            
            </div>
            <!-- <div class="hidden" id="replies-${message.uuid}"> -->
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

onValue(messagesInDB, function(snapshot) {
    
    let feedHtml = ``
    
    snapshot.forEach(function(childSnapshot) {
    var messageKey = childSnapshot.key
    var messageData = childSnapshot.val()
    var messageHandle = messageData.handle
    var messageText = messageData.messageText
    
    // console.log("Key:", messageKey)
    // console.log("Handle:", messageHandle)
    // console.log("Message Text:", messageText)

    feedHtml += `
    <div class="message">
        <div class="message-inner">
            <div>
                <p class="handle">${messageHandle}</p>
                <p class="message-text">${messageText}</p>
            </div>            
        </div>
        <!-- <div class="hidden" id="replies-${messageKey}"> -->
        </div>   
    </div>
    `

    });
    document.getElementById('feed').innerHTML = feedHtml
})

//render()

