import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

export const Paddle = forwardRef(({ control, paddleX, courtRef, ...props }, ref) => {
  const paddleHeight = 1;
  const paddleWidth = 0.2;
  const paddleDepth = 0.2;
  const paddleBuffer = 0.32;
  const missBuffer = 2;
  const side = paddleX > 0 ? "right" : "left";
  const [paddleY, setPaddleY] = useState(0);

  const movePaddle = useCallback((delta) => {
    setPaddleY((prevY) => {
      const newY = prevY + delta;
      if (courtRef.current) {
        return Math.max(courtRef.current.getBottom() + paddleHeight/2 + paddleBuffer, Math.min(courtRef.current.getTop() - paddleHeight/2 - paddleBuffer, newY));
      }
      return newY;
    });
  }, [courtRef]);

  useEffect(() => {
    const handleMouseWheel = (event) => {
      movePaddle(event.deltaY / 100);
    };
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") movePaddle(0.2);
      if (event.key === "ArrowDown") movePaddle(-0.2);
    };

    if (control === "mouse") {
      window.addEventListener("wheel", handleMouseWheel);
    } else if (control === "keyboard") {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (control === "mouse") {
        window.removeEventListener("wheel", handleMouseWheel);
      } else if (control === "keyboard") {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [control, movePaddle]);

  useImperativeHandle(ref, () => ({
    intersectsPoint: (point) => {
      const [x, y, z] = point;
      const halfWidth = paddleWidth / 2;
      const halfHeight = paddleHeight / 2;
      const halfDepth = paddleDepth / 2;

      return (
        x >= paddleX - halfWidth &&
        x <= paddleX + halfWidth &&
        y >= paddleY - halfHeight &&
        y <= paddleY + halfHeight &&
        z >= -halfDepth &&
        z <= halfDepth
      );
    },
    getDeflectionVelocity: (ballPosition, ballVelocity) => {
      // Calculate the relative position of the ball on the paddle
      const relativeIntersectY = paddleY - ballPosition[1];
      const normalizedRelativeIntersectionY = relativeIntersectY / (paddleHeight / 2);
  
      // Calculate the new angle based on where the ball hit the paddle
      const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // Max angle: 45 degrees

      // Set new velocity
      const speed = Math.sqrt(ballVelocity[0] * ballVelocity[0] + ballVelocity[1] * ballVelocity[1]);
      return([(side === "right" ? -1 : 1) * Math.abs(speed * Math.cos(bounceAngle)),speed * -Math.sin(bounceAngle), 0]);
    }    
  }));
  return (
    <mesh ref={ref}{...props} position={[paddleX, paddleY, 0]}>
      <boxGeometry args={[paddleWidth, paddleHeight, paddleDepth]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
});


Paddle.propTypes = {
  control: PropTypes.oneOf(['mouse', 'keyboard']).isRequired,
  paddleX: PropTypes.number.isRequired,
  courtRef: PropTypes.object.isRequired,
};