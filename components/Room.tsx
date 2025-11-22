import { useControls } from 'leva'

export const Room = () => {
  const { grid } = useControls({
    grid: true,
  })

  return (
    <group>
      <color attach="background" args={['#111111']} />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {grid && <gridHelper args={[20, 20, '#444444', '#222222']} position-y={0} />}
    </group>
  )
}
