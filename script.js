const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');
const playIcon = document.getElementById('playIcon');
const timeDisplay = document.getElementById('timeDisplay');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const trackTitle = document.getElementById('trackTitle');
const trackSub = document.getElementById('trackSub');

let activeAudio = 1; // 1 for song1, 2 for song2
let totalDuration = 0;

// Calculate total duration once metadata is loaded for both tracks
function calculateTotalDuration() {
    if (!isNaN(audio1.duration) && !isNaN(audio2.duration)) {
        totalDuration = audio1.duration + audio2.duration;
    }
}

audio1.addEventListener('loadedmetadata', calculateTotalDuration);
audio2.addEventListener('loadedmetadata', calculateTotalDuration);

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function togglePlay() {
    const currentAudio = activeAudio === 1 ? audio1 : audio2;

    if (currentAudio.paused) {
        currentAudio.play().then(() => {
            playIcon.textContent = '❚❚';
        }).catch(error => {
            console.error("Playback failed:", error);
            alert("Unable to play audio tracks. Check file names.");
        });
    } else {
        currentAudio.pause();
        playIcon.textContent = '▶';
    }
}

// Track 1 ending -> automatically transition to Track 2
audio1.addEventListener('ended', () => {
    audio1.currentTime = 0;
    activeAudio = 2;
    trackTitle.textContent = "Bishenpur Ambient";
    trackSub.textContent = "Playing Song 2";
    audio2.play().catch(err => console.log(err));
});

// Track 2 ending -> loop back to Track 1
audio2.addEventListener('ended', () => {
    audio2.currentTime = 0;
    activeAudio = 1;
    trackTitle.textContent = "Bishenpur Memories";
    trackSub.textContent = "Playing Song 1";
    audio1.play().catch(err => console.log(err));
});

// Unified time updates combining both tracks into one 9+ min progress indicator
function handleTimeUpdate() {
    if (!totalDuration) calculateTotalDuration();

    let cumulativeCurrentTime = 0;
    if (activeAudio === 1) {
        cumulativeCurrentTime = audio1.currentTime;
    } else {
        cumulativeCurrentTime = audio1.duration + audio2.currentTime;
    }

    if (totalDuration > 0) {
        const percent = (cumulativeCurrentTime / totalDuration) * 100;
        progressBar.style.width = percent + '%';
        timeDisplay.textContent = `${formatTime(cumulativeCurrentTime)} / ${formatTime(totalDuration)}`;
    }
}

audio1.addEventListener('timeupdate', () => {
    if (activeAudio === 1) handleTimeUpdate();
});

audio2.addEventListener('timeupdate', () => {
    if (activeAudio === 2) handleTimeUpdate();
});

// Unified scrubbing across both tracks
function seekAudio(event) {
    if (!totalDuration) return;
    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    const clickPercent = clickX / width;
    const targetTime = clickPercent * totalDuration;

    if (targetTime <= audio1.duration) {
        // Switch to or stay on Track 1
        if (activeAudio === 2) {
            audio2.pause();
            audio2.currentTime = 0;
            activeAudio = 1;
            trackTitle.textContent = "Bishenpur Memories";
            trackSub.textContent = "Playing Song 1";
            if (!audio1.paused) audio1.play();
        }
        audio1.currentTime = targetTime;
    } else {
        // Switch to or stay on Track 2
        if (activeAudio === 1) {
            audio1.pause();
            audio1.currentTime = 0;
            activeAudio = 2;
            trackTitle.textContent = "Bishenpur Ambient";
            trackSub.textContent = "Playing Song 2";
            if (!audio2.paused) audio2.play();
        }
        audio2.currentTime = targetTime - audio1.duration;
    }
    handleTimeUpdate();
}

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