"use client";

import { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import { Leva, useControls } from "leva";
import { mockVehicle } from "../vehicle";

const Scene = () => {
  const scene = useRef<any>();
  // @ts-ignore
  const model = useLoader(GLTFLoader, "./truck_1.glb");

  return (
    <group ref={scene}>
      <primitive position={[0, 0.5, 0]} scale={1} object={model.scene} />
    </group>
  );
};

export default function Vehicle() {
  const params = useSearchParams();

  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });
  return (
    <main className="h-screen box-border">
      <Canvas
        style={{ height: "50%" }}
        camera={{ position: [5, 12, 15], fov: 25 }}
      >
        <Leva hidden />
        <Environment preset="forest" />
        <OrbitControls makeDefault />
        <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
        <Scene />
      </Canvas>
      <div className="box-border container mx-auto px-4 pt-12">
        <h1>{params.get("id")}</h1>
        <p className="text-xl">
          Status{" "}
          <span className="text-green-500 uppercase font-bold">
            {mockVehicle.status}
          </span>
        </p>

        <a
          className="no-underline block px-2 bg-blue-500 py-3 font-bold text-lg border-none shadow-sm text-blue-50 w-fit"
          href="/"
        >
          Back
        </a>
      </div>
    </main>
  );
}
