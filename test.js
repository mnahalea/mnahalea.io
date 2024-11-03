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
    "Alexander", "Austin", "Brad", "Travis", "John", "Tyrone", "Marquise",
    "Lamar", "Kareem", "Demetrius", "Juan", "Carlos", "Miguel", "Alejandro"
  ];

  const audioSources = names.flatMap(name =>
    speakers.map(speaker => ({
      audioFile: `audio/${speaker.name}_${name}_Stimulus.mp3`,
      name,
      speaker: speaker.name,
      ethnicity: speaker.ethnicity
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

  document.getElementById("startButton").onclick = function () {
    document.getElementById("startButton").style.display = "none";
    startTest();
  };

  function startTest() {
    if (testAudioQueue.length === 0) {
      localStorage.setItem("reactionData", JSON.stringify(reactionData));
      window.location.href = "congratulations.html";
      return;
    }

    const nextAudio = testAudioQueue.shift();
    currentAudioFile = nextAudio.audioFile;
    audio.src = currentAudioFile;
    responseRecorded = false;

    setTimeout(() => {
      startTime = Date.now();
      audio.play();
    }, 2000);
  }

  function recordReactionTime(keyPressed) {
    if (responseRecorded) return;
    responseRecorded = true;
    const reactionTime = Date.now() - startTime;
    reactionData.push({
      audioFile: currentAudioFile,
      keyPressed,
      reactionTime
    });
    setTimeout(startTest, 1000);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'a') recordReactionTime('A');
    else if (event.key.toLowerCase() === 'l') recordReactionTime('L');
  });
});
