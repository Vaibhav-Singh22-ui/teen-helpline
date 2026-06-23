import os
from PIL import Image

def crop_and_save():
    logo_path = r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\public\logo.png"
    if not os.path.exists(logo_path):
        print("Logo path does not exist")
        return
        
    img = Image.open(logo_path)
    
    # Get bounding box of non-transparent content
    bbox = img.getbbox()
    if bbox:
        # Crop to the active content
        cropped = img.crop(bbox)
        cropped.save(r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\public\logo_cropped.png", "PNG")
        print(f"Saved cropped logo to public/logo_cropped.png with bbox {bbox}")
        
        # Now let's extract just the heart icon (top portion of the cropped content)
        w, h = cropped.size
        # The heart icon is roughly the top 58% of the height
        icon_h = int(h * 0.58)
        icon_bbox = (0, 0, w, icon_h)
        icon_img = cropped.crop(icon_bbox)
        
        # Crop any transparent border around the icon
        icon_bbox_tight = icon_img.getbbox()
        if icon_bbox_tight:
            icon_img = icon_img.crop(icon_bbox_tight)
            
        icon_img.save(r"c:\Users\Vaibhav Singh\Downloads\Teens Helpline\public\logo_icon.png", "PNG")
        print(f"Saved icon-only logo to public/logo_icon.png")
    else:
        print("No active content bounding box found")

if __name__ == "__main__":
    crop_and_save()
