import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Group } from "three";
import { useCharacterController } from "../hooks/useCharacterController";
import { useMapSystem } from "../hooks/useMapSystem";
import { useControls } from 'leva';

export function Avatar(props: any) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/avatar.glb");

  const { zoom } = useControls('Camera', {
    zoom: { value: 5, min: 2, max: 10, step: 0.1 }
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

  useFrame(({ camera }) => {
    const { position, lookAt, animation } = getFrameData();
    
    // Update Animation State
    const currentAnim = useCharacterController.getState().curAnimation;
    if (currentAnim !== animation) {
      setAnimation(animation as any);
    }

    if (group.current) {
      // Update Position
      group.current.position.copy(position);
      
      // Update Rotation (Look At)
      group.current.lookAt(lookAt);
      
      // Update Camera (Follow)
      const cameraOffset = { x: 0, y: 2, z: zoom };
      camera.position.set(
        position.x + cameraOffset.x,
        position.y + cameraOffset.y,
        position.z + cameraOffset.z
      );
      camera.lookAt(position.x, position.y + 1.5, position.z);
    }
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
