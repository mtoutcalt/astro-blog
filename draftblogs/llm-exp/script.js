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

/* ---------- Favorite Patterns ---------- */
const FAVORITES_KEY = "favoritePatterns";

/**
 * Returns a Set of favorite pattern names from localStorage
 */
function getFavoritePatterns() {
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) return new Set();
  return new Set(JSON.parse(stored));
}

/**
 * Saves a Set of favorite pattern names to localStorage
 */
function saveFavoritePatterns(setOfFavorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...setOfFavorites]));
}

/* ---------- Recently Viewed Patterns ---------- */
const RECENTLY_VIEWED_KEY = "recentlyViewedPatterns";
function getRecentlyViewedPatterns() {
  const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}
function saveRecentlyViewedPatterns(list) {
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
}
function addRecentlyViewedPattern(patternName) {
  let recentlyViewed = getRecentlyViewedPatterns();
  // Remove if it already exists in the array to avoid duplicates
  recentlyViewed = recentlyViewed.filter((name) => name !== patternName);
  // Push to front
  recentlyViewed.unshift(patternName);
  // Keep only 5
  recentlyViewed = recentlyViewed.slice(0, 5);
  saveRecentlyViewedPatterns(recentlyViewed);
  updateRecentlyViewedUI();
}
function updateRecentlyViewedUI() {
  const recentlyViewed = getRecentlyViewedPatterns();
  const list = document.getElementById("recentlyViewedList");
  list.innerHTML = "";
  recentlyViewed.forEach((patternName) => {
    const li = document.createElement("li");
    li.textContent = patternName;
    
    // ENHANCEMENT: Add button to jump to that pattern
    const viewButton = document.createElement("button");
    viewButton.className = "view-pattern-btn";
    viewButton.textContent = "View";
    viewButton.setAttribute("aria-label", `View ${patternName} pattern`);
    viewButton.addEventListener("click", () => {
      // Clear any filters and find this pattern
      categoryFilter.value = "All";
      flashcardSearch.value = patternName;
      sortBySelect.value = "none";
      loadFlashcards("All", patternName, "none");
      
      // Scroll to flashcards section
      document.getElementById("flashcards").scrollIntoView({ behavior: "smooth" });
    });
    
    li.appendChild(viewButton);
    list.appendChild(li);
  });
}

/* ---------- Flashcards Section ---------- */
const flashcardsContainer = document.getElementById("flashcardsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const flashcardSearch = document.getElementById("flashcardSearch");
const shuffleFlashcardsBtn = document.getElementById("shuffleFlashcards");
const sortBySelect = document.getElementById("sortBySelect");

// For the code snippet modal
const codeSnippetModal = document.getElementById("codeSnippetModal");
const modalCodeBlock = document.getElementById("modalCodeBlock");
const closeCodeSnippetModal = document.getElementById("closeCodeSnippetModal");

// Close snippet modal via "X" or outside click
closeCodeSnippetModal.addEventListener("click", () => {
  codeSnippetModal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === codeSnippetModal) {
    codeSnippetModal.style.display = "none";
  }
});

// ENHANCEMENT: Add ESC keypress to close modals
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    // Close any open modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

/**
 * Opens the code snippet modal, showing the given raw snippet text.
 */
function showSnippetInModal(snippetText) {
  codeSnippetModal.style.display = "block";

  // Clear any previous highlight
  modalCodeBlock.textContent = "";

  // Insert freshly highlighted code
  const highlighted = highlightCode(snippetText);
  modalCodeBlock.innerHTML = highlighted;
}

/**
 * Creates the flashcard DOM element for a given pattern.
 */
function createFlashcard(pattern) {
  const card = document.createElement("div");
  card.className = "flashcard flashcard-animate";
  card.dataset.pattern = pattern.name.toLowerCase();
  // ENHANCEMENT: Add ARIA attributes for accessibility
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", "false");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `${pattern.name} pattern. Press Enter or Space to flip card.`);

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Card Front
  const front = document.createElement("div");
  front.className = "card-front";
  front.setAttribute("aria-hidden", "false");

  const title = document.createElement("h3");
  title.textContent = pattern.name;
  front.appendChild(title);

  // Favorites star icon
  const star = document.createElement("span");
  star.className = "star-favorite";
  star.innerHTML = "&#9733;"; // star symbol
  star.setAttribute("role", "checkbox");
  star.setAttribute("aria-label", "Mark as favorite");
  
  const favs = getFavoritePatterns();
  if (favs.has(pattern.name)) {
    star.classList.add("favorited");
    star.setAttribute("aria-checked", "true");
  } else {
    star.setAttribute("aria-checked", "false");
  }
  
  star.addEventListener("click", (e) => {
    e.stopPropagation(); // don't flip card on star click
    const currentFavs = getFavoritePatterns();
    if (currentFavs.has(pattern.name)) {
      currentFavs.delete(pattern.name);
      star.classList.remove("favorited");
      star.setAttribute("aria-checked", "false");
    } else {
      currentFavs.add(pattern.name);
      star.classList.add("favorited");
      star.setAttribute("aria-checked", "true");
    }
    saveFavoritePatterns(currentFavs);
  });
  
  // ENHANCEMENT: Add keyboard support for star
  star.setAttribute("tabindex", "0");
  star.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      star.click();
    }
  });
  
  front.appendChild(star);

  // Card Back
  const back = document.createElement("div");
  back.className = "card-back";
  back.setAttribute("aria-hidden", "true");

  const desc = document.createElement("p");
  desc.textContent = pattern.description;
  back.appendChild(desc);

  // Button to open snippet in modal
  if (pattern.codeExamples && pattern.codeExamples.javascript) {
    const snippetBtn = document.createElement("button");
    snippetBtn.className = "btn";
    snippetBtn.textContent = "View JS Snippet";
    snippetBtn.addEventListener("click", (evt) => {
      evt.stopPropagation(); // avoid flipping the card
      showSnippetInModal(pattern.codeExamples.javascript);
    });
    back.appendChild(snippetBtn);
  }

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  // Flip card on normal click
  card.addEventListener("click", () => {
    flipCard(card);
  });
  
  // ENHANCEMENT: Add keyboard support for flipping
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard(card);
    }
  });

  return card;
}

// ENHANCEMENT: Extract flip card logic to a function
function flipCard(card) {
  const isActive = card.classList.toggle("active");
  
  // Update ARIA states
  card.setAttribute("aria-pressed", isActive ? "true" : "false");
  const front = card.querySelector(".card-front");
  const back = card.querySelector(".card-back");
  
  front.setAttribute("aria-hidden", isActive ? "true" : "false");
  back.setAttribute("aria-hidden", isActive ? "false" : "true");
  
  // Record this pattern as recently viewed
  const patternName = card.querySelector(".card-front h3").textContent;
  addRecentlyViewedPattern(patternName);
}

/**
 * Returns a sorted & filtered list of patterns.
 */
function getFilteredPatterns(filter, searchQuery, sortBy) {
  const favs = getFavoritePatterns();
  // Filter by category & search
  let filtered = patterns.filter((pattern) => {
    // category
    let matchesCat;
    if (filter === "All") {
      matchesCat = true;
    } else if (filter === "Favorites") {
      matchesCat = favs.has(pattern.name);
    } else {
      matchesCat = pattern.category === filter;
    }
    // search
    const matchesSearch = pattern.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sort if needed
  if (sortBy === "nameAsc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "nameDesc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  return filtered;
}

/**
 * Clears flashcards and re-renders them.
 */
function loadFlashcards(filter = "All", searchQuery = "", sortBy = "none") {
  flashcardsContainer.innerHTML = "";
  const filtered = getFilteredPatterns(filter, searchQuery, sortBy);
  filtered.forEach((pattern) => {
    flashcardsContainer.appendChild(createFlashcard(pattern));
  });
}

// Initial load
loadFlashcards();
updateRecentlyViewedUI(); // show existing from localStorage

// Category & Search
categoryFilter.addEventListener("change", (e) => {
  loadFlashcards(e.target.value, flashcardSearch.value, sortBySelect.value);
});
flashcardSearch.addEventListener("input", (e) => {
  loadFlashcards(categoryFilter.value, e.target.value, sortBySelect.value);
});

// Sort by name
sortBySelect.addEventListener("change", () => {
  loadFlashcards(categoryFilter.value, flashcardSearch.value, sortBySelect.value);
});

// Shuffle flashcards
shuffleFlashcardsBtn.addEventListener("click", () => {
  const filterVal = categoryFilter.value;
  const searchVal = flashcardSearch.value;
  const sortVal = sortBySelect.value;

  let filtered = getFilteredPatterns(filterVal, searchVal, "none");
  shuffle(filtered);
  flashcardsContainer.innerHTML = "";
  filtered.forEach((pattern) => {
    flashcardsContainer.appendChild(createFlashcard(pattern));
  });
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
const viewScoreboardBtn = document.getElementById("viewScoreboard");

/* Custom time input */
const customTimeInput = document.getElementById("customTime");

let currentScore = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let timerInterval;
let timeLeft = 60;
let gameOver = false;
let questionCount = 0;
const MAX_QUESTIONS = 15; // used for progress bar scaling

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

  // Save current score to scoreboard
  addScoreToScoreboard(currentScore);
}

function loadQuizGame() {
  // if user provided a custom time
  const val = parseInt(customTimeInput.value, 10);
  if (!isNaN(val) && val > 0) {
    timeLeft = val;
  } else {
    timeLeft = 60; // fallback if invalid
  }

  currentScore = 0;
  questionCount = 0;
  updateScore();
  quizQuestionElem.textContent = "";
  quizOptionsElem.innerHTML = "";
  progressFill.style.width = "0%";
  clearInterval(timerInterval);
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

    // Use highlight on raw snippet
    const highlighted = highlightCode(questionObj.codeSnippet);
    code.innerHTML = highlighted;

    pre.appendChild(code);
    quizQuestionElem.appendChild(pre);
  }

  questionObj.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.textContent = optionText;
    // ENHANCEMENT: Add keyboard shortcut hints and accessibility
    btn.setAttribute("aria-label", `Option ${index + 1}: ${optionText.substring(0, 50)}${optionText.length > 50 ? '...' : ''}`);
    btn.setAttribute("data-key", index + 1);
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

  // ENHANCEMENT: Add keyboard number shortcuts for quiz options
  window.addEventListener("keydown", function quizKeyHandler(e) {
    if (gameOver) {
      window.removeEventListener("keydown", quizKeyHandler);
      return;
    }
    
    if (e.key >= "1" && e.key <= "4") {
      const index = parseInt(e.key, 10) - 1;
      const buttons = quizOptionsElem.querySelectorAll("button");
      if (index < buttons.length && !buttons[index].disabled) {
        buttons[index].click();
      }
    }
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

/* ENHANCEMENT: Enhanced Dark Mode Toggle */
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
function updateDarkModeButton() {
  if (document.body.classList.contains("dark-mode")) {
    toggleDarkModeBtn.innerHTML = '<i class="moon-icon">🌙</i> Light Mode';
    toggleDarkModeBtn.setAttribute("aria-label", "Switch to light mode");
    toggleDarkModeBtn.setAttribute("aria-pressed", "true");
  } else {
    toggleDarkModeBtn.innerHTML = '<i class="sun-icon">☀️</i> Dark Mode';
    toggleDarkModeBtn.setAttribute("aria-label", "Switch to dark mode");
    toggleDarkModeBtn.setAttribute("aria-pressed", "false");
  }
}

toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
  updateDarkModeButton();
});

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}
updateDarkModeButton();

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
  highlightAllCodeBlocks(); // re-highlight after loading
}

function createCodeSnippetBlock(lang, codeSnippet) {
  const snippetContainer = document.createElement("div");
  snippetContainer.style.marginTop = "1rem";

  const langHeading = document.createElement("h4");
  langHeading.textContent = lang.toUpperCase();
  snippetContainer.appendChild(langHeading);

  const pre = document.createElement("pre");
  pre.className = "code-snippet";

  // Raw snippet => highlight => set innerHTML
  const code = document.createElement("code");
  code.innerHTML = highlightCode(codeSnippet);

  pre.appendChild(code);
  snippetContainer.appendChild(pre);

  // Copy button
  const copyButton = document.createElement("button");
  copyButton.className = "copy-btn";
  copyButton.textContent = "Copy Code";
  copyButton.setAttribute("aria-label", `Copy ${lang} code snippet`);
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      // ENHANCEMENT: Improved feedback for copy button
      const originalText = copyButton.textContent;
      copyButton.textContent = "Copied!";
      copyButton.classList.add("copied");
      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.classList.remove("copied");
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      alert("Failed to copy code. Please try again.");
    });
  });
  snippetContainer.appendChild(copyButton);

  return snippetContainer;
}

languageSelect.addEventListener("change", e => {
  loadCodeExamples(e.target.value);
});
loadCodeExamples("all");

/*********************************************
 * SCOREBOARD ENHANCEMENT
 *********************************************/
const scoreboardKey = "quizScoreboard";

function getScoreboard() {
  const scoreboardData = localStorage.getItem(scoreboardKey);
  if (!scoreboardData) return [];
  return JSON.parse(scoreboardData);
}
function saveScoreboard(data) {
  localStorage.setItem(scoreboardKey, JSON.stringify(data));
}
function addScoreToScoreboard(score) {
  const scoreboard = getScoreboard();
  scoreboard.push({ score, date: new Date().toLocaleString() });
  // sort descending by score
  scoreboard.sort((a, b) => b.score - a.score);
  // keep top 5
  scoreboard.splice(5);
  saveScoreboard(scoreboard);
}
function updateScoreboardUI() {
  const scoreboard = getScoreboard();
  const scoreboardList = document.getElementById("scoreboardList");
  scoreboardList.innerHTML = "";
  scoreboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.score} points on ${entry.date}`;
    // highlight the top score
    if (index === 0) {
      li.classList.add("top-scorer");
    }
    scoreboardList.appendChild(li);
  });
}

/* Scoreboard Modal Logic */
const scoreboardModal = document.getElementById("scoreboardModal");
const closeScoreboard = document.getElementById("closeScoreboard");

viewScoreboardBtn.addEventListener("click", () => {
  updateScoreboardUI();
  scoreboardModal.style.display = "block";
});
closeScoreboard.addEventListener("click", () => {
  scoreboardModal.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === scoreboardModal) {
    scoreboardModal.style.display = "none";
  }
});

/*********************************************
 * PATTERN STATS ENHANCEMENT
 *********************************************/
function displayPatternStats() {
  const categoriesCount = {};
  patterns.forEach(p => {
    if (!categoriesCount[p.category]) {
      categoriesCount[p.category] = 0;
    }
    categoriesCount[p.category]++;
  });
  const statsList = document.getElementById("patternStatsList");
  statsList.innerHTML = "";
  Object.keys(categoriesCount).forEach(cat => {
    const li = document.createElement("li");
    li.textContent = `${cat}: ${categoriesCount[cat]} pattern(s)`;
    statsList.appendChild(li);
  });
}

// Display pattern stats on page load
displayPatternStats();

/*********************************************
 * ENHANCED SYNTAX HIGHLIGHTING
 * ENHANCEMENT: Improved syntax highlighting for code examples
 *********************************************/
function highlightCode(text) {
  // 1) Escape special HTML chars
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;");

  // ENHANCEMENT: More comprehensive syntax highlighting
  
  // Extract language from common indicators (class declarations, imports, etc)
  let lang = "generic";
  if (html.includes("function") && html.includes("console.log")) {
    lang = "javascript";
  } else if (html.includes("public class") || html.includes("System.out.println")) {
    lang = "java";
  } else if (html.includes("def") && html.includes("self") && html.includes("__init__")) {
    lang = "python";
  }
  
  // 2) Highlight specific language constructs based on detected language
  if (lang === "javascript") {
    // Keywords
    const jsKeywords = [
      "class", "function", "return", "if", "else", "const", "let", "var",
      "for", "while", "new", "extends", "this", "super", "null", "undefined",
      "true", "false", "break", "continue", "try", "catch", "finally", "throw"
    ];
    html = html.replace(
      new RegExp("\\b(" + jsKeywords.join("|") + ")\\b(?![=])", "g"),
      '<span class="keyword">$1</span>'
    );
    
    // Numbers
    html = html.replace(
      /\b(\d+(\.\d+)?)\b/g,
      '<span class="number">$1</span>'
    );
    
    // Comments (single and multi-line)
    html = html.replace(
      /(\/\/.*?)(?:\n|$)/g,
      '<span class="comment">$1</span>'
    );
    
    // Function names
    html = html.replace(
      /\b(function)\s+([a-zA-Z0-9_]+)/g,
      '<span class="keyword">$1</span> <span class="function">$2</span>'
    );
    
    // Operators
    html = html.replace(
      /([=+\-*/%&|^!<>?:]+)/g,
      '<span class="operator">$1</span>'
    );
    
    // Strings - simpler, more reliable pattern
    html = html.replace(
      /"[^"\\]*(?:\\.[^"\\]*)*"/g,
      '<span class="string">$&</span>'
    );
    html = html.replace(
      /'[^'\\]*(?:\\.[^'\\]*)*'/g,
      '<span class="string">$&</span>'
    );
    html = html.replace(
      /`[^`\\]*(?:\\.[^`\\]*)*`/g,
      '<span class="string">$&</span>'
    );
    
    // Built-in functions
    html = html.replace(
      /\b(console|document|window|Math|Array|Object|String|Promise)\b/g,
      '<span class="builtin">$1</span>'
    );
  } else if (lang === "java") {
    // Java-specific highlighting
    const javaKeywords = [
      "public", "private", "protected", "static", "final", "abstract", "class", "interface",
      "extends", "implements", "void", "int", "boolean", "String", "new", "return", "if", "else",
      "for", "while", "try", "catch", "throws", "import", "package"
    ];
    
    html = html.replace(
      new RegExp("\\b(" + javaKeywords.join("|") + ")\\b", "g"),
      '<span class="keyword">$1</span>'
    );
    
    // Comments
    html = html.replace(
      /(\/\/.*?)(?:\n|$)/g,
      '<span class="comment">$1</span>'
    );
    
    // Numbers
    html = html.replace(
      /\b(\d+(\.\d+)?[fFL]?)\b/g,
      '<span class="number">$1</span>'
    );
    
    // Strings - simpler pattern
    html = html.replace(
      /"[^"\\]*(?:\\.[^"\\]*)*"/g,
      '<span class="string">$&</span>'
    );
  } else if (lang === "python") {
    // Python-specific highlighting
    const pythonKeywords = [
      "def", "class", "from", "import", "if", "elif", "else", "for", "while", "in",
      "not", "and", "or", "return", "try", "except", "finally", "with", "as", "self",
      "True", "False", "None", "pass", "continue", "break"
    ];
    
    html = html.replace(
      new RegExp("\\b(" + pythonKeywords.join("|") + ")\\b", "g"),
      '<span class="keyword">$1</span>'
    );
    
    // Comments
    html = html.replace(
      /(#.*?)(?:\n|$)/g,
      '<span class="comment">$1</span>'
    );
    
    // Numbers
    html = html.replace(
      /\b(\d+(\.\d+)?)\b/g,
      '<span class="number">$1</span>'
    );
    
    // Strings - simpler patterns for single and double quotes
    html = html.replace(
      /"[^"\\]*(?:\\.[^"\\]*)*"/g,
      '<span class="string">$&</span>'
    );
    html = html.replace(
      /'[^'\\]*(?:\\.[^'\\]*)*'/g,
      '<span class="string">$&</span>'
    );
  } else {
    // Generic highlighting for any other language
    // Comments (single line style)
    html = html.replace(
      /(\/\/.*|#.*?)(?:\n|$)/g,
      '<span class="comment">$1</span>'
    );
    
    // Strings - simpler patterns
    html = html.replace(
      /"[^"\\]*(?:\\.[^"\\]*)*"/g,
      '<span class="string">$&</span>'
    );
    html = html.replace(
      /'[^'\\]*(?:\\.[^'\\]*)*'/g,
      '<span class="string">$&</span>'
    );
  }
  
  return html;
}