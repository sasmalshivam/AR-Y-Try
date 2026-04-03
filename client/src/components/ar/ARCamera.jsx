import React, { useRef, useEffect, useState } from 'react';
import { FilesetResolver, FaceLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';

const ARCamera = ({ currentProduct }) => {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mediaType, setMediaType] = useState('camera'); // 'camera', 'video', 'image'
  const [error, setError] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    let active = true;

    const setupMediaPipe = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        const poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 1
        });
        
        if (active) {
          faceLandmarkerRef.current = faceLandmarker;
          poseLandmarkerRef.current = poseLandmarker;
          startCamera();
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current && active) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsCameraReady(true);
            setError(null);
          };
        }
      } catch (err) {
        if (active) {
          setError('Camera input failed or blocked. Please enable your camera or use a test video.');
        }
      }
    };

    setupMediaPipe();

    return () => {
      active = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject;
         if (stream.getTracks) {
            stream.getTracks().forEach(track => track.stop());
         }
      }
      if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
      if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    
    if (file.type.startsWith('video/')) {
      if (videoRef.current) {
        if (videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
        videoRef.current.src = url;
        videoRef.current.loop = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setMediaType('video');
          setIsCameraReady(true);
          setError(null);
        };
      }
    } else if (file.type.startsWith('image/')) {
      if (imgRef.current) {
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
        }
        imgRef.current.src = url;
        imgRef.current.onload = () => {
          setMediaType('image');
          setIsCameraReady(true);
          setError(null);
        };
      }
    }
  };

  useEffect(() => {
    if (!isCameraReady || !faceLandmarkerRef.current || !poseLandmarkerRef.current || !canvasRef.current) return;

    let lastVideoTime = -1;
    const renderLoop = async () => {
      const isImage = mediaType === 'image';
      const sourceElement = isImage ? imgRef.current : videoRef.current;
      const canvas = canvasRef.current;
      
      if (!sourceElement || !canvas || (!isImage && sourceElement.readyState < 2)) {
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const sourceWidth = isImage ? sourceElement.naturalWidth : sourceElement.videoWidth;
      const sourceHeight = isImage ? sourceElement. प्राकृतिकHeight || sourceElement.height || sourceElement.naturalHeight : sourceElement.videoHeight;
      
      if (canvas.width !== sourceWidth || canvas.height !== sourceHeight) {
        if (sourceWidth && sourceHeight) {
          canvas.width = sourceWidth;
          canvas.height = sourceHeight;
        }
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let startTimeMs = performance.now();
      
      if (isImage || lastVideoTime !== sourceElement.currentTime) {
        if (!isImage) {
          lastVideoTime = sourceElement.currentTime;
        }
        
        if (currentProduct?.arType === 'pose') {
          const results = isImage 
            ? poseLandmarkerRef.current.detect(sourceElement)
            : poseLandmarkerRef.current.detectForVideo(sourceElement, startTimeMs);
            
          if (results.landmarks && results.landmarks.length > 0) {
            drawPoseProductOverlay(ctx, results.landmarks[0], canvas.width, canvas.height);
          }
        } else {
          const results = isImage
            ? faceLandmarkerRef.current.detect(sourceElement)
            : faceLandmarkerRef.current.detectForVideo(sourceElement, startTimeMs);
            
          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            drawProductOverlay(ctx, results.faceLandmarks[0], canvas.width, canvas.height);
          }
        }
      }
      
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isCameraReady, currentProduct, mediaType]);

  const drawProductOverlay = (ctx, landmarks, width, height) => {
    // Basic placeholder rendering
    
    // Eyewear tracking: use eyes (left eye: 33, 133; right eye: 362, 263. Midpoint of eyes approx 168)
    const leftEyeIdx = 133;
    const rightEyeIdx = 362;
    
    const leftEye = landmarks[leftEyeIdx];
    const rightEye = landmarks[rightEyeIdx];

    const dx = (rightEye.x - leftEye.x) * width;
    const dy = (rightEye.y - leftEye.y) * height;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);
    
    const centerX = (leftEye.x + rightEye.x) * 0.5 * width;
    const centerY = (leftEye.y + rightEye.y) * 0.5 * height;

    if (currentProduct?.images?.[0] || currentProduct?.image) {
      if (!currentProduct.imageObj) {
        const img = new Image();
        img.src = currentProduct.arAssetUrl || currentProduct.images?.[0] || currentProduct.image;
        currentProduct.imageObj = img;
      }

      if (currentProduct.imageObj.complete) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        // Adjust scale based on product type
        let scaleX = distance * 2.2;
        let scaleY = scaleX * (currentProduct.imageObj.height / currentProduct.imageObj.width);
        let offsetY = 0;

        if (currentProduct.category === 'headwear') {
           scaleX = distance * 3.5;
           scaleY = scaleX * (currentProduct.imageObj.height / currentProduct.imageObj.width);
           offsetY = -scaleY * 0.8; // move up
        }

        ctx.drawImage(currentProduct.imageObj, -scaleX/2, offsetY - scaleY/2, scaleX, scaleY);
        ctx.restore();
      }
    } else {
      // Fallback drawings based on category
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      if (currentProduct?.category === 'headwear') {
        ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        const capW = distance * 3.5;
        const capH = distance * 1.5;
        ctx.fillRect(-capW/2, -capH - distance, capW, capH); // rudimentary cap block
      } else {
        // default glasses fallback
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        const glassRadius = distance * 0.5;
        ctx.arc(-distance/2, 0, glassRadius, 0, Math.PI * 2);
        ctx.arc(distance/2, 0, glassRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-distance/2, 0);
        ctx.lineTo(distance/2, 0);
        ctx.stroke();
      }
    }
  };

  const drawPoseProductOverlay = (ctx, poseLandmarks, width, height) => {
    // Shoulder landmarks: 11 (left), 12 (right)
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];

    if (!leftShoulder || !rightShoulder) return;

    const dx = (rightShoulder.x - leftShoulder.x) * width;
    const dy = (rightShoulder.y - leftShoulder.y) * height;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);

    const centerX = (leftShoulder.x + rightShoulder.x) * 0.5 * width;
    const centerY = (leftShoulder.y + rightShoulder.y) * 0.5 * height;

    if (currentProduct?.images?.[0] || currentProduct?.image) {
      if (!currentProduct.imageObj) {
        const img = new Image();
        img.src = currentProduct.arAssetUrl || currentProduct.images?.[0] || currentProduct.image;
        currentProduct.imageObj = img;
      }

      if (currentProduct.imageObj.complete) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        // A shirt usually spans wider than just the shoulders and hangs down
        const scaleX = distance * 2.0; 
        const scaleY = scaleX * (currentProduct.imageObj.height / currentProduct.imageObj.width);
        const offsetY = scaleY * 0.4; // shift it down so the neck aligns with shoulders

        ctx.drawImage(currentProduct.imageObj, -scaleX/2, -offsetY, scaleX, scaleY);
        ctx.restore();
      }
    } else {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(50, 150, 255, 0.8)';
      ctx.fillRect(-distance, -distance * 0.5, distance * 2, distance * 3);
      ctx.restore();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000', borderRadius: '16px' }}>
      {error && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 10, textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '2rem', borderRadius: '12px' }}>
          <p style={{ marginBottom: '1rem' }}>{error}</p>
          <label style={{ cursor: 'pointer', background: 'var(--gradient-brand)', padding: '0.8rem 1.5rem', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold' }}>
            Upload Demo Video
            <input type="file" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        </div>
      )}
      {!isCameraReady && !error && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 10 }}>Initializing AI Engine...</div>}
      
      {/* Explicit Video Upload Button for Demoing */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
         <label style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.3)' }}>
            Test with Demo Video
            <input type="file" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFileUpload} />
         </label>
      </div>

      <video 
        ref={videoRef} 
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          objectFit: 'cover', transform: 'scaleX(-1)',
          display: mediaType === 'image' ? 'none' : 'block'
        }} 
        playsInline muted autoPlay
      />

      <img 
        ref={imgRef}
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          objectFit: 'cover', transform: 'scaleX(-1)',
          display: mediaType === 'image' ? 'block' : 'none'
        }} 
        alt="AR Upload"
      />
      
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          objectFit: 'cover', transform: 'scaleX(-1)' 
        }} 
      />
    </div>
  );
};

export default ARCamera;
