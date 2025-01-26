import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const env = process.env.REACT_APP_NODE_ENV as string;
const bool = true;
const localhost = bool
  ? 'ws://127.0.0.1:88/SINGLE/benetric'
  : 'ws://127.0.0.1:88';
const url = env === 'development' ? localhost : 'wss://api.jaychis.com';
const socket = io(url);

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { message: string; fromUserId: string }[]
  >([]);
  const [userId, setUserId] = useState('');
  const [recipientId, setRecipientId] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection on component mount

    socket.emit('register', userId);

    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, fromUserId: data.fromUserId },
      ]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  const handleSendMessage = () => {
    if (message && recipientId) {
      socket.emit('send_message', {
        fromUserId: userId,
        toUserId: recipientId,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h3>Chat Messages:</h3>
        {chatMessages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.fromUserId}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
