/* ==========================================
   FIREBASE DATABASE HELPERS
   ========================================== */

/**
 * Save data to Firebase RTDB at the given path.
 * @param {string} path - The database path (e.g., 'love-site/timeline/heading-0')
 * @param {*} data - The data to save
 */
function dbSave(path, data) {
    return db.ref(path).set(data)
        .catch(err => console.error('❌ Firebase save error:', path, err));
}

/**
 * Load data from Firebase RTDB at the given path.
 * @param {string} path - The database path
 * @returns {Promise<*>} The data at that path, or null
 */
function dbLoad(path) {
    return db.ref(path).once('value')
        .then(snapshot => snapshot.val())
        .catch(err => {
            console.error('❌ Firebase load error:', path, err);
            return null;
        });
}

/**
 * Listen for real-time changes at the given path.
 * Calls the callback every time data changes (including initial load).
 * @param {string} path - The database path
 * @param {function} callback - Called with the new data value
 */
function dbListen(path, callback) {
    db.ref(path).on('value', snapshot => {
        callback(snapshot.val());
    }, err => {
        console.error('❌ Firebase listen error:', path, err);
    });
}

/**
 * Compress an image (base64 string) using canvas.
 * Returns a Promise that resolves with the compressed base64 string.
 * @param {string} base64 - The original base64 image data
 * @param {number} maxDimension - Max width or height in pixels (default 1200)
 * @param {number} quality - JPEG quality 0-1 (default 0.85)
 * @returns {Promise<string>} Compressed base64 string
 */
function compressImage(base64, maxDimension = 1200, quality = 0.85) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
            let { width, height } = img;

            // Calculate new dimensions maintaining aspect ratio
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            // Draw on canvas at new size
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Export as compressed JPEG
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.onerror = function () {
            // If compression fails, return original
            resolve(base64);
        };
        img.src = base64;
    });
}
