/* ==========================================
   TIMELINE EDITOR (LocalStorage & Photo Uploads)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Load saved content and photos
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const heading = item.querySelector('.timeline-heading');
        const text = item.querySelector('.timeline-text');
        const imgPlaceholder = item.querySelector('.timeline-img-placeholder');

        // 1. Text Content
        const savedHeading = localStorage.getItem(`timeline-heading-${index}`);
        if (savedHeading) heading.innerHTML = savedHeading;

        const savedText = localStorage.getItem(`timeline-text-${index}`);
        if (savedText) text.innerHTML = savedText;

        // Save on input
        heading.addEventListener('input', () => {
            localStorage.setItem(`timeline-heading-${index}`, heading.innerHTML);
        });

        text.addEventListener('input', () => {
            localStorage.setItem(`timeline-text-${index}`, text.innerHTML);
        });

        // 2. Photo Uploads
        const fileInput = document.getElementById('timelineUploadInput');

        // Load saved image
        const savedImage = localStorage.getItem(`timeline-img-${index}`);
        if (savedImage) {
            imgPlaceholder.style.backgroundImage = `url(${savedImage})`;
            imgPlaceholder.textContent = ''; // Hide the placeholder text
        }

        // Handle click to upload
        imgPlaceholder.addEventListener('click', () => {
            // Temporarily store the active index so the input knows where to save
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

            reader.onload = function (event) {
                const base64String = event.target.result;

                // Find the right placeholder and set the image
                const items = document.querySelectorAll('.timeline-item');
                const targetItem = items[activeIndex];
                const placeholder = targetItem.querySelector('.timeline-img-placeholder');

                placeholder.style.backgroundImage = `url(${base64String})`;
                placeholder.textContent = ''; // Hide text

                // Save to localStorage
                localStorage.setItem(`timeline-img-${activeIndex}`, base64String);
            };

            reader.readAsDataURL(file);

            // Reset input so the same file can be selected again if needed
            this.value = '';
        });
    }
});
