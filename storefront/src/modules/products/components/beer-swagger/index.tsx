"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group } from "three";

// Tipizza i nodi del file GLTF
type GLTFResult = {
  nodes: {
    cylinder: THREE.Mesh;
    cylinder_1: THREE.Mesh;
    Tab: THREE.Mesh;
  };
} & THREE.Object3D;

// Tipizza le props per il componente BeerSwagger
export type BeerSwaggerProps = {
  urlImg: string; // Rende opzionale l'URL
  scale?: number;
};

export function BeerSwagger({ urlImg, scale = 1.5 }: BeerSwaggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Canvas
      style={{
        position: "absolute",
        left: "50%",
        top: "75%",
        transform: "translate(-50%, -50%)",
        overflow: "hidden",
        pointerEvents: "auto",
        zIndex: 30,
      }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{
        fov: 30,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ambientLight intensity={15} color={"#fffafa"} />
      <directionalLight position={[5, -5, 5]} intensity={2} castShadow />
      <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
      <Scene urlImg={urlImg} scale={scale} isHovered={isHovered} />
    </Canvas>
  );
}

// Tipizza le props per il componente Scene
type SceneProps = {
  urlImg: string;
  scale: number;
  isHovered: boolean;
};

function Scene({ urlImg, scale, isHovered }: SceneProps) {
  const { nodes } = useGLTF("/Beer-can.gltf") as unknown as GLTFResult;
  const image = "/images/beer-swagger/label-placeholder.png"

  const label = useTexture(image);
  label.flipY = true;


  const groupRef = useRef<Group>(null);
  const rotationSpeed = useRef(0.01); // Velocità iniziale della rotazione
  const damping = 0.01; // Fattore di smorzamento per rallentare la rotazione

  useFrame(() => {
    if (groupRef.current) {
      if (isHovered && rotationSpeed.current > 0) {
        // Riduci gradualmente la velocità di rotazione
        rotationSpeed.current = Math.max(rotationSpeed.current - damping * rotationSpeed.current, 0);
      } else if (!isHovered && rotationSpeed.current < 0.01) {
        // Aumenta gradualmente la velocità di rotazione fino alla velocità normale
        rotationSpeed.current = Math.min(rotationSpeed.current + damping * (0.01 - rotationSpeed.current), 0.01);
      }

      groupRef.current.rotation.y += rotationSpeed.current;
    }
  });

  const metalMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.9,
    color: "#bbbbbb"
  });

  return (
    <Float
      speed={2.5}
      rotationIntensity={1.2}
      floatIntensity={1.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group
        ref={groupRef}
        dispose={null}
        scale={scale}
        rotation={[0, -Math.PI, 0]}
        position={[0, 0.5, 0]}
      >
        <mesh castShadow receiveShadow geometry={nodes.cylinder.geometry} material={metalMaterial} />
        <mesh castShadow receiveShadow geometry={nodes.cylinder_1.geometry}>
          {label ? (

            <meshStandardMaterial roughness={0.3} metalness={0.9} map={label} />
          ) : (
            <meshStandardMaterial roughness={0.3} metalness={0.9} />
          )}
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.Tab.geometry} material={metalMaterial} />
      </group>
    </Float>
  );
}