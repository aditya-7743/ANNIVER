/**
 * Slideshow logic for memories.html
 */

let currentSlide = 0;
let slides = document.querySelectorAll('.slide');
let dots = document.querySelectorAll('.dot');
let isTransitioning = false;

function initSlides() {
    slides = document.querySelectorAll('.slide');

    // Auto-generate dots to match slide count
    const dotsContainer = document.getElementById('slideDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.onclick = () => goToSlide(index);
            dotsContainer.appendChild(dot);
        });
    }

    dots = document.querySelectorAll('.dot');

    // Set initial classes for animations
    if (slides.length > 0) {
        updateClasses(currentSlide, -1);
    }
}

function updateClasses(targetIndex, currentIndex) {
    slides.forEach((slide, i) => {
        // Reset all classes
        slide.className = 'slide';

        if (i === targetIndex) {
            slide.classList.add('active');
        } else if (i < targetIndex || (currentIndex === slides.length - 1 && targetIndex === 0 && currentIndex !== -1)) {
            // Previous slides (or wrapping around from last to first)
            slide.classList.add('prev');
        } else {
            // Next slides
            slide.classList.add('next');
        }
    });

    dots.forEach((dot, i) => {
        if (i === targetIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function createHeartAnimation() {
    // Create little floating hearts when changing slides
    const container = document.getElementById('memoriesSlideshow');
    if (!container) return;

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💕', '💗', '💓'][Math.floor(Math.random() * 4)];
            heart.style.position = 'absolute';
            heart.style.left = (Math.random() * 80 + 10) + '%';
            heart.style.bottom = '-20px';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '10';
            heart.style.animation = `heartFloat ${Math.random() * 2 + 2}s ease-in forwards`;
            heart.style.opacity = '0';

            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 150);
    }
}

// Add the keyframe style if it doesn't exist
if (!document.getElementById('slideshow-hearts-style')) {
    const style = document.createElement('style');
    style.id = 'slideshow-hearts-style';
    style.textContent = `
        @keyframes heartFloat {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(-300px) scale(1.5) rotate(${Math.random() * 40 - 20}deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

window.goToSlide = function (index) {
    if (isTransitioning || index === currentSlide || index < 0 || index >= slides.length) return;

    isTransitioning = true;
    const previousIndex = currentSlide;
    currentSlide = index;

    updateClasses(currentSlide, previousIndex);
    createHeartAnimation();

    setTimeout(() => {
        isTransitioning = false;
    }, 800); // Wait for CSS transition
}

window.nextSlide = function () {
    if (isTransitioning) return;
    let next = currentSlide + 1;
    if (next >= slides.length) {
        showGrandFinale();
        return; // Don't loop back to start just yet
    }
    goToSlide(next);
}

window.showGrandFinale = function () {
    const finale = document.getElementById('grandFinale');
    if (finale) {
        finale.classList.add('show');
        // Let's also trigger an explosion of hearts for the grand finale
        for (let i = 0; i < 30; i++) {
            createHeartAnimation();
        }
    }
}

window.closeGrandFinale = function () {
    const finale = document.getElementById('grandFinale');
    if (finale) {
        finale.classList.remove('show');
        // Loop back to the very first slide as they exist the finale
        setTimeout(() => {
            goToSlide(0);
        }, 800);
    }
}

window.showUltimateFinale = function () {
    const grandFinale = document.getElementById('grandFinale');
    const ultimateFinale = document.getElementById('ultimateFinale');

    if (grandFinale) {
        grandFinale.classList.remove('show');
    }

    if (ultimateFinale) {
        // slight delay so the first one fades before the second begins
        setTimeout(() => {
            ultimateFinale.classList.add('show');
            for (let i = 0; i < 40; i++) {
                createHeartAnimation();
            }
        }, 800);
    }
}

window.closeUltimateFinale = function () {
    const ultimateFinale = document.getElementById('ultimateFinale');
    if (ultimateFinale) {
        ultimateFinale.classList.remove('show');
        setTimeout(() => {
            goToSlide(0);
        }, 800);
    }
}

window.prevSlide = function () {
    if (isTransitioning) return;
    let prev = currentSlide - 1;
    if (prev < 0) {
        prev = slides.length - 1; // Loop to end
    }
    goToSlide(prev);
}

// Init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlides();
});

// If the script runs after DOM loaded (like via dynamic load)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSlides();
}
