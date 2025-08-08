/// <reference types="vite/client" />
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
console.log("✅ 서버 URL:", SERVER_URL);

export const socket = io(SERVER_URL, {
  autoConnect: false, // 수동 연결
  transports: ['websocket'],
});