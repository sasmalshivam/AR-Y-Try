from flask import Flask, Response
from flask_cors import CORS
import cv2
import os
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import time

app = Flask(__name__)
CORS(app)

# Webcam
cap = cv2.VideoCapture(0)
cap.set(3, 1920)
cap.set(4, 1080)

# MediaPipe Tasks Initialization
# Pose Landmarker (for Shirts)
pose_model_path = os.path.join(os.path.dirname(__file__), 'pose_landmarker_lite.task')
pose_options = vision.PoseLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=pose_model_path),
    running_mode=vision.RunningMode.VIDEO,
    min_pose_detection_confidence=0.5,
    min_pose_presence_confidence=0.5,
    min_tracking_confidence=0.5
)
pose_detector = vision.PoseLandmarker.create_from_options(pose_options)

# Face Landmarker (for Eyewear, Jewelry, Beauty)
face_model_path = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')
face_options = vision.FaceLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=face_model_path),
    running_mode=vision.RunningMode.VIDEO,
    min_face_detection_confidence=0.5,
    min_face_presence_confidence=0.5,
    min_tracking_confidence=0.5,
    output_face_blendshapes=True,
    output_facial_transformation_matrixes=True
)
face_detector = vision.FaceLandmarker.create_from_options(face_options)

# Load assets
categories = ["fashion", "eyewear", "jewelry", "beauty"]
current_category = "fashion"
current_item_index = 0
lipstick_color = (0, 0, 180) # Default Crimson

# Load items for each category
asset_folders = {
    "fashion": os.path.join(os.path.dirname(__file__), "Shirts"),
    "eyewear": os.path.join(os.path.dirname(__file__), "Eyewear"),
    "jewelry": os.path.join(os.path.dirname(__file__), "Jewelry"),
}

inventory = {}
for cat, folder in asset_folders.items():
    if os.path.exists(folder):
        inventory[cat] = sorted([f for f in os.listdir(folder) if f.endswith(('.png', '.jpg'))])
    else:
        inventory[cat] = []

# Smooth position
prevX, prevY = 0, 0
pose_prevX, pose_prevY = 0, 0

# Overlay function
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


# 🔥 Improved occlusion (NO HOLES)
def applyOcclusion(shirt, x, y, wristPoints):
    h, w = shirt.shape[:2]
    result = shirt.copy()

    mask = np.zeros((h, w), dtype=np.uint8)

    for (wx, wy) in wristPoints:
        relX = wx - x
        relY = wy - y

        if 0 <= relX < w and 0 <= relY < h:
            cv2.circle(mask, (relX, relY), 30, 255, -1)

    # Smooth edges for natural transition
    mask = cv2.GaussianBlur(mask, (31, 31), 0)

    # Apply to alpha channel of the shirt
    alpha = result[:, :, 3]
    alpha = cv2.subtract(alpha, mask)
    result[:, :, 3] = alpha

    return result

def render_eyewear(img, landmarks, item_path):
    h, w, _ = img.shape
    glasses = cv2.imread(item_path, cv2.IMREAD_UNCHANGED)
    if glasses is None: return img
    
    # If it's a 3-channel image (JPG or no alpha), remove white/light background
    if glasses.shape[2] == 3:
        tmp = cv2.cvtColor(glasses, cv2.COLOR_BGR2BGRA)
        gray = cv2.cvtColor(glasses, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY_INV)
        tmp[:, :, 3] = alpha
        glasses = tmp
    
    # Use eye outer corners for positioning (33=left, 263=right)
    pL = landmarks[33]
    pR = landmarks[263]
    
    xL, yL = int(pL.x * w), int(pL.y * h)
    xR, yR = int(pR.x * w), int(pR.y * h)
    
    # Eye midpoint — glasses anchor to eye level
    xMid = (xL + xR) // 2
    yMid = (yL + yR) // 2
    
    # Size glasses based on eye span
    eye_span = np.hypot(xR - xL, yR - yL)
    glasses_width = int(eye_span * 2.5)
    aspect = glasses.shape[0] / glasses.shape[1]
    glasses_height = int(glasses_width * aspect)
    
    glasses = cv2.resize(glasses, (glasses_width, glasses_height))
    
    # Rotate to match head tilt
    angle = np.degrees(np.arctan2(yR - yL, xR - xL))
    M = cv2.getRotationMatrix2D((glasses_width // 2, glasses_height // 2), angle, 1.0)
    glasses = cv2.warpAffine(glasses, M, (glasses_width, glasses_height),
                              flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))
    
    # Place glasses centered on eye midpoint
    x = xMid - glasses_width // 2
    y = yMid - glasses_height // 2
    
    return overlayPNG(img, glasses, x, y)

def render_earrings(img, landmarks, item_path):
    h, w, _ = img.shape
    earring = cv2.imread(item_path, cv2.IMREAD_UNCHANGED)
    if earring is None: return img
    
    # If it's a 3-channel image (JPG or no alpha), remove white background
    if earring.shape[2] == 3:
        tmp = cv2.cvtColor(earring, cv2.COLOR_BGR2BGRA)
        gray = cv2.cvtColor(earring, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
        tmp[:, :, 3] = alpha
        earring = tmp
    
    # 234: Left Ear, 454: Right Ear (approximate lobes)
    for id in [234, 454]:
        p = landmarks[id]
        ex, ey = int(p.x * w), int(p.y * h)
        
        # Scaling based on face size
        dist = np.hypot(landmarks[33].x - landmarks[263].x, landmarks[33].y - landmarks[263].y) * w
        ear_size = int(dist * 0.25)
        
        resized = cv2.resize(earring, (ear_size, int(ear_size * (earring.shape[0] / earring.shape[1]))))
        img = overlayPNG(img, resized, ex - ear_size // 2, ey)
        
    return img

def render_pendant(img, landmarks, item_path):
    h, w, _ = img.shape
    pendant = cv2.imread(item_path, cv2.IMREAD_UNCHANGED)
    if pendant is None: return img

    # Remove white/light background if no alpha channel
    if pendant.shape[2] == 3:
        tmp = cv2.cvtColor(pendant, cv2.COLOR_BGR2BGRA)
        gray = cv2.cvtColor(pendant, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY_INV)
        tmp[:, :, 3] = alpha
        pendant = tmp

    # Landmark 152 = chin bottom, 10 = forehead top (for face height ref)
    # Use 33 & 263 (eye corners) for face width reference
    chin = landmarks[152]
    eyeL = landmarks[33]
    eyeR = landmarks[263]

    chin_x = int(chin.x * w)
    chin_y = int(chin.y * h)

    face_width = abs(int(eyeR.x * w) - int(eyeL.x * w))
    pendant_w = int(face_width * 1.2)  # pendant slightly narrower than face
    aspect = pendant.shape[0] / pendant.shape[1]
    pendant_h = int(pendant_w * aspect)

    pendant = cv2.resize(pendant, (pendant_w, pendant_h))

    # Place pendant centered below chin
    x = chin_x - pendant_w // 2
    y = chin_y + int(face_width * 0.1)  # small offset below chin

    return overlayPNG(img, pendant, x, y)

def render_lipstick(img, landmarks, color):
    # Lip outer indices
    upper_lip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291]
    lower_lip = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61]
    
    h, w, _ = img.shape
    points = []
    for idx in upper_lip + lower_lip:
        p = landmarks[idx]
        points.append([int(p.x * w), int(p.y * h)])
        
    points = np.array(points, np.int32)
    
    # Create mask for lips
    mask = np.zeros_like(img)
    cv2.fillPoly(mask, [points], color)
    
    # Blend
    alpha = 0.4 # Transparent lipstick
    mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    _, binary_mask = cv2.threshold(mask_gray, 1, 255, cv2.THRESH_BINARY)
    
    img_bgr = img.copy()
    mask_area = binary_mask > 0
    img[mask_area] = cv2.addWeighted(img[mask_area], 1 - alpha, mask[mask_area], alpha, 0)
    
    return img

# Gesture control state
selection_counter_right = 0
selection_counter_left = 0
selection_speed = 4
cooldown = 0

def generate_frames():
    global pose_prevX, pose_prevY
    global current_category, current_item_index, lipstick_color
    global selection_counter_right, selection_counter_left, cooldown

    while True:
        success, img = cap.read()
        if not success:
            break

        img = cv2.flip(img, 1)
        h, w, _ = img.shape
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        timestamp_ms = int(time.time() * 1000)
        
        # 1. ALWAYS RUN POSE DETECTION (for Gestures)
        pose_result = pose_detector.detect_for_video(mp_image, timestamp_ms)
        p_landmarks = None
        if pose_result.pose_landmarks:
            p_landmarks = pose_result.pose_landmarks[0]
            
            # GESTURE LOGIC: Right Hand = Next, Left Hand = Previous
            def getP(id): return int(p_landmarks[id].x * w), int(p_landmarks[id].y * h)
            
            try:
                p11, p12, p23, p15, p16 = getP(11), getP(12), getP(23), p_landmarks[15], p_landmarks[16]
                wristL, wristR = getP(15), getP(16)
                shL, shR = getP(11), getP(12)

                if cooldown == 0:
                    # Right Hand (Wrist 16) above Right Shoulder (12)
                    if wristR[1] < shR[1] - 30:
                        selection_counter_right += 1
                        if selection_counter_right >= selection_speed:
                            items_count = len(inventory.get(current_category, [])) if current_category != "beauty" else 2
                            current_item_index = (current_item_index + 1) % (items_count if items_count > 0 else 1)
                            selection_counter_right = 0
                            cooldown = 8
                    # Left Hand (Wrist 15) above Left Shoulder (11)
                    elif wristL[1] < shL[1] - 30:
                        selection_counter_left += 1
                        if selection_counter_left >= selection_speed:
                            items_count = len(inventory.get(current_category, [])) if current_category != "beauty" else 2
                            current_item_index = (current_item_index - 1) % (items_count if items_count > 0 else 1)
                            selection_counter_left = 0
                            cooldown = 8
                    else:
                        selection_counter_right = 0
                        selection_counter_left = 0
                
                if cooldown > 0: cooldown -= 1

                # Visual Feedback for gestures
                if selection_counter_right > 1:
                    cv2.circle(img, wristR, 20, (0, 255, 0), 2)
                    cv2.putText(img, "NEXT", (w-150, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                if selection_counter_left > 1:
                    cv2.circle(img, wristL, 20, (0, 0, 255), 2)
                    cv2.putText(img, "PREV", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                # Rendering for Fashion (Body)
                if current_category == "fashion":
                    bodyWidth = max(abs(p11[0] - p12[0]), 80)
                    items = inventory.get("fashion", [])
                    if items:
                        item_path = os.path.join(asset_folders["fashion"], items[current_item_index % len(items)])
                        shirt = cv2.imread(item_path, cv2.IMREAD_UNCHANGED)
                        if shirt is not None:
                            aspect = shirt.shape[0] / shirt.shape[1]
                            sW = int(bodyWidth * 1.8)
                            sH = int(sW * aspect)
                            shirt = cv2.resize(shirt, (sW, sH))
                            x, y = int((p11[0]+p12[0])/2 - sW/2), int((p11[1]+p23[1])/2 - sH*0.42)
                            x = int(pose_prevX * 0.7 + x * 0.3); y = int(pose_prevY * 0.7 + y * 0.3)
                            pose_prevX, pose_prevY = x, y
                            shirt = applyOcclusion(shirt, x, y, [wristL, wristR])
                            img = overlayPNG(img, shirt, x, y)
            except Exception as e:
                print(f"Pose processing error: {e}")


        # 2. RUN FACE DETECTION IF NEEDED
        if current_category != "fashion":
            face_result = face_detector.detect_for_video(mp_image, timestamp_ms + 1)
            if face_result.face_landmarks:
                f_landmarks = face_result.face_landmarks[0]
                if current_category == "eyewear":
                    items = inventory.get("eyewear", [])
                    if items:
                        item_path = os.path.join(asset_folders["eyewear"], items[current_item_index % len(items)])
                        img = render_eyewear(img, f_landmarks, item_path)
                elif current_category == "jewelry":
                    items = inventory.get("jewelry", [])
                    if items:
                        item_path = os.path.join(asset_folders["jewelry"], items[current_item_index % len(items)])
                        img = render_pendant(img, f_landmarks, item_path)
                elif current_category == "beauty":
                    img = render_lipstick(img, f_landmarks, lipstick_color)

        # Convert frame to stream
        _, buffer = cv2.imencode('.jpg', img)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/set_category/<category>')
def set_category(category):
    global current_category, current_item_index
    if category in categories:
        current_category = category
        current_item_index = 0
        return {"status": "success", "category": category}, 200
    return {"status": "error", "message": "Invalid category"}, 400

@app.route('/set_item/<int:item_id>')
def set_item(item_id):
    global current_item_index
    current_item_index = item_id
    return {"status": "success", "item_index": item_id}, 200

@app.route('/set_lipstick')
def set_lipstick():
    global lipstick_color, current_category
    from flask import request
    r = int(request.args.get('r', 0))
    g = int(request.args.get('g', 0))
    b = int(request.args.get('b', 0))
    lipstick_color = (b, g, r) # OpenCV uses BGR
    current_category = "beauty"
    return {"status": "success", "color": lipstick_color}, 200

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)