import os
import re

REPLACEMENTS = {
    # Off-white conversions (beige, cream, sand, light teals/mints)
    "#FFFDF9": "#FAF9F6",
    "#FFFDF5": "#FAF9F6",
    "#F6F3EB": "#FAF9F6",
    "#F4F1EA": "#FAF9F6",
    "#F2F0FF": "#FAF9F6",
    "#F6F4FF": "#FAF9F6",
    "#F8F7FF": "#FAF9F6",
    "#F0EFFF": "#FAF9F6",
    "#F0F3FC": "#FAF9F6",
    "#EBF8F8": "#FAF9F6",
    "#E6FFFA": "#FAF9F6",
    "#E6F4F0": "#FAF9F6",
    "#FAFAFA": "#FAF9F6",
    "#FAF9FB": "#FAF9F6",
    
    # Pink conversions (reds, yellows, oranges, light pinks)
    "#FFF5F5": "#FFC0C1",
    "#FEB2B2": "#FFC0C1",
    "#FED7D7": "#FFC0C1",
    "#FFFBEB": "#FFC0C1",
    "#FDE047": "#FFC0C1",
    "#FEFCBF": "#FFC0C1",
    "#FED7D7": "#FFC0C1",
    "#C53030": "#323244", # Treat emergency red text as dark text on pink background
    "#742A2A": "#323244",
    
    # Cyan conversions (teals, greens, light blues)
    "#2C7A7B": "#20BEE8",
    "#319795": "#20BEE8",
    "#2B6CB0": "#323244",
    "#EBF8FF": "#FFC0C1",
    "#8F9E8B": "#20BEE8",
    "#354F52": "#20BEE8",
    "#52796F": "#20BEE8",
    "#84A98C": "#20BEE8",
    "#CAD2C5": "#FFC0C1",
    
    # Dark text conversions (charcoal, slate, navy, olive darks)
    "#2D3748": "#323244",
    "#4A5568": "#323244",
    "#718096": "#323244",
    "#5D6D58": "#323244",
    "#2F3E46": "#323244",
    "#1E1D3B": "#323244",
    "#535175": "#323244",
    
    # Border & gray conversions
    "#CBD5E0": "#FFC0C1",
    "#E2E8F0": "#FFC0C1",
    "#E2E0FF": "#FFC0C1",
    
    # Shadow and RGBA color replacements (replacing green/olive/purple with #323244 or #20BEE8 alphas)
    "rgba(93, 109, 88, 0.16)": "rgba(50, 50, 68, 0.08)",
    "rgba(93, 109, 88, 0.14)": "rgba(50, 50, 68, 0.08)",
    "rgba(93, 109, 88, 0.12)": "rgba(50, 50, 68, 0.08)",
    "rgba(93, 109, 88, 0.08)": "rgba(50, 50, 68, 0.06)",
    "rgba(93, 109, 88, 0.04)": "rgba(50, 50, 68, 0.04)",
    "rgba(93, 109, 88, 0.02)": "rgba(50, 50, 68, 0.02)",
    "rgba(92, 107, 115, 0.03)": "rgba(50, 50, 68, 0.03)",
    "rgba(92, 107, 115, 0.15)": "rgba(50, 50, 68, 0.08)",
    "rgba(143, 158, 139, 0.12)": "rgba(50, 50, 68, 0.1)",
    "rgba(143, 158, 139, 0.15)": "rgba(50, 50, 68, 0.1)",
    "rgba(143, 158, 139, 0.2)": "rgba(50, 50, 68, 0.1)",
    "rgba(44, 122, 123, 0.25)": "rgba(32, 190, 232, 0.2)",
    "rgba(44, 122, 123, 0.15)": "rgba(32, 190, 232, 0.15)",
    "rgba(44, 122, 123, 0.1)": "rgba(32, 190, 232, 0.1)",
    "rgba(118, 115, 224, 0.04)": "rgba(50, 50, 68, 0.04)",
    "rgba(118, 115, 224, 0.12)": "rgba(32, 190, 232, 0.12)",
    "rgba(118, 115, 224, 0.08)": "rgba(32, 190, 232, 0.08)"
}

FILES = [
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\globals.css",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\page.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\resources\page.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\community\page.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\counselors\page.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\auth\page.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\components\Navbar.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\components\Footer.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\components\Buddy.tsx",
    r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\app\dashboard\page.tsx"
]

def clean_file(path):
    if not os.path.exists(path):
        print(f"Skipping non-existent: {path}")
        return
        
    print(f"Cleaning: {path}")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    original = content
    
    # Perform standard replacements
    for src, dest in REPLACEMENTS.items():
        # Case insensitive replace for hexes
        if src.startswith("#"):
            content = re.sub(re.escape(src), dest, content, flags=re.IGNORECASE)
        else:
            content = content.replace(src, dest)
            
    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"-> Updated {path}")
    else:
        print("-> No changes needed")

if __name__ == "__main__":
    for p in FILES:
        clean_file(p)
