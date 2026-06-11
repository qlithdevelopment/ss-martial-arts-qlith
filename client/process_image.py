from PIL import Image
import numpy as np
import sys

try:
    print("Loading image...")
    img = Image.open('src/assets/raw_samurai.webp').convert('RGBA')
    data = np.array(img)
    
    print("Processing...")
    # Calculate intensity of each pixel
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    intensity = (r.astype(int) + g.astype(int) + b.astype(int)) / 3.0
    
    # We want a black silhouette. So the color channels will all be 0.
    data[:,:,0] = 0
    data[:,:,1] = 0
    data[:,:,2] = 0
    
    # The alpha channel determines how "solid" the shadow is.
    new_alpha = 255 - intensity
    
    data[:,:,3] = new_alpha.astype(np.uint8)
    
    # ERASE THE HAGAKURE TEXT AT THE TOP
    # We will simply make the top 12% of the image completely transparent
    height = data.shape[0]
    crop_amount = int(height * 0.12)
    data[:crop_amount, :, 3] = 0
    
    print("Saving...")
    new_img = Image.fromarray(data, 'RGBA')
    new_img.save('src/assets/samurai_shadow.png')
    print("Done! Saved as samurai_shadow.png")
except Exception as e:
    print("Error:", e)
    sys.exit(1)
