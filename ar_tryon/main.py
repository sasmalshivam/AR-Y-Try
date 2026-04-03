import cv2
import os
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import time

# Webcam
cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

# MediaPipe Tasks Initialization
model_path = os.path.join(os.path.dirname(__file__), 'pose_landmarker_lite.task')
base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO,
    min_pose_detection_confidence=0.5,
    min_pose_presence_confidence=0.5,
    min_tracking_confidence=0.5
)
detector = vision.PoseLandmarker.create_from_options(options)

# Load shirts
shirtFolder = os.path.join(os.path.dirname(__file__), "Shirts")
shirts = sorted(os.listdir(shirtFolder))
imageNumber = 0

# Gesture control
counterRight = 0
counterLeft = 0
selectionSpeed = 12
cooldown = 0

# Smooth position
prevX, prevY = 0, 0

# 🔥 Fast overlay
def overlayPNG(img, overlay, x, y):
    h, w = overlay.shape[:2]
    img_h, img_w = img.shape[:2]

    if x >= img_w or y >= img_h or x + w <= 0 or y + h <= 0:
        return img

    x1 = max(0, x)
    y1 = max(0, y)
    x2 = min(img_w, x + w)
    y2 = min(img_h, y + h)

    overlay_x1 = x1 - x
    overlay_y1 = y1 - y
    overlay_x2 = overlay_x1 + (x2 - x1)
    overlay_y2 = overlay_y1 + (y2 - y1)

    overlay_crop = overlay[overlay_y1:overlay_y2, overlay_x1:overlay_x2]

    if overlay_crop.shape[0] == 0 or overlay_crop.shape[1] == 0:
        return img

    alpha = overlay_crop[:, :, 3] / 255.0
    for c in range(3):
        img[y1:y2, x1:x2, c] = (
            alpha * overlay_crop[:, :, c] +
            (1 - alpha) * img[y1:y2, x1:x2, c]
        )

    return img

while True:
    success, img = cap.read()
    if not success:
        break

    img = cv2.flip(img, 1)
    h, w, _ = img.shape

    # Convert to MediaPipe Image
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    
    # Precise timestamp for VIDEO mode
    timestamp_ms = int(time.time() * 1000)
    
    # Detect landmarks
    result = detector.detect_for_video(mp_image, timestamp_ms)

    if result.pose_landmarks:
        # Get first person detected
        landmarks = result.pose_landmarks[0]

        def getPoint(id):
            lm = landmarks[id]
            return int(lm.x * w), int(lm.y * h)

        try:
            p11 = getPoint(11) # Left Shoulder
            p12 = getPoint(12) # Right Shoulder
            p23 = getPoint(23) # Left Hip
            p24 = getPoint(24) # Right Hip
            p15 = getPoint(15) # Left Wrist
            p16 = getPoint(16) # Right Wrist
        except:
            continue

        # -------- BODY SIZE --------
        shoulderWidth = abs(p11[0] - p12[0])
        hipWidth = abs(p23[0] - p24[0])
        bodyWidth = max(shoulderWidth, hipWidth)

        if bodyWidth < 80:
            continue

        # -------- LOAD SHIRT --------
        shirt_idx = imageNumber % len(shirts)
        shirtPath = os.path.join(shirtFolder, shirts[shirt_idx])
        shirt = cv2.imread(shirtPath, cv2.IMREAD_UNCHANGED)

        if shirt is None or shirt.shape[2] != 4:
            continue

        # -------- RESIZE --------
        aspectRatio = shirt.shape[0] / shirt.shape[1]
        shirtW = int(bodyWidth * 1.6)
        shirtH = int(shirtW * aspectRatio)

        shirt = cv2.resize(shirt, (shirtW, shirtH))

        # -------- POSITION --------
        centerX = (p11[0] + p12[0]) // 2
        centerY = (p11[1] + p23[1]) // 2

        x = int(centerX - shirtW // 2)
        y = int(centerY - shirtH * 0.45)

        # Smooth movement
        x = int(prevX * 0.7 + x * 0.3)
        y = int(prevY * 0.7 + y * 0.3)
        prevX, prevY = x, y

        # -------- OVERLAY --------
        img = overlayPNG(img, shirt, x, y)

        # -------- GESTURE CONTROL --------
        if cooldown == 0:
            if p16[1] < p12[1] + 60:
                counterRight += 1
                if counterRight > selectionSpeed:
                    counterRight = 0
                    imageNumber = (imageNumber + 1) % len(shirts)
                    cooldown = 15

            elif p15[1] < p11[1] + 60:
                counterLeft += 1
                if counterLeft > selectionSpeed:
                    counterLeft = 0
                    imageNumber = (imageNumber - 1) % len(shirts)
                    cooldown = 15
            else:
                counterRight = 0
                counterLeft = 0

        if cooldown > 0:
            cooldown -= 1

        # -------- UI --------
        cv2.putText(img, f"Shirt Index: {imageNumber % len(shirts)}", (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)

    cv2.imshow("AR Try-On PRO", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
detector.close()