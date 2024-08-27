import * as THREE from "three";
import { useEffect, useState } from "react";

import { GroupProps } from "@react-three/fiber";
import { loadStep1 } from "../helpers/loadStep1";

interface StepModelProps extends GroupProps {
  url: string;
  loadStep?: (url: string) => Promise<THREE.Object3D>;
}
export function StepModel({
  url,
  loadStep = loadStep1,
  ...props
}: StepModelProps) {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    (async () => {
      const mainObject = await loadStep(url);

      console.log(mainObject);
      setObj(mainObject);
    })();
  }, [url, loadStep]);

  if (!obj) return null;

  return (
    <group {...props}>
      <primitive object={obj} />
    </group>
  );
}
