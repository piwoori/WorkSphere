# WorkSphere

실시간 아바타와 함께 집중하는 가상 협업 공간(포모도로 + 상태 동기화)

<p align="center">
  <img src="docs/cover.png" alt="WorkSphere" width="720" />
</p>

## ✨ 핵심 기능
- 닉네임 입력 후 공간 입장
- 3D 공간 내 아바타 이동 (React Three Fiber)
- 실시간 위치/상태 동기화 (Socket.io)
- 포모도로 타이머(집중/휴식) & 상태 표시
- 사용자 리스트 표시(온라인/오프라인)
- 채팅, 로컬 집중 음악

## 🧱 기술 스택
- **Frontend**: React, TypeScript, React Three Fiber(Three.js), Zustand, Vite
- **Real‑time**: Socket.io
- **Backend**: Node.js + Express + Socket.io *(초기엔 간단 서버, 이후 Supabase/Firebase 대체 가능)*
- **Deploy**: Vercel(프론트), Render/railway(백엔드)

## 📦 폴더 구조
root
├─ client/ # React 앱 (Vite)
│ ├─ src/
│ │ ├─ pages/RoomPage.tsx
│ │ ├─ components/
│ │ ├─ stores/ # Zustand
│ │ ├─ utils/socket.ts # Socket.io client
│ │ └─ three/ # R3F scene, models
│ └─ index.html
├─ server/ # Express + Socket.io 서버
│ ├─ src/
│ │ ├─ index.ts
│ │ └─ socket.ts
│ └─ .env.example
├─ docs/
│ └─ cover.png
└─ README.md

markdown
복사

### Connection
- `connection` / `disconnect` : 기본 연결/해제

### Presence / Users
- `join` `{ nickname }` : 입장 요청 (클라→서버)
- `users:list` `[ { id, nickname, state } ]` : 전체 목록(서버→클라)
- `user:update` `{ id, position, rotation, state }` : 단일 상태 브로드캐스트
- `user:left` `{ id }` : 유저 퇴장 알림

### Timer
- `timer:control` `{ mode: 'focus'|'break', action: 'start'|'pause'|'stop' }`
- `timer:tick` `{ remaining, mode }`
- `state:change` `{ state: 'FOCUS'|'BREAK'|'IDLE' }`

> 상태 예시: `FOCUS`(집중), `BREAK`(휴식), `IDLE`(대기)

## 🚀 시작하기
### 1) 사전 요구사항
- Node.js 18+
- pnpm 또는 npm

### 2) 환경 변수
**client/.env**
VITE_SERVER_URL=http://localhost:4000

bash
복사
**server/.env**
PORT=4000
CORS_ORIGIN=http://localhost:5173

python
복사

### 3) 설치 & 실행
```bash
# 루트에서
pnpm i -r        # 또는 npm run install -ws

# 서버
pnpm --filter server dev

# 클라이언트
pnpm --filter client dev
클라이언트: http://localhost:5173

서버: http://localhost:4000

🧪 스크립트(예시)
client/package.json

json
복사
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
server/package.json

json
복사
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p .",
    "start": "node dist/index.js"
  }
}
🔐 코드 스타일 & 커밋
ESLint + Prettier (권장)

커밋: Conventional Commits

feat: RoomPage 사용자 리스트 출력

fix: 소켓 재연결 시 중복 리스너 제거

🔧 개발 메모
소켓 리스너 정리: useEffect cleanup에서 socket.off() 호출 필수

연결 전략: 초입장 시 socket.connect() 확인 → join emit

상태 관리: 사용자 목록/자기 아바타/타이머는 분리된 zustand slice 추천

🧭 아키텍처 다이어그램(간단)
css
복사
[Client (React/R3F/Zustand)] <--Socket.io--> [Server (Express + Socket.io)]
                                        └─(선택) DB/Supabase
🗺️ 배포 가이드(요약)
Frontend(Vercel): client/를 Framework = Vite로 지정

Backend(Render/Railway): 포트 PORT 노출, WebSocket 활성화

환경변수: VITE_SERVER_URL을 서버 도메인으로 교체

📌 이슈/로드맵
 사용자 위치 보간(LERP)로 이동 부드럽게

 타이머 서버 권위(or 클라 로컬) 결정 및 동기화 지터 대응

 모바일 대응(터치 컨트롤)

 간단 채팅 & 음소거 토글

📝 라이선스
MIT (변경 가능)

yaml
복사

</details>

---