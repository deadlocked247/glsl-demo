import { Canvas, useFrame } from "react-three-fiber";

import React, { useCallback, Suspense, useRef } from "react";
import lerp from "lerp";

import useStore from "./Store";
import { Text } from "drei";

const Controls = () => {
  let values = useRef([0, 0, 0]);

  const onMove = (e) => {
    values.current[0] = e.clientX / window.innerWidth - .5;
    values.current[1] = 5 + (1 - e.clientY / window.innerHeight);
  };
  React.useEffect(() => {
    document.addEventListener("mousemove", onMove);
  });
  useFrame(({ camera }) => {
    camera.position.x = lerp(camera.position.x, values.current[0], 0.1);
    camera.position.y = lerp(camera.position.y, values.current[1], 0.1);
  }, 1);

  const highscore = localStorage.getItem('highscore');
  return (
    <Suspense fallback={null}>
      <Text
        color="#000"
        font="https://fonts.gstatic.com/s/notosans/v7/o-0IIpQlx3QUlC5A4PNr5TRG.woff"
        position={[0, 2, -6]}
        fontSize={1.25}
        fontWeight={600}
        rotation={[-Math.PI / 8, 0, 0]}

      >
        Welcome to pong!
      </Text>
      <Text
        color="#000"
        font="https://fonts.gstatic.com/s/notosans/v7/o-0IIpQlx3QUlC5A4PNr5TRG.woff"
        position={[0, .5, -6]}
        fontSize={.5}
        fontWeight={600}
        rotation={[-Math.PI / 8, 0, 0]}

      >
        Click anywhere to start
      </Text>
      <Text
        color="#000"
        font="https://fonts.gstatic.com/s/notosans/v7/o-0IIpQlx3QUlC5A4PNr5TRG.woff"
        position={[0, -10, -6]}
        rotation={[-Math.PI / 8, 0, 0]}
        fontSize={.5}
        fontWeight={600}
      >
        Highscore: {highscore}
      </Text>
    </Suspense>
  );
};

export default function (props) {
  const welcome = useStore((state) => state.welcome);
  const { reset } = useStore((state) => state.api);
  const onClick = useCallback(() => welcome && reset(false), [welcome, reset]);

  return (
    <Canvas
      sRGB
      camera={{  position: [0, 5, 12], fov: 50 }}
      onClick={onClick}
      concurrent
      shadowMap
      gl={{
        powerPreference: "high-performance",
        alpha: false,
        antialias: true,
      }}
    >
      {welcome&& <Controls />}

      {props.children}
    </Canvas>
  );
}
