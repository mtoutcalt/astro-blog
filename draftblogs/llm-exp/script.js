// script.js
// All the main logic for flashcards, quiz, code examples, etc.
// We assume patterns.js is loaded before this, so `patterns` is available.

/* ---------- Utility Functions ---------- */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* ---------- Flashcards Section ---------- */
const flashcardsContainer = document.getElementById("flashcardsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const flashcardSearch = document.getElementById("flashcardSearch");

function createFlashcard(pattern) {
  const card = document.createElement("div");
  card.className = "flashcard";
  card.dataset.pattern = pattern.name.toLowerCase();

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Card Front
  const front = document.createElement("div");
  front.className = "card-front";
  const title = document.createElement("h3");
  title.textContent = pattern.name;
  front.appendChild(title);

  // Card Back
  const back = document.createElement("div");
  back.className = "card-back";
  const desc = document.createElement("p");
  desc.textContent = pattern.description;
  back.appendChild(desc);
  if (pattern.image) {
    const img = document.createElement("img");
    img.src = pattern.image;
    img.alt = pattern.name + " Pattern";
    back.appendChild(img);
  }

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });

  return card;
}

function loadFlashcards(filter = "All", searchQuery = "") {
  flashcardsContainer.innerHTML = "";
  const filtered = patterns.filter((pattern) => {
    const matchesCat = (filter === "All" || pattern.category === filter);
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  filtered.forEach((pattern) => {
    flashcardsContainer.appendChild(createFlashcard(pattern));
  });
}

// Initial load
loadFlashcards();
categoryFilter.addEventListener("change", (e) => {
  loadFlashcards(e.target.value, flashcardSearch.value);
});
flashcardSearch.addEventListener("input", (e) => {
  loadFlashcards(categoryFilter.value, e.target.value);
});

/* ---------- Quiz Game Section ---------- */
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const quizQuestionElem = document.getElementById("quizQuestion");
const quizOptionsElem = document.getElementById("quizOptions");
const questionNumberElem = document.getElementById("questionNumber");
const progressFill = document.getElementById("progressFill");

const startQuizBtn = document.getElementById("startQuiz");
const stopQuizBtn = document.getElementById("stopQuiz");

let currentScore = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let timerInterval;
let timeLeft = 60;
let gameOver = false;
let questionCount = 0;
const MAX_QUESTIONS = 15; // Arbitrary limit to show progress bar scaling

bestScoreDisplay.textContent = `Best Score: ${bestScore}`;

function updateScore() {
  scoreDisplay.textContent = `Score: ${currentScore}`;
}
function updateTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}

/* Timer Logic */
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  updateTimer();
  gameOver = false;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  clearInterval(timerInterval);
  document.getElementById("finalScoreText").textContent = `Your final score is: ${currentScore}`;
  document.getElementById("gameOverModal").style.display = "block";
  document.querySelectorAll(".quiz-options button").forEach((btn) => {
    btn.disabled = true;
  });
}

function loadQuizGame() {
  currentScore = 0;
  questionCount = 0;
  updateScore();
  quizQuestionElem.textContent = "";
  quizOptionsElem.innerHTML = "";
  progressFill.style.width = "0%";
  clearInterval(timerInterval);
  timeLeft = 60;
  updateTimer();
  gameOver = false;
  startTimer();
  nextQuestion();
}

/* Confetti Effect */
function showConfetti() {
  const confettiContainer = document.getElementById("confettiContainer");
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    const size = Math.floor(Math.random() * 8) + 4;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.top = Math.random() * 100 + "%";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.opacity = Math.random() + 0.5;
    confetti.style.animation = `confetti-fall 1.5s linear ${Math.random()}s forwards`;
    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 2000);
  }
}

/* Quiz Question Generation */
function generateQuestion() {
  let questionType;
  const rand = Math.random();
  if (rand < 0.33) {
    questionType = "code";
  } else if (rand < 0.66) {
    questionType = "name";
  } else {
    questionType = "description";
  }

  const correctPattern = patterns[Math.floor(Math.random() * patterns.length)];
  let questionText = "";
  let correctOption = "";
  let options = [];
  let codeSnippet = null;

  if (questionType === "name") {
    questionText = `What is the correct detailed description for "${correctPattern.name}"?`;
    correctOption = correctPattern.description;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    )
      .slice(0, 3)
      .map(p => p.description);
    options = [correctOption, ...distractors];
  } else if (questionType === "description") {
    questionText = `Which design pattern matches the detailed description:\n"${correctPattern.description}"?`;
    correctOption = correctPattern.name;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    )
      .slice(0, 3)
      .map(p => p.name);
    options = [correctOption, ...distractors];
  } else if (questionType === "code") {
    const languages = ["javascript", "java", "python"];
    const language = languages[Math.floor(Math.random() * languages.length)];
    codeSnippet = correctPattern.codeExamples[language];
    questionText = `Which design pattern is illustrated by the following ${language.toUpperCase()} code snippet?`;
    correctOption = correctPattern.name;
    const distractors = shuffle(
      patterns.filter(p => p.name !== correctPattern.name)
    )
      .slice(0, 3)
      .map(p => p.name);
    options = [correctOption, ...distractors];
  }

  options = shuffle(options);
  return { questionText, options, correctAnswer: correctOption, codeSnippet };
}

function displayQuestion(questionObj) {
  quizQuestionElem.innerHTML = "";
  quizOptionsElem.innerHTML = "";

  const questionPara = document.createElement("p");
  questionPara.textContent = questionObj.questionText;
  quizQuestionElem.appendChild(questionPara);

  if (questionObj.codeSnippet) {
    const pre = document.createElement("pre");
    pre.className = "code-snippet";
    const code = document.createElement("code");
    code.textContent = questionObj.codeSnippet;
    pre.appendChild(code);
    quizQuestionElem.appendChild(pre);
  }

  questionObj.options.forEach(optionText => {
    const btn = document.createElement("button");
    btn.textContent = optionText;
    btn.addEventListener("click", () => {
      if (gameOver || btn.disabled) return;

      if (optionText === questionObj.correctAnswer) {
        btn.classList.add("correct");
        currentScore++;
        updateScore();
        showConfetti();
        if (currentScore > bestScore) {
          bestScore = currentScore;
          bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
          localStorage.setItem("bestScore", bestScore);
        }
      } else {
        btn.classList.add("incorrect");
      }
      document.querySelectorAll("#quizOptions button").forEach(b => {
        b.disabled = true;
      });
      setTimeout(() => {
        if (!gameOver) {
          nextQuestion();
        }
      }, 800);
    });
    quizOptionsElem.appendChild(btn);
  });
}

function nextQuestion() {
  questionCount++;
  questionNumberElem.textContent = `Question #${questionCount}`;
  const progressPercentage = Math.min((questionCount / MAX_QUESTIONS) * 100, 100);
  progressFill.style.width = progressPercentage + "%";

  const questionObj = generateQuestion();
  displayQuestion(questionObj);
}

/* Start & Stop Quiz */
startQuizBtn.addEventListener("click", () => {
  loadQuizGame();
});
stopQuizBtn.addEventListener("click", () => {
  endGame();
});

/* Modals (Instructions & Game Over) */
const instructionsBtn = document.getElementById("instructionsBtn");
const instructionsModal = document.getElementById("instructionsModal");
const closeInstructions = document.getElementById("closeInstructions");
const startGameBtn = document.getElementById("startGame");
const gameOverModal = document.getElementById("gameOverModal");
const playAgainBtn = document.getElementById("playAgain");

instructionsBtn.addEventListener("click", () => {
  instructionsModal.style.display = "block";
});
if (closeInstructions) {
  closeInstructions.addEventListener("click", () => {
    instructionsModal.style.display = "none";
  });
}
startGameBtn.addEventListener("click", () => {
  instructionsModal.style.display = "none";
  loadQuizGame();
});
playAgainBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  loadQuizGame();
});
window.addEventListener("click", (event) => {
  if (event.target === instructionsModal) {
    instructionsModal.style.display = "none";
  }
  if (event.target === gameOverModal) {
    gameOverModal.style.display = "none";
  }
});

/* Dark Mode */
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

/* Confetti CSS Animations */
const style = document.createElement("style");
style.innerHTML = `
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);

/*********************************************
 * CODE EXAMPLES SECTION
 *********************************************/
const languageSelect = document.getElementById("languageSelect");
const codeExamplesContainer = document.getElementById("codeExamplesContainer");

function loadCodeExamples(language) {
  codeExamplesContainer.innerHTML = "";
  patterns.forEach(pattern => {
    const patternDiv = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = pattern.name;
    patternDiv.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = pattern.description;
    patternDiv.appendChild(desc);

    if (language === "all") {
      ["javascript", "java", "python"].forEach(lang => {
        if (pattern.codeExamples[lang]) {
          patternDiv.appendChild(createCodeSnippetBlock(lang, pattern.codeExamples[lang]));
        }
      });
    } else {
      if (pattern.codeExamples[language]) {
        patternDiv.appendChild(createCodeSnippetBlock(language, pattern.codeExamples[language]));
      }
    }

    codeExamplesContainer.appendChild(patternDiv);
  });
}

function createCodeSnippetBlock(lang, codeSnippet) {
  const snippetContainer = document.createElement("div");
  snippetContainer.style.marginTop = "1rem";

  const langHeading = document.createElement("h4");
  langHeading.textContent = lang.toUpperCase();
  snippetContainer.appendChild(langHeading);

  const pre = document.createElement("pre");
  pre.className = "code-snippet";
  const code = document.createElement("code");
  code.textContent = codeSnippet;
  pre.appendChild(code);
  snippetContainer.appendChild(pre);

  return snippetContainer;
}

languageSelect.addEventListener("change", e => {
  loadCodeExamples(e.target.value);
});
loadCodeExamples("all");
