import os
import json

def generate_gallery():
    base_dir = "images"
    categories = ['early-life', 'priesthood', 'ministry', 'family', 'celebrations', 'legacy']
    photo_map = {}

    print("Scanning images directory...")
    for cat in categories:
        cat_dir = os.path.join(base_dir, cat)
        if os.path.isdir(cat_dir):
            # Find all image files, filter out hidden files
            files = [
                f for f in os.listdir(cat_dir)
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))
                and not f.startswith('.')
            ]
            # Sort files naturally/alphabetically
            photo_map[cat] = sorted(files)
            print(f"  Category '{cat}': found {len(files)} images.")
        else:
            photo_map[cat] = []
            print(f"  Category '{cat}': directory not found, using empty list.")

    output_path = os.path.join("js", "photos.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(photo_map, f, indent=2)
    
    print(f"Successfully generated {output_path}!")

if __name__ == "__main__":
    generate_gallery()
