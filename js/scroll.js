/**
 * Scroll module for the portfolio website.
 * Handles the scroll event and header visibility.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

let lastScrollTop = 0;
const header = document.querySelector('.site-header');
const scrollThreshold = 50; // minimum scroll amount before hiding/showing
let ticking = false;

function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Only apply on mobile
            if (window.innerWidth <= 768) {
                if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                }
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            ticking = false;
        });
        ticking = true;
    }
}

export function initScroll() {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize events to ensure proper behavior when switching between mobile and desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            header.classList.remove('header-hidden');
        }
    }, { passive: true });
} 