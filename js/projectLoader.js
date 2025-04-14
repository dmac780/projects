/**
 * Project loader module for the portfolio website.
 * Handles the loading and navigation of projects.
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

// DOM elements
const projectsLinks = document.querySelector('.projects-links');
const projectContentContainer = document.getElementById('project-content-container');

// Import modules
import { playClickSound, playHoverSound } from './audio.js';
import { projects } from './projects.js';

// Current project index
let currentProjectIndex = 0;

// Populate project links
export function initProjects() {
  projects.forEach((project, index) => {
    // Create project link
    const projectLink = document.createElement('a');
    projectLink.className = 'project-link';
    projectLink.setAttribute('data-index', index);
    projectLink.textContent = project.title;
    projectLink.href = '#' + project.title.toLowerCase().replace(/\s+/g, '-');
    projectLink.style.animationDelay = `${index * 0.1}s`;
    projectLink.classList.add('animate-in');
    
    // Add hover sound effect
    projectLink.addEventListener('mouseenter', () => {
      playHoverSound();
    });
    
    projectLink.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      showProject(index);
    });
    
    projectsLinks.appendChild(projectLink);
    
    // Create project content
    const projectContent = document.createElement('div');
    projectContent.className = 'project-content';
    projectContent.id = `project-${index}`;
    
    // Add mobile title for project navigation context
    const mobileTitle = document.createElement('div');
    mobileTitle.className = 'mobile-project-title';
    mobileTitle.textContent = `Project ${index + 1} of ${projects.length}`;
    
    // Create mobile navigation controls
    const mobileNavControls = document.createElement('div');
    mobileNavControls.className = 'mobile-nav-controls';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'mobile-nav-btn prev-btn';
    prevBtn.innerHTML = '← Previous';
    prevBtn.addEventListener('click', () => {
      playClickSound();
      navigateProject(-1);
    });
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'mobile-nav-btn next-btn';
    nextBtn.innerHTML = 'Next →';
    nextBtn.addEventListener('click', () => {
      playClickSound();
      navigateProject(1);
    });
    
    mobileNavControls.appendChild(prevBtn);
    mobileNavControls.appendChild(nextBtn);
    
    // Main content
    projectContent.innerHTML = `
      <header class="project-header">
        <h2 class="project-detail-title">${project.title}</h2>
        <div class="project-meta">
          <div class="project-date">${project.date}</div>
          ${project.tags ? `
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </header>
      <img class="project-detail-image" src="${project.image}" alt="${project.title} image">
      <div class="project-detail-description">${project.description.replace(/\n\n/g, '<br><br>')}</div>
    `;
    
    // Add the mobile title and navigation controls
    projectContent.prepend(mobileTitle);
    projectContent.appendChild(mobileNavControls);
    
    projectContentContainer.appendChild(projectContent);
  });

  // Check URL hash on load
  const hash = window.location.hash;
  if (hash) {
    const projectTitle = hash.substring(1); // Remove the # character
    const projectIndex = projects.findIndex(p => 
      p.title.toLowerCase().replace(/\s+/g, '-') === projectTitle
    );
    
    if (projectIndex !== -1) {
      showProject(projectIndex);
    }
  } else {
    // Automatically load the first project if no hash is present
    showProject(0);
  }
}

// Navigate to next/previous project
function navigateProject(direction) {
  let newIndex = currentProjectIndex + direction;
  
  // Handle wrap-around
  if (newIndex < 0) {
    newIndex = projects.length - 1;
  } else if (newIndex >= projects.length) {
    newIndex = 0;
  }
  
  showProject(newIndex);
}

// Show project
export function showProject(index) {
  // Store current index
  currentProjectIndex = index;
  
  // Update active project link
  const projectLinks = document.querySelectorAll('.project-link');
  projectLinks.forEach(link => link.classList.remove('active', 'animate-in'));
  
  // Calculate delays based on distance from clicked item
  projectLinks.forEach((link, i) => {
    const distance = Math.abs(i - index);
    link.style.animationDelay = `${distance * 0.075}s`;
    // Remove and re-add the class to restart animation
    requestAnimationFrame(() => {
      link.classList.add('animate-in');
      if (i === index) {
        link.classList.add('active');
      }
    });
  });
  
  // Update active project content
  const projectContents = document.querySelectorAll('.project-content');
  projectContents.forEach(content => content.classList.remove('active'));
  const activeContent = projectContents[index];
  activeContent.classList.add('active');
  
  // Update URL hash
  const projectTitle = projects[index].title.toLowerCase().replace(/\s+/g, '-');
  window.history.replaceState(null, null, `#${projectTitle}`);
  
  // Handle scrolling behavior
  if (window.innerWidth <= 768) {
    // Mobile behavior - scroll to top
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('.main-content').scrollTop = 0;
  } else {
    // Desktop behavior - scroll project into view with offset
    const mainContent = document.querySelector('.main-content');
    const projectTop = activeContent.offsetTop - 50; // Add extra offset for better positioning
    mainContent.scrollTo({
      top: projectTop,
      behavior: 'smooth'
    });
  }
} 