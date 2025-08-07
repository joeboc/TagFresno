import { useEffect, useRef, useState } from 'react';

function GraffitiCanvas({ backgroundImage }) {
  const [brushType, setBrushType] = useState('ink');
  const [color, setColor] = useState('#00ff00');
  const [brushSize, setBrushSize] = useState(20);

  const canvasRef = useRef(null);
  const inkBrushRef = useRef(null); // Persist InkBrush constructor

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
const [canvasHeight, setCanvasHeight] = useState((window.innerWidth * 3) / 100);


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
      const width = (window.innerWidth * 0.9);
      const height = (width * 3) / 7;
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


    return () => canvas.dispose();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current?.fabricCanvas;
    const fabric = window.fabric;
    if (!canvas || !fabric) return;

    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    if (backgroundImage) {
      fabric.Image.fromURL(backgroundImage, (img) => {
        const scale = Math.min(
          canvas.getWidth() / img.width,
          canvas.getHeight() / img.height
        );
      
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvas.getWidth() - img.width * scale) / 2,
          top: (canvas.getHeight() - img.height * scale) / 2,
          originY: 'top'
        });
      
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
      
    } else {
      canvas.renderAll();
    }
    
  }, [canvasWidth, canvasHeight, backgroundImage]);

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

    if (brushType === 'pencil') {
      brush = new fabricInstance.PencilBrush(canvas);
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
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '80%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
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
          <div class="controls">
          <button onClick={() => setBrushType('pencil')} title="Pencil">✏️ Pencil</button>
          <button onClick={() => setBrushType('ink')} title="Ink">🖋️ Ink</button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default GraffitiCanvas;
