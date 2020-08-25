import React, { Suspense, useMemo, useEffect } from "react";
import { useLoader, useThree, useFrame } from "react-three-fiber";
import lerp from "lerp";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  SSAO,
  SMAA,
  Glitch,
  Scanline,
  Pixelation,
  ChromaticAberration,
  Vignette,
} from "react-postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";

import useStore from "./Store";

export default function Post() {
  const welcome = useStore((state) => state.welcome);

  return (
    <Suspense fallback={null}>
      <EffectComposer>
        <Vignette />
        <SSAO
          blendFunction={BlendFunction.MULTIPLY} // blend mode
          samples={8} // amount of samples per pixel (shouldn't be a multiple of the ring count)
          rings={4} // amount of rings in the occlusion sampling pattern
          distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
          distanceFalloff={0.0} // distance falloff. min: 0, max: 1
          rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
          rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
          luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
          radius={20} // occlusion sampling radius
          scale={0.5} // scale of the ambient occlusion
          bias={0.5} // occlusion bias
        />
        {/* <GodRays
          sun={sunRef}
          blendFunction={BlendFunction.Screen} // The blend function of this effect.
          samples={60} // The number of samples per pixel.
          density={0.96} // The density of the light rays.
          decay={0.9} // An illumination decay factor.
          weight={0.4} // A light ray weight factor.
          exposure={0.6} // A constant attenuation coefficient.
          clampMax={1} // An upper bound for the saturation of the overall effect.
          width={Resizer.AUTO_SIZE} // Render width.
          height={Resizer.AUTO_SIZE} // Render height.
          kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
          blur={true} // Whether the god rays should be blurred to reduce artifacts.
          /> */}
        {/* <Glitch
          delay={[1.5, 3.5]} // min and max glitch delay
          duration={[0.6, 1.0]} // min and max glitch duration
          strength={[0.3, 1.0]} // min and max glitch strength
          mode={GlitchMode.SPORADIC} // glitch mode
          active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
          ratio={0.9} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        /> */}
        <SMAA edgeDetection={0.1} />
        <Noise opacity={0.15} premultiply blendFunction={BlendFunction.ADD} />
        {/* <Pixelation granularity={5} /> */}
      </EffectComposer>
    </Suspense>
  );
}
