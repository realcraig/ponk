import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import {Howl, Howler} from 'howler';
import PropTypes from 'prop-types'; 


const Ball = forwardRef(({ gameRef, courtRef, leftPaddleRef, rightPaddleRef }, ref) =>  {
    const ballRadius = 0.15;
    // Setup the new Howl.
    const plinkSound = new Howl({
        src: ['/sounds/plink.mp3']
    });
    const missSound = new Howl({
        src: ['/sounds/miss.mp3'],
        volume: 0.3
    });

    const [ballPosition, setBallPosition] = useState([0, 0, 0]);
    const [ballVelocity, setBallVelocity] = useState([0, 0, 0]);

    useImperativeHandle(ref, () => ({        
        setVelocity: (velocity) => {
            setBallVelocity(velocity);
        },
    }));

    useFrame(() => {
        if (ballPosition[0] + ballRadius >= courtRef.current.getRight() || 
            ballPosition[0] - ballRadius <= courtRef.current.getLeft()) {
            setBallPosition([0, 0, 0]);
            setBallVelocity([0, 0, 0]);

            if (ballPosition[0] + ballRadius >= courtRef.current.getRight()) {
                gameRef.current.incrementLeftScore();
            } else {
                gameRef.current.incrementRightScore();
            }
            missSound.play();

            gameRef.current.pointOver();
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