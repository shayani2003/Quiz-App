
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Function to fetch questions from API
async function fetchQuestions() {
    const url = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple"; // Modify as needed
    try {
        const response = await fetch(url);
        const data = await response.json();
        questions = data.results.map((q) => ({
            question: q.question,
            answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer]),
            correctAnswer: q.correct_answer,
        }));
        startQuiz();
    } catch (error) {
        console.error("Failed to fetch questions:", error);
    }
}


function shuffleAnswers(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    nextButton.removeEventListener("click", startQuiz); // Remove any previous restart listeners
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer === currentQuestion.correctAnswer) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
    });
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Restart";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", startQuiz, { once: true }); // Restart only once
}


fetchQuestions();
