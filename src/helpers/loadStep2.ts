import * as THREE from "three";
import { ReadStepFileResult } from "occt-import-js";

export function loadStep2(result: ReadStepFileResult) {
  // process the geometries of the result
  const group = new THREE.Group();
  for (const resultMesh of result.meshes) {
    const { mesh, edges } = BuildMesh(resultMesh, true);
    group.add(mesh);
    if (edges) {
      group.add(edges);
    }
  }
  const mainObject = new THREE.Object3D();
  mainObject.add(group);

  return mainObject;
}

function BuildMesh(
  geometryMesh: ReadStepFileResult["meshes"][number],
  showEdges: boolean
) {
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(geometryMesh.attributes.position.array, 3)
  );
  if (geometryMesh.attributes.normal) {
    geometry.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(geometryMesh.attributes.normal.array, 3)
    );
  }
  geometry.name = geometryMesh.name;
  const index = Uint32Array.from(geometryMesh.index.array);
  geometry.setIndex(new THREE.BufferAttribute(index, 1));

  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const defaultMaterial = new THREE.MeshPhongMaterial({
    color: geometryMesh.color
      ? new THREE.Color(
          geometryMesh.color[0],
          geometryMesh.color[1],
          geometryMesh.color[2]
        )
      : 0xcccccc,
    specular: 0,
  });

  const materials = [defaultMaterial];
  const edges = showEdges ? new THREE.Group() : null;

  if (geometryMesh.brep_faces && geometryMesh.brep_faces.length > 0) {
    for (const faceColor of geometryMesh.brep_faces) {
      const color = faceColor.color
        ? new THREE.Color(
            faceColor.color[0],
            faceColor.color[1],
            faceColor.color[2]
          )
        : Math.floor(Math.random() * 0xffffff);
      // defaultMaterial.color;
      materials.push(
        new THREE.MeshPhongMaterial({ color: color, specular: 0 })
      );
    }

    const triangleCount = geometryMesh.index.array.length / 3;
    let triangleIndex = 0;
    let faceColorGroupIndex = 0;
    while (triangleIndex < triangleCount) {
      const firstIndex = triangleIndex;
      let lastIndex: number;
      let materialIndex: number;
      if (faceColorGroupIndex >= geometryMesh.brep_faces.length) {
        lastIndex = triangleCount;
        materialIndex = 0;
      } else if (
        triangleIndex < geometryMesh.brep_faces[faceColorGroupIndex].first
      ) {
        lastIndex = geometryMesh.brep_faces[faceColorGroupIndex].first;
        materialIndex = 0;
      } else {
        lastIndex = geometryMesh.brep_faces[faceColorGroupIndex].last + 1;
        materialIndex = faceColorGroupIndex + 1;
        faceColorGroupIndex++;
      }
      geometry.addGroup(
        firstIndex * 3,
        (lastIndex - firstIndex) * 3,
        materialIndex
      );
      triangleIndex = lastIndex;

      if (edges) {
        console.log("call edges", firstIndex, lastIndex);
        const innerGeometry = new THREE.BufferGeometry();
        innerGeometry.setAttribute("position", geometry.attributes.position);
        if (geometryMesh.attributes.normal) {
          innerGeometry.setAttribute("normal", geometry.attributes.normal);
        }
        innerGeometry.setIndex(
          new THREE.BufferAttribute(
            index.slice(firstIndex * 3, lastIndex * 3),
            1
          )
        );
        const innerEdgesGeometry = new THREE.EdgesGeometry(innerGeometry, 180);
        const edge = new THREE.LineSegments(
          innerEdgesGeometry,
          outlineMaterial
        );
        edges.add(edge);
      }
    }
  }

  const mesh = new THREE.Mesh(
    geometry,
    materials.length > 1 ? materials : materials[0]
  );
  mesh.name = geometryMesh.name;

  if (edges) {
    edges.renderOrder = mesh.renderOrder + 1;
  }

  console.log(mesh, geometry, edges);

  return { mesh, geometry, edges };
}
