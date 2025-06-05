import { useEffect, useRef, useState } from 'react';

function GraffitiCanvas({ backgroundImage }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#00ff00');
  const [brushSize, setBrushSize] = useState(10); // try 10 or 20 to test

  useEffect(() => {
    const fabric = window.fabric;

    // Create canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    // Set initial brush settings
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    // Load and set the background image
    if (backgroundImage) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      });
    }

    // Save canvas to ref
    canvasRef.current.fabricCanvas = canvas;

    // Cleanup on unmount
    return () => canvas.dispose();
  }, [backgroundImage]);

  // Sync brush size when it changes
  useEffect(() => {
    const canvas = canvasRef.current.fabricCanvas;
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '2px solid #444', marginTop: '1rem' }}
    />
  );
}

export default GraffitiCanvas;
