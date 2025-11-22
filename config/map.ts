import { Vector3 } from 'three'

export type MapPoint = [number, number, number]

export interface TriggerZone {
  position: [number, number, number]
  size: [number, number, number]
  animation: string
  duration: number // How much of the scroll (0-1) this trigger consumes
}

export const MAP_POINTS: MapPoint[] = [
  [0, 0, 0],
  [5, 0, 2],
  [10, 0, -2],
  [15, 0, 0],
  [20, 0, 2],
  [25, 0, 0],
  [36,0,0]
]

export const TRIGGERS: TriggerZone[] = [
  {
    position: [10, 0, -2],
    size: [2, 2, 2],
    animation: 'Typing',
    duration: 0.2 // Takes up 20% of the total scroll time
  },
  {
    position: [35, 0, 0],
    size: [2, 2, 2],
    animation: 'Picking',
    duration: 0.2
  }
]
