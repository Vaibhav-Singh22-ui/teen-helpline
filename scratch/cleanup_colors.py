import os

REPLACEMENTS = {
    "rgba(143,158,139,0.12)": "rgba(32, 190, 232, 0.15)",
    "rgba(143,158,139,0.15)": "rgba(32, 190, 232, 0.15)",
    "rgba(143, 158, 139, 0.12)": "rgba(32, 190, 232, 0.15)",
    "rgba(143, 158, 139, 0.08)": "var(--border-soft)",
    "rgba(93, 109, 88, 0.06)": "rgba(50, 50, 68, 0.04)",
    "rgba(93, 109, 88, 0.1)": "rgba(50, 50, 68, 0.06)",
    "rgba(44, 122, 123, 0.08)": "rgba(32, 190, 232, 0.08)",
    "rgba(44,122,123,0.15)": "rgba(32, 190, 232, 0.15)",
    "#C6F6D5": "#FAF9F6"
}

WORKSPACE = r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline"

def run_cleanup():
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
                    for old, new in REPLACEMENTS.items():
                        if old in content:
                            content = content.replace(old, new)
                            print(f"Replacing {old} with {new} in {file}")
                            changed = True
                    
                    if changed:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(content)
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    run_cleanup()
