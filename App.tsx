import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import ReactorScene from './components/ReactorScene';
import UI from './components/UI';
import { STAGES } from './constants';

function App() {
  const [currentStageIndex, setStageIndex] = useState(0);
  const [controlRodLevel, setControlRodLevel] = useState(0.2); // 0.0 to 1.0

  const currentStage = STAGES[currentStageIndex];

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 45 }}>
        <Suspense fallback={null}>
          <ReactorScene 
            currentStage={currentStage} 
            controlRodLevel={controlRodLevel}
          />
        </Suspense>
      </Canvas>
      <Loader />
      <UI 
        currentStageIndex={currentStageIndex} 
        setStageIndex={setStageIndex}
        controlRodLevel={controlRodLevel}
        setControlRodLevel={setControlRodLevel}
      />
    </div>
  );
}

export default App;
