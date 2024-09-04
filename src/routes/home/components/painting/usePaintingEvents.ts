import { useEffect, useState, MouseEvent, TouchEvent, KeyboardEvent, FocusEvent } from 'react'
import { SCPaintingController } from '../../../../lib/scp/types'

type PointerEvent = MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement> | any

type PaintingControllerEventHandlers = {
  onMouseDown: (e: PointerEvent) => void
  onMouseMove: (e: PointerEvent) => void
  onMouseUp: (e: PointerEvent) => void
  onTouchStart: (e: PointerEvent) => void
  onTouchMove: (e: PointerEvent) => void
  onTouchEnd: (e: PointerEvent) => void
  onTouchCancel: (e: PointerEvent) => void
  onFocus: (e: FocusEvent) => void
  onBlur: (e: FocusEvent) => void
  onKeyDown: (e: KeyboardEvent<HTMLCanvasElement>) => void
} | {}

export default function usePaintingController (
  painting: SCPaintingController,
  isLoaded: boolean,
  animate: boolean = false
): PaintingControllerEventHandlers {
  const [events, setEvents] = useState<PaintingControllerEventHandlers>({})

  useEffect(() => {
    if (!isLoaded) return

    let isDown = false
    let resumeMove = false

    const onEnter = (): void => {
      isDown = resumeMove
    }

    const onLeave = (): void => {
      isDown = false
    }

    const onKeyboardMove = (e: KeyboardEvent<HTMLCanvasElement>): void => {
      // No painting!
      if (painting === null) return

      const canvas = e.target
      const activeElement = document.activeElement

      // Is the canvas focused?
      if (activeElement !== canvas) return

      // We store the direction of the key event
      let dx = 0
      let dy = 0

      switch (e.key) {
        case 'ArrowLeft': dx = 1; break
        case 'ArrowRight': dx = -1; break
        case 'ArrowUp': dy = -1; break
        case 'ArrowDown': dy = 1; break

        default: return
      }

      // Get the painting's current rotation
      const { x, y } = painting.getRotation()

      // The amount of
      const moveStep = e.repeat ? 0.05 : 0.1

      const scaleX = 1
      const scaleY = 0.5

      const rotationX = Math.min(Math.max(x + moveStep * scaleX * dx, -scaleX), scaleX);
      const rotationY = Math.min(Math.max(y + moveStep * scaleY * dy, -scaleY), scaleY)

      painting.rotate(rotationX, rotationY)
    }

    const onDown = (e: PointerEvent): void => {
      isDown = true
      resumeMove = true

      // On tactile devices if you touch and then move
      //  the canvas doesn't get focused.
      if (e.type === 'touchstart') {
        e.target.focus()
      }
    }

    const onMove = (e: PointerEvent): void => {
      if (!isDown) return

      const bcr = e.target.getBoundingClientRect()

      let clientX, clientY

      if (e.type === 'touchmove' && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const x = clientX - bcr.left
      const y = clientY - bcr.top

      const normalizedX = x / bcr.width
      const normalizedY = y / bcr.height

      const min = -1
      const max = 1
      const scaleX = -1
      const scaleY = 0.5

      const rx = min * scaleX + max * scaleX * normalizedX * 2
      const ry = min * scaleY + max * scaleY * normalizedY * 2

      painting?.rotate(rx, ry)
    }

    const onUp = (): void => {
      isDown = false
      resumeMove = false
    }

    let step = 0
    let requestAnimationHandle: number | null = null

    const toRadians = Math.PI / 180.0
    let initialX: number | null = null;
    let initialY: number | null = null;
    
    let rotateBackAndForth = () => {
      if (!painting) return

      if (initialX == null || initialY == null) {
        const { x, y } = painting.getRotation()

        initialX = x;
        initialY = y;
      }

      step = ++step % Infinity;

      let s = Math.sin(step * 0.005);

      const dx = 35 * s * toRadians;
      const dy = -3 * Math.abs(s) * toRadians;

      painting.rotate(initialX + dx, initialY + dy);

      requestAnimationHandle = requestAnimationFrame(rotateBackAndForth)
    };

    if (animate) {
      rotateBackAndForth();
    }

    setEvents({
      onMouseDown: onDown,
      onMouseMove: onMove,
      onMouseUp: onUp,
      onTouchStart: onDown,
      onTouchMove: onMove,
      onTouchEnd: onUp,
      onTouchCancel: onUp,
      onFocus: onEnter,
      onBlur: onLeave,
      onKeyDown: onKeyboardMove
    })

    return () => {
      if (requestAnimationHandle) {
        cancelAnimationFrame(requestAnimationHandle)
      }
    }
  }, [painting, isLoaded])

  return events
}
