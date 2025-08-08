import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

const JoinPage = () => {
  const [input, setInput] = useState('');
  const setNickname = useUserStore((state) => state.setNickname);
  const navigate = useNavigate();

  const handleJoin = () => {
    if (input.trim()) {
      setNickname(input.trim());
      navigate('/room');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1>닉네임을 입력하세요</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="닉네임"
      />
      <button onClick={handleJoin} style={{ marginLeft: '8px' }}>
        입장하기
      </button>
    </div>
  );
};

export default JoinPage;