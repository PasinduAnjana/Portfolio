import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCharacterController } from '../hooks/useCharacterController'

export const ScrollManager = () => {
  const data = useScroll()
  const setAnimation = useCharacterController((state) => state.setAnimation)
  const curAnimation = useCharacterController((state) => state.curAnimation)

  useFrame(() => {
    // Trigger point for typing (e.g., at the end of the scroll)
    if (data.offset > 0.85) {
      if (curAnimation !== 'Typing') setAnimation('Typing')
    } else if (data.delta > 0.0001) {
      if (curAnimation !== 'Walk') setAnimation('Walk')
    } else {
      if (curAnimation !== 'Idle' && curAnimation !== 'Typing') {
        setAnimation('Idle')
      }
      // If we were typing and scrolled back up, go to idle
      if (curAnimation === 'Typing' && data.offset <= 0.85) {
        setAnimation('Idle')
      }
    }
  })

  return null
}
