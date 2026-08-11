const playBtn = document.getElementById("playBtn");
const btnIcon = document.getElementById("btn-icon");
const song1 = document.getElementById("song1");
const song2 = document.getElementById("song2");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const trackTitleEl = document.getElementById("track-title");

let currentSong = song1;
let isPlaying = false;

// Format seconds to mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Calculate total combined duration of both songs
function getTotalDuration() {
  return (song1.duration || 0) + (song2.duration || 0);
}

function updateDurationDisplay() {
  const total = getTotalDuration();
  if (total > 0) {
    totalDurationEl.textContent = formatTime(total);
  }
}

song1.addEventListener("loadedmetadata", updateDurationDisplay);
song2.addEventListener("loadedmetadata", updateDurationDisplay);

function playAudio() {
  currentSong.play().then(() => {
    isPlaying = true;
    btnIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
    trackTitleEl.textContent = "Bishenpur Memories";
    updateDurationDisplay();
  }).catch(err => console.log("Playback failed or blocked:", err));
}

function pauseAudio() {
  song1.pause();
  song2.pause();
  isPlaying = false;
  btnIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
}

playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Update progress bar across the unified timeline of both songs
function handleTimeUpdate() {
  const d1 = song1.duration || 0;
  const d2 = song2.duration || 0;
  const totalDuration = d1 + d2;
  
  if (totalDuration > 0) {
    let currentTotalTime = 0;
    if (currentSong === song1) {
      currentTotalTime = song1.currentTime;
    } else {
      currentTotalTime = d1 + song2.currentTime;
    }
    
    const percent = (currentTotalTime / totalDuration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTotalTime);
  }
}

song1.addEventListener("timeupdate", () => {
  if (currentSong === song1) handleTimeUpdate();
});

song2.addEventListener("timeupdate", () => {
  if (currentSong === song2) handleTimeUpdate();
});

// Allow scrubbing across the entire unified timeline of both songs
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const totalDuration = getTotalDuration();
  
  if (totalDuration > 0) {
    const targetTime = (clickX / width) * totalDuration;
    const d1 = song1.duration || 0;
    
    if (targetTime < d1) {
      // Target falls within Song 1
      song2.pause();
      song2.currentTime = 0;
      currentSong = song1;
      song1.currentTime = targetTime;
      if (isPlaying) song1.play();
    } else {
      // Target falls within Song 2
      song1.pause();
      song1.currentTime = 0;
      currentSong = song2;
      song2.currentTime = targetTime - d1;
      if (isPlaying) song2.play();
    }
  }
});

// Seamless transition from Song 1 to Song 2
song1.addEventListener("ended", () => {
  song1.currentTime = 0;
  currentSong = song2;
  song2.currentTime = 0;
  if (isPlaying) {
    song2.play().catch(err => console.log("Song 2 playback error:", err));
  }
});

// Infinite loop back from Song 2 to Song 1
song2.addEventListener("ended", () => {
  song2.currentTime = 0;
  currentSong = song1;
  song1.currentTime = 0;
  if (isPlaying) {
    song1.play().catch(err => console.log("Song 1 loop error:", err));
  }
});

// Drag / Pan functionality for the background image viewport
const viewport = document.getElementById("viewport");
const img = document.getElementById("bg-image");

let isDragging = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;

function startDrag(e) {
  isDragging = true;
  if (img) img.style.animationPlayState = 'paused';
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

  if (img) {
    img.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scale(1.01)`;
  }
}

function endDrag() {
  isDragging = false;
  if (img) img.style.animationPlayState = 'running';
}

if (viewport) {
  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  viewport.addEventListener('touchstart', startDrag);
  window.addEventListener('touchmove', drag);
  window.addEventListener('touchend', endDrag);
}