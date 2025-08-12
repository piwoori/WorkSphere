import { useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { useUserStore } from '../stores/userStore';

type User = {
  id: string;
  name: string;
};

const RoomPage = () => {
  const nickname = useUserStore((state) => state.nickname);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (!nickname) return;

    // 소켓이 아직 연결되지 않았다면 연결 시도
    if (!socket.connected) {
      socket.connect();
    }

    // 연결 성공 시 닉네임 서버에 전송
    const handleConnect = () => {
      console.log('✅ 소켓 연결됨:', socket.id);
      socket.emit('join', { nickname });
    };

    // 사용자 리스트 수신 이벤트
    const handleUserList = (users: User[]) => {
      console.log('👥 사용자 목록 수신:', users);
      setUserList(users);
    };

    socket.on('connect', handleConnect);
    socket.on('room:userList', handleUserList);

    // cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('room:userList', handleUserList);
      socket.disconnect();
    };
  }, [nickname]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>🚪 Room Page</h1>
      <p>현재 접속 중인 사용자: <strong>{nickname}</strong></p>

      <div style={{ marginTop: '32px' }}>
        <h2>👥 접속자 목록</h2>
        {userList.length === 0 ? (
          <p>아직 아무도 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {userList.map((user) => (
              <li key={user.id}>• {user.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
