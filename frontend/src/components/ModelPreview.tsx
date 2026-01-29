import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center } from '@react-three/drei';
import { Suspense } from 'react';

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ModelPreviewProps {
  modelUrl: string;
}

export function ModelPreview({ modelUrl }: ModelPreviewProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-xl">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Center>
            <Model url={modelUrl} />
          </Center>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        🖱️ Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
