import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { ReadStepFileResult } from "occt-import-js";

export function loadStep1(result: ReadStepFileResult) {
  const targetObject = new THREE.Object3D();

  for (const resultMesh of result.meshes) {
    const geometry = new THREE.BufferGeometry();

    const normal = resultMesh.attributes.normal?.array;
    const position = resultMesh.attributes.position.array;
    const faces = resultMesh.brep_faces;
    const index = resultMesh.index.array;

    console.log("===== resultMesh info =====");
    console.log("attributes.normal", normal?.length);
    console.log("attributes.normal", position.length);
    console.log("brep_faces", faces.length);
    console.log("index", index.length);
    console.log("===========================");

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    if (normal) {
      geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normal, 3)
      );
    }
    geometry.setIndex(new THREE.BufferAttribute(Uint16Array.from(index), 1));

    const colorArray = new Float32Array(position.length); // RGB 색상 배열

    // 각 면에 색상을 할당
    faces.forEach((face, i) => {
      // 고유한 색상 생성 (HSL 기반)
      //index.js
      function makeRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r},${g},${b})`;
      }
      const color = new THREE.Color(
        // i === 0 ? "pink" :
        makeRandomColor()
        // `hsl(${(i * 360) / faces.length}, 80%, 50%)`
      );

      // 해당 face의 인덱스 범위 내에 있는 정점에 색상 할당
      console.log("face", face, color, (i * 360) / faces.length);
      for (let j = face.first; j <= face.last; j++) {
        const vertexIndex = index[j * 3] * 3; // 인덱스 배열에서 해당 면의 정점 인덱스 가져오기

        // 해당 정점에 색상 할당
        if (colorArray[vertexIndex] && colorArray[vertexIndex] === color.r)
          console.log("override 1");
        colorArray[vertexIndex] = color.r;
        if (
          colorArray[vertexIndex + 1] &&
          colorArray[vertexIndex + 1] === color.r
        )
          console.log("override 2");
        colorArray[vertexIndex + 1] = color.g;
        if (
          !colorArray[vertexIndex + 2] &&
          colorArray[vertexIndex + 2] === color.r
        )
          console.log("override 3");

        colorArray[vertexIndex + 2] = color.b;
      }
    });
    console.log(colorArray, new THREE.Float32BufferAttribute(colorArray, 3));

    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );

    let material = null;
    material = new CustomShaderMaterial({ vertexColors: true });

    // if (resultMesh.color) {
    //   const color = new THREE.Color(
    //     resultMesh.color[0],
    //     resultMesh.color[1],
    //     resultMesh.color[2]
    //   );
    //   material = new THREE.MeshPhongMaterial({ color: color });
    // } else {
    //   material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    // }

    const mesh = new THREE.Mesh(geometry, material);
    targetObject.add(mesh);
  }
  return targetObject;
}

const vertexShader = `
  varying vec3 vColor;

  void main() {
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

export const CustomShaderMaterial = shaderMaterial(
  {},
  vertexShader,
  fragmentShader
);
