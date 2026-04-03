import os
import requests

def download_file(url, filename):
    print(f"Downloading {filename} from {url}...")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Download complete.")
    else:
        print(f"Failed to download {filename}. Status code: {response.status_code}")

if __name__ == "__main__":
    ar_tryon_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(ar_tryon_dir, "ar_tryon")
    
    models = {
        "face_landmarker.task": "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
    }
    
    for name, url in models.items():
        path = os.path.join(target_dir, name)
        if not os.path.exists(path):
            download_file(url, path)
        else:
            print(f"{name} already exists.")
