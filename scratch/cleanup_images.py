import os

WORKSPACE = r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline"

IMAGE_REPLACEMENTS = {
    "/media__1782225726306.png": "/media__1782218276491.png", # Balloons -> Focused
    "/media__1782225726142.png": "/media__1782194988151.png", # Snorkeling -> Happy
    "/media__1782225713515.png": "/media__1782225726481.png", # Playground -> Waving kids
    "/media__1782225726443.png": "/media__1782218276474.png"  # Toy car -> Anxious/calming
}

def replace_images():
    for root, dirs, files in os.walk(WORKSPACE):
        if "node_modules" in dirs: dirs.remove("node_modules")
        if ".next" in dirs: dirs.remove(".next")
        
        for file in files:
            if file.endswith((".tsx", ".css", ".ts")):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    changed = False
                    for old, new in IMAGE_REPLACEMENTS.items():
                        if old in content:
                            content = content.replace(old, new)
                            print(f"Replacing image {old} with {new} in {file}")
                            changed = True
                    
                    if changed:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(content)
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    replace_images()
