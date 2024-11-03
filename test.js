document.addEventListener("DOMContentLoaded", () => {
  let startTime = 0;
  let currentAudioFile = "";
  const reactionData = [];
  let responseRecorded = false; // This will track if a response has been recorded for the current audio

  const speakers = [
    { name: "Speaker1", ethnicity: "White" },
    { name: "Speaker2", ethnicity: "White" },
    { name: "Speaker3", ethnicity: "Black" },
    { name: "Speaker4", ethnicity: "Black" }
  ];

  const names = [
    "Von", "Kai", "Tyrone", "Malik", "Darius", "Jamal", 
    "Connor", "Jake", "Brett", "Tanner", "Hunter",
    "Alexander", "Austin", "Brad", "Travis", "John",
    "Marquise", "Lamar", "Kareem", "Demetrius", "Juan", 
    "Carlos", "Miguel", "Alejandro"
  ];

  const audioSources = names.flatMap(name =>
    speakers.map(speaker => ({
      audioFile: `audio/${speaker.name}_${name}_Stimulus.mp3`,
      name,
      speaker: speaker.name,
      ethnicity: speaker.ethnicity,
      congruency: Math.random() < 0.5 ? "Congruent" : "Incongruent", // Randomly assign congruency for demo
    }))
  );

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function balancedShuffle() {
    const shuffled = shuffleArray([...audioSources]);
    const whiteSubset = shuffled.filter(a => a.ethnicity === "White").slice(0, 16);
    const blackSubset = shuffled.filter(a => a.ethnicity === "Black").slice(0, 16);
    return shuffleArray([...whiteSubset, ...blackSubset]);
  }

  let testAudioQueue = balancedShuffle();
  let audio = new Audio();
  const startButton = document.getElementById("startButton");

  if (startButton) {
    startButton.onclick = function () {
      startButton.style.display = "none"; // Hide the start button
      startTest(); // Start the test
    };
  }

  function startTest() {
    if (testAudioQueue.length === 0) {
      localStorage.setItem("reactionData", JSON.stringify(reactionData));
      console.log("Redirecting to results page...");
      window.location.href = "test_results.html"; // Redirect to the results page
      return;
    }

    const nextAudio = testAudioQueue.shift();
    currentAudioFile = nextAudio.audioFile;
    responseRecorded = false; // Reset response tracking for the new audio

    audio.src = currentAudioFile; // Set the audio source here

    // Wait until the audio is ready to play before starting playback
    audio.addEventListener('canplaythrough', () => {
      setTimeout(() => {
        startTime = Date.now();
        audio.play().then(() => {
          console.log("Playing audio:", currentAudioFile);
        }).catch(error => {
          console.error("Audio playback failed:", error);
        });
      }, 2000); // Delay before audio starts
    }, { once: true });

    audio.onended = () => {
      // No need to reset responseRecorded here
      // The next audio will be handled in the key press event
    };
  }

  function recordReactionTime(keyPressed) {
    if (responseRecorded) return; // Prevent recording multiple times during this audio
    responseRecorded = true; // Set to true to prevent further recordings until the next audio

    const reactionTime = Date.now() - startTime;

    // Determine if the response was correct based on congruency
    const correct = (keyPressed === 'A' && currentAudioFile.includes("Black")) || 
                    (keyPressed === 'L' && currentAudioFile.includes("White"));

    reactionData.push({
      audioFile: currentAudioFile,
      name: currentAudioFile.split('_')[1], // Extract name from the file name
      congruency: nextAudio.congruency, // Save congruency from nextAudio
      keyPressed,
      correct,
      reactionTime
    });

    // Move to the next audio after a delay
    setTimeout(() => {
      startTest(); // Proceed to the next audio
    }, 1000); // Delay before starting the next audio
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'a') recordReactionTime('A');
    else if (event.key.toLowerCase() === 'l') recordReactionTime('L');
  });
});
