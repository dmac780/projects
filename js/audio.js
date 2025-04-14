/**
 * Audio setup module for the portfolio website.
 * Handles audio playback and management.
 * custom clipping prevention for audio sounds
 * 
 * @author DMAC780
 * @version 1.0.0
 * @since 2025-04-11
 */

// Audio context and nodes
let audioContext = null;
let sfxBuffer = null;
let hoverSfxBuffer = null;
let themeToggleSfxBuffer = null;
let bgmBuffer = null;
let bgmSource = null;
let masterGainNode = null;
let sfxGainNode = null;
let hoverSfxGainNode = null;
let themeToggleSfxGainNode = null;
let bgmGainNode = null;
let isMuted = false;
let bgmInitialized = false;

// Initialize audio system only after user interaction
async function initializeAudioContext() {
  if (audioContext) return; // Already initialized

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create gain nodes
  masterGainNode = audioContext.createGain();
  sfxGainNode = audioContext.createGain();
  hoverSfxGainNode = audioContext.createGain();
  themeToggleSfxGainNode = audioContext.createGain();
  bgmGainNode = audioContext.createGain();

  // Set initial volumes
  sfxGainNode.gain.value = 1.2;
  hoverSfxGainNode.gain.value = 0.05;
  themeToggleSfxGainNode.gain.value = 0.5;
  bgmGainNode.gain.value = 0.3;

  // Connect nodes to master
  sfxGainNode.connect(masterGainNode);
  hoverSfxGainNode.connect(masterGainNode);
  themeToggleSfxGainNode.connect(masterGainNode);
  bgmGainNode.connect(masterGainNode);
  masterGainNode.connect(audioContext.destination);

  // Load all audio files
  await Promise.all([
    // Load click sound
    fetch('assets/boom2.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => { sfxBuffer = buffer; })
      .catch(e => console.error('Error loading SFX:', e)),

    // Load hover sound
    fetch('assets/click.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => { hoverSfxBuffer = buffer; })
      .catch(e => console.error('Error loading hover SFX:', e)),

    // Load background music
    fetch('assets/ambient.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => { bgmBuffer = buffer; })
      .catch(e => console.error('Error loading BGM:', e)),

    // Load theme toggle sound
    fetch('assets/click2.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => { themeToggleSfxBuffer = buffer; })
      .catch(e => console.error('Error loading theme toggle SFX:', e))
  ]);

  // Start BGM after everything is loaded
  startBGM();
}

function startBGM() {
  if (!bgmBuffer || !audioContext || audioContext.state === 'suspended') return;
  
  try {
    // Only create and start BGM if not already initialized
    if (!bgmInitialized) {
      bgmSource = audioContext.createBufferSource();
      bgmSource.buffer = bgmBuffer;
      bgmSource.loop = true;
      bgmSource.connect(bgmGainNode);
      bgmSource.start(0);
      bgmInitialized = true;
    }
  } catch (error) {
    console.warn('Error starting BGM:', error);
    bgmInitialized = false;
  }
}

// Function to play sound with anti-clipping
export function playClickSound() {
  if (!audioContext || !sfxBuffer || audioContext.state === 'suspended') return;
  
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  source.buffer = sfxBuffer;
  source.connect(gainNode);
  gainNode.connect(sfxGainNode);

  const now = audioContext.currentTime;
  const attackTime = 0.015;
  const holdTime = 0.02;
  const releaseTime = sfxBuffer.duration - (attackTime + holdTime);
  
  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.5, now + attackTime);
  gainNode.gain.setValueAtTime(0.5, now + attackTime + holdTime);
  gainNode.gain.linearRampToValueAtTime(0, now + sfxBuffer.duration);
  
  source.start(0);
}

// Function to play hover sound
export function playHoverSound() {
  if (!audioContext || !hoverSfxBuffer || audioContext.state === 'suspended') return;
  
  const source = audioContext.createBufferSource();
  source.buffer = hoverSfxBuffer;
  source.connect(hoverSfxGainNode);
  source.start(0);
}

// Function to play theme toggle sound
export function playThemeToggleSound() {
  if (!audioContext || !themeToggleSfxBuffer || audioContext.state === 'suspended') return;
  
  const source = audioContext.createBufferSource();
  source.buffer = themeToggleSfxBuffer;
  source.connect(themeToggleSfxGainNode);
  source.start(0);
}

export function toggleMute() {
  if (!audioContext) return false;
  
  playThemeToggleSound();
  
  isMuted = !isMuted;
  masterGainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
  
  if (!isMuted && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
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

  // Handle user interaction to initialize audio
  async function handleFirstInteraction() {
    await initializeAudioContext();
    updateMuteButtons(isMuted);
  }

  // Add click handlers for mute buttons
  if (muteButton) {
    muteButton.addEventListener('click', async () => {
      await handleFirstInteraction();
      const isMuted = toggleMute();
      updateMuteButtons(isMuted);
    });
  }

  if (footerMuteButton) {
    footerMuteButton.addEventListener('click', async () => {
      await handleFirstInteraction();
      const isMuted = toggleMute();
      updateMuteButtons(isMuted);
    });
  }

  // Add interaction listeners for audio initialization
  const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
  const handleInteraction = async () => {
    await handleFirstInteraction();
    // Remove listeners after first successful interaction
    interactionEvents.forEach(event => {
      document.removeEventListener(event, handleInteraction);
    });
  };

  interactionEvents.forEach(event => {
    document.addEventListener(event, handleInteraction, { once: true });
  });

  // Initialize mute state
  updateMuteButtons(isMuted);
}