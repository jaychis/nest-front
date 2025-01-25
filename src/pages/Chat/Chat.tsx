import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const webSocket = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [serverMessage, setServerMessage] = useState<string>('');

  useEffect(() => {
    // Initialize WebSocket connection on component mount
    const env = process.env.REACT_APP_NODE_ENV as string;
    const url =
      env === 'development'
        ? 'ws://127.0.0.1:88?chatRoomType=SINGLE&nickname=benetric'
        : 'wss://api.jaychis.com';

    webSocket.current = new WebSocket(url);

    webSocket.current.onopen = () => {
      console.log('WebSocket 연결!');
    };
    webSocket.current.onclose = (error) => {
      console.log(error);
    };
    webSocket.current.onerror = (error) => {
      console.log(error);
    };
    webSocket.current.onmessage = (event: MessageEvent) => {
      setMessage(event.data);
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  const sendMessage = () => {
    const readState = webSocket?.current?.readyState;
    if (readState === WebSocket.OPEN) {
      webSocket?.current?.send(message);
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
