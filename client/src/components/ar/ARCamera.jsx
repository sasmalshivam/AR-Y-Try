import React, { useRef, useEffect, useState } from 'react';
import { FaceLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const ARCamera = ({ currentProduct }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [assets, setAssets] = useState({});

  // Initialize MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        const face = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/face_landmarker.task" },
          runningMode: "VIDEO",
          numFaces: 1
        });

        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/pose_landmarker_lite.task" },
          runningMode: "VIDEO",
          numPoses: 1
        });

        setFaceLandmarker(face);
        setPoseLandmarker(pose);
        setLoading(false);
      } catch (err) {
        console.error("MediaPipe Init Error:", err);
        setError("Failed to load AR models. Please check your connection.");
        setLoading(false);
      }
    };

    initMediaPipe();
    setupCamera();

    return () => {
      if (faceLandmarker) faceLandmarker.close();
      if (poseLandmarker) poseLandmarker.close();
    };
  }, []);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Webcam access denied or not available.");
    }
  };

  // Preload product image
  useEffect(() => {
    if (currentProduct && currentProduct.image) {
      const img = new Image();
      img.src = currentProduct.image;
      img.onload = () => {
        setAssets(prev => ({ ...prev, [currentProduct.id]: img }));
      };
    }
  }, [currentProduct]);

  // Main Render Loop
  useEffect(() => {
    let animationId;
    
    const render = () => {
      if (videoRef.current && canvasRef.current && !loading && (faceLandmarker || poseLandmarker)) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Sync canvas size to video
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Draw Video Frame (Mirror mode)
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const startTimeMs = performance.now();
        
        // --- 1. Face Tasks (Eyewear, Jewelry, Beauty) ---
        if (faceLandmarker) {
          const faceResult = faceLandmarker.detectForVideo(video, startTimeMs);
          if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
            const marks = faceResult.faceLandmarks[0];
            
            if (currentProduct?.id < 100) { // Eyewear & Jewelry
               if (currentProduct.image.includes('eyewear')) renderEyewear(ctx, marks, canvas.width, canvas.height);
               if (currentProduct.image.includes('jewelry')) renderJewelry(ctx, marks, canvas.width, canvas.height);
            } else { // Beauty (Lipstick)
               renderLipstick(ctx, marks, canvas.width, canvas.height, currentProduct.color);
            }
          }
        }

        // --- 2. Pose Tasks (Fashion/Shirts) ---
        if (poseLandmarker && currentProduct?.image.includes('fashion')) {
          const poseResult = poseLandmarker.detectForVideo(video, startTimeMs);
          if (poseResult.poseLandmarks && poseResult.poseLandmarks.length > 0) {
            renderShirt(ctx, poseResult.poseLandmarks[0], canvas.width, canvas.height);
          }
        }
      }
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [loading, faceLandmarker, poseLandmarker, currentProduct, assets]);

  // Helper: Overlays
  const renderEyewear = (ctx, marks, w, h) => {
    const glasses = assets[currentProduct.id];
    if (!glasses) return;

    // Corner eyes for scale/rotation
    const pL = marks[33]; 
    const pR = marks[263];
    
    // Convert to canvas coords (Mirrored)
    const xL = (1 - pL.x) * w; const yL = pL.y * h;
    const xR = (1 - pR.x) * w; const yR = pR.y * h;

    const span = Math.hypot(xR - xL, yR - yL);
    const angle = Math.atan2(yR - yL, xR - xL);
    const midX = (xL + xR) / 2;
    const midY = (yL + yR) / 2;

    const gW = span * 2.5;
    const gH = gW * (glasses.height / glasses.width);

    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.drawImage(glasses, -gW/2, -gH/2, gW, gH);
    ctx.restore();
  };

  const renderJewelry = (ctx, marks, w, h) => {
    const jewel = assets[currentProduct.id];
    if (!jewel) return;

    // Use eye span as a proxy for face width
    const pL = marks[33]; const pR = marks[263];
    const span = Math.hypot((pR.x - pL.x) * w, (pR.y - pL.y) * h);
    
    const chin = marks[152];
    const neckX = (1 - chin.x) * w;
    const neckY = chin.y * h + (h * 0.05);

    const jW = span * 1.2;
    const jH = jW * (jewel.height / jewel.width);

    ctx.drawImage(jewel, neckX - jW/2, neckY, jW, jH);
  };

  const renderLipstick = (ctx, marks, w, h, color) => {
    if (!color) return;
    const upper = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lower = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];

    ctx.beginPath();
    [...upper, ...lower].forEach((id, i) => {
      const x = (1 - marks[id].x) * w;
      const y = marks[id].y * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
    ctx.fill();
  };

  const renderShirt = (ctx, landmarks, w, h) => {
    const shirt = assets[currentProduct.id];
    if (!shirt) return;

    const sL = landmarks[11]; // Left shoulder
    const sR = landmarks[12]; // Right shoulder
    
    const xL = (1 - sL.x) * w; const yL = sL.y * h;
    const xR = (1 - sR.x) * w; const yR = sR.y * h;

    const shoulderDist = Math.abs(xR - xL);
    const shirtW = shoulderDist * 2.2;
    const shirtH = shirtW * (shirt.height / shirt.width);
    
    const midX = (xL + xR) / 2;
    const midY = (yL + yR) / 2;

    ctx.drawImage(shirt, midX - shirtW/2, midY - shirtH * 0.2, shirtW, shirtH);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', color: 'white' }}>
          <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '15px' }} />
          <p style={{ fontSize: '14px', letterSpacing: '1px' }}>INITIALIZING NEURAL MIRROR...</p>
        </div>
      )}

      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', color: '#ff4b4b', padding: '20px', textAlign: 'center' }}>
          <p>{error}</p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ARCamera;

