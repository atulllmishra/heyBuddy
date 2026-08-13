import { useState, useEffect, useRef } from 'react';

/**
 * Custom Hook: useHandwritingAnimation
 * Converts mathematical formulas & concept text strings into animated SVG paths.
 * Dynamically computes the exact leading tip (x, y) coordinate of the stroke path 
 * to position an AI Hand holding a stylus/marker in real-time.
 */
export function useHandwritingAnimation({
  text = '',
  isFormula = false,
  duration = 4000,
  isPlaying = true,
  startX = 50,
  startY = 100
}) {
  const [progress, setProgress] = useState(0);
  const [handPosition, setHandPosition] = useState({ x: startX, y: startY });
  const [isCompleted, setIsCompleted] = useState(false);
  const pathRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  // Generate SVG Path String for Text / Formula
  const generateSvgPath = () => {
    const chars = text.length || 10;
    const width = Math.min(600, Math.max(150, chars * 14));

    if (isFormula) {
      // Wave / Math integral shape simulation for formula writing
      return `M ${startX} ${startY} 
              Q ${startX + width * 0.25} ${startY - 35}, ${startX + width * 0.5} ${startY + 15} 
              T ${startX + width} ${startY}`;
    }

    // Straight handwritten line path simulation
    return `M ${startX} ${startY} L ${startX + width} ${startY}`;
  };

  const pathData = generateSvgPath();

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    startTimeRef.current = null;
    setIsCompleted(false);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / duration);

      setProgress(currentProgress);

      // Update leading edge (x, y) tip coordinate if SVG Path reference exists
      if (pathRef.current) {
        try {
          const totalLength = pathRef.current.getTotalLength();
          const point = pathRef.current.getPointAtLength(currentProgress * totalLength);
          setHandPosition({ x: point.x, y: point.y });
        } catch (err) {
          // Fallback coordinate calculation if path not yet attached to DOM
          const totalWidth = Math.min(600, Math.max(150, text.length * 14));
          setHandPosition({
            x: startX + currentProgress * totalWidth,
            y: startY + (isFormula ? Math.sin(currentProgress * Math.PI * 2) * 15 : 0)
          });
        }
      }

      if (currentProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsCompleted(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, isFormula, duration, isPlaying, startX, startY]);

  return {
    pathRef,
    pathData,
    progress,
    handPosition,
    isCompleted
  };
}
