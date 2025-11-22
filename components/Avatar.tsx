import React, { useEffect, useRef } from 'react'
import { useAnimations, useGLTF, useScroll } from '@react-three/drei'
import { useCharacterController } from '../hooks/useCharacterController'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

export function Avatar(props: any) {
  const group = useRef<Group>(null)
  const { scene } = useGLTF('/models/avatar.glb')
  
  const { animations: idleAnimation } = useGLTF('/models/animations/idle.glb')
  const { animations: walkingAnimation } = useGLTF('/models/animations/walking.glb')
  const { animations: typingAnimation } = useGLTF('/models/animations/typing.glb')

  idleAnimation[0].name = 'Idle'
  walkingAnimation[0].name = 'Walk'
  typingAnimation[0].name = 'Typing'

  const { actions } = useAnimations(
    [idleAnimation[0], walkingAnimation[0], typingAnimation[0]],
    group
  )

  const curAnimation = useCharacterController((state) => state.curAnimation)
  const scroll = useScroll()

  useFrame(({ camera }) => {
    if (group.current) {
      // Move character to the right based on scroll
      group.current.position.x = scroll.offset * 10
      
      // Make camera follow the character
      camera.position.x = group.current.position.x
    }
  })

  useEffect(() => {
    const action = actions[curAnimation]
    
    // Reset all weights
    Object.values(actions).forEach(a => {
        if (a && a !== action) {
            a.stop()
        }
    })

    if (action) {
        action.reset().play()
    }
    
    return () => {}
  }, [curAnimation, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} rotation-y={Math.PI / 2} />
    </group>
  )
}

useGLTF.preload('/models/avatar.glb')
