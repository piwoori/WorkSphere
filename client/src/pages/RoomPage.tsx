import { useEffect } from 'react';
import { socket } from '../utils/socket';
import { useUserStore } from '../stores/userStore';

const RoomPage = () => {
  const nickname = useUserStore((state) => state.nickname);

  useEffect(() => {
    if (!nickname) return;

    // 소켓이 아직 연결되지 않았다면 연결 시도
    if (!socket.connected) {
      socket.connect();
    }

    // 연결 성공 시 닉네임 전송
    const handleConnect = () => {
      console.log('✅ 소켓 연결됨:', socket.id);
      socket.emit('join', { nickname });
    };

    socket.on('connect', handleConnect);

    // cleanup
    return () => {
      socket.off('connect', handleConnect); // 리스너 제거
      socket.disconnect(); // 소켓 연결 해제
    };
  }, [nickname]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>🚪 Room Page</h1>
      <p>현재 접속 중인 사용자: <strong>{nickname}</strong></p>
    </div>
  );
};

export default RoomPage;