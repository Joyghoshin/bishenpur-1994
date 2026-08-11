const viewport = document.getElementById('viewport');
const img = document.getElementById('bg-image');
const playBtn = document.getElementById('playBtn');
const bgMusic = document.getElementById('bgMusic');

// ===== Your two songs =====
const songs = [
  "song1.mp3",
  "song2.mp3"
];

let currentSongIndex = 0;
let isPlaying = false;

// Load the first song
bgMusic.src = songs[currentSongIndex];

// When one song ends → play the next one (loop)
bgMusic.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  bgMusic.src = songs[currentSongIndex];
  bgMusic.play();
});

// Play / Pause button
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    playBtn.textContent = "Play";
  } else {
    bgMusic.play();
    playBtn.textContent = "Pause";
  }
  isPlaying = !isPlaying;
});

// ===== Drag / Pan Logic =====
let isDragging = false;
let startX, startY;
let currentX = 0;
let currentY = 0;

function startDrag(e) {
  isDragging = true;
  img.style.animationPlayState = 'paused';
  const point = e.touches ? e.touches[0] : e;
  startX = point.clientX - currentX;
  startY = point.clientY - currentY;
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  const point = e.touches ? e.touches[0] : e;
  currentX = point.clientX - startX;
  currentY = point.clientY - startY;

  const maxX = 80;
  const maxY = 50;
  currentX = Math.max(Math.min(currentX, maxX), -maxX);
  currentY = Math.max(Math.min(currentY, maxY), -maxY);

  img.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(1.01)`;
}

function endDrag() {
  isDragging = false;
  img.style.animationPlayState = 'running';
}

// Mouse events
viewport.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);

// Touch events (mobile)
viewport.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('touchmove', drag, { passive: false });
window.addEventListener('touchend', endDrag);