import os
import shutil

FORBIDDEN = [
    "media__1782194839945.png",
    "media__1782194863815.png",
    "media__1782194863887.png",
    "media__1782206187950.png"
]

NEW_IMAGES = [
    "media__1782225713515.png",
    "media__1782225726142.png",
    "media__1782225726306.png",
    "media__1782225726443.png",
    "media__1782225726481.png"
]

WORKSPACE_DIR = r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline"
ARTIFACTS_DIR = r"C:\Users\Vaibhav Singh\.gemini\antigravity-ide\brain\9075276f-cdd0-4da0-81fb-11be4fb88590"

def copy_images():
    public_dir = os.path.join(WORKSPACE_DIR, "public")
    os.makedirs(public_dir, exist_ok=True)
    
    # Copy new images
    for img in NEW_IMAGES:
        src = os.path.join(ARTIFACTS_DIR, img)
        dst = os.path.join(public_dir, img)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {img} to public/")
        else:
            print(f"New image not found in artifacts: {src}")

def scan_references():
    print("\nScanning workspace for forbidden image references:")
    for root, dirs, files in os.walk(WORKSPACE_DIR):
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        if ".next" in dirs:
            dirs.remove(".next")
            
        for file in files:
            if file.endswith((".tsx", ".ts", ".css", ".js", ".json")):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    for fbd in FORBIDDEN:
                        if fbd in content:
                            print(f"FOUND forbidden image {fbd} in {os.path.relpath(path, WORKSPACE_DIR)}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    copy_images()
    scan_references()
