import React from 'react';
import { Html } from '@react-three/drei';

const ScoreBoard = ({ leftScore, rightScore }) => {
  return (
    <Html>
      <div style={{
        position: 'absolute',
        width: '100%',
        top: '-300px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '128px',
        color: 'white',
      }}>
        <div style={{ marginRight: '50px' }}>{leftScore}</div>
        <div style={{ marginLeft: '50px' }}>{rightScore}</div>
      </div>
    </Html>
  );
};

export default ScoreBoard;
