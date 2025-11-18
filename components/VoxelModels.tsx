import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';

// --- Materials ---
const materials = {
  concrete: new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.9 }),
  metal: new THREE.MeshStandardMaterial({ color: '#889', metalness: 0.8, roughness: 0.2 }),
  fuel: new THREE.MeshStandardMaterial({ color: '#00ff00', emissive: '#004400', emissiveIntensity: 2 }),
  controlRod: new THREE.MeshStandardMaterial({ color: '#ff3333', roughness: 0.5 }),
  water: new THREE.MeshPhysicalMaterial({ color: '#00aaff', transmission: 0.6, opacity: 0.5, transparent: true, roughness: 0.1 }),
  steam: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.6 }),
  glow: new THREE.MeshBasicMaterial({ color: '#00ff88', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
};

// --- Helper Components ---

// A simple Voxel cube wrapper
const Voxel = ({ position, color, size = 1, material }: { position: [number, number, number], color?: string, size?: number, material?: THREE.Material }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[size, size, size]} />
      {material ? <primitive object={material} attach="material" /> : <meshStandardMaterial color={color} />}
    </mesh>
  );
};

// --- Models ---

export const Core = ({ controlRodLevel }: { controlRodLevel: number }) => {
  // Fuel Rods Array
  const rods = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        pos.push([x * 0.8, 0, z * 0.8]);
      }
    }
    return pos;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Containment Vessel Base */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 1, 32]} />
        <primitive object={materials.concrete} attach="material" />
      </mesh>
      
      {/* Water Pool */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 4, 32]} />
        <primitive object={materials.water} attach="material" />
      </mesh>

      {/* Fuel Rods */}
      {rods.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.4, 3, 0.4]} />
            <primitive object={materials.fuel} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Control Rods (Movable) */}
      <group position={[0, controlRodLevel, 0]}>
         {rods.map((pos, i) => (
           <mesh key={`cr-${i}`} position={[pos[0], 1.5, pos[2]]}>
             <boxGeometry args={[0.3, 3, 0.3]} />
             <primitive object={materials.controlRod} attach="material" />
           </mesh>
         ))}
         <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[2.5, 0.2, 2.5]} />
            <primitive object={materials.metal} attach="material" />
         </mesh>
      </group>

      {/* Glow Effect */}
      <pointLight position={[0, 0, 0]} color="#00ff88" intensity={2 - controlRodLevel} distance={5} />
    </group>
  );
};

export const Turbine = ({ speed }: { speed: number }) => {
  const rotorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += speed * delta * 10;
    }
  });

  return (
    <group position={[-5, 1, 0]}>
      {/* Housing */}
      <Voxel position={[0, -1, 0]} size={3} material={materials.metal} />
      
      {/* Shaft */}
      <group ref={rotorRef} position={[0, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
          <primitive object={materials.metal} attach="material" />
        </mesh>
        {/* Blades */}
        {[0, 1, 2, 3].map((r) => (
          <group key={r} rotation={[r * (Math.PI / 2), 0, 0]}>
             <mesh position={[0, 0.8, 0]}>
               <boxGeometry args={[0.5, 1.5, 0.1]} />
               <meshStandardMaterial color="#ccc" metalness={0.9} />
             </mesh>
             <mesh position={[0.8, 0.8, 0]}>
               <boxGeometry args={[0.5, 1.5, 0.1]} />
               <meshStandardMaterial color="#ccc" metalness={0.9} />
             </mesh>
              <mesh position={[-0.8, 0.8, 0]}>
               <boxGeometry args={[0.5, 1.5, 0.1]} />
               <meshStandardMaterial color="#ccc" metalness={0.9} />
             </mesh>
          </group>
        ))}
      </group>

      {/* Generator Box */}
      <group position={[-3, 0, 0]}>
         <Voxel position={[0, 0, 0]} size={2} color="#334455" />
         {/* Electric Sparks Simulated by light */}
         {speed > 0.1 && (
            <pointLight position={[0, 1, 0]} color="#ffff00" intensity={Math.random() * 2} distance={3} />
         )}
      </group>
    </group>
  );
};

export const CoolingTower = () => {
  return (
    <group position={[-12, 0, 0]}>
       {/* Voxel Approximation of a Hyperboloid structure */}
       {[...Array(8)].map((_, i) => {
         const y = i * 1;
         const scale = 2.5 - Math.sin(i * 0.3) * 0.8;
         return (
           <mesh key={i} position={[0, y, 0]}>
             <cylinderGeometry args={[scale, scale + 0.2, 1, 16]} />
             <primitive object={materials.concrete} attach="material" />
           </mesh>
         )
       })}
    </group>
  );
};

export const Pipes = () => {
    return (
        <group>
            {/* Reactor to Turbine (Steam) */}
            <mesh position={[-2.5, 2, 0]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.3, 0.3, 5, 8]} />
                <primitive object={materials.metal} attach="material" />
            </mesh>
             {/* Turbine to Cooling (Low Pressure Steam/Water) */}
             <mesh position={[-8, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.3, 0.3, 6, 8]} />
                <primitive object={materials.metal} attach="material" />
            </mesh>
        </group>
    )
}

export const Particles = ({ count = 50, type = 'steam', active = true }: { count?: number, type?: 'steam' | 'neutron', active?: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 5,
        (Math.random() - 0.5) * 2
      ),
      speed: Math.random() * 0.05 + 0.02,
      offset: Math.random() * 100
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !active) return;
    
    particles.forEach((particle, i) => {
      const t = clock.getElapsedTime();
      let { pos, speed, offset } = particle;
      
      if (type === 'steam') {
          // Rise up
          let y = (pos.y + speed + t) % 6;
          dummy.position.set(pos.x, y + 2, pos.z);
          const scale = (y / 6); // Grow as they rise
          dummy.scale.setScalar(scale);
      } else {
          // Neutrons (jitter)
           dummy.position.set(
               pos.x + Math.sin(t * 10 + offset) * 0.2,
               pos.y,
               pos.z + Math.cos(t * 10 + offset) * 0.2
           );
           dummy.scale.setScalar(0.2);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      {type === 'steam' ? (
          <meshBasicMaterial color="white" transparent opacity={0.4} />
      ) : (
          <meshBasicMaterial color="#00ffff" />
      )}
    </instancedMesh>
  );
};
