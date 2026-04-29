function goToTeams() {
    window.location.href = "/drivers";
}

function goToSchedule(){
    window.location.href = "/Calendar";
}

function goToRace(){
    window.location.href = "/data";
}

function toggleTheme() {
    // Toggles the 'light-mode' class on the body
    document.body.classList.toggle('light-mode');

    // Optional: Save preference to local storage so it stays on page refresh
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Check for saved theme on page load
window.onload = () => {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
};
/*
// Driver images
const driverImages = [
    "2026alpinefracol01right.avif",
    "2026alpinepiegas01right.avif",
    "2026astonmartinferalo01right.avif",
    "2026astonmartinlanstr01right.avif",
    "2026audigabbor01right.avif",
    "2026audinichul01right.avif",
    "2026cadillacserper01right.avif",
    "2026cadillacvalbot01right.avif",
    "2026ferrarichalec01right.avif",
    "2026ferrarilewham01right.avif",
    "2026haasestoco01right.avif",
    "2026haasolibea01right.avif",
    "2026mclarenlannor01right.avif",
    "2026mclarenoscpia01right.avif",
    "2026mercedesandant01right.avif",
    "2026mercedesgeorus01right.avif",
    "2026redbullracingisahad01right.avif",
    "2026redbullracingmaxver01right.avif",
    "2026williamsalealb01right.avif",
    "2026williamscarsai01right.avif",
];


// Pick random driver image
function setRandomDriverImage() {
    const img = document.getElementById("driver-image");
    const randomIndex = Math.floor(Math.random() * driverImages.length);
    img.src = "WebDev/Img/" + driverImages[randomIndex];
}


// Run when page loads
window.onload = function () {
    setRandomDriverImage();
}; */