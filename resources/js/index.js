const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const enterButton = document.getElementById("enter-button");
const chatBox = document.getElementById("chat");

const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

const nameStorage = localStorage.setItem('name', 'my-name-input');
let userName = localStorage.getItem('name');


function updateMessagesInChatBox(){
  const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;

  function fetchMessages(){
    return fetch(serverURL).then(response => response.json())
  }

  async function updateMessages(){
    const messages = await fetchMessages;
    
    function formatMessage(message, myNameInput) {
      const time = new Date(message.timestamp);
      const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
  
      if (myNameInput === message.sender) {
          return `
          <div class="mine messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${formattedTime}
              </div>
          </div>
          `
      } else {
          return `
              <div class="yours messages">
                  <div class="message">
                      ${message.text}
                  </div>
                  <div class="sender-info">
                      ${message.sender} ${formattedTime}
                  </div>
              </div>
          `
      }
  }

    let formatMessages = "";
    message.forEach(message => {
      formatMessages += formatMessage(message, nameInput.value);
    });

    chatBox.innerHTML = formatMessages;
  }

  updateMessages();

function sendMessages(username, text){
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  }

  fetch(serverURL, {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
}

sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();

  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value="";
});

enterButton.addEventListener("click", function(enterButtonClickEvent) {

  const sender = nameInput.value;
  localStorage.setItem('name', sender);

  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value="";
});
}