import React from "react";
import Scene from './Scene';
import useStore from "./Store";


export default function () {
  const welcome = useStore((state) => state.welcome);
  return (
    <Scene>
      {/*Nothing here... yet :) */}
    </Scene>
  );
}
