import { ScrollControls } from '@react-three/drei'
import { Avatar } from './Avatar'
import { ScrollManager } from './ScrollManager'

export const Experience = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <gridHelper args={[20, 20, '#444444', '#888888']} position-y={-1} />
      <ScrollControls pages={3} damping={0.1}>
        <group position-y={-1}>
          <Avatar />
        </group>
        <ScrollManager />
      </ScrollControls>
    </>
  )
}
