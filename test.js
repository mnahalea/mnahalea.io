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
    "Connor", "Jake", "Brett", "Tanner", "Hunter", "Austin",
    "Alexander", "Austin", "Brad", "Travis", "John", "Tyrone", 
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
      window.location.href = "test_results.html"; // Redirect to the results page
      return;
    }

    const nextAudio = testAudioQueue.shift();
    currentAudioFile = nextAudio.audioFile;
    responseRecorded = false;
    
    audio.src = currentAudioFile; // Set audio source for the current file
    audio.play().then(() => {
      startTime = Date.now();
      console.log("Playing audio:", currentAudioFile);
    }).catch(error => {
      console.error("Audio playback failed:", error);
    });

    audio.onended = () => {
      // Automatically starts the next audio after the current one ends
      startTest();
    };
  }

  function recordReactionTime(keyPressed) {
    if (responseRecorded) return; // Prevent multiple recordings during audio
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

    // Add a short delay before the next audio starts playing
    setTimeout(() => {
      startTest();
    }, 1000);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'a') recordReactionTime('A');
    else if (event.key.toLowerCase() === 'l') recordReactionTime('L');
  });
});
