import { useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'

import { FileInput } from './FileInput'
// import { StepModel } from './StepModel'
import { useStepFile } from './useStepFile'
import { download } from './download'
import { ModelViewer } from './ModelViewer'

export default function App() {
  const [stepFile, setStepFile] = useState('/17HM08-1204S.STEP')
  console.log('stepFile', stepFile)
  const { step, glb } = useStepFile({ url: stepFile })
  const onDownload = () => {
    // console.log('stepfile', stepFile)
    if (!glb) {
      console.error('No GLB')
      return
    }
    download(glb, 'file.glb')
  }
  return (
    <div>
      <FileInput onChange={setStepFile} accept=".step,.stp,application/STEP" />
      {glb && (
        <button type="button" onClick={onDownload}>
          Download GLB
        </button>
      )}
      {step ? (
        <div style={{ height: '90vh' }}>
          <Canvas>
            <Stats className="stats" />
            <OrbitControls makeDefault />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />

            {/* {stepFile && (
              <StepModel
                scale={[0.1, 0.1, 0.1]}
                // url="/Gripper01.stp"
                // url="/17HM08-1204S.STEP"
                url={stepFile}
              />
            )} */}

            <ModelViewer step={step} glb={glb} />
          </Canvas>
        </div>
      ) : stepFile ? (
        <div>Processing...</div>
      ) : (
        <div>Upload a STEP file to start.</div>
      )}
    </div>
  )
}
