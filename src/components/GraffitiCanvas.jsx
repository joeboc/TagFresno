import { useEffect, useRef, useState } from 'react';

function GraffitiCanvas({ backgroundImage }) {
  const [brushType, setBrushType] = useState('spray');
  const [color, setColor] = useState('#00ff00');
  const [brushSize, setBrushSize] = useState(20);

  // Set initial canvas size based on window
  const [canvasWidth, setCanvasWidth] = useState(Math.min(window.innerWidth * 0.9, 1000));
  const [canvasHeight, setCanvasHeight] = useState((Math.min(window.innerWidth * 0.9, 1000) * 3) / 5);

  const canvasRef = useRef(null);

  // Resize canvas when window changes
  useEffect(() => {
    const updateCanvasSize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1000); // 90% of window, max 1000px
      const height = (width * 3) / 5;
      setCanvasWidth(width);
      setCanvasHeight(height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Fabric Canvas
  useEffect(() => {
    const fabric = window.fabric;
    const canvasEl = canvasRef.current;
    const canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: true,
    });

    canvasRef.current.fabricCanvas = canvas;

    // Setup default brush
    const sprayBrush = new fabric.SprayBrush(canvas);
    sprayBrush.color = color;
    sprayBrush.width = brushSize;
    sprayBrush.density = 30;
    sprayBrush.dotWidth = 6;
    sprayBrush.dotWidthVariance = 3;
    sprayBrush.distance = 2;
    canvas.freeDrawingBrush = sprayBrush;

    // Set Canvas Image
    if (backgroundImage) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        img.scaleToWidth(canvasWidth);
        img.scaleToHeight(canvasHeight);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }

    return () => canvas.dispose();
  }, [backgroundImage]);

  // Resize Window
  useEffect(() => {
    const canvas = canvasRef.current?.fabricCanvas;
    if (!canvas) return;

    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);

    // Resize canvas image
    const bgImage = canvas.backgroundImage;
    if (bgImage) {
      bgImage.scaleToWidth(canvasWidth);
      bgImage.scaleToHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasWidth, canvasHeight]);

  // Update brush
  useEffect(() => {
    const canvas = canvasRef.current.fabricCanvas;
    const fabricInstance = window.fabric;
    if (!canvas || !fabricInstance) return;

    let brush;
    if (brushType === 'spray') {
      brush = new fabricInstance.SprayBrush(canvas);
      brush.density = 30;
      brush.dotWidth = 10;
      brush.dotWidthVariance = 10;
      brush.distance = 1;
    } else if (brushType === 'pencil') {
      brush = new fabricInstance.PencilBrush(canvas);
    } else {
      brush = new fabricInstance.CircleBrush(canvas);
    }

    brush.color = color;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;
  }, [brushType, color, brushSize]);

  return (
    <div style={{ width: '100%', padding: '1rem' }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          width: '100%',
          height: 'auto',
          border: '2px solid #444',
          display: 'block',
          marginTop: '1rem',
        }}
      />

      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
        <label>
          🎨 Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label>
          Size:
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          &nbsp;{brushSize}px
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Select Brush:&nbsp;</label>
        <button onClick={() => setBrushType('spray')} title="Spray Can">🖌️ Spray</button>
        <button onClick={() => setBrushType('pencil')} title="Pencil">✏️ Pencil</button>
        <button onClick={() => setBrushType('circle')} title="Circle">⚪ Circle</button>
      </div>
    </div>
  );
}

export default GraffitiCanvas;
