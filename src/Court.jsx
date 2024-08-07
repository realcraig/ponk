import { React, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Plane } from '@react-three/drei';


const Court = forwardRef((_props, ref) => {
    const courtHeight = 6;
    const courtWidth = 10;
    const lineWidth = 0.1;
    const boundsRef = useRef();

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
       
        </>
    );
});

export default Court;
