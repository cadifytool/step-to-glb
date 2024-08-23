import * as THREE from 'three'
// import { useLoader } from '@react-three/fiber'
import occtimportjs from 'occt-import-js'
// import occtimportWasm from 'occt-import-js/dist/occt-import-js.wasm'

// const wasmBlob = dataURItoBlob(occtimportWasm)
// const wasmUrl = URL.createObjectURL(wasmBlob)
const wasmUrl = 'https://cdn.jsdelivr.net/npm/occt-import-js@0.0.14/dist/occt-import-js.wasm'

let occtImportPromise = null
function loadOcctImport() {
  if (occtImportPromise) {
    return occtImportPromise
  }
  const occt = occtimportjs({
    locateFile: (name) => {
      console.log('name', name)
      // return occtimportWasm
      return wasmUrl
    }
  })
  occtImportPromise = occt
  return occtImportPromise
}

export async function LoadStep(fileUrl) {
  // init occt-import-js
  // const occtimportWasm = await import('occt-import-js/dist/occt-import-js.wasm').then((res) => res.default)
  // console.log('occtimportWasm', occtimportWasm)
  const occt = await loadOcctImport()
  console.log('occt', occt, occt.ReadStepFile)

  const targetObject = new THREE.Object3D()

  // download a step file
  // let fileUrl = '../test/testfiles/cax-if/as1_pe_203.stp';
  let response = await fetch(fileUrl)
  let buffer = await response.arrayBuffer()

  // read the imported step file
  let fileBuffer = new Uint8Array(buffer)
  let result = occt.ReadStepFile(fileBuffer, null)
  // console.log('result', result)

  // process the geometries of the result
  for (let resultMesh of result.meshes) {
    let geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(resultMesh.attributes.position.array, 3))
    if (resultMesh.attributes.normal) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(resultMesh.attributes.normal.array, 3))
    }
    const index = Uint32Array.from(resultMesh.index.array)
    geometry.setIndex(new THREE.BufferAttribute(index, 1))
    // geometry = geometry.clone();

    let material = null
    let defaultColor = [1, 1, 1]
    if (resultMesh.color) {
      const color = new THREE.Color(resultMesh.color[0], resultMesh.color[1], resultMesh.color[2])
      defaultColor = resultMesh.color
      material = new THREE.MeshPhongMaterial({ color: color })
    }
    // else {
    // material = new THREE.MeshPhongMaterial({ color: 0xcccccc })
    // material = new THREE.MeshPhongMaterial({ color: '#c8c8c8' })
    // }

    if (resultMesh.face_colors) {
      // console.log(resultMesh.face_colors)
      material = new THREE.MeshPhongMaterial({
        vertexColors: true
      })
      // For Faces
      // const faceColors = [];
      // for (let faceColorGroup of resultMesh.face_colors) {
      //   const { color, first, last } = faceColorGroup
      //   for (let i = first; i <= last; i++) {
      //     faceColors.push(color[0], color[1], color[2])
      //   }
      // }

      // For vertices
      const indexedGeometry = geometry
      geometry = geometry.toNonIndexed()
      const faceColors = new Array(geometry.attributes.position.array.length).fill(0)
      for (let faceColorGroup of resultMesh.face_colors) {
        const { color, first, last } = faceColorGroup
        for (let i = first; i <= last; i++) {
          // faceColors.push(color[0], color[1], color[2])
          // faceColors.push(color[0], color[1], color[2])
          // faceColors.push(color[0], color[1], color[2])

          // faceColors[i * 9] = color[0]
          // faceColors[i * 9 + 3] = color[0]
          // faceColors[i * 9 + 6] = color[0]

          faceColors.splice(Math.floor(i * 9), 9, ...color, ...color, ...color)
        }
      }

      // console.log('faceColors', faceColors)
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(faceColors, 3))
      // console.log('geometry with face colors', resultMesh.face_colors.length, geometry, indexedGeometry)
      // console.log('position', geometry.attributes.position.count, geometry.attributes.position.array.length)
      // console.log('color', geometry.attributes.color.count, geometry.attributes.color.array.length)
      // console.log('geometry with face colors')
    }

    if (!material) {
      material = new THREE.MeshPhongMaterial({ color: '#c8c8c8' })
    }

    const mesh = new THREE.Mesh(geometry, material)
    targetObject.add(mesh)
  }
  return targetObject
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  var ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString })
  return blob
}
