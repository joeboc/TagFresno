import { useEffect, useRef, useState } from 'react';

function GraffitiCanvas({ backgroundImage }) {
  const [brushType, setBrushType] = useState('spray');
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#00ff00');
  const [brushSize, setBrushSize] = useState(20);

  useEffect(() => {
    const fabric = window.fabric;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    // Default brush setup
    const sprayBrush = new fabric.SprayBrush(canvas);
    sprayBrush.color = color;
    sprayBrush.width = brushSize;
    sprayBrush.density = 30;
    sprayBrush.dotWidth = 6;
    sprayBrush.dotWidthVariance = 3;
    sprayBrush.distance = 2;

    canvas.freeDrawingBrush = sprayBrush;
    canvasRef.current.fabricCanvas = canvas;

    // Set background image
    if (backgroundImage) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      });
    }

    return () => canvas.dispose();
  }, [backgroundImage]);

  // Function to switch brush type
  function applyBrush(canvas, fabricInstance) {
    let brush;

    if (brushType === 'spray') {
      brush = new fabricInstance.SprayBrush(canvas);
      brush.density = 30;
      brush.dotWidth = 10;
      brush.dotWidthVariance = 10;
      brush.distance = 1;
    } else if (brushType === 'pencil') {
      brush = new fabricInstance.PencilBrush(canvas);
    } else if (brushType === 'circle') {
      brush = new fabricInstance.CircleBrush(canvas);
    }

    brush.color = color;
    brush.width = brushSize;
    canvas.freeDrawingBrush = brush;
  }

  useEffect(() => {
    const canvas = canvasRef.current.fabricCanvas;
    const fabricInstance = window.fabric;
    if (canvas && fabricInstance) {
      applyBrush(canvas, fabricInstance);
    }
  }, [brushType, color, brushSize]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '2px solid #444', marginTop: '1rem' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <label>
          🎨 Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <label style={{ marginLeft: '1rem' }}>
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
