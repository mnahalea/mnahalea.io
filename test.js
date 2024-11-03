document.addEventListener("DOMContentLoaded", () => {
  let startTime = 0;
  let responseRecorded = false;
  let currentAudioFile = "";
  const reactionData = [];

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
      startButton.style.display = "none";
      startTest();
    };
  }

  function startTest() {
    if (testAudioQueue.length === 0) {
      localStorage.setItem("reactionData", JSON.stringify(reactionData));
      window.location.href = "test_results.html"; // Ensure to redirect to the results page correctly
      return;
    }

    const nextAudio = testAudioQueue.shift();
    currentAudioFile = nextAudio.audioFile;
    responseRecorded = false;

    audio.src = currentAudioFile; // Set the audio source here

    audio.addEventListener('canplaythrough', () => {
      setTimeout(() => {
        startTime = Date.now();
        audio.play().then(() => {
          console.log("Playing audio:", currentAudioFile);
          responseRecorded = false; // Reset for new audio
        }).catch(error => {
          console.error("Audio playback failed:", error);
        });
      }, 2000);
    }, { once: true });

    audio.onended = () => {
      // Audio has finished playing; enable keypress recording
      responseRecorded = false;
    };
  }

  function recordReactionTime(keyPressed) {
    if (responseRecorded) return; // Prevent recording multiple times during playback
    responseRecorded = true;
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

    setTimeout(() => {
      startTest(); // Move to the next audio after a delay
    }, 1000);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'a') recordReactionTime('A');
    else if (event.key.toLowerCase() === 'l') recordReactionTime('L');
  });
});
