import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Game } from "./Game";

function App() {
  const gameRef = useRef();
  return (
    <Canvas style={{ background: "#000" }}>
      <OrthographicCamera makeDefault position={[0, 0, 1]} lookAt={[0, 0, 0]} zoom={100}/>

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 10]} intensity={0.5} />
      <pointLight position={[0, 0, 2]} intensity={50} color="white" />

      {/* Game */}
      <Game ref={gameRef} />
    
    </Canvas>
  );
}

export default App;