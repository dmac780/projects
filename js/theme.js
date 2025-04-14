/**
 * Theme handling module for the portfolio website.
 * Manages light/dark theme switching and persistence.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

import { playThemeToggleSound } from './audio.js';

const THEME_KEY = 'portfolio-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

function setTheme(theme) {
    if (theme === LIGHT_THEME) {
        document.documentElement.setAttribute('data-theme', LIGHT_THEME);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
}

function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || DARK_THEME;
}

export function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = getStoredTheme();
    
    // Apply initial theme
    setTheme(storedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        setTheme(newTheme);
        playThemeToggleSound(); // Play the click2.mp3 sound effect
    });
} 