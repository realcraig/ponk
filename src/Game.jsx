import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { Paddle } from "./Paddle";
import Court from "./Court";
import ScoreBoard from "./ScoreBoard";
import Ball from "./Ball";
import PropTypes from 'prop-types';

export const Game = forwardRef((_props, ref) => {
    const maxScore = 11;
    const leftPaddleRef = useRef();
    const rightPaddleRef = useRef();
    const courtRef = useRef();
    const ballRef = useRef();

    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [serveStarted, setServeStarted] = useState(false);

    function resetScore() {
        setLeftScore(0);
        setRightScore(0);
    }
    
    function startGame() {
        resetScore();
        setGameStarted(true);
        serveBall(100);
    }

    function gameOver() {
        setGameStarted(false);
    }

    function serveBall(delay) {
        setTimeout(() => {
            ballRef.current.setVelocity(getRandomVelocity());
        }, delay);
        setServeStarted(true);
    }
   
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomVelocity() {
        const angle = getRandomFloat(-Math.PI / 4, Math.PI / 4);
        const speed = (Math.random() < 0.5 ? -1 : 1) * getRandomFloat(0.05, 0.06);

        return [speed * Math.cos(angle), speed * Math.sin(angle), 0];
    }

    useImperativeHandle(ref, () => ({        
        incrementLeftScore: () => {
            setLeftScore(leftScore + 1);
        },
        incrementRightScore: () => {
            setRightScore(rightScore + 1);
        },
        resetScore: () => {
            resetScore();
        },
        isGameStarted: () => {
            return gameStarted;
        },  
        startGame: () => {
            startGame();
        },
        pointOver: () => {
            setServeStarted(false);            
        }
    }));

    useFrame(() => {
        if (leftScore >= maxScore && rightScore < (leftScore - 1) || rightScore >= maxScore && leftScore < (rightScore - 1)) {
            gameOver();
        }
        else if (!serveStarted && gameStarted) {
            serveBall(1000);
        }
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === " " && !gameStarted) {
                startGame();                           
            };
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameStarted]);

    return (
        <group>
            {/* Court */}
            <Court ref={courtRef} />
            {/* Score Board */}
            <ScoreBoard leftScore={leftScore} rightScore={rightScore} />
            {/* Left Paddle */}
            <Paddle ref={leftPaddleRef} paddleX={-4} control="mouse" courtRef={courtRef} />
            {/* Right Paddle */}
            <Paddle ref={rightPaddleRef} paddleX={4} control="keyboard" courtRef={courtRef} />
            {/* Ball */}
            <Ball ref={ballRef} gameRef={ref} courtRef={courtRef} leftPaddleRef={leftPaddleRef} rightPaddleRef={rightPaddleRef} />
        </group>
    );
});

