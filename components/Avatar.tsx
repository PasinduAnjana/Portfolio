import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { useCharacterController } from "../hooks/useCharacterController";
import { useMapSystem } from "../hooks/useMapSystem";
import { useControls } from 'leva';

export function Avatar(props: any) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/avatar.glb");

  const { zoom } = useControls('Camera', {
    zoom: { value: 10, min: 2, max: 20, step: 0.1 }
  });

  const { animations: [idleClip] } = useGLTF("/models/animations/idle.glb");
  const { animations: [walkingClip] } = useGLTF("/models/animations/walking.glb");
  const { animations: [typingClip] } = useGLTF("/models/animations/typing.glb");
  const { animations: [pickingClip] } = useGLTF("/models/animations/picking.glb");

  idleClip.name = "Idle";
  walkingClip.name = "Walk";
  typingClip.name = "Typing";
  pickingClip.name = "Picking";

  const { actions } = useAnimations(
    [idleClip, walkingClip, typingClip, pickingClip],
    group
  );

  const { getFrameData } = useMapSystem();
  const setAnimation = useCharacterController((state) => state.setAnimation);

  useFrame(({ camera }, delta) => {
    const targetCameraPos = new Vector3();
    const targetLookAt = new Vector3();

    // Calculate Targets
    if (props.isHome) {
      // Home Mode Targets
      const currentAnim = useCharacterController.getState().curAnimation;
      if (currentAnim !== 'Idle') {
        setAnimation('Idle');
      }
      
      if (group.current) {
        group.current.position.set(0, 0, 0);
        group.current.rotation.set(0, 0, 0);
        
        targetCameraPos.set(0, 1.5, 10);
        targetLookAt.set(0, 1.5, 0);
      }
    } else {
      // Map Mode Targets
      const { position, lookAt, animation } = getFrameData();
      
      const currentAnim = useCharacterController.getState().curAnimation;
      if (currentAnim !== animation) {
        setAnimation(animation as any);
      }

      if (group.current) {
        group.current.position.copy(position);
        group.current.lookAt(lookAt);
        
        const cameraOffset = { x: 0, y: 2, z: zoom };
        targetCameraPos.set(
          position.x + cameraOffset.x,
          position.y + cameraOffset.y,
          position.z + cameraOffset.z
        );
        targetLookAt.set(position.x, position.y + 1.5, position.z);
      }
    }

    camera.position.lerp(targetCameraPos, delta * 2);

    camera.lookAt(targetLookAt); 
    
  });

  useEffect(() => {
    // Play initial animation
    let activeAnimation = useCharacterController.getState().curAnimation;
    actions[activeAnimation]?.reset().fadeIn(0.2).play();

    // Subscribe to changes
    const unsubscribe = useCharacterController.subscribe((state) => {
      const newAnimation = state.curAnimation;
      if (newAnimation !== activeAnimation) {
        actions[activeAnimation]?.fadeOut(0.2);
        actions[newAnimation]?.reset().fadeIn(0.2).play();
        activeAnimation = newAnimation;
      }
    });

    return () => unsubscribe();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} rotation-y={0} />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
