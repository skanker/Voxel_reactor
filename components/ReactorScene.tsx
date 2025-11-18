import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Stars } from '@react-three/drei';
import { Core, Turbine, CoolingTower, Pipes, Particles } from './VoxelModels';
import { ReactorStage, StageInfo } from '../types';
import * as THREE from 'three';

interface ReactorSceneProps {
  currentStage: StageInfo;
  controlRodLevel: number; // 0 (in) to 1 (out)
}

const ReactorScene: React.FC<ReactorSceneProps> = ({ currentStage, controlRodLevel }) => {
  const controlsRef = useRef<CameraControls>(null);
  
  // Smooth camera movement when stage changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        currentStage.cameraPosition[0],
        currentStage.cameraPosition[1],
        currentStage.cameraPosition[2],
        currentStage.cameraTarget[0],
        currentStage.cameraTarget[1],
        currentStage.cameraTarget[2],
        true // animate
      );
    }
  }, [currentStage]);

  // Calculate derived states based on control rod level
  // If rods are OUT (1), reaction is high. If rods are IN (0), reaction is low.
  const reactionIntensity = controlRodLevel; 
  const turbineSpeed = reactionIntensity * 0.5;

  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 
         Using a direct URL for the HDRI to avoid 404 errors from the default 'city' preset 
         which relies on a specific CDN path that may change.
      */}
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />

      <group position={[0, -2, 0]}>
        {/* 1. The Core */}
        <group>
           <Core controlRodLevel={1 - controlRodLevel} /> {/* Inverted logic visually: 0 level = rods up (active), 1 = rods down? No. logic passed: 0=In(Safe), 1=Out(Active) */}
           {/* Neutrons active only when rods are pulled out */}
           <Particles count={20} type="neutron" active={reactionIntensity > 0.2} />
        </group>

        {/* 2. Pipes & Transfer */}
        <Pipes />
        {reactionIntensity > 0.3 && (
           <group position={[-2, 2, 0]}>
             <Particles count={30} type="steam" />
           </group>
        )}

        {/* 3. Turbine */}
        <Turbine speed={turbineSpeed} />

        {/* 4. Cooling */}
        <CoolingTower />
        {reactionIntensity > 0.3 && (
             <group position={[-12, 4, 0]}>
                 <Particles count={100} type="steam" />
             </group>
        )}
        
        {/* Floor Grid for context */}
        <gridHelper args={[40, 40, 0x444444, 0x222222]} position={[0, -2.5, 0]} />
      </group>

      <CameraControls ref={controlsRef} />
    </>
  );
};

export default ReactorScene;