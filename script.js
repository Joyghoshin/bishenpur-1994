const playBtn = document.getElementById("playBtn");
const song1 = document.getElementById("song1");
const song2 = document.getElementById("song2");

let isPlaying = false;

if (playBtn && song1) {
  playBtn.addEventListener("click", () => {
    if (!isPlaying) {
      song1.play().then(() => {
        playBtn.textContent = "Pause";
        isPlaying = true;
      }).catch(err => {
        console.log("Audio playback failed:", err);
      });
    } else {
      song1.pause();
      if (song2) song2.pause();
      playBtn.textContent = "Play";
      isPlaying = false;
    }
  });

  // When song1 finishes, automatically play song2
  song1.addEventListener("ended", () => {
    if (song2) {
      song2.play().catch(err => console.log("Song 2 playback failed:", err));
    } else {
      playBtn.textContent = "Play";
      isPlaying = false;
    }
  });

  // When song2 finishes, reset the play button
  if (song2) {
    song2.addEventListener("ended", () => {
      playBtn.textContent = "Play";
      isPlaying = false;
    });
  }
}

// Drag / Pan functionality for the background image viewport
const viewport = document.getElementById("viewport");
const img = document.getElementById("bg-image");

let isDragging = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;

function startDrag(e) {
  isDragging = true;
  if (img) {
    img.style.animationPlayState = 'paused';
  }
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
  if (img) {
    img.style.animationPlayState = 'running';
  }
}

if (viewport) {
  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  viewport.addEventListener('touchstart', startDrag);
  window.addEventListener('touchmove', drag);
  window.addEventListener('touchend', endDrag);
}