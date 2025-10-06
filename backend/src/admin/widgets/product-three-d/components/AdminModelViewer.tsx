import { Suspense, memo, useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Html, useProgress, useGLTF, OrbitControls } from "@react-three/drei"
import { Text } from "@medusajs/ui"
import * as THREE from "three"

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
Loader.displayName = "Loader"

const Model = memo(({ url, onError }: { url: string; onError: () => void }) => {
  try {
    const gltf = useGLTF(url, true, undefined, (error) => {
      console.error('Failed to load 3D model:', error)
      onError()
    }) as any

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (gltf?.scene) {
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.geometry?.dispose()
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat: any) => {
                    Object.keys(mat).forEach((prop) => {
                      if (mat[prop] && mat[prop].isTexture) {
                        mat[prop].dispose()
                      }
                    })
                    mat.dispose()
                  })
                } else {
                  Object.keys(child.material).forEach((prop) => {
                    if (child.material[prop] && child.material[prop].isTexture) {
                      child.material[prop].dispose()
                    }
                  })
                  child.material.dispose()
                }
              }
            }
          })
        }
        // Clear useGLTF cache for this URL
        useGLTF.clear(url)
      }
    }, [gltf, url])

    return gltf?.scene ? <primitive object={gltf.scene} /> : null
  } catch (error) {
    console.error('Error in Model component:', error)
    onError()
    return null
  }
})
Model.displayName = "Model"

const ModelViewerCanvas = memo(({ src, onError }: { src: string; onError: () => void }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
    >
      {/* Simple lighting setup - more efficient than Environment preset */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow={false} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} castShadow={false} />

      <Suspense fallback={<Loader />}>
        <Model url={src} onError={onError} />
      </Suspense>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.05}
        maxDistance={10}
        minDistance={2}
      />
    </Canvas>
  )
})
ModelViewerCanvas.displayName = "ModelViewerCanvas"

export const AdminModelViewer = memo(({ src }: AdminModelViewerProps) => {
  const [hasError, setHasError] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Delay mount to avoid flicker
  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
      setHasError(false)
    }
  }, [])

  if (!src) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[400px]">
        <Text size="small" className="text-ui-fg-subtle">No model</Text>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full min-h-[400px] gap-2">
        <Text size="small" className="text-ui-fg-muted">Failed to load 3D model</Text>
        <Text size="xsmall" className="text-ui-fg-subtle">The model file may be unavailable</Text>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[400px]">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 animate-spin border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ModelViewerCanvas src={src} onError={() => setHasError(true)} />
    </div>
  )
})
AdminModelViewer.displayName = "AdminModelViewer"


