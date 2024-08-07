import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { Paddle } from "./Paddle";
import Court from "./Court";
const ballRadius = 0.15;


function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomVelocity() {
  const angle = getRandomFloat(-Math.PI / 4, Math.PI / 4);
  const speed = (Math.random() < 0.5 ? -1 : 1) * getRandomFloat(0.04, 0.05);

  return [speed * Math.cos(angle), speed * Math.sin(angle), 0];
}

function Ball({ courtRef, leftPaddleRef, rightPaddleRef }) {
  
  const [ballPosition, setBallPosition] = useState([0, 0, 0]);
  const [ballVelocity, setBallVelocity] = useState([0, 0, 0]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " " && !playing) {
        setBallVelocity(getRandomVelocity());
        setPlaying(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playing, ballVelocity]);

  useFrame(() => {
    if (ballPosition[0] + ballRadius >= courtRef.current.getRight() || 
      ballPosition[0] - ballRadius <= courtRef.current.getLeft()) {
      setBallPosition([0, 0, 0]);
      setBallVelocity([0, 0, 0]);
      setPlaying(false);
    }
    else {
      // Check for collision with top wall
      if (ballPosition[1] + ballRadius >= courtRef.current.getTop()) {
        setBallVelocity([ballVelocity[0], -Math.abs(ballVelocity[1]), ballVelocity[2]]);
      }
      // Check for collision with bottom wall
      else if (ballPosition[1] - ballRadius <= courtRef.current.getBottom()) {
        setBallVelocity([ballVelocity[0], Math.abs(ballVelocity[1]), ballVelocity[2]]);
      }
      // Check for collision with left paddle
      else if (leftPaddleRef.current.intersectsPoint([ballPosition[0]-ballRadius, ballPosition[1], ballPosition[2]])) {
        setBallVelocity(leftPaddleRef.current.getDeflectionVelocity(ballPosition, ballVelocity));
      }
      // Check for collision with right paddle
      else if (rightPaddleRef.current.intersectsPoint([ballPosition[0]+ballRadius, ballPosition[1], ballPosition[2]])) {
        setBallVelocity(rightPaddleRef.current.getDeflectionVelocity(ballPosition, ballVelocity));
      }
    
    setBallPosition([ballPosition[0] + ballVelocity[0], ballPosition[1] + ballVelocity[1], ballPosition[2] + ballVelocity[2]]);    
  }
  });

  return (
    <mesh position={ballPosition}>
      <sphereGeometry args={[ballRadius]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}


function App() {
  const leftPaddleRef = useRef();
  const rightPaddleRef = useRef();
  const courtRef = useRef();

  return (
    <Canvas style={{ background: "#000" }}>
      <OrthographicCamera makeDefault position={[0, 0, 1]} lookAt={[0, 0, 0]} zoom={100}/>
      <Court ref={courtRef} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 10]} intensity={0.5} />
      <pointLight position={[0, 0, 2]} intensity={50} color="white" />

      {/* Left Paddle */}
      <Paddle ref={leftPaddleRef} paddleX={-4} control="mouse" courtRef={courtRef} />
      
      {/* Right Paddle */}
      <Paddle ref={rightPaddleRef} paddleX={4} control="keyboard" courtRef={courtRef} />

      {/* Ball */}
      <Ball courtRef={courtRef} leftPaddleRef={leftPaddleRef} rightPaddleRef={rightPaddleRef} />
    
    </Canvas>
  );
}

export default App;