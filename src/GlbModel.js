import { useRef, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader, BoxHelper } from 'three-stdlib'
import { useHelper } from '@react-three/drei'

export function GlbModel({ url }) {
  const gltf = useLoader(GLTFLoader, url)
  // console.log('gltf', gltf)

  const mesh = useRef()
  useHelper(mesh, BoxHelper, 'cyan')

  return (
    <Suspense fallback={null}>
      <primitive ref={mesh} object={gltf.scene} />
    </Suspense>
  )
}
