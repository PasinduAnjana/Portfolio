'use client'

import { Canvas } from '@react-three/fiber'
import { Experience } from '@/components/Experience'

export default function Home() {
  return (
    <main className="h-screen w-full">
      <Canvas
        camera={{
          position: [0, 2, 5],
          fov: 30,
        }}
      >
        <Experience />
      </Canvas>
    </main>
  )
}
