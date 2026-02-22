/* ==========================================
   AUTHENTICATION - Login Gate
   ========================================== */

(function () {
    // Check if already logged in this session
    if (sessionStorage.getItem('love-site-auth') === 'true') {
        return; // Already authenticated, skip
    }

    // Block the page content
    document.body.style.overflow = 'hidden';

    // Create the overlay
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.id = 'authOverlay';
    overlay.innerHTML = `
        <div class="auth-card">
            <div class="auth-lock-icon">💝</div>
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Enter your credentials to continue 💕</p>
            
            <div class="auth-input-group">
                <label class="auth-label">Username</label>
                <input type="text" class="auth-input" id="authUsername" placeholder="Enter username..." autocomplete="off">
            </div>
            
            <div class="auth-input-group">
                <label class="auth-label">Password</label>
                <input type="password" class="auth-input" id="authPassword" placeholder="Enter password...">
            </div>
            
            <button class="auth-login-btn" id="authLoginBtn">Login 💖</button>
            <div class="auth-error" id="authError">Wrong username or password! 😢</div>
        </div>
    `;

    // Insert overlay as the first child of body
    document.body.insertBefore(overlay, document.body.firstChild);

    // Credentials
    const VALID_USERNAME = 'ADITYA';
    const VALID_PASSWORD = '27022000';

    // Login handler
    function attemptLogin() {
        const username = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const errorEl = document.getElementById('authError');

        if (username.toUpperCase() === VALID_USERNAME && password === VALID_PASSWORD) {
            // Success!
            sessionStorage.setItem('love-site-auth', 'true');

            // Beautiful exit animation
            overlay.style.transition = 'opacity 0.8s ease';
            overlay.style.opacity = '0';

            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 800);
        } else {
            // Error
            errorEl.classList.remove('show');
            void errorEl.offsetWidth; // trigger reflow
            errorEl.classList.add('show');
        }
    }

    // Event listeners (after DOM is ready)
    function attachListeners() {
        document.getElementById('authLoginBtn').addEventListener('click', attemptLogin);

        // Allow Enter key to submit
        document.getElementById('authPassword').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') attemptLogin();
        });

        document.getElementById('authUsername').addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                document.getElementById('authPassword').focus();
            }
        });

        // Auto-focus username field
        setTimeout(() => {
            document.getElementById('authUsername').focus();
        }, 500);
    }

    // Attach listeners when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachListeners);
    } else {
        attachListeners();
    }
})();
