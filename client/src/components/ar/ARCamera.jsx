import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const ARCamera = ({ currentProduct, proMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const overlayRef = useRef(new Image());

  useEffect(() => {
    overlayRef.current.crossOrigin = 'anonymous';
    overlayRef.current.src = currentProduct?.arAssetUrl || currentProduct?.images?.[0] || '';
  }, [currentProduct]);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      if (proMode) return; // Don't capture camera in browser if Pro Mode is active
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setActive(true);
      } catch (error) {
        console.error('Unable to access camera', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [proMode]);

  useEffect(() => {
    if (!active || !videoRef.current) return;

    let landmarker;
    let raf;
    let running = true;

    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm');

        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        setPoseLandmarker(landmarker);
        setModelReady(true);
      } catch (err) {
        console.error('PoseLandmarker failed', err);
      }
    };

    loadModel();

    const updateFrame = async () => {
      if (!running || !poseLandmarker || !videoRef.current) {
        raf = requestAnimationFrame(updateFrame);
        return;
      }

      try {
        const nowInMs = performance.now();
        const result = poseLandmarker.detectForVideo(videoRef.current, nowInMs);

        if (result.pose_landmarks && result.pose_landmarks.length > 0) {
          setLandmarks(result.pose_landmarks[0]);
        }
      } catch (err) {
        console.warn('Pose detection tick error', err);
      } finally {
        raf = requestAnimationFrame(updateFrame);
      }
    };

    raf = requestAnimationFrame(updateFrame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (landmarker) {
        landmarker.close();
      }
    };
  }, [active, poseLandmarker]);

  useEffect(() => {
    if (!landmarks || !canvasRef.current || !videoRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;

    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2 * canvas.width,
      y: (leftShoulder.y + rightShoulder.y) / 2 * canvas.height,
    };

    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2 * canvas.width,
      y: (leftHip.y + rightHip.y) / 2 * canvas.height,
    };

    const shoulderDist = Math.hypot((rightShoulder.x - leftShoulder.x) * canvas.width, (rightShoulder.y - leftShoulder.y) * canvas.height);
    const torsoHeight = Math.hypot((hipCenter.x - shoulderCenter.x), (hipCenter.y - shoulderCenter.y));

    const overlayWidth = shoulderDist * 2.3;
    const overlayHeight = torsoHeight * 1.6;

    const angle = Math.atan2((rightShoulder.y - leftShoulder.y), (rightShoulder.x - leftShoulder.x));

    const img = overlayRef.current;

    if (!img || !img.complete) {
      return;
    }

    ctx.save();
    ctx.translate(shoulderCenter.x, shoulderCenter.y);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.82;
    ctx.drawImage(img, -overlayWidth / 2, -overlayHeight * 0.12, overlayWidth, overlayHeight);
    ctx.restore();
  }, [landmarks, currentProduct]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000' }}>
      {proMode ? (
        <img 
          src="http://127.0.0.1:5001/video" 
          alt="Pro AR Stream"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
            alert("Error: Ensure the Python AR server is running at http://127.0.0.1:5001/video");
          }}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          />
        </>
      )}
      
      {(!active || !modelReady) && !proMode && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.35)' }}>
          {active ? 'Loading AR model...' : 'Initializing camera...'}
        </div>
      )}

      {proMode && (
        <div style={{ position: 'absolute', top: '80px', right: '20px', background: 'rgba(201,168,76,0.9)', color: 'black', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          PRO SERVER ACTIVE
        </div>
      )}
    </div>
  );
};

export default ARCamera;
