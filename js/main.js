/**
 * Main script for the portfolio website.
 * Initializes all modules and handles DOM content loaded event.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

import { initAudio } from './audio.js';
import { initProjects } from './projectLoader.js';
import { initMobileMenu } from './mobileMenu.js';
import { initClouds } from './clouds.js';
import { initScroll } from './scroll.js';
import { initTheme } from './theme.js';
import { initProjectFilter } from './projectFilter.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProjects();
  initClouds();
  initScroll();
  initAudio();
  initTheme();
  initProjectFilter();
});