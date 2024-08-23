import { Stage } from '@react-three/drei'

import { GlbModel } from './GlbModel'

export function ModelViewer({ step, glb }) {
  return (
    <Stage contactShadow shadows adjustCamera intensity={0.2} environment="warehouse" preset="rembrandt">
      <group>
        {step && !glb && <primitive object={step} />}
        {glb && <GlbModel url={glb} />}
      </group>
    </Stage>
  )
}
