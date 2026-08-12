const audio1 = document.getElementById('audio1');
const playIcon = document.getElementById('playIcon');
const timeDisplay = document.getElementById('timeDisplay');

function togglePlay() {
    if (audio1.paused) {
        audio1.play().then(() => {
            playIcon.textContent = '❚❚';
        }).catch(error => {
            console.error("Playback failed:", error);
            alert("Unable to play 'song1.mp3'. Please check if the audio file exists.");
        });
    } else {
        audio1.pause();
        playIcon.textContent = '▶';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio1.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `0:00 / ${formatTime(audio1.duration)}`;
});

audio1.addEventListener('timeupdate', () => {
    const current = formatTime(audio1.currentTime);
    const total = audio1.duration ? formatTime(audio1.duration) : '0:00';
    timeDisplay.textContent = `${current} / ${total}`;
});

audio1.addEventListener('ended', () => {
    playIcon.textContent = '▶';
});

// --- FULL-SCREEN DRAGGING LOGIC (Mouse & Touch Supported) ---
const videoElement = document.getElementById('schoolVideo');

let isDragging = false;
let startX, startY;
let posX = 0;
let posY = 0;

function startDrag(clientX, clientY) {
    isDragging = true;
    startX = clientX - posX;
    startY = clientY - posY;
}

function onDrag(clientX, clientY) {
    if (!isDragging) return;
    posX = clientX - startX;
    posY = clientY - startY;
    videoElement.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px))`;
}

function endDrag() {
    isDragging = false;
}

// Mouse Events
videoElement.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => onDrag(e.clientX, e.clientY));
window.addEventListener('mouseup', endDrag);

// Touch Events for Mobile
videoElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
});
window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
        onDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
});
window.addEventListener('touchend', endDrag);