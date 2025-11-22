import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Group } from "three";
import { useCharacterController } from "../hooks/useCharacterController";

export function Avatar(props: any) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/avatar.glb");
  const scroll = useScroll();

  const { animations: [idleClip] } = useGLTF("/models/animations/idle.glb");
  const { animations: [walkingClip] } = useGLTF("/models/animations/walking.glb");
  const { animations: [typingClip] } = useGLTF("/models/animations/typing.glb");

  idleClip.name = "Idle";
  walkingClip.name = "Walk";
  typingClip.name = "Typing";

  const { actions } = useAnimations(
    [idleClip, walkingClip, typingClip],
    group
  );

  useFrame(({ camera }) => {
    if (group.current) {
      group.current.position.x = scroll.offset * 10;
      camera.position.x = group.current.position.x;
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
      <primitive object={scene} rotation-y={Math.PI / 2} />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
