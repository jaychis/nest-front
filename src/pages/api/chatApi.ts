import { useState, useEffect } from 'react'
import * as StompJs from '@stomp/stompjs'

 
    
const baseUrl = process.env.REACT_APP_BASE_URL;

const ChatClient = new StompJs.Client({
    brokerURL: `ws://localhost:${baseUrl}/ws`,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
})

