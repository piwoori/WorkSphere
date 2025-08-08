import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

console.log('🟢 서버 코드 진입 확인');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // 개발 중에는 전체 허용
  },
});

io.on('connection', (socket) => {
  console.log('✅ 연결됨:', socket.id);

  socket.on('join', ({ nickname }) => {
    console.log(`🙋‍♂️ ${nickname} 님 입장`);
  });

  socket.on('disconnect', () => {
    console.log('❌ 연결 종료:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('🚀 서버 실행 중: http://localhost:4000');
});