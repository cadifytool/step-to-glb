import { useEffect, useRef, useState } from 'react'
import { BoxHelper } from 'three-stdlib'
import { useHelper } from '@react-three/drei'
import { LoadStep } from './StepLoader'
// import { download } from './download'
import { GlbModel } from './GlbModel'
import { convertObjectToGlb } from './convertObjectToGlb'

// function Box(props) {
//   // This reference gives us direct access to the THREE.Mesh object
//   const ref = useRef()
//   // Hold state for hovered and clicked events
//   const [hovered, hover] = useState(false)
//   const [clicked, click] = useState(false)
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => (ref.current.rotation.x += delta))
//   // Return the view, these are regular Threejs elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={ref}
//       scale={clicked ? 1.5 : 1}
//       onClick={(event) => click(!clicked)}
//       onPointerOver={(event) => hover(true)}
//       onPointerOut={(event) => hover(false)}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }
export function StepModel({ url, ...props }) {
  const mesh = useRef()
  useHelper(mesh, BoxHelper, 'cyan')

  const [obj, setObj] = useState(null)
  const [glb, setGlb] = useState(null)
  useEffect(() => {
    async function load() {
      // const mainObject = LoadStep('https://github.com/kovacsv/occt-import-js/raw/main/test/testfiles/cax-if/as1_pe_203.stp')
      // const mainObject = await LoadStep('/as1_pe_203.stp')
      const mainObject = await LoadStep(url)
      console.log('mainObject', mainObject)
      setObj(mainObject)

      const glbUrl = await convertObjectToGlb(mainObject)
      console.log('glbUrl', glbUrl)
      setGlb(glbUrl)
    }
    load()
  }, [url])

  if (!obj) {
    return null
  }

  return (
    <group
      ref={mesh}
      {...props}
      // onClick={() => {
      //   download(glb)
      // }}
    >
      <primitive object={obj} />

      {glb && (
        <group position={[500, 0, 0]}>
          <GlbModel url={glb} />
        </group>
      )}
    </group>
  )
}
