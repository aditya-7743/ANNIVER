/* ==========================================
   TIMELINE EDITOR (Firebase RTDB — Live Sync)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Track which fields the user is currently editing (to avoid overwriting while typing)
    const editingFields = new Set();

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const heading = item.querySelector('.timeline-heading');
        const text = item.querySelector('.timeline-text');
        const imgPlaceholder = item.querySelector('.timeline-img-placeholder');

        // 1. Live-sync Text Content from Firebase
        dbListen(`love-site/timeline/heading-${index}`, (val) => {
            if (val && !editingFields.has(`heading-${index}`)) {
                heading.innerHTML = val;
            }
        });

        dbListen(`love-site/timeline/text-${index}`, (val) => {
            if (val && !editingFields.has(`text-${index}`)) {
                text.innerHTML = val;
            }
        });

        // Save on input (debounced)
        let headingTimer, textTimer;

        heading.addEventListener('focus', () => editingFields.add(`heading-${index}`));
        heading.addEventListener('blur', () => editingFields.delete(`heading-${index}`));

        heading.addEventListener('input', () => {
            clearTimeout(headingTimer);
            headingTimer = setTimeout(() => {
                dbSave(`love-site/timeline/heading-${index}`, heading.innerHTML);
            }, 500);
        });

        text.addEventListener('focus', () => editingFields.add(`text-${index}`));
        text.addEventListener('blur', () => editingFields.delete(`text-${index}`));

        text.addEventListener('input', () => {
            clearTimeout(textTimer);
            textTimer = setTimeout(() => {
                dbSave(`love-site/timeline/text-${index}`, text.innerHTML);
            }, 500);
        });

        // 2. Live-sync Photo from Firebase
        const fileInput = document.getElementById('timelineUploadInput');

        dbListen(`love-site/timeline/img-${index}`, (savedImage) => {
            if (savedImage) {
                imgPlaceholder.style.backgroundImage = `url(${savedImage})`;
                imgPlaceholder.classList.add('has-image');
                imgPlaceholder.textContent = '';
            }
        });

        // Handle click to upload
        imgPlaceholder.addEventListener('click', () => {
            fileInput.dataset.activeIndex = index;
            fileInput.click();
        });
    });

    // Handle the actual file selection
    const fileInput = document.getElementById('timelineUploadInput');
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const activeIndex = this.dataset.activeIndex;
            if (activeIndex === undefined) return;

            const reader = new FileReader();

            reader.onload = async function (event) {
                const base64String = event.target.result;
                const compressed = await compressImage(base64String, 1200, 0.85);

                const items = document.querySelectorAll('.timeline-item');
                const targetItem = items[activeIndex];
                const placeholder = targetItem.querySelector('.timeline-img-placeholder');

                placeholder.style.backgroundImage = `url(${compressed})`;
                placeholder.classList.add('has-image');
                placeholder.textContent = '';

                dbSave(`love-site/timeline/img-${activeIndex}`, compressed);
            };

            reader.readAsDataURL(file);
            this.value = '';
        });
    }
});
