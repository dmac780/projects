/**
 * Audio setup module for the portfolio website.
 * Handles audio playback and management.
 * custom clipping prevention for audio sounds
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

// Audio setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let sfxBuffer = null;
let hoverSfxBuffer = null;  // New buffer for hover sound
let themeToggleSfxBuffer = null;  // New buffer for theme toggle sound
let bgmBuffer = null;
let bgmSource = null;
let masterGainNode = null;
let sfxGainNode = null;
let hoverSfxGainNode = null;
let themeToggleSfxGainNode = null;  // New gain node for theme toggle sound
let bgmGainNode = null;
let isMuted = false;

// Create gain nodes
masterGainNode = audioContext.createGain();
sfxGainNode = audioContext.createGain();
hoverSfxGainNode = audioContext.createGain();
themeToggleSfxGainNode = audioContext.createGain();  // Create theme toggle gain node
bgmGainNode = audioContext.createGain();

// Set initial volumes
sfxGainNode.gain.value = 1.2;
hoverSfxGainNode.gain.value = 0.2;
themeToggleSfxGainNode.gain.value = 0.5;
bgmGainNode.gain.value = 0.3;

// Connect nodes to master
sfxGainNode.connect(masterGainNode);
hoverSfxGainNode.connect(masterGainNode);
themeToggleSfxGainNode.connect(masterGainNode);
bgmGainNode.connect(masterGainNode);
masterGainNode.connect(audioContext.destination);

// Load and decode sound effect
fetch('assets/boom2.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(buffer => {
    sfxBuffer = buffer;
  })
  .catch(e => console.error('Error loading SFX:', e));

// Load and decode hover sound effect
fetch('assets/click.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(buffer => {
    hoverSfxBuffer = buffer;
  })
  .catch(e => console.error('Error loading hover SFX:', e));

// Load and decode background music
fetch('assets/ambient.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(buffer => {
    bgmBuffer = buffer;
    // Start BGM on any interaction
    const startAudioOnInteraction = () => {
      startBGM();
      // Remove all event listeners once BGM starts
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('mousemove', startAudioOnInteraction);
      document.removeEventListener('scroll', startAudioOnInteraction);
      document.removeEventListener('touchstart', startAudioOnInteraction);
    };

    // Add listeners for various interactions
    document.addEventListener('click', startAudioOnInteraction, { once: true });
    document.addEventListener('mousemove', startAudioOnInteraction, { once: true });
    document.addEventListener('scroll', startAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
  })
  .catch(e => console.error('Error loading BGM:', e));

// Load and decode theme toggle sound effect
fetch('assets/click2.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(buffer => {
    themeToggleSfxBuffer = buffer;
  })
  .catch(e => console.error('Error loading theme toggle SFX:', e));

// Function to play sound with anti-clipping
export function playClickSound() {
  if (!sfxBuffer || audioContext.state === 'suspended') return;
  
  // Create new buffer source and gain node
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  source.buffer = sfxBuffer;
  source.connect(gainNode);
  gainNode.connect(sfxGainNode);

  // Set volume with improved attack curve
  const now = audioContext.currentTime;
  const attackTime = 0.015; // 15ms attack time
  const holdTime = 0.02;    // 20ms hold time
  const releaseTime = sfxBuffer.duration - (attackTime + holdTime);
  
  // Start at near-zero to prevent click
  gainNode.gain.setValueAtTime(0.001, now);
  // Exponential ramp for smoother attack on low frequencies
  gainNode.gain.exponentialRampToValueAtTime(0.5, now + attackTime);
  // Hold at peak
  gainNode.gain.setValueAtTime(0.5, now + attackTime + holdTime);
  // Linear release
  gainNode.gain.linearRampToValueAtTime(0, now + sfxBuffer.duration);
  
  // Start playback
  source.start(0);
}

function startBGM() {
  if (!bgmBuffer || audioContext.state === 'suspended') return;
  
  try {
    // Stop existing BGM if any
    if (bgmSource) {
      bgmSource.stop();
      bgmSource.disconnect();
    }
    
    // Create and setup new BGM source
    bgmSource = audioContext.createBufferSource();
    bgmSource.buffer = bgmBuffer;
    bgmSource.loop = true;
    bgmSource.connect(bgmGainNode);
    
    // Start playback
    bgmSource.start(0);
  } catch (error) {
    console.warn('Error starting BGM:', error);
  }
}

// Function to play hover sound
export function playHoverSound() {
  if (!hoverSfxBuffer || audioContext.state === 'suspended') return;
  
  // Create new buffer source and gain node
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  source.buffer = hoverSfxBuffer;
  source.connect(hoverSfxGainNode);

  // Set volume and prevent clipping
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + hoverSfxBuffer.duration);
  
  // Start playback
  source.start(0);
}

// Function to play theme toggle sound
export function playThemeToggleSound() {
  if (!themeToggleSfxBuffer || audioContext.state === 'suspended') return;
  
  // Create new buffer source and gain node
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  source.buffer = themeToggleSfxBuffer;
  source.connect(themeToggleSfxGainNode);

  // Set volume and prevent clipping
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + themeToggleSfxBuffer.duration);
  
  // Start playback
  source.start(0);
}

export function toggleMute() {
  if (themeToggleSfxBuffer && audioContext.state !== 'suspended') {
    // Create new buffer source and gain node for the mute toggle sound
    const source = audioContext.createBufferSource();
    source.buffer = themeToggleSfxBuffer;
    source.connect(themeToggleSfxGainNode);
    source.start(0);
  }
  
  isMuted = !isMuted;
  masterGainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
  return isMuted;
}

// Initialize audio system
export function initAudio() {
  const muteButton = document.getElementById('muteButton');
  const footerMuteButton = document.getElementById('footerMuteButton');
  
  function updateMuteButtons(muted) {
    if (muteButton) muteButton.classList.toggle('muted', muted);
    if (footerMuteButton) footerMuteButton.classList.toggle('muted', muted);
  }

  // Function to ensure audio context is running
  async function ensureAudioContext() {
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
        return true;
      } catch (error) {
        console.warn('Could not resume audio context:', error);
        return false;
      }
    }
    return true;
  }

  // Handle user interaction to start audio
  async function handleInteraction() {
    const success = await ensureAudioContext();
    if (success && !bgmSource && bgmBuffer) {
      startBGM();
    }
  }

  // Add click handlers for mute buttons
  if (muteButton) {
    muteButton.addEventListener('click', async () => {
      await handleInteraction();
      const isMuted = toggleMute();
      updateMuteButtons(isMuted);
    });
  }

  if (footerMuteButton) {
    footerMuteButton.addEventListener('click', async () => {
      await handleInteraction();
      const isMuted = toggleMute();
      updateMuteButtons(isMuted);
    });
  }

  // Add interaction listeners for audio context resume
  const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
  const handleFirstInteraction = async () => {
    await handleInteraction();
    // Remove listeners after first successful interaction
    interactionEvents.forEach(event => {
      document.removeEventListener(event, handleFirstInteraction);
    });
  };

  interactionEvents.forEach(event => {
    document.addEventListener(event, handleFirstInteraction);
  });

  // Initialize mute state
  updateMuteButtons(isMuted);
}