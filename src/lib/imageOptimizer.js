/**
 * Client-Side Image Optimizer
 * Resizes large camera photos to crisp, responsive dimensions (max 1600px)
 * ensuring instant previews and fast loading on mobile without crashing storage.
 */
export async function optimizeImageFile(file, maxDimension = 1600, quality = 0.88) {
  if (!file) throw new Error('No file provided');

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (PNG, JPG, or WebP).');
  }

  // If FileReader or Canvas is unavailable, return direct object URL
  if (typeof window === 'undefined' || !window.FileReader) {
    return {
      dataUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw dataUrl if image decode fails
        resolve({
          dataUrl: e.target.result,
          name: file.name,
          size: file.size,
        });
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // If image is already smaller than maxDimension, use original
        if (width <= maxDimension && height <= maxDimension) {
          resolve({
            dataUrl: e.target.result,
            name: file.name,
            size: file.size,
          });
          return;
        }

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target.result,
            name: file.name,
            size: file.size,
          });
          return;
        }

        // Crisp rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const optimizedDataUrl = canvas.toDataURL(outputMime, quality);

        resolve({
          dataUrl: optimizedDataUrl,
          name: file.name,
          size: Math.round((optimizedDataUrl.length * 3) / 4),
        });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

