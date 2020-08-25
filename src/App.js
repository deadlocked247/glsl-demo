import { Physics, useSphere, useBox, usePlane } from "use-cannon";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import lerp from "lerp";
import React, { Suspense, useRef } from "react";

import crossTexture from "./cross.jpg";
import PaddleModel from "./PaddleModel";
import Post from "./Post";
import Scene from './Scene';
import useStore from "./Store";

function Paddle() {
  const { pong } = useStore((state) => state.api);
  const welcome = useStore((state) => state.welcome);
  const model = useRef();
  const [ref, api] = useBox(() => ({
    type: "Kinematic",
    args: [3.4, 1, 3.5],
    onCollide: (e) => pong(e.contact.impactVelocity),
  }));
  let values = useRef([0, 0]);
  useFrame((state) => {
    values.current[0] = lerp(
      values.current[0],
      (state.mouse.x * Math.PI) / 5,
      0.2
    );
    values.current[1] = lerp(
      values.current[1],
      (state.mouse.x * Math.PI) / 5,
      0.2
    );

    api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0);
    api.rotation.set(0, 0, values.current[1]);

    model.current.rotation.x = lerp(
      model.current.rotation.x,
      welcome ? Math.PI / 2 : 0,
      0.2
    );
    model.current.rotation.y = values.current[0];
  });

  return <PaddleModel ref={ref} model={model} />;
}

function Ball() {
  const map = useLoader(THREE.TextureLoader, crossTexture);
  const [ref] = useSphere(() => ({ mass: 1, args: 0.5, position: [0, 5, 0] }));
  return (
    <mesh castShadow receiveShadow ref={ref}>
      <sphereBufferGeometry attach="geometry" args={[0.5, 64, 64]} />
      <meshPhysicalMaterial
        color="#FF9900"
        map={map}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
}

function ContactGround() {
  // When the ground was hit we reset the game ...
  const { reset } = useStore((state) => state.api);
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
    onCollide: () => reset(true),
  }));
  return <mesh ref={ref} />;
}

export default function () {
  const welcome = useStore((state) => state.welcome);
  return (
    <Scene>
      <Post />
      <color attach="background" args={["#FFEEE4"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, -10, -10]} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <Physics
        iterations={20}
        tolerance={0.0001}
        defaultContactMaterial={{
          friction: 0.9,
          restitution: 0.6,
          contactEquationStiffness: 1e7,
          contactEquationRelaxation: 1,
          frictionEquationStiffness: 1e7,
          frictionEquationRelaxation: 2,
        }}
        gravity={[0, -40, 0]}
        allowSleep={false}
      >
        <mesh castShadow receiveShadow position={[0, 0, -10]}>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshBasicMaterial color="#E8FFEB" />
        </mesh>
        <ContactGround />
        {!welcome && <Ball />}
        <Suspense fallback={null}>
          <Paddle />
        </Suspense>
      </Physics>
    </Scene>
  );
}
