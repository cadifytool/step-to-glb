import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CustomShaderMaterial, loadStep2, loadStep1 } from "./helpers";
import { useControls } from "leva";
import { SelectableStepModel } from "./components";
import { useState } from "react";

extend({ CustomShaderMaterial });

function App() {
  const { stepFile: url, loadStep } = useControls({
    stepFile: {
      options: {
        일반: "/General.step",
        "절곡면 1개 + 홀 2개": "/1 Bend Surface + 2 Holes.step",
        "절곡면 2개 + 홀 2개 + 탭 1개":
          "/2 Bend Surfaces + 2 Holes + 1 Tab.step",
        "절곡 3번": "/3 Bends.step",
        "홀 4개": "/4 Holes.step",
        "전개 불가": "/Unfold Not Possible.step",
      },
    },
    loadStep: { options: { loadStep2, loadStep1 } },
  });

  const [selectedMeshList, setSelectedMeshList] = useState<THREE.Object3D[]>(
    []
  );

  return (
    <Canvas
      style={{ display: "flex", width: "100%", backgroundColor: "white" }}
    >
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <SelectableStepModel
        onSelect={(mesh) => setSelectedMeshList((p) => [...p, mesh])}
        position={[0, 0, 0]}
        scale={[0.1, 0.1, 0.1]}
        url={url}
        loadStep={loadStep}
      />
      <group position={[0, -5, 0]} scale={[0.1, 0.1, 0.1]}>
        {selectedMeshList.map((selectedMesh, index) => (
          <primitive key={index} object={selectedMesh} />
        ))}
      </group>
    </Canvas>
  );
}

export default App;
