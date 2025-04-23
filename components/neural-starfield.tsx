"use client"

import { useEffect, useRef } from "react"

interface NeuralStarfieldProps {
  isDaytime: boolean
  timeProgress: number
}

export default function NeuralStarfield({ isDaytime }: NeuralStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const neuronsRef = useRef<Neuron[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationRef = useRef<number>(0)

  interface Star {
    x: number
    y: number
    size: number
    opacity: number
    speed: number
    twinkleSpeed: number
    twinklePhase: number
  }

  interface Neuron {
    x: number
    y: number
    size: number
    speed: number
    direction: number
    connections: number[]
    pulsePhase: number
    pulseSpeed: number
  }

  interface Connection {
    from: number
    to: number
    opacity: number
    pulsePhase: number
    pulseSpeed: number
    active: boolean
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeStars()
      initializeNeurons()
    }

    // Initialize stars
    const initializeStars = () => {
      starsRef.current = []
      const starCount = Math.floor((canvas.width * canvas.height) / 10000) // Adjust density

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 0.2 + 0.1,
          twinkleSpeed: Math.random() * 0.05 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    // Initialize neurons
    const initializeNeurons = () => {
      neuronsRef.current = []
      connectionsRef.current = []
      const neuronCount = 15

      for (let i = 0; i < neuronCount; i++) {
        neuronsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          speed: Math.random() * 0.5 + 0.1,
          direction: Math.random() * Math.PI * 2,
          connections: [],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.01,
        })
      }

      // Create connections
      for (let i = 0; i < neuronCount; i++) {
        for (let j = i + 1; j < neuronCount; j++) {
          if (Math.random() < 0.3) {
            connectionsRef.current.push({
              from: i,
              to: j,
              opacity: Math.random() * 0.3 + 0.1,
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: Math.random() * 0.02 + 0.01,
              active: true,
            })
            neuronsRef.current[i].connections.push(j)
            neuronsRef.current[j].connections.push(i)
          }
        }
      }
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      starsRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()
      })

      // Update and draw neurons and connections
      neuronsRef.current.forEach((neuron) => {
        // Update neuron position
        neuron.x += Math.cos(neuron.direction) * neuron.speed
        neuron.y += Math.sin(neuron.direction) * neuron.speed

        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.direction = Math.PI - neuron.direction
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.direction = -neuron.direction

        // Keep within bounds
        neuron.x = Math.max(0, Math.min(canvas.width, neuron.x))
        neuron.y = Math.max(0, Math.min(canvas.height, neuron.y))

        // Update pulse
        neuron.pulsePhase += neuron.pulseSpeed
      })

      // Draw connections
      connectionsRef.current.forEach((conn) => {
        const fromNeuron = neuronsRef.current[conn.from]
        const toNeuron = neuronsRef.current[conn.to]
        const dx = toNeuron.x - fromNeuron.x
        const dy = toNeuron.y - fromNeuron.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < canvas.width * 0.3) {
          conn.pulsePhase += conn.pulseSpeed
          const pulse = Math.sin(conn.pulsePhase) * 0.5 + 0.5
          const opacity = conn.opacity * pulse * (1 - distance / (canvas.width * 0.3))

          ctx.beginPath()
          ctx.moveTo(fromNeuron.x, fromNeuron.y)
          ctx.lineTo(toNeuron.x, toNeuron.y)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // Draw neurons
      neuronsRef.current.forEach((neuron) => {
        const pulse = Math.sin(neuron.pulsePhase) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.size * (0.8 + pulse * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.4})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Set up resize listener
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Start animation if it's nighttime
    if (!isDaytime) {
      animate()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isDaytime])

  if (isDaytime) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: isDaytime ? 0 : 0.8 }}
    />
  )
}