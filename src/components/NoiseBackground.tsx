import { useEffect, useRef } from 'react'

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

const GRID_SIZE = 8
const WAVE_SPEED = 0.01

function getThreshold(x: number, y: number) {
  return BAYER_4X4[y % 4][x % 4] / 16 - 0.5
}

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let time = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = `${window.innerWidth}px`
      canvas!.style.height = `${window.innerHeight}px`
      ctx!.scale(dpr, dpr)
    }

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      const cols = Math.ceil(w / GRID_SIZE)
      const rows = Math.ceil(h / GRID_SIZE)

      const isDark =
        document.documentElement.dataset.theme !== 'light'
      const bgColor = isDark ? '#1a1a1a' : '#f7f7f7'
      const dotColor = isDark
        ? 'rgba(255, 255, 255, 0.018)'
        : 'rgba(0, 0, 0, 0.012)'

      ctx!.fillStyle = bgColor
      ctx!.fillRect(0, 0, w, h)

      const centerY = rows / 2
      const amplitude = rows / 8
      const freq = 0.025

      ctx!.fillStyle = dotColor

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave1 = Math.sin(x * freq + time) * amplitude
          const wave2 = Math.cos(x * freq * 0.6 - time * 0.7) * amplitude * 0.4
          const wave3 =
            Math.sin((x + y) * freq * 0.3 + time * 0.5) * amplitude * 0.3
          const combinedWave = wave1 + wave2 + wave3

          const distFromWave = Math.abs(y - (centerY + combinedWave))
          let intensity = Math.max(0, 1 - distFromWave / 36)

          intensity += (Math.random() - 0.5) * 0.04

          const threshold = getThreshold(x, y)
          if (intensity + threshold > 0.5) {
            ctx!.fillRect(
              x * GRID_SIZE,
              y * GRID_SIZE,
              GRID_SIZE - 1,
              GRID_SIZE - 1,
            )
          }
        }
      }

      time += WAVE_SPEED
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="noise-canvas" role="presentation" />
}
