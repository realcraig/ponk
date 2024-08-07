import { React, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Plane } from '@react-three/drei';
import ScoreBoard from './ScoreBoard';

const Court = forwardRef((_props, ref) => {
    const courtHeight = 6;
    const courtWidth = 10;
    const lineWidth = 0.1;
    const boundsRef = useRef();
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] = useState(0);

    useImperativeHandle(ref, () => ({
        getTop: () => {
            return boundsRef.current.position.y + courtHeight / 2;
        },
        getBottom: () => {
            return boundsRef.current.position.y - courtHeight / 2;
        },
        getLeft: () => {
            return boundsRef.current.position.x - courtWidth / 2;
        },
        getRight: () => {
            return boundsRef.current.position.x + courtWidth / 2;
        },
        incrementLeftScore: () => {
            setLeftScore(leftScore + 1);
        },
        incrementRightScore: () => {
            setRightScore(rightScore + 1);
        },
        resetScore: () => {
            setLeftScore(0);
            setRightScore(0);
        }
    }));

    return (
        <>
        {/* White background plane */}
        <Plane args={[courtWidth, courtHeight + lineWidth]} position={[0, 0, -0.1]}>
            <meshBasicMaterial color="white" />
        </Plane>
        
        {/* Black court plane */}
        <Plane ref={boundsRef} args={[courtWidth, courtHeight]}>
            <meshBasicMaterial color="darkgreen" />
        </Plane>
        <ScoreBoard leftScore={leftScore} rightScore={rightScore} />
        </>
    );
});

export default Court;
