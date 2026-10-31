import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.03 + 7.1;
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  vec2 pointer = u_pointer - 0.5;
  pointer.x *= u_resolution.x / u_resolution.y;
  p += pointer * 0.022;

  float t = u_time * 0.055;
  vec2 flow = vec2(
    fbm(p * 1.15 + vec2(t, -t * 0.45)),
    fbm(p * 1.10 + vec2(-t * 0.38, t * 0.72))
  );

  float field = fbm(p * 1.45 + flow * 0.75 + vec2(t * 0.22, 0.0));
  float contour = smoothstep(0.42, 0.68, field);
  float edge = 1.0 - smoothstep(0.0, 0.012, abs(field - 0.555));
  float sheen = pow(max(0.0, 1.0 - abs(field - 0.64) * 4.2), 7.0);

  float curve = p.y - 0.12 * sin(p.x * 1.85 + t * 1.4) + 0.06;
  float ribbon = exp(-15.0 * abs(curve));
  ribbon *= 1.0 - smoothstep(0.22, 1.05, abs(p.x));
  float ribbonCore = exp(-55.0 * abs(curve + 0.018));

  vec3 base = vec3(0.004, 0.005, 0.007);
  vec3 graphite = vec3(0.055, 0.065, 0.082);
  vec3 steel = vec3(0.30, 0.34, 0.42);
  vec3 color = mix(base, graphite, contour * 0.92);
  color += steel * edge * 0.28;
  color += vec3(0.14, 0.17, 0.23) * sheen * 0.36;
  color += graphite * ribbon * 0.52;
  color += steel * ribbonCore * 0.12;
  float pointerLight = exp(-5.5 * length(p - pointer));
  color += vec3(0.08, 0.10, 0.14) * pointerLight * 0.06;

  float centerClear = 1.0 - smoothstep(0.12, 0.62, length(p * vec2(0.82, 1.15)));
  color *= mix(1.0, 0.34, centerClear);

  float vignette = 1.0 - smoothstep(0.22, 0.92, length(p * vec2(0.74, 1.0)));
  color *= vignette;
  color += (hash(gl_FragCoord.xy + u_time) - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!canvas || !gl) return

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    if (!vertex || !fragment || !program) return

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'a_position')
    const resolution = gl.getUniformLocation(program, 'u_resolution')
    const time = gl.getUniformLocation(program, 'u_time')
    const pointer = gl.getUniformLocation(program, 'u_pointer')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let previous = 0
    const start = performance.now()
    const pointerTarget = { x: 0.5, y: 0.5 }
    const pointerCurrent = { x: 0.5, y: 0.5 }

    const updatePointer = (event: PointerEvent) => {
      pointerTarget.x = event.clientX / window.innerWidth
      pointerTarget.y = 1 - event.clientY / window.innerHeight
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.round(canvas.clientWidth * ratio)
      const height = Math.round(canvas.clientHeight * ratio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const render = (now: number) => {
      if (now - previous >= 33 || reducedMotion) {
        resize()
        gl.uniform2f(resolution, canvas.width, canvas.height)
        gl.uniform1f(time, reducedMotion ? 0 : (now - start) / 1000)
        pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.035
        pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.035
        gl.uniform2f(pointer, pointerCurrent.x, pointerCurrent.y)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        previous = now
      }
      if (!reducedMotion) frame = requestAnimationFrame(render)
    }

    render(performance.now())
    window.addEventListener('resize', resize)
    if (!reducedMotion) window.addEventListener('pointermove', updatePointer, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', updatePointer)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} className="shader" aria-hidden="true" />
}
