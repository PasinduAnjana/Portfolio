import { create } from 'zustand'

export type CharacterAnimation = 'Idle' | 'Walk' | 'Typing' | 'Picking'

interface CharacterControllerState {
  curAnimation: CharacterAnimation
  setAnimation: (animation: CharacterAnimation) => void
}

export const useCharacterController = create<CharacterControllerState>((set) => ({
  curAnimation: 'Idle',
  setAnimation: (animation) => set({ curAnimation: animation }),
}))
