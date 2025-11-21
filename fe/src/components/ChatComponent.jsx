// fe/src/components/ChatComponent.jsx
import React, { useState, useEffect } from "react";
import { getChatWithPatient, sendMessageToPatient } from "../utils/api";
import { io } from "socket.io-client";
import "../styles/Chat.css";

const ChatComponent = ({ patientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const therapistId = localStorage.getItem("userId");

  useEffect(() => {
    loadChat();
    
    // Initialize Socket.IO
    const newSocket = io("http://localhost:5003");
    setSocket(newSocket);

    newSocket.emit("join-chat", { userId: patientId, therapistId });

    newSocket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.close();
  }, [patientId]);

  const loadChat = async () => {
    try {
      const data = await getChatWithPatient(patientId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessageToPatient(patientId, newMessage);
      
      const room = `chat-${patientId}-${therapistId}`;
      socket.emit("send-message", {
        room,
        message: newMessage,
        sender: therapistId,
      });

      setNewMessage("");
      loadChat();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>🔒 Secure Chat</h3>
        <span className="encryption-badge">End-to-end encrypted</span>
      </div>

      <div className="messages-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === therapistId ? "sent" : "received"}`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
