import { ScrollControls } from '@react-three/drei'
import { Avatar } from './Avatar'
import { Room } from './Room'
import { ScrollManager } from './ScrollManager'

export const Experience = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <Room />

      <ScrollControls pages={3} damping={0.1}>
        <group>
          <Avatar />
        </group>
        <ScrollManager />
      </ScrollControls>
    </>
  )
}
