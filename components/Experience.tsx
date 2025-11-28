import { ScrollControls } from '@react-three/drei'
import { Avatar } from './Avatar'
import { Room } from './Room'
import { MapDebug } from './MapDebug'
// import { ScrollManager } from './ScrollManager'
import { usePathname } from 'next/navigation'

export const Experience = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      <Room />
      {!isHome && <MapDebug />}

      <ScrollControls pages={isHome ? 0 : 6} damping={0.1}>
        <group>
          <Avatar isHome={isHome} />
        </group>
        {/* <ScrollManager /> */}
      </ScrollControls>
    </>
  )
}
