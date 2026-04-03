from flask import Flask, Response
from flask_cors import CORS
import cv2
import os
import mediapipe as mp
import numpy as np

app = Flask(__name__)
CORS(app)

# Webcam
cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)

# MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.6, min_tracking_confidence=0.6)

# Load shirts
shirtFolder = "Shirts"
shirts = os.listdir(shirtFolder)
imageNumber = 0

# Gesture control
counterRight = 0
counterLeft = 0
selectionSpeed = 12
cooldown = 0

# Smooth position
prevX, prevY = 0, 0

# Overlay function
def overlayPNG(img, overlay, x, y):
    h, w = overlay.shape[:2]
    img_h, img_w = img.shape[:2]

    # If completely outside screen → skip
    if x >= img_w or y >= img_h or x + w <= 0 or y + h <= 0:
        return img

    # Clip coordinates
    x1 = max(0, x)
    y1 = max(0, y)
    x2 = min(img_w, x + w)
    y2 = min(img_h, y + h)

    # Corresponding overlay region
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


def generate_frames():
    global prevX, prevY, imageNumber
    global counterRight, counterLeft, cooldown

    while True:
        success, img = cap.read()
        if not success:
            break

        img = cv2.flip(img, 1)
        h, w, _ = img.shape

        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = pose.process(imgRGB)

        if results.pose_landmarks:

            lm = results.pose_landmarks.landmark

            def getPoint(id):
                return int(lm[id].x * w), int(lm[id].y * h)

            try:
                p11 = getPoint(11)
                p12 = getPoint(12)
                p23 = getPoint(23)
                p24 = getPoint(24)
                p15 = getPoint(15)  # left wrist
                p16 = getPoint(16)  # right wrist
            except:
                continue

            # -------- BODY SIZE --------
            shoulderWidth = abs(p11[0] - p12[0])
            hipWidth = abs(p23[0] - p24[0])
            bodyWidth = max(shoulderWidth, hipWidth)

            if bodyWidth < 80:
                continue

            # -------- LOAD SHIRT --------
            shirtPath = os.path.join(shirtFolder, shirts[imageNumber])
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

                # RIGHT HAND → NEXT
                if p16[1] < p12[1] + 60:
                    counterRight += 1
                    if counterRight > selectionSpeed:
                        counterRight = 0
                        imageNumber = (imageNumber + 1) % len(shirts)
                        cooldown = 15

                # LEFT HAND → PREVIOUS
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

        # Convert frame to stream
        _, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video')
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(port=5000, debug=True)