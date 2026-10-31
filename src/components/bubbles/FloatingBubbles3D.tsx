'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FresnelShader = {
  uniforms: {
    mRefractionRatio: { value: 0.988 },
    mFresnelBias: { value: 0.1 },
    mFresnelPower: { value: 2.0 },
    mFresnelScale: { value: 1.0 },
    tCube: { value: null as THREE.CubeTexture | null },
  },

  vertexShader: `
    uniform float mRefractionRatio;
    uniform float mFresnelBias;
    uniform float mFresnelScale;
    uniform float mFresnelPower;

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vec3 I = worldPosition.xyz - cameraPosition;

      vReflect = reflect(I, worldNormal);
      vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio * 0.986);
      vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.987);
      vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.988);
      vReflectionFactor = mFresnelBias + mFresnelScale * pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform samplerCube tCube;

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {
      vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, -vReflect.yz));
      vec4 refractedColor = vec4(0.97);

      refractedColor.r = textureCube(tCube, vec3(vRefract[0].x, vRefract[0].yz)).r;
      refractedColor.g = textureCube(tCube, vec3(vRefract[1].x, vRefract[1].yz)).g;
      refractedColor.b = textureCube(tCube, vec3(vRefract[2].x, vRefract[2].yz)).b;

      // Realistic iridescent bubble rim with subtle prismatic glow
      vec4 col = mix(refractedColor * 0.95, reflectedColor, clamp(vReflectionFactor, 0.45, 0.15));
      col.a = clamp(vReflectionFactor * 0.75 + 0.25, 0.1, 0.85);

      gl_FragColor = col;
    }
  `,
};

interface BubbleData {
  mesh: THREE.Mesh;
  initialX: number;
  y: number;
  z: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  baseScale: number;
  targetScale: number;
  isPopping: boolean;
  popProgress: number;
}

export default function FloatingBubbles3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    // Load authentic Stem Beauty cubemap
    const cubeLoader = new THREE.CubeTextureLoader();
    cubeLoader.setPath('/assets/');
    const textureCube = cubeLoader.load([
      'px.png',
      'nx.png',
      'py.png',
      'ny.png',
      'pz.png',
      'nz.png',
    ]);

    const bubbleMaterial = new THREE.ShaderMaterial({
      vertexShader: FresnelShader.vertexShader,
      fragmentShader: FresnelShader.fragmentShader,
      uniforms: {
        mRefractionRatio: { value: 0.988 },
        mFresnelBias: { value: 0.2 },
        mFresnelPower: { value: 2.2 },
        mFresnelScale: { value: 1.0 },
        tCube: { value: textureCube },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const geometry = new THREE.SphereGeometry(1, 32, 24);

    const bubbles: BubbleData[] = [];
    const bubbleCount = window.innerWidth <= 768 ? 8 : 14;

    const createBubble = (initialY?: number): BubbleData => {
      const mesh = new THREE.Mesh(geometry, bubbleMaterial);
      const aspect = window.innerWidth / window.innerHeight;
      const xRange = 6 * aspect;
      const x = (Math.random() - 0.5) * xRange;
      const y = initialY !== undefined ? initialY : -7 - Math.random() * 4;
      const z = (Math.random() - 0.5) * 4;
      const scale = Math.random() * 0.45 + 0.35; // 0.35 to 0.8

      mesh.position.set(x, y, z);
      mesh.scale.setScalar(scale);
      scene.add(mesh);

      return {
        mesh,
        initialX: x,
        y,
        z,
        speedY: Math.random() * 0.015 + 0.012,
        wobbleSpeed: Math.random() * 0.015 + 0.01,
        wobbleAmp: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        baseScale: scale,
        targetScale: scale,
        isPopping: false,
        popProgress: 0,
      };
    };

    // Stagger bubbles across vertical screen height initially
    for (let i = 0; i < bubbleCount; i++) {
      const initialY = -6 + (14 / bubbleCount) * i + (Math.random() - 0.5);
      bubbles.push(createBubble(initialY));
    }

    const mouse = { x: -1000, y: -1000, worldX: -1000, worldY: -1000 };

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Approximate world position at z = 0
      const aspect = window.innerWidth / window.innerHeight;
      const vFov = (camera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(vFov / 2) * camera.position.z;
      const planeW = planeH * aspect;

      mouse.worldX = (mouse.x * planeW) / 2;
      mouse.worldY = (mouse.y * planeH) / 2;
    };

    const onClick = (e: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const meshes = bubbles.map((b) => b.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const b = bubbles.find((item) => item.mesh === hitMesh);
        if (b && !b.isPopping) {
          b.isPopping = true;
          b.popProgress = 0;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        if (b.isPopping) {
          b.popProgress += 0.08;
          b.mesh.scale.setScalar(b.baseScale * (1 + b.popProgress * 0.4));
          (b.mesh.material as THREE.ShaderMaterial).opacity = 1 - b.popProgress;

          if (b.popProgress >= 1) {
            // Reset bubble to bottom
            b.y = -7 - Math.random() * 3;
            b.mesh.position.y = b.y;
            b.isPopping = false;
            b.popProgress = 0;
            b.mesh.scale.setScalar(b.baseScale);
            (b.mesh.material as THREE.ShaderMaterial).opacity = 1;
          }
          continue;
        }

        if (!prefersReducedMotion) {
          b.y += b.speedY;
          b.mesh.position.y = b.y;
          b.mesh.position.x =
            b.initialX + Math.sin(time * b.wobbleSpeed * 60 + b.phase) * b.wobbleAmp;

          // Gentle mouse repulsion
          const dx = b.mesh.position.x - mouse.worldX;
          const dy = b.mesh.position.y - mouse.worldY;
          const dist = Math.hypot(dx, dy);
          if (dist < 2.5 && dist > 0.01) {
            const force = (1 - dist / 2.5) * 0.06;
            b.initialX += (dx / dist) * force;
            b.y += (dy / dist) * force;
          }
        }

        // Loop to bottom when reaching top of viewport
        if (b.y > 8) {
          b.y = -7 - Math.random() * 2;
          b.initialX = (Math.random() - 0.5) * (6 * camera.aspect);
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);

      bubbles.forEach((b) => {
        b.mesh.geometry.dispose();
      });
      geometry.dispose();
      bubbleMaterial.dispose();
      textureCube.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      aria-hidden="true"
    />
  );
}
