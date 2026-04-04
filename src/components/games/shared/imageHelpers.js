/**
 * Shared image processing utilities for games
 * Extracted from TornadoGameWrapper.jsx for code reuse across all games
 */

/**
 * Extracts the filename from an uploaded image file without the extension.
 * Handles various image formats (.jpg, .jpeg, .png, .gif, .webp, .svg, .bmp, .tiff)
 *
 * @param {File|string} fileOrName - Either a File object or a filename string
 * @returns {string} The filename without the file extension
 */
export function extractImageName(fileOrName) {
  let filename = '';

  if (typeof fileOrName === 'string') {
    filename = fileOrName;
  } else if (fileOrName instanceof File) {
    filename = fileOrName.name;
  } else {
    return '';
  }

  // Remove path separators (for cross-platform compatibility)
  filename = filename.replace(/[\\/]/g, ' ');

  // Remove file extension
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex > 0) {
    // Check if it's a valid image extension
    const extension = filename.slice(lastDotIndex + 1).toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico'];

    if (imageExtensions.includes(extension)) {
      filename = filename.slice(0, lastDotIndex);
    }
  }

  return filename.trim();
}

/**
 * Processes uploaded image files and creates editable text elements for the game.
 * Extracts filenames without extensions and allows modification of these names.
 *
 * @param {File[]} files - Array of File objects from file input
 * @param {Function} onProcessComplete - Callback function called with processed image data
 * @returns {Promise<Array>} Promise resolving to array of processed image objects
 */
export async function processUploadedImages(files, onProcessComplete) {
  if (!files || files.length === 0) return [];

  const imagePromises = Array.from(files).map((file) => {
    return new Promise((resolve, reject) => {
      // Verify it's an image file
      if (!file.type.startsWith('image/')) {
        reject(new Error(`File "${file.name}" is not an image`));
        return;
      }

      // Extract name without extension
      const displayName = extractImageName(file);

      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          src: reader.result,
          name: displayName,
          originalName: file.name,
          file: file
        });
      };
      reader.onerror = () => reject(new Error(`Failed to read file "${file.name}"`));
      reader.readAsDataURL(file);
    });
  });

  try {
    const processedImages = await Promise.all(imagePromises);

    // Notify callback if provided
    if (onProcessComplete && typeof onProcessComplete === 'function') {
      onProcessComplete(processedImages);
    }

    return processedImages;
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the display name of a processed image
 *
 * @param {Object} imageData - The image data object
 * @param {string} newName - The new display name
 * @returns {Object} Updated image data object
 */
export function updateImageName(imageData, newName) {
  return {
    ...imageData,
    name: newName.trim()
  };
}
