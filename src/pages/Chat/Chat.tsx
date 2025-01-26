import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const env = process.env.REACT_APP_NODE_ENV as string;
const url =
  env === 'development' ? 'ws://localhost:88' : 'wss://api.jaychis.com';
const socket = io(url, { transports: ['websocket'] });

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { readonly message: string; readonly fromUserId: string }[]
  >([]);
  const [userId, setUserId] = useState('');
  const [recipientId, setRecipientId] = useState('');

  useEffect(() => {
    // Initialize WebSocket connection on component mount
    console.log('url :', url);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('register', { userId: 'benetric' });
      console.log('socket : ', socket);
    });

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
