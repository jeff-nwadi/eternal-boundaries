"use client";

import * as React from "react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { animate } from "motion/react";

const colors = ["#5b2bd2", "#7c4ddb", "#a25afd", "#aff33e", "#26ccff", "#ff5e7e", "#fcff42"];
const shapes = ["circle", "rect", "rect", "strip", "strip"] as const;
const keyframeCount = 40;
const popWindow = 0.08;

type ParticleShape = (typeof shapes)[number];

type Particle = {
  keyframes: { transform: string[]; opacity: number[] };
  duration: number;
  size: number;
  color: string;
  shape: ParticleShape;
};

type Burst = {
  id: number;
  particles: Particle[];
};

function buildKeyframes({
  angle,
  startVelocity,
  decay,
  gravity,
  drift,
  wobbleSpeed,
  wobbleOffset,
  size,
  ticks,
  tiltRotations,
  rotation,
}: {
  angle: number;
  startVelocity: number;
  decay: number;
  gravity: number;
  drift: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  size: number;
  ticks: number;
  tiltRotations: number;
  rotation: number;
}) {
  const transforms: string[] = [];
  const opacities: number[] = [];
  let velocity = startVelocity;
  let x = 0;
  let y = 0;
  let wobble = wobbleOffset;
  let tick = 0;

  for (let i = 0; i <= keyframeCount; i++) {
    const t = i / keyframeCount;
    if (i > 0) {
      const targetTick = Math.round((i * ticks) / keyframeCount);
      while (tick < targetTick) {
        x += Math.cos(angle) * velocity + drift;
        y += Math.sin(angle) * velocity + gravity * 3;
        velocity *= decay;
        wobble += wobbleSpeed;
        tick++;
      }
    }
    const translateX = i === 0 ? 0 : x + Math.cos(wobble) * 15 * size;
    const translateY = y;
    let scale: number;
    if (t < popWindow * 0.6) scale = (t / (popWindow * 0.6)) * 1.15;
    else if (t < popWindow) scale = 1.15 - ((t - popWindow * 0.6) / (popWindow * 0.4)) * 0.15;
    else scale = 1;
    const tilt = tiltRotations * 360 * t;
    let opacity: number;
    if (t <= 0.5) opacity = 1;
    else if (t <= 0.8) opacity = 1 - ((t - 0.5) / 0.3) * 0.5;
    else opacity = 0.5 - ((t - 0.8) / 0.2) * 0.5;
    transforms.push(
      `translate(${translateX}px, ${translateY}px) scale(${scale}) rotateY(${tilt}deg) rotate(${rotation}deg)`,
    );
    opacities.push(opacity);
  }

  return { transform: transforms, opacity: opacities };
}

function ParticleDot({ particle }: { particle: Particle }) {
  const ref = useRef<HTMLDivElement>(null);
  const { keyframes, duration, size, color, shape } = particle;
  const width = shape === "strip" ? size * 0.3 : shape === "rect" ? size * 0.7 : size;
  const height = shape === "strip" ? size * 2 : size;
  const radius = shape === "circle" ? "50%" : shape === "strip" ? size * 0.12 : 2;

  useEffect(() => {
    if (!ref.current) return;
    const playback = animate(ref.current, keyframes, { duration, ease: "linear" });
    return () => playback.cancel();
  }, [keyframes, duration]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: radius,
        backgroundColor: color,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    />
  );
}

export type ConfettiCannonHandle = { fire: () => void };

export type ConfettiCannonProps = {
  particleCount?: number;
  startVelocity?: number;
  spread?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  duration?: number;
  size?: number;
  className?: string;
};

/**
 * Headless confetti cannon. Renders nothing visible until `fire()` is called via
 * ref; bursts originate from the element's centre. Place inside a `relative`
 * wrapper (e.g. around a button) and call `ref.current.fire()` to celebrate.
 */
export const ConfettiCannon = React.forwardRef<ConfettiCannonHandle, ConfettiCannonProps>(
  function ConfettiCannon(
    {
      particleCount = 60,
      startVelocity = 25,
      spread = 110,
      decay = 0.91,
      gravity = 1,
      drift = 0,
      duration = 2.5,
      size = 1,
      className,
    },
    ref,
  ) {
    const [bursts, setBursts] = useState<Burst[]>([]);
    const nextId = useRef(0);

    useImperativeHandle(
      ref,
      () => ({
        fire() {
          const id = nextId.current++;
          const ticks = Math.round(duration * 60);
          const particles = Array.from({ length: particleCount }, () => {
            const spreadRad = spread * (Math.PI / 180);
            const angle = -Math.PI / 2 + (0.5 * spreadRad - Math.random() * spreadRad);
            const velocity = startVelocity * 0.5 + Math.random() * startVelocity;
            return {
              keyframes: buildKeyframes({
                angle,
                startVelocity: velocity,
                decay,
                gravity,
                drift,
                wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
                wobbleOffset: Math.random() * 10,
                size,
                ticks,
                tiltRotations: 2 + Math.random() * 4,
                rotation: Math.random() * 360,
              }),
              duration,
              size: 6 * size + Math.random() * 6 * size,
              color: colors[Math.floor(Math.random() * colors.length)],
              shape: shapes[Math.floor(Math.random() * shapes.length)],
            };
          });
          setBursts((current) => [...current, { id, particles }]);
          setTimeout(() => {
            setBursts((current) => current.filter((burst) => burst.id !== id));
          }, (duration + 0.5) * 1000);
        },
      }),
      [particleCount, startVelocity, spread, decay, gravity, drift, duration, size],
    );

    return (
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0",
          className ?? "",
        ].join(" ")}
      >
        {bursts.map((burst) => (
          <div key={burst.id} className="absolute left-0 top-0">
            {burst.particles.map((particle, index) => (
              <ParticleDot key={index} particle={particle} />
            ))}
          </div>
        ))}
      </div>
    );
  },
);

export default ConfettiCannon;
