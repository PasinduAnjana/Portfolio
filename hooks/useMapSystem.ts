import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3, Quaternion, Matrix4 } from 'three'
import { useScroll } from '@react-three/drei'
import { MAP_POINTS, TRIGGERS } from '../config/map'

export const useMapSystem = () => {
  const scroll = useScroll()

  // Create the curve from points
  const curve = useMemo(() => {
    return new CatmullRomCurve3(
      MAP_POINTS.map((p) => new Vector3(...p))
    )
  }, [])

  // Calculate total duration (1 unit of path length = 1 unit of scroll duration + trigger durations)
  // We normalize this so total scroll (0-1) maps to the entire timeline
  const timeline = useMemo(() => {
    const pathLength = curve.getLength()
    const totalTriggerDuration = TRIGGERS.reduce((acc, t) => acc + t.duration, 0)
    
    // We'll define the timeline in "units". 
    // Let's say the path length is L.
    // Each trigger adds D units of "pause".
    // Total timeline length T = L + Sum(D).
    
    // We need to map scroll offset (0-1) to this timeline T.
    // Then we determine where we are:
    // - Are we on a path segment? -> Move along curve
    // - Are we inside a trigger duration? -> Stay at trigger position
    
    return {
      pathLength,
      totalDuration: 1, // Normalized scroll is always 0-1
      triggers: TRIGGERS.map(t => {
        // Find where this trigger is on the curve (0-1)
        // We find the closest point on the curve to the trigger position
        const triggerPos = new Vector3(...t.position)
        // This is an approximation. For precise placement, we might need to store the 'u' value in config
        // But for now, let's assume the trigger position IS a point on the curve or we find the closest u
        // Finding closest u is expensive to do every frame, so we do it once here.
        
        // Simple approach: Iterate samples to find closest u
        let closestU = 0
        let minDist = Infinity
        const samples = 100
        for(let i=0; i<=samples; i++) {
          const u = i/samples
          const p = curve.getPointAt(u)
          const d = p.distanceTo(triggerPos)
          if(d < minDist) {
            minDist = d
            closestU = u
          }
        }
        
        return {
          ...t,
          u: closestU
        }
      }).sort((a, b) => a.u - b.u) // Sort by position on path
    }
  }, [curve])

  const getFrameData = () => {
    const scrollOffset = scroll.offset // 0 to 1
    
    // We need to distribute the scroll offset between "moving" and "waiting"
    // Total "weight" of the timeline = Path Length (let's say 1 for normalized path) + Trigger Durations (relative to path)
    // Actually, simpler: The user defines trigger duration as a fraction of TOTAL scroll (0-1).
    // So if we have 2 triggers of 0.2 duration each, 0.4 of the scroll is waiting, 0.6 is moving.
    
    const totalTriggerDuration = timeline.triggers.reduce((acc, t) => acc + t.duration, 0)
    const moveDuration = 1 - totalTriggerDuration
    
    // Iterate through timeline to find current state
    let currentScroll = 0
    let currentMoveProgress = 0 // 0 to 1 along the path
    
    // We need to find which segment we are in
    // Segments are: [Move] -> [Trigger] -> [Move] -> [Trigger] -> [Move]
    
    let lastU = 0
    let activeAnimation = 'Walk' // Default
    let targetPoint = new Vector3()
    let lookAtPoint = new Vector3()
    
    // Calculate the "length" of movement segments relative to each other based on curve u
    // u goes 0->1. 
    // Segment 1: u from 0 to trigger1.u
    // Segment 2: u from trigger1.u to trigger2.u
    // ...
    
    // We need to map the "moveDuration" (e.g. 0.6) to the curve's u (0-1)
    // So if trigger is at u=0.5, it splits the move duration in half (0.3 and 0.3)
    
    let accumulatedScroll = 0
    let found = false
    
    for (let i = 0; i < timeline.triggers.length; i++) {
      const trigger = timeline.triggers[i]
      
      // Calculate scroll consumed by moving to this trigger
      const segmentU = trigger.u - lastU
      const segmentScroll = segmentU * moveDuration
      
      // Check if we are in this movement segment
      if (scrollOffset < accumulatedScroll + segmentScroll) {
        // We are moving towards this trigger
        const localProgress = (scrollOffset - accumulatedScroll) / segmentScroll
        const currentU = lastU + localProgress * segmentU
        
        targetPoint = curve.getPointAt(currentU)
        lookAtPoint = curve.getPointAt(Math.min(currentU + 0.01, 1))
        activeAnimation = 'Walk'
        found = true
        break
      }
      
      accumulatedScroll += segmentScroll
      
      // Check if we are IN this trigger
      if (scrollOffset < accumulatedScroll + trigger.duration) {
        // We are waiting at this trigger
        targetPoint = curve.getPointAt(trigger.u)
        // Look ahead on the curve or keep looking at trigger orientation?
        // For now, look ahead on curve
        lookAtPoint = curve.getPointAt(Math.min(trigger.u + 0.01, 1))
        activeAnimation = trigger.animation
        found = true
        break
      }
      
      accumulatedScroll += trigger.duration
      lastU = trigger.u
    }
    
    if (!found) {
      // We are in the final movement segment
      const remainingScroll = 1 - accumulatedScroll
      if (remainingScroll > 0.0001) {
         const localProgress = (scrollOffset - accumulatedScroll) / remainingScroll
         const currentU = lastU + localProgress * (1 - lastU)
         targetPoint = curve.getPointAt(Math.min(currentU, 1))
         lookAtPoint = curve.getPointAt(Math.min(currentU + 0.01, 1))
         activeAnimation = 'Walk'
      } else {
         // End of path
         targetPoint = curve.getPointAt(1)
         const tangent = curve.getTangentAt(1)
         lookAtPoint = targetPoint.clone().add(tangent)
         activeAnimation = 'Idle'
      }
    }
    
    // Override 'Walk' with 'Idle' if not scrolling
    if (activeAnimation === 'Walk' && scroll.delta < 0.0001) {
      activeAnimation = 'Idle'
    }
    
    return {
      position: targetPoint,
      lookAt: lookAtPoint,
      animation: activeAnimation
    }
  }

  return {
    getFrameData
  }
}
