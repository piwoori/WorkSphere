import { create } from 'zustand';

interface UserStore {
  nickname: string;
  setNickname: (name: string) => void;
  clearNickname: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  nickname: '',
  setNickname: (name) => set({ nickname: name }),
  clearNickname: () => set({ nickname: '' }),
}));