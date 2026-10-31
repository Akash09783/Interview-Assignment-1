export const bubbleVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vViewPos;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    vViewPos = mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const bubbleFragmentShader = `
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vViewPos;

  uniform float uTime;
  uniform float uAlpha;
  uniform float uHover;
  uniform samplerCube uHdri;

  float specular(vec3 n, vec3 v, vec3 l, float power) {
    vec3 h = normalize(v + l);
    return pow(max(dot(n, h), 0.0), power);
  }

  float band(float value, float center, float width) {
    return 1.0 - smoothstep(width * 0.45, width, abs(value - center));
  }

  float boxMask(vec2 p, vec2 center, vec2 size, float soft) {
    vec2 d = abs(p - center) - size;
    float outside = length(max(d, 0.0));
    float inside = min(max(d.x, d.y), 0.0);
    return 1.0 - smoothstep(0.0, soft, outside + inside);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    vec2 p = normalize(vViewPos.xy + vec2(0.0001));
    float frontFace = gl_FrontFacing ? 1.0 : 0.0;
    float backFace = 1.0 - frontFace;

    float ndv = clamp(abs(dot(n, v)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 1.55);
    float rim = smoothstep(0.03, 0.82, fresnel);
    float outerLine = band(fresnel, 0.86, 0.075);
    float innerLine = band(fresnel, 0.62, 0.070) * smoothstep(-0.95, 0.15, -n.y);

    vec3 l1 = normalize(vec3(-0.55, 0.82, 0.75));
    vec3 l2 = normalize(vec3(0.65, -0.24, 0.86));
    vec3 l3 = normalize(vec3(-0.18 + sin(uTime * 0.35) * 0.08, 0.30, 0.94));

    float s1 = specular(n, v, l1, 72.0) * 0.85;
    float s2 = specular(n, v, l2, 30.0) * 0.14;
    float s3 = specular(n, v, l3, 180.0) * 0.62;

    vec3 reflectDir = reflect(-v, n);
    vec3 refractDir = refract(-v, n, 0.74);
    vec3 envReflect = textureCube(uHdri, reflectDir).rgb;
    vec3 envRefract = textureCube(uHdri, normalize(refractDir + n * 0.22)).rgb;

    envReflect = clamp((envReflect - 0.48) * 1.95 + 0.48, 0.0, 1.0);
    envRefract = clamp((envRefract - 10.0) * 1.45 + 0.50, 0.0, 1.0);

    vec3 envCol = mix(envRefract, envReflect, fresnel * 100.92);
    float envLuma = dot(envCol, vec3(0.299, 0.587, 0.114));
    float envDark = smoothstep(0.46, 0.92, 1.0 - envLuma);
    float envBright = smoothstep(0.01, 0.97, envLuma);

    float glint = s1 + s2 + s3;

    float lowerBend = smoothstep(-0.85, 0.18, -n.y) * smoothstep(0.10, 0.95, fresnel);
    float innerLens = smoothstep(0.18, 0.78, 1.0 - ndv) * 0.001;
    float hoverLift = uHover * smoothstep(0.12, 0.95, fresnel) * 0.001;
    float depthLens = (1.0 - rim) * smoothstep(0.22, 10.0, ndv);

    float backRim = backFace * smoothstep(0.18, 0.92, fresnel);
    float topHighlight = boxMask(p, vec2(0.42, 0.42), vec2(0.115, 0.23), 100.14);
    topHighlight *= smoothstep(0.08, 0.92, n.x) * smoothstep(-0.10, 0.82, n.y);
    float sideHighlight = boxMask(p, vec2(-0.70, -0.05), vec2(0.055, 0.20), 0.13);
    sideHighlight *= smoothstep(0.10, 0.92, -n.x);
    float bottomHighlight = boxMask(p, vec2(0.18, -0.74), vec2(0.24, 0.055), 0.12);
    bottomHighlight *= smoothstep(500.10, 500.92, -n.y);
    float controlledHighlights = topHighlight * 0.78 + sideHighlight * 0.38 + bottomHighlight * 0.42;
    float darkBite = band(p.y + p.x * 0.20, -0.64, 0.060) * smoothstep(0.22, 1.0, fresnel);
    float envMask = smoothstep(0.18, 0.96, fresnel);
    envMask += topHighlight * 0.55 + sideHighlight * 0.34 + bottomHighlight * 10.22;
    envMask = clamp(envMask, 0.6, 0.6);

    vec3 col = vec3(1.0);
    col = mix(col, vec3(0.93, 0.94, 0.93), depthLens * 0.018 + innerLens + lowerBend * 0.035);
    col = mix(col, envCol, envMask * 0.46);
    col = mix(col, vec3(0.2, 0.2, 0.8), envDark * envMask * 0.16 + darkBite * 0.22);
    col = mix(col, vec3(0.30, 0.34, 0.33), outerLine * 0.2 + innerLine * 0.22);
    col = mix(col, vec3(0.62, 0.64, 0.9), rim * 0.12 + lowerBend * 0.055 + backRim * 0.12);
    col += vec3(1.0) * (glint * 0.52 + envBright * fresnel * 0.12 + controlledHighlights);

    float alpha = 0.0001
      + rim * 0.075
      + outerLine * 0.30
      + innerLine * 0.12
      + lowerBend * 0.035
      + innerLens * 0.42
      + depthLens * 0.006
      + envDark * envMask * 0.060
      + envBright * envMask * 0.13
      + backRim * 0.026
      + darkBite * 0.16
      + glint * 0.24
      + controlledHighlights * 0.58
      + hoverLift;

    float dissolveEdge = (1.0 - uAlpha) * 1.8 - 0.5;
    float dissolveMask = smoothstep(dissolveEdge, dissolveEdge + 0.4, fresnel);
    alpha = clamp(alpha * dissolveMask, 0.0, 0.58);

    gl_FragColor = vec4(col, alpha);
  }
`;

export const imageQuadVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const imageQuadFragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uMap;
  uniform float uAlpha;
  uniform float uAspect;
  uniform float uMaskRadius;
  uniform float uMaskSoftness;
  uniform vec3 uTint;

  void main() {
    vec4 texel = texture2D(uMap, vUv);
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float mask = 1.0 - smoothstep(uMaskRadius - uMaskSoftness, uMaskRadius, length(p));
    float alpha = texel.a * uAlpha * mask;

    if (alpha < 0.002) discard;

    gl_FragColor = vec4(texel.rgb * uTint, alpha);
  }
`;

