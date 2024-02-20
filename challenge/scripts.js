// Countdown variables
const countdownDuration = 3*60*60; // 3 hours in seconds
const breakDuration = 5 * 60; // 5 minutes in seconds
let countdownInterval;
let timeLeft = countdownDuration;

// Elements
const countdownDisplay = document.getElementById('countdown');
const startButton = document.getElementById('startButton');
const statusMessage = document.getElementById('statusMessage');

// Check if Wake Lock API is supported
let wakeLock = null;
if ('wakeLock' in navigator) {
  // Request a screen wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Screen wake lock is active');
      startChallenge(); // Start the challenge once wake lock is acquired
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  // Request a wake lock when the challenge starts
  startButton.addEventListener('click', async () => {
    await requestWakeLock();
  });

  function displayEndDateTime() {
    const endTime = new Date(Date.now() + timeLeft * 1000);
    const endDateString = `${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}`;
    document.getElementById('endDateTime').textContent = `Challenge ends on: ${endDateString}`;
}

  // Release the wake lock when the challenge ends
  function endChallenge(isVictory) {
    clearInterval(countdownInterval);
    if (isVictory) {
      countdownDisplay.textContent = 'অভিনন্দন!';
      statusMessage.textContent = 'তুমি তোমার ৩ ঘন্টার চ্যালেঞ্জটি সফলভাবে সম্পন্ন করেছো। তোমার জন্য মেসন পরিবার গর্বিত!';
      statusMessage.style.color = '#32cd32'; // Lime green
      statusMessage.style.fontSize = '20px';
    } else {
      countdownDisplay.textContent = 'হেরে গেলে!';
      statusMessage.textContent = 'আহা! নিজের প্রতি, নিজের বাবা-মা-পরিবারের স্বপ্নের প্রতি কি অবিচার! নিজেকে তৈরি করবে কবে আর, যুদ্ধ তো শেষ হতে চললো! পূণরায় চর্চা করো, ঘুরে দাঁড়াও; আমরা জানি তুমি পারবে';
      statusMessage.style.color = '#ff6347'; // Tomato red
      statusMessage.style.fontSize = '20px';
    }
    displayEndDateTime();
    releaseWakeLock();
  }
  
  // Release the screen wake lock
  const releaseWakeLock = async () => {
    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
      console.log('Screen wake lock has been released');
    }
  };
} else {
  console.log('Wake Lock API is not supported in this browser.');
}

// Start the challenge
function startChallenge() {
  startButton.style.display = 'none';
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (timeLeft <= 0) {
    clearInterval(countdownInterval);
    endChallenge(true); // Victory
  } else {
    countdownDisplay.textContent = formatTime(timeLeft);
    timeLeft--;

    if (timeLeft % (30 * 60) === 0) { // If it's time for a break
      clearInterval(countdownInterval);
      setTimeout(() => {
        countdownInterval = setInterval(updateCountdown, 1000);
      }, breakDuration * 1000);
      alert("অভিনন্দন, তুমি নিরবচ্ছিন্নভাবে ৩০ মিনিট মনোযোগের সাথে পড়েছো। সেই সাথে ধীরে ধীরে এগিয়ে যাচ্ছো নিজের স্বপ্নের পথে। এবার, ৫ মিনিটের বিশ্রাম নাও এবং পূণরায় শুরু করো ৩০ মিনিটস চ্যালেঞ্জ; শুভ কামনা!")
    }
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

function pad(value) {
  return String(value).padStart(2, '0');
}

// Check if the window/tab loses focus
let hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

function handleVisibilityChange() {
  if (document[hidden]) {
    clearInterval(countdownInterval);
    endChallenge(false); // Loss
  }
}

if (typeof document.addEventListener === 'undefined' || typeof hidden === 'undefined') {
  // Browser doesn't support event listeners or visibility API
  console.log('This browser does not support the Page Visibility API.');
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}