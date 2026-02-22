/* ==========================================
   EDIT TOGGLE - Hidden Lock/Unlock System (Firebase RTDB)
   Password Protected: 3565-78
   ========================================== */

(function () {
    let editMode = false;

    // Create the hidden toggle button (bottom-left, tiny & subtle)
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'editToggleBtn';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        z-index: 9999;
        opacity: 0.15;
        transition: opacity 0.3s ease;
        user-select: none;
        background: transparent;
    `;

    toggleBtn.addEventListener('mouseenter', () => { toggleBtn.style.opacity = '0.6'; });
    toggleBtn.addEventListener('mouseleave', () => { toggleBtn.style.opacity = '0.15'; });

    const EDIT_PASSWORD = '3565-78';

    toggleBtn.addEventListener('click', () => {
        if (editMode) {
            // Lock directly (no password needed to lock)
            editMode = false;
            dbSave('love-site/settings/editMode', false);
            applyEditMode();
        } else {
            // Show password popup to unlock
            showPasswordPopup();
        }
    });

    // Password Popup
    function showPasswordPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'editPasswordOverlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10,5,8,0.9);
            z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            animation: authFadeIn 0.3s ease;
        `;

        overlay.innerHTML = `
            <div style="
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,143,171,0.2);
                border-radius: 24px;
                padding: 2.5rem;
                width: 90%; max-width: 360px;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                text-align: center;
                animation: authSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
            ">
                <div style="font-size: 3rem; margin-bottom: 0.8rem;">🔐</div>
                <h2 style="
                    font-family: 'Dancing Script', cursive;
                    font-size: 1.8rem;
                    color: #ff8fab;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 0 15px rgba(255,143,171,0.3);
                ">Enter Password</h2>
                <p style="
                    font-family: 'Quicksand', sans-serif;
                    font-size: 0.9rem;
                    color: #f5c6d0;
                    opacity: 0.7;
                    margin-bottom: 1.5rem;
                ">Enter admin password to unlock editing</p>
                <input type="password" id="editPasswordInput" placeholder="Password..." style="
                    width: 100%; padding: 12px 18px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,143,171,0.2);
                    border-radius: 12px;
                    color: white;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 1.1rem;
                    outline: none;
                    text-align: center;
                    letter-spacing: 3px;
                    box-sizing: border-box;
                ">
                <div style="display: flex; gap: 1rem; margin-top: 1.2rem;">
                    <button id="editPassCancel" style="
                        flex: 1; padding: 10px;
                        background: transparent;
                        border: 1px solid rgba(255,143,171,0.3);
                        border-radius: 12px;
                        color: #f5c6d0;
                        font-family: 'Quicksand', sans-serif;
                        font-size: 1rem;
                        cursor: pointer;
                    ">Cancel</button>
                    <button id="editPassSubmit" style="
                        flex: 1; padding: 10px;
                        background: linear-gradient(135deg, #c76b8f, #ff8fab);
                        border: none;
                        border-radius: 12px;
                        color: white;
                        font-family: 'Quicksand', sans-serif;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(255,143,171,0.4);
                    ">Unlock 🔓</button>
                </div>
                <p id="editPassError" style="
                    font-family: 'Quicksand', sans-serif;
                    color: #ff6b6b;
                    font-size: 0.85rem;
                    margin-top: 0.8rem;
                    min-height: 1.2rem;
                    opacity: 0;
                    transition: opacity 0.3s;
                ">Wrong password! ❌</p>
            </div>
        `;

        document.body.appendChild(overlay);

        const input = document.getElementById('editPasswordInput');
        const submitBtn = document.getElementById('editPassSubmit');
        const cancelBtn = document.getElementById('editPassCancel');
        const errorMsg = document.getElementById('editPassError');

        setTimeout(() => input.focus(), 300);

        function tryUnlock() {
            if (input.value.trim() === EDIT_PASSWORD) {
                editMode = true;
                dbSave('love-site/settings/editMode', true);
                applyEditMode();

                overlay.style.transition = 'opacity 0.5s ease';
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            } else {
                errorMsg.style.opacity = '1';
                input.style.borderColor = '#ff6b6b';
                setTimeout(() => {
                    errorMsg.style.opacity = '0';
                    input.style.borderColor = 'rgba(255,143,171,0.2)';
                }, 2000);
            }
        }

        submitBtn.addEventListener('click', tryUnlock);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
        cancelBtn.addEventListener('click', () => {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        });
    }

    // Apply edit mode based on current state
    function applyEditMode() {
        const editableElements = document.querySelectorAll('[contenteditable]');
        editableElements.forEach(el => {
            if (editMode) {
                el.setAttribute('contenteditable', 'true');
                el.style.cursor = 'text';
            } else {
                el.setAttribute('contenteditable', 'false');
                el.style.cursor = 'default';
            }
        });

        // Photo placeholders — hide empty ones when locked, show all when unlocked
        const imgPlaceholders = document.querySelectorAll('.timeline-img-placeholder');
        imgPlaceholders.forEach(el => {
            if (editMode) {
                el.style.display = '';
                el.style.pointerEvents = 'auto';
                el.style.cursor = 'pointer';
            } else {
                // Hide only if no photo uploaded
                const hasPhoto = el.classList.contains('has-image') || el.querySelector('img') || (el.style.backgroundImage && el.style.backgroundImage !== '' && el.style.backgroundImage !== 'none');
                el.style.display = hasPhoto ? '' : 'none';
                el.style.pointerEvents = 'none';
                el.style.cursor = 'default';
            }
        });

        const memPlaceholders = document.querySelectorAll('.memory-placeholder-img');
        memPlaceholders.forEach(el => {
            if (editMode) {
                el.style.display = '';
                el.style.pointerEvents = 'auto';
                el.style.cursor = 'pointer';
            } else {
                const hasPhoto = el.classList.contains('has-image') || el.querySelector('img') || (el.style.backgroundImage && el.style.backgroundImage !== '' && el.style.backgroundImage !== 'none');
                el.style.display = hasPhoto ? '' : 'none';
                el.style.pointerEvents = 'none';
                el.style.cursor = 'default';
            }
        });

        toggleBtn.textContent = editMode ? '🔓' : '🔒';
    }

    // Init
    function init() {
        document.body.appendChild(toggleBtn);
        dbLoad('love-site/settings/editMode').then(saved => {
            if (saved !== null) editMode = saved;
            applyEditMode();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
