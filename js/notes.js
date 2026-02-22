/**
 * Logic for Live Editing the Memories Slides
 */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');

    slides.forEach((slide, index) => {
        const editableElements = slide.querySelectorAll('[contenteditable="true"]');
        const saveStatus = slide.querySelector('.save-status');
        const storageKeyPrefix = `ourLoveMemory_${index}_`;

        let timeoutId;

        editableElements.forEach((el, elIndex) => {
            const elKey = `${storageKeyPrefix}${elIndex}`;

            // 1. Load saved content on initialization
            const savedContent = localStorage.getItem(elKey);
            if (savedContent) {
                el.innerText = savedContent;
            }

            // 2. Auto-save logic on input
            el.addEventListener('input', () => {
                clearTimeout(timeoutId);
                if (saveStatus) saveStatus.classList.remove('show');

                timeoutId = setTimeout(() => {
                    localStorage.setItem(elKey, el.innerText);

                    if (saveStatus) {
                        saveStatus.classList.add('show');
                        setTimeout(() => {
                            saveStatus.classList.remove('show');
                        }, 3000);
                    }
                }, 1000);
            });

            // 3. Prevent keystrokes (like arrows) inside editable elements from triggering slide changes
            el.addEventListener('keydown', (e) => {
                e.stopPropagation();
            });

            // Ensure pasting text doesn't carry over weird HTML styles
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });

        // --- Live Photo Upload Logic ---
        const placeholderImg = slide.querySelector('.memory-placeholder-img');
        const photoUploadInput = document.getElementById('photoUploadInput');
        const photoStorageKey = `ourLovePhoto_${index}`;

        if (placeholderImg && photoUploadInput) {
            // 4. Load saved photo on initialization
            const savedPhoto = localStorage.getItem(photoStorageKey);
            if (savedPhoto) {
                placeholderImg.style.backgroundImage = 'none';
                placeholderImg.classList.add('has-image');
                placeholderImg.innerHTML = `<img src="${savedPhoto}" alt="Memory photo">`;
            }

            // 5. Click placeholder to trigger file input
            placeholderImg.addEventListener('click', () => {
                // We use a global file input, so we need to store which slide triggered it
                window.currentPlaceholderTarget = placeholderImg;
                window.currentPhotoStorageKey = photoStorageKey;
                window.currentSaveStatus = saveStatus;

                photoUploadInput.click();
            });
        }
    });

    // 6. Handle the actual file selection for photos globally
    const photoUploadInput = document.getElementById('photoUploadInput');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (event) {
                const base64String = event.target.result;
                const targetPlaceholder = window.currentPlaceholderTarget;
                const storageKey = window.currentPhotoStorageKey;
                const saveStatus = window.currentSaveStatus;

                if (targetPlaceholder && storageKey) {
                    // Update UI
                    targetPlaceholder.style.backgroundImage = 'none';
                    targetPlaceholder.classList.add('has-image');
                    targetPlaceholder.innerHTML = `<img src="${base64String}" alt="Memory photo">`;

                    // Save to local storage
                    try {
                        localStorage.setItem(storageKey, base64String);
                        if (saveStatus) {
                            saveStatus.classList.add('show');
                            setTimeout(() => {
                                saveStatus.classList.remove('show');
                            }, 3000);
                        }
                    } catch (e) {
                        console.error("Local storage might be full!", e);
                        alert("Could not save photo. It might be too large for local browser storage.");
                    }
                }
            };

            reader.readAsDataURL(file);

            // Reset input so the same file could be selected again if needed
            this.value = '';
        });
    }
});
