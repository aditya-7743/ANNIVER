/**
 * Logic for Live Editing the Memories Slides (Firebase RTDB — Live Sync)
 */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const editingFields = new Set();

    slides.forEach((slide, index) => {
        const editableElements = slide.querySelectorAll('[contenteditable="true"]');
        const saveStatus = slide.querySelector('.save-status');
        const dbKeyPrefix = `love-site/memories/slide-${index}/`;

        let timeoutId;

        editableElements.forEach((el, elIndex) => {
            const dbKey = `${dbKeyPrefix}field-${elIndex}`;
            const fieldId = `mem-${index}-${elIndex}`;

            // 1. Live-sync content from Firebase
            dbListen(dbKey, (val) => {
                if (val && !editingFields.has(fieldId)) {
                    el.innerText = val;
                }
            });

            // 2. Auto-save (debounced)
            el.addEventListener('focus', () => editingFields.add(fieldId));
            el.addEventListener('blur', () => editingFields.delete(fieldId));

            el.addEventListener('input', () => {
                clearTimeout(timeoutId);
                if (saveStatus) saveStatus.classList.remove('show');

                timeoutId = setTimeout(() => {
                    dbSave(dbKey, el.innerText);

                    if (saveStatus) {
                        saveStatus.classList.add('show');
                        setTimeout(() => {
                            saveStatus.classList.remove('show');
                        }, 3000);
                    }
                }, 1000);
            });

            // 3. Prevent keystrokes from triggering slide changes
            el.addEventListener('keydown', (e) => {
                e.stopPropagation();
            });

            // Paste plain text only
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });

        // --- Live Photo Upload Logic ---
        const placeholderImg = slide.querySelector('.memory-placeholder-img');
        const photoUploadInput = document.getElementById('photoUploadInput');
        const photoDbKey = `love-site/memories/photo-${index}`;

        if (placeholderImg && photoUploadInput) {
            // 4. Live-sync photo from Firebase
            dbListen(photoDbKey, (savedPhoto) => {
                if (savedPhoto) {
                    placeholderImg.style.backgroundImage = 'none';
                    placeholderImg.classList.add('has-image');
                    placeholderImg.innerHTML = `<img src="${savedPhoto}" alt="Memory photo">`;
                }
            });

            // 5. Click to upload
            placeholderImg.addEventListener('click', () => {
                window.currentPlaceholderTarget = placeholderImg;
                window.currentPhotoDbKey = photoDbKey;
                window.currentSaveStatus = saveStatus;
                photoUploadInput.click();
            });
        }
    });

    // 6. Handle file selection for photos
    const photoUploadInput = document.getElementById('photoUploadInput');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = async function (event) {
                const base64String = event.target.result;
                const targetPlaceholder = window.currentPlaceholderTarget;
                const dbKey = window.currentPhotoDbKey;
                const saveStatus = window.currentSaveStatus;

                if (targetPlaceholder && dbKey) {
                    const compressed = await compressImage(base64String, 1200, 0.85);

                    targetPlaceholder.style.backgroundImage = 'none';
                    targetPlaceholder.classList.add('has-image');
                    targetPlaceholder.innerHTML = `<img src="${compressed}" alt="Memory photo">`;

                    dbSave(dbKey, compressed);

                    if (saveStatus) {
                        saveStatus.classList.add('show');
                        setTimeout(() => {
                            saveStatus.classList.remove('show');
                        }, 3000);
                    }
                }
            };

            reader.readAsDataURL(file);
            this.value = '';
        });
    }
});
