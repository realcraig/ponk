import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import {Howl, Howler} from 'howler';
import PropTypes from 'prop-types'; 

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomVelocity() {
    const angle = getRandomFloat(-Math.PI / 4, Math.PI / 4);
    const speed = (Math.random() < 0.5 ? -1 : 1) * getRandomFloat(0.05, 0.06);

    return [speed * Math.cos(angle), speed * Math.sin(angle), 0];
}

const Ball = forwardRef(({ gameRef, courtRef, leftPaddleRef, rightPaddleRef }, ref) =>  {
    const ballRadius = 0.15;
    // Setup the new Howl.
    const plinkSound = new Howl({
        src: ['/sounds/plink.mp3']
    });
    const missSound = new Howl({
        src: ['/sounds/miss.mp3']
    });

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
        if (ballPosition[0] + ballRadius >= courtRef.current.getRight()) {
            gameRef.current.incrementLeftScore();
        } else {
            gameRef.current.incrementRightScore();
        }
        missSound.play();
        }
        else {
        // Check for collision with top wall
        if (ballPosition[1] + ballRadius >= courtRef.current.getTop()) {
            setBallVelocity([ballVelocity[0], -Math.abs(ballVelocity[1]), ballVelocity[2]]);
            plinkSound.play();
        }
        // Check for collision with bottom wall
        else if (ballPosition[1] - ballRadius <= courtRef.current.getBottom()) {
            setBallVelocity([ballVelocity[0], Math.abs(ballVelocity[1]), ballVelocity[2]]);
            plinkSound.play();
        }
        // Check for collision with left paddle
        else if (leftPaddleRef.current.intersectsPoint([ballPosition[0]-ballRadius, ballPosition[1], ballPosition[2]])) {
            setBallVelocity(leftPaddleRef.current.getDeflectionVelocity(ballPosition, ballVelocity));
            plinkSound.play();
        }
        // Check for collision with right paddle
        else if (rightPaddleRef.current.intersectsPoint([ballPosition[0]+ballRadius, ballPosition[1], ballPosition[2]])) {
            setBallVelocity(rightPaddleRef.current.getDeflectionVelocity(ballPosition, ballVelocity));
            plinkSound.play();
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
});

export default Ball;