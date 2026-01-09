// ═══════════════════════════════════════════════════════════
// UNICORN STUDIO BACKGROUND COMPONENT
// WebGL shader-based animated background using UnicornStudio
// Embedded config for fastest loading (no external fetch)
// ═══════════════════════════════════════════════════════════

"use client";

import { useEffect, useRef, useState } from "react";

// Full scene config - embedded for instant loading
const SCENE_CONFIG = {
  history: [
    {
      breakpoints: [],
      visible: true,
      aspectRatio: 1,
      userDownsample: 0.25,
      layerType: "effect",
      type: "gradient",
      usesPingPong: false,
      speed: 0.25,
      trackMouse: 0,
      trackAxes: "xy",
      mouseMomentum: 0,
      texture: false,
      animating: false,
      isMask: 0,
      compiledFragmentShaders: [
        "#version 300 es\nprecision highp float;in vec2 vTextureCoord;uniform vec2 uMousePos;vec3 getColor(int index) {\nswitch(index) {\ncase 0: return vec3(0.08235294117647059, 0.08235294117647059, 0.08235294117647059);\ncase 1: return vec3(0, 0, 0);\ncase 2: return vec3(0, 0, 0);\ncase 3: return vec3(0, 0, 0);\ncase 4: return vec3(0, 0, 0);\ncase 5: return vec3(0, 0, 0);\ncase 6: return vec3(0, 0, 0);\ncase 7: return vec3(0, 0, 0);\ncase 8: return vec3(0, 0, 0);\ncase 9: return vec3(0, 0, 0);\ncase 10: return vec3(0, 0, 0);\ncase 11: return vec3(0, 0, 0);\ncase 12: return vec3(0, 0, 0);\ncase 13: return vec3(0, 0, 0);\ncase 14: return vec3(0, 0, 0);\ncase 15: return vec3(0, 0, 0);\ndefault: return vec3(0.0);\n}\n}const float PI = 3.14159265;vec2 rotate(vec2 coord, float angle) {\nfloat s = sin(angle);\nfloat c = cos(angle);\nreturn vec2(\ncoord.x * c - coord.y * s,\ncoord.x * s + coord.y * c\n);\n}out vec4 fragColor;vec3 getColor(vec2 uv) {return vec3(0.08235294117647059, 0.08235294117647059, 0.08235294117647059);\n}void main() {vec2 uv = vTextureCoord;\nvec2 pos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.0000);\nuv -= pos;\nuv /= max(0.5000*2., 1e-5);\nuv = rotate(uv, (0.0000 - 0.5) * 2. * PI);\nvec4 color = vec4(getColor(uv), 1.0000);\nfragColor = color;\n}",
      ],
      compiledVertexShaders: [
        "#version 300 es\nprecision mediump float;in vec3 aVertexPosition;\nin vec2 aTextureCoord;uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;out vec2 vTextureCoord;\nout vec3 vVertexPosition;void main() {\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\nvTextureCoord = aTextureCoord;\n}",
      ],
      data: { downSample: 0.5, depth: false, uniforms: {}, isBackground: true },
      id: "effect",
    },
    {
      breakpoints: [],
      visible: true,
      aspectRatio: 1,
      userDownsample: 0.25,
      layerType: "effect",
      type: "circle",
      usesPingPong: false,
      trackMouse: 0,
      trackAxes: "xy",
      mouseMomentum: 1,
      texture: false,
      animating: false,
      isMask: 0,
      compiledFragmentShaders: [
        "#version 300 es\nprecision highp float;\nin vec3 vVertexPosition;\nin vec2 vTextureCoord;\nuniform sampler2D uTexture;\nuniform vec2 uResolution;out vec4 fragColor;mat2 rot(float a) {\nreturn mat2(cos(a),-sin(a),sin(a),cos(a));\n}float luma(vec3 color) {\nreturn dot(color, vec3(0.299, 0.587, 0.114));\n}\nvoid main() {\nvec2 uv = vTextureCoord;\nvec4 bg = texture(uTexture, uv);\nfloat lum = luma(bg.rgb);\nfloat displacement = (lum - 0.5) * 0.0000 * 0.5;\nvec2 aspectRatio = vec2(uResolution.x/uResolution.y, 1.0);\nvec2 skew = vec2(max(0.5000, 0.001), max(1.0 - 0.5000, 0.001));\nfloat halfRadius = 0.5000 * 0.5;\nfloat falloffAmount = max(1.0000, 0.001);\nfloat innerEdge = halfRadius - falloffAmount * halfRadius * 0.5;\nfloat outerEdge = halfRadius + falloffAmount * halfRadius * 0.5;\nvec2 pos = vec2(0.5026132404181185, 0.010801393728222863);\nconst float TWO_PI = 6.28318530718;\nvec2 scaledUV = uv * aspectRatio * rot(0.0000 * TWO_PI) * skew;\nvec2 scaledPos = pos * aspectRatio * rot(0.0000 * TWO_PI) * skew;\nfloat radius = distance(scaledUV, scaledPos);\nfloat falloff = smoothstep(innerEdge + displacement, outerEdge + displacement, radius);\nfalloff = (1.0 - falloff) * 1.0000;\nvec3 circle = vec3(0, 0.9647058823529412, 0.8784313725490196) * falloff;circle = mix(bg.rgb, vec3(0, 0.9647058823529412, 0.8784313725490196), falloff);\nvec4 color = vec4(circle, max(bg.a, falloff));\nfragColor = color;}",
      ],
      compiledVertexShaders: [
        "#version 300 es\nprecision mediump float;in vec3 aVertexPosition;\nin vec2 aTextureCoord;uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uTextureMatrix;out vec2 vTextureCoord;\nout vec3 vVertexPosition;void main() {\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\nvTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n}",
      ],
      data: { depth: false, uniforms: {}, isBackground: false },
      id: "effect1",
    },
    {
      breakpoints: [],
      visible: true,
      aspectRatio: 1,
      userDownsample: 0.25,
      layerType: "effect",
      type: "liquify",
      usesPingPong: false,
      speed: 0.25,
      trackMouse: 0,
      trackAxes: "xy",
      mouseMomentum: 0,
      texture: false,
      animating: true,
      isMask: 0,
      compiledFragmentShaders: [
        "#version 300 es\nprecision mediump float;in vec3 vVertexPosition;\nin vec2 vTextureCoord;uniform float uTime;\nuniform sampler2D uTexture;uniform vec2 uMousePos;\nuniform vec2 uResolution;float ease (int easingFunc, float t) {\nreturn t;\n}const float PI = 3.14159265;mat2 rot(float a) {\nreturn mat2(cos(a), -sin(a), sin(a), cos(a));\n}vec2 liquify(vec2 st, float dist) {\nfloat aspectRatio = uResolution.x / uResolution.y;\nvec2 pos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos - 0.5), 0.0000);\nvec2 drift = vec2(0, 0.0000 * uTime * 0.0125) * rot(0.3807 * -2. * PI);pos += drift;\nvec2 skew = mix(vec2(1), vec2(1, 0), 0.0000);\nst -= pos;\nst.x *= aspectRatio;\nst = st * rot(0.3807 * 2. * PI);\nst *= skew;\nfloat freq = (5.0 * (0.1400 + 0.1));\nfloat t = uTime * 0.025;float amplitude = 0.6800 * mix(0.2, 0.2/(0.1400 + 0.05), 0.25) * dist;for (float i = 1.0; i <= 5.0; i++) {\nst = st * rot(i / 5. * PI * 2.);\nfloat ff = i * freq;\nst.x += amplitude * cos(ff * st.y + t);\nst.y += amplitude * sin(ff * st.x + t);\n}st /= skew;st = st * rot(0.3807 * -2. * PI);\nst.x /= aspectRatio;\nst += pos;return st;\n}out vec4 fragColor;void main() {\nvec2 uv = vTextureCoord;\nfloat aspectRatio = uResolution.x/uResolution.y;\nvec2 mPos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.0000);\nfloat dist = ease(0, max(0.,1. - distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - 1.0000)));if(dist <= 0.001) {\nfragColor = texture(uTexture, uv);\nreturn;\n}vec2 liquifiedUV = liquify(uv, dist);\nvec2 normalizedUv = normalize(liquifiedUV - uv);\nfloat distanceUv = length(liquifiedUV - uv);\nfloat chromAbb = 0.4700 * 0.5;vec2 offsetR = liquifiedUV + chromAbb * normalizedUv * distanceUv;\nvec2 offsetG = liquifiedUV;\nvec2 offsetB = liquifiedUV - chromAbb * normalizedUv * distanceUv;vec4 colorR = texture(uTexture, mix(uv, offsetR, 0.5000));\nvec4 colorG = texture(uTexture, mix(uv, offsetG, 0.5000));\nvec4 colorB = texture(uTexture, mix(uv, offsetB, 0.5000));vec4 color = vec4(colorR.r, colorG.g, colorB.b, colorR.a * colorG.a * colorB.a);\nfragColor = color;}",
      ],
      compiledVertexShaders: [
        "#version 300 es\nprecision mediump float;in vec3 aVertexPosition;\nin vec2 aTextureCoord;uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uTextureMatrix;out vec2 vTextureCoord;\nout vec3 vVertexPosition;void main() {\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\nvTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n}",
      ],
      data: { depth: false, uniforms: {}, isBackground: false },
      id: "effect2",
    },
    {
      breakpoints: [],
      visible: true,
      aspectRatio: 1,
      userDownsample: 0.25,
      layerType: "effect",
      type: "noiseBlur",
      usesPingPong: false,
      speed: 0.16,
      texture: false,
      animating: true,
      mouseMomentum: 0,
      isMask: 0,
      compiledFragmentShaders: [
        "#version 300 es\nprecision highp float;in vec2 vTextureCoord;uniform sampler2D uTexture;uniform float uTime;uniform vec2 uResolution;vec4 permute(vec4 t) {\nreturn t * (t * 34.0 + 133.0);\n}vec3 grad(float hash) {\nvec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;\nvec3 cuboct = cube;float index0 = step(0.0, 1.0 - floor(hash / 16.0));\nfloat index1 = step(0.0, floor(hash / 16.0) - 1.0);cuboct.x *= 1.0 - index0;\ncuboct.y *= 1.0 - index1;\ncuboct.z *= 1.0 - (1.0 - index0 - index1);float type = mod(floor(hash / 8.0), 2.0);\nvec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));vec3 grad = cuboct * 1.22474487139 + rhomb;grad *= (1.0 - 0.042942436724648037 * type) * 3.5946317686139184;return grad;\n}\nvec4 bccNoiseDerivativesPart(vec3 X) {\nvec3 b = floor(X);\nvec4 i4 = vec4(X - b, 2.5);\nvec3 v1 = b + floor(dot(i4, vec4(.25)));\nvec3 v2 = b + vec3(1, 0, 0) + vec3(-1, 1, 1) * floor(dot(i4, vec4(-.25, .25, .25, .35)));\nvec3 v3 = b + vec3(0, 1, 0) + vec3(1, -1, 1) * floor(dot(i4, vec4(.25, -.25, .25, .35)));\nvec3 v4 = b + vec3(0, 0, 1) + vec3(1, 1, -1) * floor(dot(i4, vec4(.25, .25, -.25, .35)));\nvec4 hashes = permute(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));\nhashes = permute(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));\nhashes = mod(permute(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);\nvec3 d1 = X - v1; vec3 d2 = X - v2; vec3 d3 = X - v3; vec3 d4 = X - v4;\nvec4 a = max(0.75 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);\nvec4 aa = a * a; vec4 aaaa = aa * aa;\nvec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);\nvec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);\nvec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));\nvec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)\n+ mat4x3(g1, g2, g3, g4) * aaaa;\nreturn vec4(derivative, dot(aaaa, extrapolations));\n}\nvec4 bccNoiseDerivatives_XYBeforeZ(vec3 X) {\nmat3 orthonormalMap = mat3(\n0.788675134594813, -0.211324865405187, -0.577350269189626,\n-0.211324865405187, 0.788675134594813, -0.577350269189626,\n0.577350269189626, 0.577350269189626, 0.577350269189626);\nX = orthonormalMap * X;\nvec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);\nreturn vec4(result.xyz * orthonormalMap, result.w);\n}const int MAX_ITERATIONS = 32;\nconst float MAX_ITERATIONS_F = 32.0;\nconst float HALF_ITERATIONS = 16.0;out vec4 fragColor;const float PI = 3.14159265;mat2 rot(float a) {\nreturn mat2(cos(a), -sin(a), sin(a), cos(a));\n}void main() {\nvec2 uv = vTextureCoord;\nfloat aspectRatio = uResolution.x/uResolution.y;\nvec2 noiseUv = rot(0.5103 * -1. * 2.0 * PI) *\n(uv * vec2(aspectRatio, 1.) - vec2(0.5, 0.5) * vec2(aspectRatio, 1.)) *\nvec2(0.5400, 1.-0.5400) * 5. * 0.5200;\nvec4 noise = bccNoiseDerivatives_XYBeforeZ(vec3(noiseUv, uTime * 0.025 + 0.0000 * 2.));\nvec2 noiseOffset = (noise.xy - 0.5) * (0.6200 + 0.01) * 0.25;\nvec4 color = vec4(0.0);\nfor (int i = 0; i < MAX_ITERATIONS; i++) {\nfloat offset = float(i) - HALF_ITERATIONS;\nvec2 st = uv + noiseOffset * (offset / MAX_ITERATIONS_F);\ncolor += texture(uTexture, st);\n}\ncolor /= MAX_ITERATIONS_F;\nfragColor = color;}",
        "#version 300 es\nprecision highp float;in vec2 vTextureCoord;uniform sampler2D uTexture;uniform float uTime;uniform vec2 uResolution;vec4 permute(vec4 t) {\nreturn t * (t * 34.0 + 133.0);\n}vec3 grad(float hash) {\nvec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;\nvec3 cuboct = cube;float index0 = step(0.0, 1.0 - floor(hash / 16.0));\nfloat index1 = step(0.0, floor(hash / 16.0) - 1.0);cuboct.x *= 1.0 - index0;\ncuboct.y *= 1.0 - index1;\ncuboct.z *= 1.0 - (1.0 - index0 - index1);float type = mod(floor(hash / 8.0), 2.0);\nvec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));vec3 grad = cuboct * 1.22474487139 + rhomb;grad *= (1.0 - 0.042942436724648037 * type) * 3.5946317686139184;return grad;\n}\nvec4 bccNoiseDerivativesPart(vec3 X) {\nvec3 b = floor(X);\nvec4 i4 = vec4(X - b, 2.5);\nvec3 v1 = b + floor(dot(i4, vec4(.25)));\nvec3 v2 = b + vec3(1, 0, 0) + vec3(-1, 1, 1) * floor(dot(i4, vec4(-.25, .25, .25, .35)));\nvec3 v3 = b + vec3(0, 1, 0) + vec3(1, -1, 1) * floor(dot(i4, vec4(.25, -.25, .25, .35)));\nvec3 v4 = b + vec3(0, 0, 1) + vec3(1, 1, -1) * floor(dot(i4, vec4(.25, .25, -.25, .35)));\nvec4 hashes = permute(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));\nhashes = permute(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));\nhashes = mod(permute(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);\nvec3 d1 = X - v1; vec3 d2 = X - v2; vec3 d3 = X - v3; vec3 d4 = X - v4;\nvec4 a = max(0.75 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);\nvec4 aa = a * a; vec4 aaaa = aa * aa;\nvec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);\nvec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);\nvec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));\nvec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)\n+ mat4x3(g1, g2, g3, g4) * aaaa;\nreturn vec4(derivative, dot(aaaa, extrapolations));\n}\nvec4 bccNoiseDerivatives_XYBeforeZ(vec3 X) {\nmat3 orthonormalMap = mat3(\n0.788675134594813, -0.211324865405187, -0.577350269189626,\n-0.211324865405187, 0.788675134594813, -0.577350269189626,\n0.577350269189626, 0.577350269189626, 0.577350269189626);\nX = orthonormalMap * X;\nvec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);\nreturn vec4(result.xyz * orthonormalMap, result.w);\n}const int MAX_ITERATIONS = 32;\nconst float MAX_ITERATIONS_F = 32.0;\nconst float HALF_ITERATIONS = 16.0;out vec4 fragColor;const float PI = 3.14159265;mat2 rot(float a) {\nreturn mat2(cos(a), -sin(a), sin(a), cos(a));\n}void main() {\nvec2 uv = vTextureCoord;\nfloat aspectRatio = uResolution.x/uResolution.y;\nvec2 noiseUv = rot(0.5103 * -1. * 2.0 * PI) *\n(uv * vec2(aspectRatio, 1.) - vec2(0.5, 0.5) * vec2(aspectRatio, 1.)) *\nvec2(0.5400, 1.-0.5400) * 5. * 0.5200;\nvec4 noise = bccNoiseDerivatives_XYBeforeZ(vec3(noiseUv, uTime * 0.025 + 0.0000 * 2.));\nvec2 noiseOffset = (noise.xy - 0.5) * (0.6200 + 0.01) * 0.25;\nvec4 color = vec4(0.0);\nfor (int i = 0; i < MAX_ITERATIONS; i++) {\nfloat offset = float(i) - HALF_ITERATIONS;\nvec2 st = uv + noiseOffset * (offset / MAX_ITERATIONS_F);\ncolor += texture(uTexture, st);\n}\ncolor /= MAX_ITERATIONS_F;\nfragColor = color;}",
      ],
      compiledVertexShaders: [
        "#version 300 es\nprecision mediump float;in vec3 aVertexPosition;\nin vec2 aTextureCoord;uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uTextureMatrix;out vec2 vTextureCoord;\nout vec3 vVertexPosition;void main() {\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\nvTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n}",
      ],
      data: {
        downSample: 0.25,
        depth: false,
        uniforms: {},
        isBackground: false,
        passes: [{ prop: "pass", value: 1, downSample: 0.5 }],
      },
      id: "effect3",
    },
    {
      breakpoints: [],
      visible: true,
      aspectRatio: 1,
      userDownsample: 1,
      layerType: "effect",
      type: "liquify",
      usesPingPong: false,
      speed: 0.77,
      trackMouse: 0,
      trackAxes: "xy",
      mouseMomentum: 0,
      texture: false,
      animating: true,
      isMask: 0,
      compiledFragmentShaders: [
        "#version 300 es\nprecision mediump float;in vec3 vVertexPosition;\nin vec2 vTextureCoord;uniform float uTime;\nuniform sampler2D uTexture;uniform vec2 uMousePos;\nuniform vec2 uResolution;float ease (int easingFunc, float t) {\nreturn t;\n}const float PI = 3.14159265;mat2 rot(float a) {\nreturn mat2(cos(a), -sin(a), sin(a), cos(a));\n}vec2 liquify(vec2 st, float dist) {\nfloat aspectRatio = uResolution.x / uResolution.y;\nvec2 pos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos - 0.5), 0.0000);\nvec2 drift = vec2(0, 0.0000 * uTime * 0.0125) * rot(0.6210 * -2. * PI);pos += drift;\nvec2 skew = mix(vec2(1), vec2(1, 0), 0.0000);\nst -= pos;\nst.x *= aspectRatio;\nst = st * rot(0.6210 * 2. * PI);\nst *= skew;\nfloat freq = (5.0 * (1.2700 + 0.1));\nfloat t = uTime * 0.025;float amplitude = 0.2300 * mix(0.2, 0.2/(1.2700 + 0.05), 0.25) * dist;for (float i = 1.0; i <= 5.0; i++) {\nst = st * rot(i / 5. * PI * 2.);\nfloat ff = i * freq;\nst.x += amplitude * cos(ff * st.y + t);\nst.y += amplitude * sin(ff * st.x + t);\n}st /= skew;st = st * rot(0.6210 * -2. * PI);\nst.x /= aspectRatio;\nst += pos;return st;\n}out vec4 fragColor;void main() {\nvec2 uv = vTextureCoord;\nfloat aspectRatio = uResolution.x/uResolution.y;\nvec2 mPos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.0000);\nfloat dist = ease(0, max(0.,1. - distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - 1.0000)));if(dist <= 0.001) {\nfragColor = texture(uTexture, uv);\nreturn;\n}vec2 liquifiedUV = liquify(uv, dist);\nvec2 normalizedUv = normalize(liquifiedUV - uv);\nfloat distanceUv = length(liquifiedUV - uv);\nfloat chromAbb = 0.6700 * 0.5;vec2 offsetR = liquifiedUV + chromAbb * normalizedUv * distanceUv;\nvec2 offsetG = liquifiedUV;\nvec2 offsetB = liquifiedUV - chromAbb * normalizedUv * distanceUv;vec4 colorR = texture(uTexture, mix(uv, offsetR, 0.1600));\nvec4 colorG = texture(uTexture, mix(uv, offsetG, 0.1600));\nvec4 colorB = texture(uTexture, mix(uv, offsetB, 0.1600));vec4 color = vec4(colorR.r, colorG.g, colorB.b, colorR.a * colorG.a * colorB.a);\nfragColor = color;}",
      ],
      compiledVertexShaders: [
        "#version 300 es\nprecision mediump float;in vec3 aVertexPosition;\nin vec2 aTextureCoord;uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uTextureMatrix;out vec2 vTextureCoord;\nout vec3 vVertexPosition;void main() {\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\nvTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n}",
      ],
      data: { depth: false, uniforms: {}, isBackground: false },
      id: "effect4",
    },
  ],
  options: {
    name: "Layered Distortion (Remix)",
    fps: 60,
    dpi: 1.5,
    scale: 1,
    includeLogo: false,
    isProduction: true,
  },
  version: "2.0.1",
  id: "ASUAlhFH8ZZ5YJoYzSWg",
};

interface UnicornBackgroundProps {
  className?: string;
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init: () => Promise<unknown[]>;
      destroy: () => void;
      addScene: (options: {
        elementId: string;
        fps?: number;
        scale?: number;
        dpi?: number;
        projectId?: string;
        filePath?: string;
        production?: boolean;
        interactivity?: {
          mouse?: { disableMobile?: boolean };
        };
      }) => Promise<{ destroy: () => void }>;
    };
  }
}

export function UnicornBackground({ className = "" }: UnicornBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ destroy: () => void } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initScene = async () => {
      if (!window.UnicornStudio || !containerRef.current) return;

      try {
        // Create a blob URL from the embedded config
        const configBlob = new Blob([JSON.stringify(SCENE_CONFIG)], {
          type: "application/json",
        });
        const configUrl = URL.createObjectURL(configBlob);

        sceneRef.current = await window.UnicornStudio.addScene({
          elementId: "unicorn-auth-bg",
          fps: 60,
          scale: 1,
          dpi: 1.5,
          filePath: configUrl,
          production: true,
          interactivity: {
            mouse: { disableMobile: true },
          },
        });

        // Clean up blob URL after loading
        URL.revokeObjectURL(configUrl);

        if (mounted) setIsLoaded(true);
      } catch (err) {
        console.warn("[UnicornBackground] Init failed:", err);
      }
    };

    // Load UnicornStudio script
    if (!window.UnicornStudio) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.4/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = () => {
        if (mounted) initScene();
      };
      (document.head || document.body).appendChild(script);
    } else {
      initScene();
    }

    return () => {
      mounted = false;
      if (sceneRef.current) {
        sceneRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      id="unicorn-auth-bg"
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}

export default UnicornBackground;
