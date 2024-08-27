import * as THREE from "three";
import { StepModel, StepModelProps, StepModelRef } from "./StepModel";
import { useRef } from "react";

interface SelectableStepModelProps extends StepModelProps {
  onSelect: (obj: THREE.Object3D) => void;
}
export function SelectableStepModel({
  onSelect,
  ...props
}: SelectableStepModelProps) {
  const ref = useRef<StepModelRef>(null);

  return (
    <StepModel
      ref={ref}
      onClick={({ face }) => {
        if (!ref.current?.readStepFileResult || !face?.materialIndex) return;
        const geometryMesh = ref.current.readStepFileResult.meshes[0];

        const { first, last } = geometryMesh.brep_faces[face.materialIndex - 1];

        const firstIndex = first;
        const lastIndex = last + 1;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            geometryMesh.attributes.position.array,
            3
          )
        );
        if (geometryMesh.attributes.normal) {
          geometry.setAttribute(
            "normal",
            new THREE.Float32BufferAttribute(
              geometryMesh.attributes.normal.array,
              3
            )
          );
        }
        geometry.setIndex(
          new THREE.BufferAttribute(
            Uint32Array.from(geometryMesh.index.array).slice(
              firstIndex * 3,
              lastIndex * 3
            ),
            1
          )
        );

        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0 })
        );

        const group = new THREE.Group();
        group.add(mesh);

        const mainObject = new THREE.Object3D();
        mainObject.add(group);

        onSelect(mainObject);
      }}
      {...props}
    />
  );
}
