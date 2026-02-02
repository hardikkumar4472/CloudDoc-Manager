import { useState, useRef, useEffect } from "react";

export default function CropModal({ file, onClose, onCrop }) {
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 }); // Displayed dimensions
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 }); // Real dimensions
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragAction, setDragAction] = useState(null); // 'move' or 'resize'
  
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;
    setNaturalSize({ w: naturalWidth, h: naturalHeight });
    setImgSize({ w: clientWidth, h: clientHeight });
    // Initialize crop box in center
    setCrop({
      x: clientWidth / 4,
      y: clientHeight / 4,
      width: clientWidth / 2,
      height: clientHeight / 2
    });
  };

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setDragAction(action);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setDragStart({ x: e.clientX, y: e.clientY });

    setCrop(prev => {
      let newCrop = { ...prev };
      
      if (dragAction === 'move') {
        newCrop.x = Math.max(0, Math.min(imgSize.w - newCrop.width, prev.x + dx));
        newCrop.y = Math.max(0, Math.min(imgSize.h - newCrop.height, prev.y + dy));
      } else if (dragAction === 'resize') {
        newCrop.width = Math.max(50, Math.min(imgSize.w - prev.x, prev.width + dx));
        newCrop.height = Math.max(50, Math.min(imgSize.h - prev.y, prev.height + dy));
      }
      return newCrop;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragAction(null);
  };

  const handleCropSubmit = () => {
    // Calculate actual crop coordinates based on ratio
    const scaleX = naturalSize.w / imgSize.w;
    const scaleY = naturalSize.h / imgSize.h;

    const finalCrop = {
      width: Math.round(crop.width * scaleX),
      height: Math.round(crop.height * scaleY),
      left: Math.round(crop.x * scaleX),
      top: Math.round(crop.y * scaleY)
    };

    onCrop(file._id, finalCrop.width, finalCrop.height, finalCrop.left, finalCrop.top);
  };

  return (
    <div className="crop-modal-overlay" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onClick={onClose}>
      <div className="crop-modal-content" onClick={e => e.stopPropagation()}>
        <div className="crop-header">
            <h3>Crop Image</h3>
            <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        
        <div className="crop-workspace" ref={containerRef}>
            <img 
                ref={imgRef}
                src={file.url} 
                alt="Crop Target" 
                className="target-image"
                onLoad={handleImageLoad}
                draggable={false}
            />
            
            {imgSize.w > 0 && (
                <div 
                    className="crop-box"
                    style={{
                        left: crop.x,
                        top: crop.y,
                        width: crop.width,
                        height: crop.height
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                    <div className="resize-handle" onMouseDown={(e) => handleMouseDown(e, 'resize')}></div>
                    <div className="crop-grid">
                        <div className="grid-h"></div>
                        <div className="grid-v"></div>
                    </div>
                </div>
            )}
        </div>

        <div className="crop-actions">
             <div className="crop-info">
                 Original: {naturalSize.w}x{naturalSize.h} | 
                 Crop: {Math.round(crop.width * (naturalSize.w/imgSize.w))}x{Math.round(crop.height * (naturalSize.h/imgSize.h))}
             </div>
             <button className="btn-secondary" onClick={onClose}>Cancel</button>
             <button className="btn-primary" onClick={handleCropSubmit}>
                 <i className="fas fa-crop-alt"></i> Download Crop
             </button>
        </div>
      </div>

      <style>{`
        .crop-modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center; z-index: 3000;
        }
        .crop-modal-content {
            background: #1a1a1a; color: white; border-radius: 12px;
            width: 90%; max-width: 800px; display: flex; flex-direction: column; overflow: hidden;
            border: 1px solid #333;
        }
        .crop-header {
            padding: 16px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;
        }
        .crop-workspace {
            position: relative; overflow: hidden; background: #000;
            display: flex; justify-content: center; align-items: center;
            min-height: 400px;
            user-select: none;
        }
        .target-image {
            max-width: 100%; max-height: 60vh; display: block;
            pointer-events: none; /* Let clicks pass to container if needed */
        }
        
        .crop-box {
            position: absolute;
            border: 2px solid #fff;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5); /* Dim surrounding area */
            cursor: move;
        }
        .resize-handle {
            position: absolute; bottom: -5px; right: -5px; width: 15px; height: 15px;
            background: #fff; border: 1px solid #000; cursor: nwse-resize;
        }
        .crop-grid {
            position: absolute; inset: 0; pointer-events: none; opacity: 0.3;
        }
        .grid-h {
            position: absolute; top: 33%; left: 0; right: 0; height: 33%; border-top: 1px solid #fff; border-bottom: 1px solid #fff;
        }
        .grid-v {
            position: absolute; left: 33%; top: 0; bottom: 0; width: 33%; border-left: 1px solid #fff; border-right: 1px solid #fff;
        }

        .crop-actions {
            padding: 16px; border-top: 1px solid #333; display: flex; justify-content: flex-end; align-items: center; gap: 12px;
        }
        .crop-info { flex: 1; font-size: 0.9rem; color: #888; }
        .btn-primary { background: var(--accent-color); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-secondary { background: transparent; color: #aaa; padding: 10px 20px; border: 1px solid #444; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
}
