import cv2
import os
import mediapipe as mp
import numpy as np

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

# 🔥 Fast overlay
def overlayPNG(img, overlay, x, y):
    h, w = overlay.shape[:2]

    if x >= img.shape[1] or y >= img.shape[0]:
        return img

    h = min(h, img.shape[0] - y)
    w = min(w, img.shape[1] - x)

    if h <= 0 or w <= 0:
        return img

    overlay = overlay[:h, :w]

    alpha = overlay[:, :, 3] / 255.0
    for c in range(3):
        img[y:y+h, x:x+w, c] = (
            alpha * overlay[:, :, c] +
            (1 - alpha) * img[y:y+h, x:x+w, c]
        )

    return img

# 🔥 Improved occlusion (NO HOLES)
def applyOcclusion(shirt, x, y, wristPoints):
    h, w = shirt.shape[:2]
    result = shirt.copy()

    mask = np.zeros((h, w), dtype=np.uint8)

    for (wx, wy) in wristPoints:
        relX = wx - x
        relY = wy - y

        if 0 <= relX < w and 0 <= relY < h:
            cv2.circle(mask, (relX, relY), 25, 255, -1)

    # Smooth edges
    mask = cv2.GaussianBlur(mask, (21, 21), 0)

    # Apply to alpha channel
    alpha = result[:, :, 3]
    alpha = cv2.subtract(alpha, mask)

    result[:, :, 3] = alpha

    return result

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
            p15 = getPoint(15)
            p16 = getPoint(16)
        except:
            continue

        # -------- BODY SIZE --------
        shoulderWidth = abs(p11[0] - p12[0])
        hipWidth = abs(p23[0] - p24[0])
        bodyWidth = max(shoulderWidth, hipWidth)

        if bodyWidth < 80:
            continue

        torsoHeight = abs(p11[1] - p23[1])

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

        # -------- OCCLUSION --------
        wristPoints = [p15, p16]
        shirt = applyOcclusion(shirt, x, y, wristPoints)

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
        cv2.putText(img, f"Shirt: {imageNumber}", (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)

    cv2.imshow("Virtual Try-On PRO", img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()