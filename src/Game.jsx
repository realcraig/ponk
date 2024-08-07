import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';

import { Paddle } from "./Paddle";
import Court from "./Court";
import ScoreBoard from "./ScoreBoard";
import Ball from "./Ball";
import PropTypes from 'prop-types';

export const Game = forwardRef((_props, ref) => {
    const leftPaddleRef = useRef();
    const rightPaddleRef = useRef();
    const courtRef = useRef();
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    function resetScore() {
        setLeftScore(0);
        setRightScore(0);
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
            resetScore();
            setGameStarted(true);
        }
    }));

    useFrame(() => {
        if (leftScore >= 11 && rightScore < (leftScore - 1) || rightScore >= 11 && leftScore < (rightScore - 1)) {
            setGameStarted(false);
        }
    });

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
            <Ball gameRef={ref} courtRef={courtRef} leftPaddleRef={leftPaddleRef} rightPaddleRef={rightPaddleRef} />
        </group>
    );
});

