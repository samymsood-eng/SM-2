export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

export interface CompressedImageResult {
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  compressionRatio: number;
  fileName: string;
  width: number;
  height: number;
  format: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Compresses an image file in the browser using HTML5 Canvas
 * Resizes dimensions proportionally and converts to lightweight WebP (or JPEG fallback)
 * Protects Firestore 1MB document quota by shrinking 5MB-10MB photos to ~40KB-90KB
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressedImageResult> {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality !== undefined ? options.quality : 0.82;
  const preferredFormat = options.format || 'image/webp';

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة صالحة. يرجى اختيار ملف صورة (PNG, JPG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional scale calculation
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('تعذر معالجة وتجهيز محرك الرسوميات (Canvas) لضغط الصورة.'));
          return;
        }

        // Render scaled image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with fallback
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL(preferredFormat, quality);
          if (!dataUrl.startsWith('data:' + preferredFormat)) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const originalBytes = file.size;
        const base64Content = dataUrl.split(',')[1] || '';
        const compressedBytes = Math.round((base64Content.length * 3) / 4);

        const originalSizeKB = Math.round(originalBytes / 1024);
        const compressedSizeKB = Math.round(compressedBytes / 1024);
        const compressionRatio = originalBytes > 0
          ? Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100))
          : 0;

        resolve({
          dataUrl,
          originalSizeKB,
          compressedSizeKB,
          compressionRatio,
          fileName: file.name,
          width,
          height,
          format: dataUrl.split(';')[0].replace('data:', ''),
        });
      };

      img.onerror = () => {
        reject(new Error('تعذر فك تشفير محتوى الصورة. قد يكون الملف تالفاً أو بتنسيق غير مدعوم.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('حدث خطأ أثناء قراءة الملف من الجهاز.'));
    };

    reader.readAsDataURL(file);
  });
}
