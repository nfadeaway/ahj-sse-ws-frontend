import ChatController from "./chatController";

// const ws = new WebSocket('ws://127.0.0.1:7071/ws')
const ws = new WebSocket("ws://chat-g0bb.onrender.com:7071/ws");
const app = document.querySelector(".app");
const chatController = new ChatController(app);

chatController.nicknameConfirmBtn.addEventListener("click", () => {
  if (chatController.nicknameInput.value !== "") {
    ws.send(JSON.stringify({ newuser: chatController.nicknameInput.value }));
  }
});

chatController.nicknameInput.addEventListener("focus", () =>
  chatController.nicknameErrorDiv.classList.remove("active"),
);

ws.addEventListener("message", (e) => {
  const backendMessage = JSON.parse(e.data);
  if (backendMessage.error) {
    if (backendMessage.error === "Nickname is busy") {
      chatController.nicknameErrorDiv.classList.add("active");
    }
  }
  if (backendMessage.action === "open chat") {
    chatController.modalNickname.classList.remove("active");
    chatController.container.classList.add("active");
    chatController.userNickname = backendMessage.nickname;
  }
  if (backendMessage.action === "update user list") {
    chatController.users = backendMessage.users;
    chatController.renderUsers(chatController.users);
  }
  if (backendMessage.action === "update chat") {
    chatController.renderChatMessages(backendMessage.chat);
    chatController.allMessagesDiv.scrollTop =
      chatController.allMessagesDiv.scrollHeight;
  }
  console.log("ws message");
});

window.addEventListener("unload", () => {
  if (chatController.userNickname) {
    ws.send(
      JSON.stringify({
        action: "user left",
        nickname: chatController.userNickname,
      }),
    );
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    if (chatController.modalNickname.classList.contains("active")) {
      e.preventDefault();
      if (chatController.nicknameInput.value !== "") {
        ws.send(
          JSON.stringify({ newuser: chatController.nicknameInput.value }),
        );
      }
    } else if (chatController.messageInput.value !== "") {
      e.preventDefault();
      let dateNow = new Date();
      dateNow = `${("0" + dateNow.getHours()).slice(-2)}:${(
        "0" + dateNow.getMinutes()
      ).slice(-2)} ${("0" + dateNow.getDate()).slice(-2)}.${(
        "0" + dateNow.getMonth()
      ).slice(-2)}.${dateNow.getFullYear()}`;
      ws.send(
        JSON.stringify({
          action: "new message",
          nickname: chatController.userNickname,
          date: dateNow,
          message: chatController.messageInput.value,
        }),
      );
      chatController.messageInput.value = "";
    }
  }
});

ws.addEventListener("open", (e) => {
  console.log(e);
  console.log("ws open");
});

ws.addEventListener("close", (e) => {
  console.log(e);
  console.log("ws close");
});

ws.addEventListener("error", (e) => {
  console.log(e);
  console.log("ws error");
});
