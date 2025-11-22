import { ScrollControls } from '@react-three/drei'
import { Avatar } from './Avatar'
import { Room } from './Room'
import { MapDebug } from './MapDebug'
// import { ScrollManager } from './ScrollManager'

export const Experience = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <Room />
      <MapDebug />

      <ScrollControls pages={6} damping={0.1}>
        <group>
          <Avatar />
        </group>
        {/* <ScrollManager /> */}
      </ScrollControls>
    </>
  )
}
