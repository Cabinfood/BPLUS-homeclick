import { Suspense, memo } from "react"
import { Canvas } from "@react-three/fiber"
import { Html, useProgress, useGLTF, OrbitControls, Environment } from "@react-three/drei"
import { Text } from "@medusajs/ui"

type AdminModelViewerProps = {
  src: string
}

const Loader = memo(() => {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col gap-2 items-center">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 animate-spin border-t-transparent" />
        <p className="text-xs text-gray-600">Loading {Math.round(progress)}%</p>
      </div>
    </Html>
  )
})

const Model = ({ url }: { url: string }) => {
  const gltf = useGLTF(url, true) as any
  return gltf?.scene ? <primitive object={gltf.scene} /> : null
}

export const AdminModelViewer = ({ src }: AdminModelViewerProps) => {
  if (!src) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Text size="small" className="text-ui-fg-subtle">No model</Text>
      </div>
    )
  }
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: "transparent" }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={<Loader />}>
        <Model url={src} />
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate />
      <Environment preset="apartment" />
    </Canvas>
  )
}


