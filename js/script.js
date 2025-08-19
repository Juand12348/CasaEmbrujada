const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const gamePanel = document.getElementById("gamePanel");
const questionEl = document.getElementById("question");
const doorsEl = document.getElementById("doors");
const levelEl = document.getElementById("level");
const restartBtn = document.getElementById("restartBtn");
const endScreen = document.getElementById("endScreen");
const playAgainBtn = document.getElementById("playAgainBtn");
const loseScreen = document.getElementById("loseScreen");
const retryBtn = document.getElementById("retryBtn");
const scoreEl = document.getElementById("score"); // marcador en pantalla
const finalScoreEl = document.getElementById("finalScore"); // marcador final
const timerEl = document.getElementById("timer");
const hintBtn = document.getElementById("hintBtn");

let currentLevel = 1;
let maxLevels = 10;
let errors = 0;
let maxErrors = 2;
let score = 0;
let timer, timeLeft = 10;
let questionsShuffled = [];

const questions = [
  {
    q: "¿Cuál es el resultado de 2 + '2' en JavaScript?",
    options: ["22", "4", "Error", "NaN"],
    answer: "22"
  },
  {
    q: "¿Qué método convierte JSON en objeto?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "parse.JSON()"],
    answer: "JSON.parse()"
  },
  {
    q: "¿Cuál palabra clave declara una constante?",
    options: ["let", "var", "const", "define"],
    answer: "const"
  },
  {
    q: "¿Qué devuelve typeof null?",
    options: ["null", "object", "undefined", "error"],
    answer: "object"
  },
  {
    q: "¿Qué símbolo se usa para comentarios de una sola línea?",
    options: ["/*", "//", "<!--", "#"],
    answer: "//"
  },
  {
    q: "¿Qué operador compara valor y tipo en JavaScript?",
    options: ["==", "===", "!=", "="],
    answer: "==="
  },
  {
    q: "¿Cuál es el valor inicial de una variable declarada con var sin asignar?",
    options: ["0", "null", "undefined", "false"],
    answer: "undefined"
  },
  {
    q: "¿Qué método elimina el último elemento de un array?",
    options: ["shift()", "pop()", "remove()", "slice()"],
    answer: "pop()"
  },
  {
    q: "¿Qué estructura se usa para manejar errores?",
    options: ["if/else", "try/catch", "switch", "throw/catch"],
    answer: "try/catch"
  },
  {
    q: "¿Qué método convierte una cadena a mayúsculas?",
    options: ["toUpperCase()", "upper()", "capitalize()", "toLowerCase()"],
    answer: "toUpperCase()"
  }
  
];

// 👉 util: barajar
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Iniciar juego
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  startGame();
});

// Reiniciar desde botón
restartBtn.addEventListener("click", () => {
  startGame();
});

// Volver a jugar después de ganar
playAgainBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  startGame();
});

// Reintentar después de perder
retryBtn.addEventListener("click", () => {
  loseScreen.classList.remove("active");
  startGame();
});

// Usar pista
hintBtn.addEventListener("click", useHint);

function startGame() {
  currentLevel = 1;
  errors = 0;
  score = 0;
  questionsShuffled = shuffle([...questions]);
  gamePanel.classList.remove("hidden");
  endScreen.classList.add("hidden");
  loseScreen.classList.remove("active");
  loadLevel();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.textContent = `⏱️ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOver(false);
    }
  }, 1000);
}

function loadLevel() {
  errors = 0;
  const q = questionsShuffled[currentLevel - 1];
  levelEl.textContent = currentLevel;
  questionEl.textContent = q.q;
  doorsEl.innerHTML = "";
  scoreEl.textContent = `⭐ Puntos: ${score}`;

  q.options.forEach(opt => {
    const door = document.createElement("div");
    door.className = "door";
    door.innerHTML = `<div class="icon">🚪</div><div class="title">${opt}</div>`;
    door.addEventListener("click", () => checkAnswer(opt, door));
    doorsEl.appendChild(door);
  });

  startTimer();
}

function checkAnswer(opt, door) {
  const q = questionsShuffled[currentLevel - 1];
  if (opt === q.answer) {
    door.classList.add("open");
    score += 10 + timeLeft; // más rápido = más puntos
    setTimeout(() => {
      if (currentLevel === maxLevels) {
        gameOver(true);
      } else {
        currentLevel++;
        loadLevel();
      }
    }, 1000);
  } else {
    door.classList.add("shake");
    score -= 5;
    errors++;
    setTimeout(() => door.classList.remove("shake"), 500);

    if (errors >= maxErrors) {
      gameOver(false);
    }
  }
  scoreEl.textContent = `⭐ Puntos: ${score}`;
}

function gameOver(win) {
  clearInterval(timer);
  gamePanel.classList.add("hidden");
  if (win) {
    endScreen.classList.remove("hidden");
    finalScoreEl.textContent = `⭐ Tu puntaje final: ${score}`;

    const winSound = document.getElementById("winSound");
    if (winSound) {
      winSound.currentTime = 0;
      winSound.play();
    }

  } else {
    loseScreen.classList.add("active");

    const loseSound = document.getElementById("loseSound");
    if (loseSound) {
      loseSound.currentTime = 0;
      loseSound.play();
    }
  }
}

// 👉 Pista elimina 2 opciones incorrectas
function useHint() {
  const q = questionsShuffled[currentLevel - 1];
  let wrongs = q.options.filter(opt => opt !== q.answer);
  wrongs = shuffle(wrongs).slice(0, 2);

  document.querySelectorAll(".door").forEach(door => {
    const opt = door.querySelector(".title").textContent;
    if (wrongs.includes(opt)) {
      door.style.visibility = "hidden";
    }
  });

  hintBtn.disabled = true; // solo 1 vez por partida
}