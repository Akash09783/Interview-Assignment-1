import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import {
  bubbleVertexShader,
  bubbleFragmentShader,
  imageQuadVertexShader,
  imageQuadFragmentShader,
} from './bubbleShaders';

export interface MarchingBubbleOptions {
  resolution?: number;
  mobileResolution?: number;
  desktopResolution?: number;
  maxPolyCount?: number;
  pixelRatioLimit?: number;
  pauseWhenHidden?: boolean;
  frameRate?: number;
  pointerEase?: number;
  hoverEase?: number;
  hoverBallStrength?: number;
  hoverBallSubtract?: number;
  hoverBallReach?: number;
  hoverBallMinInfluence?: number;
  travelScatter?: boolean;
  visibilityMargin?: string;
  logoSrc?: string;
  logoScale?: number;
  logoOpacity?: number;
  logoRevealStart?: number;
  logoZ?: number;
  logoMaskRadius?: number;
  logoMaskSoftness?: number;
  logoTint?: number;
  images?: string[];
  imageScale?: number;
  imageOpacity?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageScrub?: number;
  imageMaskRadius?: number;
  imageMaskSoftness?: number;
  imageRevealStart?: number;
  imageZ?: number;
  imageRotateYFactor?: number;
  imageRotateXFactor?: number;
  imageTint?: number;
  scatterRiseRate?: number;
  scatterDecayRate?: number;
  coreFlowFactor?: number;
}

export interface MarchingBubbleState {
  reveal?: number;
  collect?: number;
  alpha?: number;
  logoAlpha?: number;
  scale?: number;
  baseScale?: number;
  x?: number;
  y?: number;
  travel?: number;
  flowX?: number;
  flowY?: number;
  flowZ?: number;
  pulse?: number;
  rotateX?: number;
  rotateY?: number;
  scatterSpread?: number;
  imageScale?: number;
}

export interface MarchingBubbleInstance {
  setState: (state: Partial<MarchingBubbleState>) => void;
  setImageTransition: (from: number, to: number, progress?: number) => void;
  destroy: () => void;
}

const INITIAL_OFFSETS = [
  { x: -410, y: -200, size: 96 },
  { x: -286, y: 186, size: 64 },
  { x: -148, y: -248, size: 48 },
  { x: 118, y: -214, size: 78 },
  { x: 292, y: 180, size: 58 },
  { x: 172, y: 244, size: 36 },
  { x: -886, y: 74, size: 50 },
  { x: -54, y: 246, size: 52 },
  { x: 356, y: -238, size: 34 },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function smoothHermite(val: number): number {
  return val * val * (3 - 2 * val);
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function createMarchingBubble(
  canvas: HTMLCanvasElement,
  initialState: Partial<MarchingBubbleState> = {},
  options: MarchingBubbleOptions = {}
): MarchingBubbleInstance {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  const resolution =
    options.resolution ||
    (isMobile ? options.mobileResolution || 72 : options.desktopResolution || 108);
  const maxPoly = options.maxPolyCount || 200000;
  const pixelRatioLimit = options.pixelRatioLimit || 2;
  const pointerEase = options.pointerEase || 0.075;
  const hoverEase = options.hoverEase || 0.09;
  const hoverStrength = options.hoverBallStrength || 0.1;
  const hoverSubtract = options.hoverBallSubtract || 13;
  const hoverReach = options.hoverBallReach || 0.16;
  const hoverMin = options.hoverBallMinInfluence || 0.1;
  const isTravelScatter = options.travelScatter === true;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 5.2);

  // Cubemap loader
  const cubeLoader = new THREE.CubeTextureLoader();
  cubeLoader.setPath('/assets/');
  const hdriTexture = cubeLoader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

  const bubbleMaterial = new THREE.ShaderMaterial({
    vertexShader: bubbleVertexShader,
    fragmentShader: bubbleFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uAlpha: { value: 1 },
      uHover: { value: 0 },
      uHdri: { value: hdriTexture },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });

  const marchingCubes = new MarchingCubes(resolution, bubbleMaterial, false, false, maxPoly);
  marchingCubes.isolation = 82;
  marchingCubes.renderOrder = 2;
  scene.add(marchingCubes);

  // Lights
  const light1 = new THREE.DirectionalLight(0xffffff, 2.7);
  light1.position.set(-3, 4, 4);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xf1f5ff, 1.85);
  light2.position.set(4, -2, 3);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight(0xbecced, 0.55);
  light3.position.set(-2, -3, 2);
  scene.add(light3);

  const texLoader = new THREE.TextureLoader();

  // Logo Quad (Optional)
  let logoMesh: THREE.Mesh | null = null;
  let logoAspect = 1;
  let logoTexture: THREE.Texture | null = null;

  if (options.logoSrc) {
    logoTexture = texLoader.load(options.logoSrc, (tex) => {
      logoAspect = tex.image ? tex.image.width / tex.image.height : 1;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      if (logoMesh) {
        (logoMesh.material as THREE.ShaderMaterial).uniforms.uAspect.value = logoAspect;
        logoMesh.visible = true;
      }
    });

    const logoMat = new THREE.ShaderMaterial({
      vertexShader: imageQuadVertexShader,
      fragmentShader: imageQuadFragmentShader,
      uniforms: {
        uMap: { value: logoTexture },
        uAlpha: { value: 0 },
        uAspect: { value: logoAspect },
        uMaskRadius: { value: options.logoMaskRadius || 0.76 },
        uMaskSoftness: { value: options.logoMaskSoftness || 0.18 },
        uTint: { value: new THREE.Color(options.logoTint || 0x3f3832) },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    logoMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), logoMat);
    logoMesh.position.z = options.logoZ || -0.18;
    logoMesh.renderOrder = 1;
    logoMesh.visible = false;
    scene.add(logoMesh);
  }

  // Multi-image Quads (for 4 steps)
  const imageTextures: THREE.Texture[] = [];
  const imageAspects: number[] = [];
  const imageMeshes: THREE.Mesh[] = [];
  const transitionState = { from: 0, to: 0, progress: 0 };

  if (options.images && options.images.length > 0) {
    options.images.forEach((src, idx) => {
      imageAspects[idx] = 1;
      imageTextures[idx] = texLoader.load(src, (tex) => {
        imageAspects[idx] = tex.image ? tex.image.width / tex.image.height : 1;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
      });
    });

    for (let k = 0; k < 2; k++) {
      const quadMat = new THREE.ShaderMaterial({
        vertexShader: imageQuadVertexShader,
        fragmentShader: imageQuadFragmentShader,
        uniforms: {
          uMap: { value: imageTextures[0] },
          uAlpha: { value: 0 },
          uAspect: { value: 1 },
          uMaskRadius: { value: options.imageMaskRadius || 0.72 },
          uMaskSoftness: { value: options.imageMaskSoftness || 0.2 },
          uTint: { value: new THREE.Color(options.imageTint || 0xffffff) },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), quadMat);
      mesh.position.z = options.imageZ || -0.26;
      mesh.renderOrder = 1;
      scene.add(mesh);
      imageMeshes.push(mesh);
    }
  }

  // Droplet Metaball Particles
  const palette = [
    new THREE.Color(0xfff8ee),
    new THREE.Color(0xf9dfab),
    new THREE.Color(0xffffff),
    new THREE.Color(0xeef2fd),
    new THREE.Color(0xf2e4bc),
  ];

  const droplets = INITIAL_OFFSETS.map((d, idx) => {
    const denom = window.innerWidth <= 768 ? 620 : 980;
    const startX = clamp(0.5 + d.x / denom, 0.08, 0.92);
    const startY = clamp(0.5 - d.y / (0.68 * denom), 0.12, 0.88);
    const collectStart = (startX < 0.5 ? 0 : 0.24) + (idx % 5) * 0.025;

    return {
      start: new THREE.Vector3(startX, startY, 0.46 + 0.018 * ((idx % 5) - 2)),
      target: new THREE.Vector3(0.5, 0.5, 0.5),
      color: palette[idx % palette.length],
      size: d.size / 96,
      delay: 0.045 * idx,
      collectStart,
      collectSpan: 0.58,
      seedX: ((37 * idx) % 11 - 5) / 5,
      seedY: ((17 * idx) % 13 - 6) / 6,
      seedZ: ((29 * idx) % 9 - 4) / 4,
      scatterBias: ((19 * idx) % 10) / 9,
    };
  });

  const state: MarchingBubbleState = {
    reveal: 0,
    collect: 0,
    alpha: 1,
    logoAlpha: 1,
    scale: 1,
    x: 0,
    y: 0,
    travel: 0,
    flowX: 0,
    flowY: 0,
    flowZ: 0,
    pulse: 0,
    rotateX: 0,
    rotateY: 0,
    scatterSpread: 1,
    ...initialState,
  };

  const pointer = {
    x: 0.5,
    y: 0.5,
    smoothX: 0.5,
    smoothY: 0.5,
    strength: 0,
    targetStrength: 0,
  };

  const clock = new THREE.Clock();
  let width = 1;
  let height = 1;
  let animId: number | null = null;
  let lastTime = 0;
  let isVisible = true;
  let isDestroyed = false;
  let scatterProgress = 0;

  function resize() {
    width = canvas.clientWidth || window.innerWidth || 1;
    height = canvas.clientHeight || window.innerHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    pointer.y = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
    pointer.targetStrength = 1;
  }

  function onPointerLeave(e: PointerEvent) {
    if (e.pointerType === 'mouse') {
      pointer.targetStrength = 0;
    }
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);

  const intersectionObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            isVisible = !entries[0] || entries[0].isIntersecting;
            if (isVisible) scheduleFrame();
          },
          { rootMargin: options.visibilityMargin || '260px' }
        )
      : null;

  if (intersectionObserver) {
    isVisible = false;
    intersectionObserver.observe(canvas);
  }

  function scheduleFrame() {
    if (!animId && !isDestroyed && isVisible) {
      animId = requestAnimationFrame(render);
    }
  }

  function render(timestamp = 0) {
    animId = null;
    if (isDestroyed || !isVisible) return;

    const frameRateCap = options.frameRate ? 1000 / options.frameRate : 0;
    if (frameRateCap && timestamp - lastTime < frameRateCap) {
      scheduleFrame();
      return;
    }
    lastTime = timestamp;

    const time = clock.getElapsedTime();
    const collect = smoothHermite(clamp(state.collect ?? 0, 0, 1));
    const reveal = clamp(state.reveal ?? 0, 0, 1);
    const travel = smoothHermite(clamp(state.travel ?? 0, 0, 1));
    const flowX = clamp(0.22 * (state.flowX ?? 0), -0.22, 0.22);
    const flowY = clamp(0.22 * (state.flowY ?? 0), -0.22, 0.22);
    const flowZ = clamp(0.18 * (state.flowZ ?? 0), -0.18, 0.18);
    const speed = clamp(3.4 * Math.hypot(flowX, flowY, flowZ), 0, 1);

    const riseRate = options.scatterRiseRate || 0.14;
    const decayRate = options.scatterDecayRate || 0.028;
    scatterProgress += (speed - scatterProgress) * (speed > scatterProgress ? riseRate : decayRate);

    pointer.smoothX += (pointer.x - pointer.smoothX) * pointerEase;
    pointer.smoothY += (pointer.y - pointer.smoothY) * pointerEase;
    pointer.strength += (pointer.targetStrength - pointer.strength) * hoverEase;

    const fovTan = 5.2 * Math.tan((19 * Math.PI) / 180);
    const targetX = 2 * (pointer.smoothX - 0.5) * fovTan * camera.aspect;
    const targetY = 2 * (pointer.smoothY - 0.5) * fovTan;
    const diffX = (targetX - (state.x ?? 0)) / fovTan;
    const diffY = (targetY - (state.y ?? 0)) / fovTan;
    const hoverInfluence = pointer.strength * clamp((collect - 0.42) / 0.58, 0, 1);

    marchingCubes.reset();
    const baseScale = state.baseScale || (window.innerWidth <= 768 ? 2.58 : 3.8);
    marchingCubes.scale.setScalar(baseScale * (state.scale ?? 1));
    marchingCubes.position.x = state.x ?? 0;
    marchingCubes.position.y = state.y ?? 0;
    marchingCubes.rotation.y =
      0.14 * Math.sin(0.34 * time) * (0.35 + collect) +
      0.28 * diffX * hoverInfluence +
      (state.rotateY ?? 0);
    marchingCubes.rotation.x =
      0.07 * Math.sin(0.27 * time) - 0.18 * diffY * hoverInfluence + (state.rotateX ?? 0);

    bubbleMaterial.uniforms.uTime.value = time;
    bubbleMaterial.uniforms.uAlpha.value = state.alpha ?? 1;
    bubbleMaterial.uniforms.uHover.value = hoverInfluence;

    // Logo update
    if (logoMesh) {
      const logoScale = options.logoScale || 1;
      const logoReveal = smoothHermite(
        clamp((collect - (options.logoRevealStart || 0.58)) / 0.3, 0, 1)
      );
      logoMesh.position.x = (state.x ?? 0) + 0.1 * diffX * hoverInfluence;
      logoMesh.position.y = (state.y ?? 0) + 0.06 * diffY * hoverInfluence;
      logoMesh.rotation.y = -0.28 * marchingCubes.rotation.y;
      logoMesh.rotation.x = -0.22 * marchingCubes.rotation.x;
      logoMesh.scale.set(
        logoScale * logoAspect * (state.scale ?? 1),
        logoScale * (state.scale ?? 1),
        1
      );
      (logoMesh.material as THREE.ShaderMaterial).uniforms.uAlpha.value =
        (options.logoOpacity || 0.22) *
        (state.alpha ?? 1) *
        logoReveal *
        (state.logoAlpha ?? 1);
    }

    // Step Images update
    if (imageMeshes.length && imageTextures.length) {
      const imgScale = state.imageScale ?? options.imageScale ?? 1;
      const imgReveal = smoothHermite(
        clamp((collect - (options.imageRevealStart || 0.24)) / 0.34, 0, 1)
      );
      const fromIdx = clamp(transitionState.from, 0, imageTextures.length - 1);
      const toIdx = clamp(transitionState.to, 0, imageTextures.length - 1);
      const prog = smoothHermite(clamp(transitionState.progress, 0, 1));
      const transitions = [
        { index: fromIdx, alpha: 1 - prog },
        { index: toIdx, alpha: prog },
      ];

      imageMeshes.forEach((mesh, idx) => {
        const tr = transitions[idx];
        const aspect = imageAspects[tr.index] || 1;
        const mat = mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uMap.value = imageTextures[tr.index];
        mat.uniforms.uAspect.value = aspect;
        mat.uniforms.uAlpha.value =
          (options.imageOpacity || 0.45) * (state.alpha ?? 1) * imgReveal * tr.alpha;
        mesh.position.x = (state.x ?? 0) + (options.imageOffsetX || 0) + 0.08 * diffX * hoverInfluence;
        mesh.position.y = (state.y ?? 0) + (options.imageOffsetY || 0) + 0.05 * diffY * hoverInfluence;
        mesh.rotation.y = -marchingCubes.rotation.y * (options.imageRotateYFactor ?? 0.22);
        mesh.rotation.x = -marchingCubes.rotation.x * (options.imageRotateXFactor ?? 0.18);
        mesh.scale.set(imgScale * aspect * (state.scale ?? 1), imgScale * (state.scale ?? 1), 1);
      });
    }

    // Add droplet metaballs
    droplets.forEach((d, idx) => {
      const rvl = smoothHermite(clamp((reveal - d.delay) / 0.38, 0, 1));
      if (rvl <= 0) return;

      const colProg = smoothHermite(clamp((collect - d.collectStart) / d.collectSpan, 0, 1));
      const phase = 0.026 * ((idx % 5) - 2) + 0.012 * (Math.floor(idx / 5) - 1);
      const travelProg = smoothHermite(clamp(travel + phase, 0, 1));
      const scatterWave = Math.sin(travelProg * Math.PI) * speed;
      const wobble = 0.02 * (1 - colProg);
      const sizeFactor = d.size;

      let ballX = lerp(d.start.x, d.target.x, colProg) + Math.sin(0.75 * time + 1.9 * idx) * wobble;
      let ballY = lerp(d.start.y, d.target.y, colProg) + Math.cos(0.62 * time + 1.3 * idx) * wobble;
      let ballZ = lerp(d.start.z, d.target.z, colProg) + Math.sin(0.54 * time + 0.8 * idx) * wobble;

      const shrink = smoothHermite(clamp((colProg - 0.72) / 0.28, 0, 1));
      let strength = lerp(0.13, 0.34, colProg) * (0.72 + 0.3 * sizeFactor) * rvl * (1 - 0.62 * shrink);
      let subtract = lerp(24, 16.2, colProg);

      if (isTravelScatter && collect > 0.95) {
        const scatterAmt = smoothStep(0, 0.08, scatterProgress);
        const bias = 0.34 * (1 - d.scatterBias);
        const c = smoothHermite(clamp((travel - bias) / Math.max(1 - bias, 0.01), 0, 1));
        const sWave = Math.sin(c * Math.PI) * scatterAmt;
        const b = 0.18 + 0.82 * d.scatterBias;
        const spread = state.scatterSpread || 1;
        const oX = sWave * b * 0.9;
        const oY = 0.22 * b * sWave * spread;
        const oZ = 0.1 * b * sWave;
        const qWobble = 0.01 * Math.sin(0.55 * time + 2.1 * idx) * speed;
        const offX = (0.32 * d.seedX + 0.16 * d.seedZ) * sWave * spread;
        const offY = (0.28 * d.seedY - 0.14 * d.seedX) * sWave * spread;

        const targetPosX = 0.5 + flowX * oX - flowY * d.seedX * oY + offX + qWobble;
        const targetPosY = 0.5 + flowY * oX + flowX * d.seedY * oY + offY + 0.7 * qWobble;
        const targetPosZ =
          0.5 +
          flowZ * oX * 1.8 +
          d.seedZ * (oZ + 1.15 * Math.abs(flowZ)) +
          0.016 * Math.sin(0.4 * time + idx) * speed;

        ballX = lerp(ballX, targetPosX, scatterAmt);
        ballY = lerp(ballY, targetPosY, targetPosZ);
        ballZ = lerp(ballZ, targetPosZ, scatterAmt);

        const subAdd = 21 + 2.2 * flowX + 3.8 * speed;
        strength = lerp(strength, (0.08 + 0.028 * sizeFactor) * rvl * (1 - 0.12 * speed), scatterAmt);
        subtract = lerp(subtract, subAdd, scatterAmt);
      } else {
        ballX += flowX * (0.55 + 0.34 * scatterWave);
        ballY += flowY * (0.55 + 0.34 * scatterWave);
        ballZ += flowZ * (0.5 + 0.3 * scatterWave) + 0.04 * scatterWave;
        strength *= 1 - 0.1 * scatterWave;
        subtract += 1.6 * scatterWave;
      }

      marchingCubes.addBall(ballX, ballY, ballZ, strength, subtract, d.color);
    });

    // Central Core Bubble
    const coreProg = smoothHermite(clamp((collect - 0.18) / 0.82, 0, 1));
    const coreElev = smoothHermite(clamp((collect - 0.18) / 0.46, 0, 1));
    const flowAmp = smoothStep(0.18, 0.82, travel) * speed;
    const invFlow = (1 - smoothStep(0.22, 0.86, travel)) * speed;
    const coreFlow = options.coreFlowFactor ?? 0.14;
    const scatterDim =
      isTravelScatter && collect > 0.95
        ? 1 - 0.42 * smoothStep(0.12, 0.88, scatterProgress)
        : 1;

    marchingCubes.addBall(
      0.5 - flowX * invFlow * coreFlow + flowX * flowAmp * coreFlow,
      lerp(0.12, 0.5, coreElev) +
        0.006 * Math.sin(0.5 * time) * coreProg -
        flowY * invFlow * coreFlow +
        flowY * flowAmp * coreFlow,
      0.5 + flowZ * flowAmp * coreFlow + 0.04 * flowAmp,
      coreProg * (0.18 + coreProg * (0.58 + 0.04 * (state.pulse ?? 0))) * (1 - 0.08 * speed) * scatterDim,
      lerp(18, 13.2, coreProg) + 0.42 * speed,
      new THREE.Color(0xffffff)
    );

    // Mouse Interaction Ball
    if (hoverInfluence > hoverMin) {
      const e = smoothHermite(clamp((hoverInfluence - hoverMin) / (1 - hoverMin), 0, 1));
      const bx = clamp(0.5 + diffX * hoverReach, 0.08, 0.92);
      const by = clamp(0.5 + diffY * hoverReach, 0.08, 0.92);
      const norm = clamp(Math.hypot(diffX, diffY) / 0.34, 0.3, 1);
      marchingCubes.addBall(bx, by, 0.5, hoverStrength * e * norm, hoverSubtract, new THREE.Color(0xffffff));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (marchingCubes as any).update();
    renderer.render(scene, camera);

    scheduleFrame();
  }

  scheduleFrame();

  return {
    setState(newState) {
      Object.assign(state, newState);
      scheduleFrame();
    },
    setImageTransition(from, to, progress = 0) {
      transitionState.from = from;
      transitionState.to = to;
      transitionState.progress = progress;
      scheduleFrame();
    },
    destroy() {
      isDestroyed = true;
      if (animId) cancelAnimationFrame(animId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();

      marchingCubes.geometry.dispose();
      if (logoMesh) {
        logoMesh.geometry.dispose();
        (logoMesh.material as THREE.Material).dispose();
      }
      if (logoTexture) logoTexture.dispose();

      imageMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      imageTextures.forEach((t) => t.dispose());

      hdriTexture.dispose();
      bubbleMaterial.dispose();
      renderer.dispose();
    },
  };
}
