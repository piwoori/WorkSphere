import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../utils/socket';
import { useUserStore } from '../stores/userStore';

type User = {
  id: string;
  name: string;
};

const RoomPage = () => {
  const navigate = useNavigate();
  const nickname = useUserStore((state) => state.nickname);
  const clearNickname = useUserStore((state) => state.clearNickname); // ✅ 추가 사용
  const [userList, setUserList] = useState<User[]>([]);

  // 닉네임 없으면 홈으로
  useEffect(() => {
    if (!nickname) navigate('/');
  }, [nickname, navigate]);

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

    // 새로고침/탭닫기에서도 서버에 알림 후 정리
    const onBeforeUnload = () => {
      socket.emit('leave', { nickname });
      socket.disconnect();
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    // cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('room:userList', handleUserList);
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (socket.connected) {
        socket.emit('leave', { nickname });
        socket.disconnect();
      }
    };
  }, [nickname]);

  // ✅ 나가기 버튼 핸들러
  const handleLeave = () => {
    socket.emit('leave', { nickname }); // 서버에 나가기 알림
    socket.disconnect();                // 소켓 연결 해제
    clearNickname?.();                  // Zustand 상태 초기화
    navigate('/');                      // 입장 페이지로 이동
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>🚪 Room Page</h1>
      <p>현재 접속 중인 사용자: <strong>{nickname}</strong></p>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleLeave}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #ddd',
            cursor: 'pointer',
          }}
        >
          나가기
        </button>
      </div>

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
