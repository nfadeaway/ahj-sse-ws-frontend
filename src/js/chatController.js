export default class ChatController {
  constructor(app) {
    this.container = app.querySelector(".main-container");
    this.nicknameConfirmBtn = app.querySelector(".modal-nickname__confirm-btn");
    this.nicknameInput = app.querySelector(".modal-nickname__input-nickname");
    this.nicknameErrorDiv = app.querySelector(".modal-nickname__error");
    this.modalNickname = app.querySelector(".modal-nickname");
    this.usersDiv = app.querySelector(".users");
    this.allMessagesDiv = app.querySelector(".all-messages");
    this.messageInput = app.querySelector(".message-form__message");

    this.userNickname = undefined;
    this.users = [];
    this.chat = [];
  }

  renderUsers(users) {
    this.users.sort();
    if (this.usersDiv.querySelector(".users__user")) {
      this.usersDiv.innerHTML = "";
    }
    users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("users__user");
      const avatarDiv = document.createElement("div");
      avatarDiv.classList.add("users__user_avatar");
      const nicknameDiv = document.createElement("div");
      nicknameDiv.classList.add("users__user_nickname");
      if (user === this.userNickname) {
        nicknameDiv.classList.add("red");
        nicknameDiv.innerText = "You";
      } else {
        nicknameDiv.innerText = user;
      }
      userDiv.appendChild(avatarDiv);
      userDiv.appendChild(nicknameDiv);
      this.usersDiv.appendChild(userDiv);
    });
  }

  renderChatMessages(incomingChatMessages) {
    let messagesForRender = [];
    if (this.chat.length === 0) {
      this.chat = incomingChatMessages;
      messagesForRender = this.chat;
    } else {
      const historyLastMessageIndex = this.chat.length;
      messagesForRender = incomingChatMessages.slice(historyLastMessageIndex);
    }
    messagesForRender.forEach((chatMessage) => {
      const userMessageDiv = document.createElement("div");
      userMessageDiv.classList.add("user-message");
      const userMessageInfoDiv = document.createElement("div");
      userMessageInfoDiv.classList.add("user-message__info");
      if (chatMessage.nickname === this.userNickname) {
        userMessageInfoDiv.textContent = `You, ${chatMessage.date}`;
        userMessageInfoDiv.classList.add("red");
        userMessageDiv.classList.add("my-message");
      } else {
        userMessageInfoDiv.textContent = `${chatMessage.nickname}, ${chatMessage.date}`;
      }
      const userMessageTextDiv = document.createElement("div");
      userMessageTextDiv.classList.add("user-message__text");
      userMessageTextDiv.textContent = chatMessage.message;
      userMessageDiv.appendChild(userMessageInfoDiv);
      userMessageDiv.appendChild(userMessageTextDiv);
      this.allMessagesDiv.appendChild(userMessageDiv);
    });
    this.chat = incomingChatMessages;
  }
}
