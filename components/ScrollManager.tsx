import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCharacterController } from '../hooks/useCharacterController'

export const ScrollManager = () => {
  const data = useScroll()
  const setAnimation = useCharacterController((state) => state.setAnimation)

  useFrame(() => {
    const curAnimation = useCharacterController.getState().curAnimation

    // Trigger point for typing (at 50% scroll)
    if (data.offset > 0.5 && data.offset <= 0.75) {
      if (curAnimation !== 'Typing') setAnimation('Typing')
    } else if (data.delta > 0.0001) {
      if (curAnimation !== 'Walk') setAnimation('Walk')
    } else {
      if (curAnimation !== 'Idle' && curAnimation !== 'Typing') {
        setAnimation('Idle')
      }
    }
  })

  return null
}
