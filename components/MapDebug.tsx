import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { useControls } from 'leva'
import { MAP_POINTS, TRIGGERS } from '../config/map'

export const MapDebug = () => {
  const { showPath, showTriggers, showPoints } = useControls('Map Debug', {
    showPath: true,
    showTriggers: true,
    showPoints: true
  })

  const curve = useMemo(() => {
    return new CatmullRomCurve3(
      MAP_POINTS.map((p) => new Vector3(...p))
    )
  }, [])

  const linePoints = useMemo(() => {
    return curve.getPoints(50)
  }, [curve])

  return (
    <group>
      {/* Render Points */}
      {showPoints && MAP_POINTS.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}

      {/* Render Path */}
      {showPath && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(linePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="blue" />
        </line>
      )}

      {/* Render Triggers */}
      {showTriggers && TRIGGERS.map((trigger, index) => (
        <group key={index} position={trigger.position}>
          <mesh>
            <boxGeometry args={trigger.size} />
            <meshBasicMaterial color="green" wireframe />
          </mesh>
        </group>
      ))}
    </group>
  )
}
