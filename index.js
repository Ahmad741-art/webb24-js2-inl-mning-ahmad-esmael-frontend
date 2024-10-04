let score = 0;
let targetNumber = Math.floor(Math.random() * 3) + 1;

function makeGuess() {
  const guess = parseInt(document.getElementById('guessInput').value);
  const resultElement = document.getElementById('result');
  
  if (guess === targetNumber) {
    score++;
    resultElement.textContent = 'Rätt gissat! Du får ett poäng.';
    document.getElementById('score').textContent = score;
    targetNumber = Math.floor(Math.random() * 3) + 1; // Nytt nummer
  } else {
    resultElement.textContent = 'Fel gissat!';
    checkHighscore();
    score = 0; // Nollställ poängen
    document.getElementById('score').textContent = score;
    targetNumber = Math.floor(Math.random() * 3) + 1; // Nytt nummer
  }
}

function checkHighscore() {
  fetch('/highscores')
    .then(response => response.json())
    .then(highscores => {
      const minScore = highscores[highscores.length - 1].score;
      if (score > minScore) {
        const name = prompt('Du kom in på highscore-listan! Ange ditt namn:');
        submitScore(name, score);
      }
      updateHighscoreList(highscores);
    });
}

function submitScore(name, score) {
  fetch('/submit-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, score })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      updateHighscoreList(data.highscores);
    });
}

function updateHighscoreList(highscores) {
  const highscoreList = document.getElementById('highscoreList');
  highscoreList.innerHTML = '';
  highscores.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    highscoreList.appendChild(li);
  });
}

// Uppdatera highscore-listan direkt vid sidan laddas
fetch('/highscores')
  .then(response => response.json())
  .then(updateHighscoreList);
