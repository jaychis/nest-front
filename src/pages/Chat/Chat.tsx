import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [serverMessage, setServerMessage] = useState<string>('');

  useEffect(() => {
    // Initialize WebSocket connection on component mount
    const env = process.env.REACT_APP_NODE_ENV as string;
    const url =
      env === 'development'
        ? 'ws://127.0.0.1:88/websocket-chat'
        : 'wss://api.jaychis.com/websocket-chat';

    const socket = new WebSocket(
      'ws://127.0.0.1:88/websocket-chat?chatRoomType=SINGLE&nickname=benetric',
    );
    socket.onopen = () => console.log('Connected to WebSocket');
    socket.onmessage = (msg) => console.log('Message from server:', msg.data);
    socket.onerror = (err) => console.error('WebSocket error:', err);

    // Create a new Socket.IO client connection
    // const socket = io(url, {
    //   transports: ['websocket'], // Use only WebSocket transport
    //   query: {
    //     chatRoomType: 'SINGLE', // Query parameters passed in the connection
    //     nickname: 'benetric', // Customize based on the user or room
    //   },
    // });
    //
    // // Event listener for when the connection is established
    // socket.on('connect', () => {
    //   console.log('Connected to WebSocket server');
    // });
    //
    // // Handle incoming messages
    // socket.on('message', (data) => {
    //   console.log('Received message:', data);
    // });
    //
    // // Handle errors
    // socket.on('connect_error', (error) => {
    //   console.error('Connection failed:', error);
    // });
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div>
      <h3>WebSocket Test</h3>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h4>Server Response:</h4>
        <p>{serverMessage}</p>
      </div>
    </div>
  );
};

export default Chat;
