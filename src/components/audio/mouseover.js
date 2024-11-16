// src/scripts/mouseoverAudio.js
export function initAudioOnMouseover() {
  let hasInteracted = false;
  let audio = null;
  let audioContext = null;

  // Pre-load the audio
  const initAudio = () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audio = new Audio("../../assets/sounds/kayo_crowd_Cheer.mp3");
    audio.preload = "auto";
    console.log("Audio initialized");
  };

  // Handle the mouseover
  const handleMouseover = async () => {
    if (hasInteracted) return;

    try {
      hasInteracted = true;

      // Initialize audio if not done yet
      if (!audio) initAudio();

      // Resume audio context and play
      await audioContext.resume();
      const playResult = await audio.play();

      console.log("Audio playing from mouseover", playResult);

      // Remove the event listener
      document.body.removeEventListener("mouseover", handleMouseover);
    } catch (err) {
      console.error("Audio playback failed:", err);
      hasInteracted = false; // Reset to try again
    }
  };

  // Add listener
  if (typeof window !== "undefined") {
    document.body.addEventListener("mouseover", handleMouseover);
  }
}

// Initialize when the module loads
if (typeof window !== "undefined") {
  initAudioOnMouseover();
}
