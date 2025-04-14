/**
 * Project filter module for the portfolio website.
 * Handles filtering projects by tags and years, and displays them in a grid layout.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

import { projects } from './projects.js';
import { playClickSound, playHoverSound } from './audio.js';

// Create a container for the filtered projects grid
const filteredProjectsContainer = document.createElement('div');
filteredProjectsContainer.className = 'filtered-projects-grid';
filteredProjectsContainer.style.display = 'none';

// Insert the container after the project content container
const projectContentContainer = document.getElementById('project-content-container');
projectContentContainer.parentNode.insertBefore(filteredProjectsContainer, projectContentContainer.nextSibling);

// Add click handlers to tags and years
export function initProjectFilter() {
    // Get all tags and years from projects
    const allTags = new Set();
    const allYears = new Set();
    
    projects.forEach(project => {
        project.tags.forEach(tag => allTags.add(tag));
        allYears.add(project.date);
    });

    // Add click handlers to existing tags and years
    document.querySelectorAll('.project-tag, .project-date').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            playClickSound();
            const filterValue = element.textContent.trim();
            filterProjects(filterValue);
        });

        element.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });

    // Add click handler to sidebar links
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(link.getAttribute('data-index'), 10);
            // Scroll to just below the header
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            window.scrollTo({ top: headerHeight, behavior: 'smooth' });
            showProject(index);
            filteredProjectsContainer.style.display = 'none';
            projectContentContainer.style.display = 'block';
            window.history.replaceState(null, null, `#${projects[index].title.toLowerCase().replace(/\s+/g, '-')}`);
        });
    });
}

function filterProjects(filterValue) {
    // Hide the current project view
    projectContentContainer.style.display = 'none';
    
    // Show the filtered projects grid
    filteredProjectsContainer.style.display = 'grid';
    
    // Clear previous content
    filteredProjectsContainer.innerHTML = '';
    
    // Filter projects
    const filteredProjects = projects.filter(project => 
        project.tags.includes(filterValue) || project.date === filterValue
    );
    
    // Create and append project cards
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-card-image">
            <div class="project-card-content">
                <h3 class="project-card-title">${project.title}</h3>
                <div class="project-card-meta">
                    <div class="project-card-date">${project.date}</div>
                </div>
            </div>
        `;
        
        // Add click handler to view full project
        projectCard.addEventListener('click', () => {
            playClickSound(); // Play boom SFX
            const projectIndex = projects.findIndex(p => p.title === project.title);
            if (projectIndex !== -1) {
                // Scroll to just below the header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                showProject(projectIndex);
                filteredProjectsContainer.style.display = 'none';
                projectContentContainer.style.display = 'block';
            }
        });
        
        // Add hover sound effect
        projectCard.addEventListener('mouseenter', () => {
            playHoverSound();
        });
        
        filteredProjectsContainer.appendChild(projectCard);
    });
}

// Import and use the showProject function from projectLoader.js
import { showProject } from './projectLoader.js'; 