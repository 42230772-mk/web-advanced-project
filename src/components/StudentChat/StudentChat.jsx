import React, { useState } from "react";
import styles from "./StudentChat.module.css";

export default function StudentChat() {
  const [messages, setMessages] = useState([
    { from: "Instructor", text: "Welcome to the chat!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState("Instructor"); // default recipient

  const recipients = ["Instructor", "Admin"]; // allowed recipients

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { from: "You", to: recipient, text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h3>Chat</h3>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        >
          {recipients.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.from === "You" ? styles.messageSent : styles.messageReceived
            }
          >
            <strong>{msg.from}{msg.to ? ` → ${msg.to}` : ""}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder={`Message ${recipient}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
