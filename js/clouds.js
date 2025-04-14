/**
 * Cloud effect module for the portfolio website.
 * Handles the cloud effect animation on the imagination text.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

export function initClouds() {
    const imaginationSpan = document.querySelector('.imagination-text');
    if (!imaginationSpan) return;
    
    // Animation timing constants
    const animationDuration = 6000; // 6s animation
    const animationDelay = 500; // 0.5s delay
    const totalDuration = animationDuration + animationDelay + 100; // add a small buffer
    const pauseBetweenAnimations = 6000; // 6s between animations
    
    // Function to trigger the cloud effect
    function triggerCloudEffect() {
        imaginationSpan.classList.add('cloud-active');
        
        // Reset after animation completes
        setTimeout(() => {
            imaginationSpan.classList.remove('cloud-active');
            
            // Schedule next appearance
            setTimeout(triggerCloudEffect, pauseBetweenAnimations);
        }, totalDuration);
    }
    
    // Start the effect after a short delay (1s)
    setTimeout(triggerCloudEffect, 1000);
}