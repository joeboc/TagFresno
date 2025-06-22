import { useEffect, useRef, useState } from 'react';

function GraffitiCanvas({ backgroundImage }) {
  const [brushType, setBrushType] = useState('spray');
  const [color, setColor] = useState('#00ff00');
  const [brushSize, setBrushSize] = useState(20);

  const canvasRef = useRef(null);
  const inkBrushRef = useRef(null); // Persist InkBrush constructor

  const [canvasWidth, setCanvasWidth] = useState(Math.min(window.innerWidth * 0.9, 1000));
  const [canvasHeight, setCanvasHeight] = useState((Math.min(window.innerWidth * 0.9, 1000) * 3) / 5);

  useEffect(() => {
    const fabricInstance = window.fabric;

    // Attach InkBrush if available globally but not yet on fabric
    if (window.InkBrush && !fabricInstance.InkBrush) {
      fabricInstance.InkBrush = window.InkBrush;
      console.log('Attached InkBrush to fabric');
    }
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1000);
      const height = (width * 3) / 5;
      setCanvasWidth(width);
      setCanvasHeight(height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const fabric = window.fabric;
    const canvasEl = canvasRef.current;
    const canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: true,
    });

    canvasRef.current.fabricCanvas = canvas;

    const sprayBrush = new fabric.SprayBrush(canvas);
    sprayBrush.color = color;
    sprayBrush.width = brushSize;
    sprayBrush.density = 30;
    sprayBrush.dotWidth = 6;
    sprayBrush.dotWidthVariance = 3;
    sprayBrush.distance = 2;
    canvas.freeDrawingBrush = sprayBrush;

    if (backgroundImage) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        img.scaleToWidth(canvasWidth);
        img.scaleToHeight(canvasHeight);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }

    return () => canvas.dispose();
  }, [backgroundImage]);

  useEffect(() => {
    const canvas = canvasRef.current?.fabricCanvas;
    if (!canvas) return;

    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);

    if (canvas.backgroundImage) {
      canvas.backgroundImage.scaleToWidth(canvasWidth);
      canvas.backgroundImage.scaleToHeight(canvasHeight);
      canvas.renderAll();
    }
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    const canvas = canvasRef.current?.fabricCanvas;
    const fabricInstance = window.fabric;
    if (!canvas || !fabricInstance) return;

    const prevBrush = canvas.freeDrawingBrush;

    // Flatten InkBrush content before switching brushes
    if (prevBrush instanceof fabricInstance.InkBrush && brushType !== 'ink') {
      const ctx = canvas.contextTop;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext('2d').putImageData(imgData, 0, 0);

      fabricInstance.Image.fromURL(tempCanvas.toDataURL(), (img) => {
        img.selectable = false;
        canvas.add(img);
        canvas.renderAll();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear overlay
      });
    }

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
    } else if (brushType === 'ink') {
      if (fabricInstance.InkBrush) {
        inkBrushRef.current = fabricInstance.InkBrush;
        brush = new inkBrushRef.current(canvas);
      } else {
        console.warn('InkBrush not available. Falling back to CircleBrush.');
        brush = new fabricInstance.CircleBrush(canvas);
      }
    }

    if ('color' in brush) brush.color = color;
    if ('strokeWidth' in brush) {
      brush.strokeWidth = brushSize;
    } else if ('width' in brush) {
      brush.width = brushSize;
    }

    canvas.freeDrawingBrush = brush;
    console.log(`Brush set to: ${brushType}`, brush);
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
        <button onClick={() => setBrushType('ink')} title="Ink">🖋️ Ink</button>
      </div>
    </div>
  );
}

export default GraffitiCanvas;
