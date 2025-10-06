"use client"
import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  Component,
  ReactNode,
  memo,
} from "react"
import { useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Html,
  useProgress,
  useGLTF,
} from "@react-three/drei"
import { Group, Vector3, Box3 } from "three"
import dynamic from "next/dynamic"
import { Eye, ArrowLeft, ArrowUp, Rotate3D, RotateCcw } from "lucide-react"

const PERFORMANCE_CONFIG = {
  low: {
    dpr: 0.5,
    antialias: false,
    shadowMap: false,
    maxDistance: 8,
    minDistance: 3,
    rotationSpeed: 0.05,
  },
  medium: {
    dpr: 1,
    antialias: true,
    shadowMap: true,
    maxDistance: 10,
    minDistance: 2,
    rotationSpeed: 0.1,
  },
} as const

// Removed default material override to preserve GLTF-provided materials

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="mx-auto mb-2 w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-transparent" />
          <p className="text-sm text-gray-600">Loading 3D viewer...</p>
        </div>
      </div>
    ),
  }
)

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("3D Model Error:", error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

type Model3DViewerProps = {
  modelUrl?: string
  className?: string
  fallbackMessage?: string
  performanceMode?: "low" | "medium" | "auto"
  enableAutoRotate?: boolean
  defaultRoughness?: number // set default roughness for all mesh materials
}

type ModelProps = {
  url: string
  performanceMode?: "low" | "medium"
  isAutoRotating?: boolean
  materialOverrides?: Record<string, string> // nodeName -> materialName
  defaultRoughness?: number
}

const usePerformanceMode = () => {
  const [mode, setMode] = useState<"low" | "medium">("medium")

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 4

    if (cores <= 2 || memory <= 2) {
      setMode("low")
    } else {
      setMode("medium")
    }
  }, [])

  return mode
}

const Loader = memo(() => {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col gap-2 items-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 animate-spin border-t-transparent" />
        <p className="text-sm text-gray-600 text-nowrap">
          Loading 3D model... {Math.round(progress)}%
        </p>
      </div>
    </Html>
  )
})

const LoadingState = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-full">
    <div className="text-center">
      <div className="mx-auto mb-2 w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-transparent" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  </div>
)

const Model = memo(
  ({
    url,
    performanceMode = "medium",
    isAutoRotating = false,
    materialOverrides,
  }: ModelProps) => {
    const model = useGLTF(url, true) as any
    const scene = model?.scene
    const error = model?.error
    const groupRef = useRef<Group>(null)

    // Cleanup: Dispose 3D resources when component unmounts
    useEffect(() => {
      return () => {
        if (scene) {
          scene.traverse((object: any) => {
            if (object.geometry) {
              object.geometry.dispose()
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((m: any) => m.dispose())
              } else {
                object.material.dispose()
              }
            }
          })
        }
        // Clear model from cache to free memory
        if (url) {
          useGLTF.clear(url)
        }
      }
    }, [scene, url])

    if (error) {
      console.error("Error in Model component:", error)
      return null
    }

    if (!scene) {
      return null
    }

    return (
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    )
  }
)

const Model3DViewer = ({
  modelUrl,
  className = "",
  fallbackMessage = "No 3D model available",
  performanceMode = "auto",
  enableAutoRotate = false,
}: Model3DViewerProps) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(enableAutoRotate)
  const [isAtDefaultView, setIsAtDefaultView] = useState(true)
  const orbitControlsRef = useRef<any>(null)

  const detectedMode = usePerformanceMode()
  const finalPerformanceMode =
    performanceMode === "auto" ? detectedMode : performanceMode

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("model-viewer-container")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [isClient])

  useEffect(() => {
    setHasError(false)
  }, [modelUrl])

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
  }, [])

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev)
  }, [])

  const rotateToView = useCallback((azimuth: number, polar: number) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.setAzimuthalAngle(azimuth)
      orbitControlsRef.current.setPolarAngle(polar)
      orbitControlsRef.current.update()
      setIsAtDefaultView(false)
      // Tắt auto-rotate khi user chọn view cụ thể
      setIsAutoRotating(false)
    }
  }, [])

  const resetView = useCallback(() => {
    if (orbitControlsRef.current) {
      // Reset về góc nhìn mặc định: camera position, zoom, rotation
      orbitControlsRef.current.reset()
      // Đảm bảo camera về vị trí ban đầu
      orbitControlsRef.current.object.position.set(0, 0, 5)
      orbitControlsRef.current.target.set(0, 0, 0)
      orbitControlsRef.current.update()
      setIsAtDefaultView(true)
    }
  }, [])

  if (!isClient) {
    return <LoadingState message="Loading 3D viewer..." />
  }

  if (!modelUrl) {
    return (
      <div className={`flex justify-center items-center h-full ${className}`}>
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-lg">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-ui-fg-muted">{fallbackMessage}</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={`flex justify-center items-center h-full ${className}`}>
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-lg">
            <svg
              className="w-8 h-8 text-red-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="mb-2 text-red-600">Failed to load 3D model</p>
          <button
            onClick={handleRetry}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const config = PERFORMANCE_CONFIG[finalPerformanceMode]

  return (
    <div
      id="model-viewer-container"
      className={`relative w-full h-full group ${className}`}
    >
      {/* Control buttons - simplified */}
      <div className={`flex absolute right-2 top-4 z-10 flex-col gap-2`}>
        {/* Auto-rotate toggle */}
        <button
          onClick={toggleAutoRotate}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 bg-white/80 hover:bg-white hover:scale-105`}
          title={isAutoRotating ? "Tắt xoay tự động" : "Bật xoay tự động"}
        >
          <Rotate3D
            className={`w-5 h-5 transition-transform duration-200 ${
              isAutoRotating ? "text-blue-600" : "text-gray-600"
            }`}
          />
        </button>

        {/* Reset view */}
        <button
          onClick={resetView}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
            isAtDefaultView
              ? "bg-gray-200/80 hover:bg-gray-300/80"
              : "bg-white/80 hover:bg-white"
          }`}
          title={
            isAtDefaultView ? "Đang ở góc nhìn gốc" : "Reset về góc nhìn gốc"
          }
        >
          <RotateCcw
            className={`w-5 h-5 transition-colors duration-200 ${
              isAtDefaultView ? "text-gray-400" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Essential view buttons - only 3 most useful */}
      <div className={`flex absolute right-2 bottom-4 z-10 flex-col gap-2`}>
        {/* Front view */}
        <button
          onClick={() => rotateToView(0, Math.PI / 2)}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 bg-white/80 hover:bg-white hover:scale-105`}
          title="Front view"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </button>

        {/* Side view (left) */}
        <button
          onClick={() => rotateToView(-Math.PI / 2, Math.PI / 2)}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 bg-white/80 hover:bg-white hover:scale-105`}
          title="Side view"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Top view */}
        <button
          onClick={() => rotateToView(0, 0)}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 bg-white/80 hover:bg-white hover:scale-105`}
          title="Top view"
        >
          <ArrowUp className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
        >
          {/* Optimized lighting - removed heavy Environment preset to save ~10-20MB memory */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <directionalLight position={[0, 10, 0]} intensity={0.3} />

          <Suspense fallback={<Loader />}>
            <ModelErrorBoundary onError={handleError}>
              <Model
                url={modelUrl}
                performanceMode={finalPerformanceMode}
                isAutoRotating={isAutoRotating}
              />
            </ModelErrorBoundary>
          </Suspense>

          <OrbitControls
            ref={orbitControlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={config.minDistance}
            maxDistance={config.maxDistance}
            autoRotate={isAutoRotating}
            autoRotateSpeed={config.rotationSpeed * 10}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      )}
    </div>
  )
}

export default memo(Model3DViewer)
