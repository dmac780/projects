/**
 * Mobile menu module for the portfolio website.
 * Handles the mobile menu toggle and close functionality.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

const sidebar = document.querySelector('.sidebar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

export function initMobileMenu() {
  // Mobile menu toggle functionality
  mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mobileMenuToggle.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  // Close mobile menu when clicking outside or on a project
  document.addEventListener('click', (e) => {
    // If clicking on a project link, close the menu
    if (e.target.classList.contains('project-link') && window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      mobileMenuToggle.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
    
    // If clicking outside the sidebar when it's open, close it
    if (!sidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target) && 
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      mobileMenuToggle.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
} 