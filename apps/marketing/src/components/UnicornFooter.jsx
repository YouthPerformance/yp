import { useEffect, useRef } from 'react'

function UnicornFooter({ className = '' }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const initUnicorn = async () => {
      // Check if script already loaded
      if (!window.UnicornStudio) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js'
        script.async = true

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      if (!isMounted || !containerRef.current || !window.UnicornStudio) return

      try {
        // Use addScene with filePath to load from public folder
        const scene = await window.UnicornStudio.addScene({
          element: containerRef.current,
          fps: 60,
          scale: 1,
          dpi: 1.5,
          filePath: '/unicorn-footer.json',
          interactivity: {
            mouse: {
              disableMobile: false,
            },
          },
        })
        sceneRef.current = scene
      } catch (err) {
        console.error('Unicorn Studio init error:', err)
      }
    }

    initUnicorn()

    return () => {
      isMounted = false
      if (sceneRef.current && window.UnicornStudio) {
        window.UnicornStudio.destroy(sceneRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`unicorn-footer ${className}`}
      style={{
        width: '100%',
        height: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  )
}

export default UnicornFooter
