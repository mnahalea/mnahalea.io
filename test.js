document.addEventListener("DOMContentLoaded", () => {
  let startTime = 0;
  let responseRecorded = false;
  let currentAudioFile = "";
  let nextAudio; // Move nextAudio to higher scope
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
      ethnicity: speaker.ethnicity
    }))
  );

  console.log("Audio Sources:", audioSources);  // Debugging to verify all audio files are generated correctly

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function balancedShuffle() {
    const shuffled = shuffleArray([...audioSources]);
    const whiteSubset = shuffled.filter(a => a.ethnicity === "White").slice(0, 12);
    const blackSubset = shuffled.filter(a => a.ethnicity === "Black").slice(0, 12);
    console.log("White Subset:", whiteSubset);  // Debugging to check the subset
    console.log("Black Subset:", blackSubset);  // Debugging to check the subset
    return shuffleArray([...whiteSubset, ...blackSubset]);
  }

  let testAudioQueue = balancedShuffle();
  console.log("Initial Test Queue:", testAudioQueue);  // Debugging to verify the initial queue

  let audio = new Audio();
  
  // Error listener for the audio object
  audio.addEventListener('error', (e) => {
    console.error("Audio error:", e);
  });

  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.onclick = function () {
      startButton.style.display = "none";
      startTest();
    };
  } else {
    console.error("Start button not found in the document.");
  }

  function startTest() {
    console.log("Starting test...");  // Debugging to confirm startTest is called
    
    if (testAudioQueue.length === 0) {
      console.log("Test completed. Saving data.");
      localStorage.setItem("reactionData", JSON.stringify(reactionData));
      window.location.href = "testresults.html";
      return;
    }

    nextAudio = testAudioQueue.shift(); // Assign here
    currentAudioFile = nextAudio.audioFile;
    audio.src = currentAudioFile;
    responseRecorded = false;

    setTimeout(() => {
      startTime = Date.now();
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
      console.log("Playing audio:", currentAudioFile); // Debugging to confirm audio file
    }, 2000);
  }

  function recordReactionTime(keyPressed) {
    if (responseRecorded) return;
    responseRecorded = true;
    const reactionTime = Date.now() - startTime;
    const correct = (keyPressed === 'A' && /* condition for A being correct */) || 
                    (keyPressed === 'L' && /* condition for L being correct */);
    const congruency = /* Determine congruency based on the current audio context */;

    reactionData.push({
      audioFile: currentAudioFile,
      name: nextAudio.name, // Using nextAudio from the higher scope
      congruency: congruency,
      keyPressed,
      correct,
      reactionTime
    });
    
    console.log("Reaction recorded:", { audioFile: currentAudioFile, keyPressed, reactionTime });
    
    // Automatically start the next audio after recording the reaction
    setTimeout(startTest, 1000);
  }

  document.addEventListener('keydown', (event) => {
    console.log("Key pressed:", event.key); // Log the key pressed
    if (event.key.toLowerCase() === 'a') recordReactionTime('A');
    else if (event.key.toLowerCase() === 'l') recordReactionTime('L');
  });
});
