'use client'

import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'

export const SceneWrapper = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{
          position: [0, 2, 10],
          fov: 30,
        }}
        style={{ pointerEvents: 'auto' }} // Enable pointer events for the canvas itself
      >
        <Experience />
      </Canvas>
    </div>
  )
}
