let questions = [];

let currentQuestion = 0;
let answers = [];
let isSubmitted = false;


// HTML elements

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");
const questionNumberElement = document.getElementById("question-number");
const totalQuestionsElement = document.getElementById("total-questions");
const questionNumbersElement = document.getElementById("question-numbers");
const submitButton = document.getElementById("submit-btn");


// Load questions from JSON

fetch("/static/afcat_2_2026.json")
    .then(function(response) {

        return response.json();

    })
    .then(function(data) {

        questions = data;

        showQuestion();
        createQuestionNumbers();

    })
    .catch(function(error) {

        console.error("Error loading questions:", error);

    });


// Show question

function showQuestion() {

    questionElement.textContent = questions[currentQuestion].question;

    questionNumberElement.textContent = currentQuestion + 1;

    totalQuestionsElement.textContent = questions.length;

    optionsElement.innerHTML = "";


    Object.entries(questions[currentQuestion].options).forEach(function ([letter, option]) {

        const button = document.createElement("button");

        button.classList.add("option");

        button.textContent = option;


        // Show selected answer

        if (answers[currentQuestion] === letter) {

            button.style.backgroundColor = "black";

            button.style.color = "white";

        }


        // Select answer

        button.addEventListener("click", function () {

            answers[currentQuestion] = letter;

            showQuestion();

            createQuestionNumbers();

        });


        optionsElement.appendChild(button);

    });

}


// Create question numbers

function createQuestionNumbers() {

    questionNumbersElement.innerHTML = "";


    questions.forEach(function (question, index) {

        const button = document.createElement("button");

        button.textContent = index + 1;


        // Current question

        if (index === currentQuestion) {

            button.style.backgroundColor = "black";

            button.style.color = "white";

        }


        // Answered question

        else if (answers[index] !== undefined) {

            button.style.backgroundColor = "#ddd";

            button.style.color = "black";

        }


        button.addEventListener("click", function () {

            currentQuestion = index;

            showQuestion();

            createQuestionNumbers();

        });


        questionNumbersElement.appendChild(button);

    });

}


// Calculate result

function calculateResult(autoSubmit = false) {

    if (isSubmitted) {

        return;

    }


    let correct = 0;
    let wrong = 0;
    let unattempted = 0;


    questions.forEach(function (question, index) {

        if (answers[index] === undefined) {

            unattempted++;

        }

        else if (answers[index] === question.answer) {

            correct++;

        }

        else {

            wrong++;

        }

    });


    // Confirm normal submission if questions are unanswered

    if (unattempted > 0 && autoSubmit === false) {

        const confirmSubmit = confirm(
            "You have " + unattempted +
            " unanswered question(s). Are you sure you want to submit?"
        );


        if (!confirmSubmit) {

            return;

        }

    }


    isSubmitted = true;


    let totalQuestions = questions.length;

    let score = correct;

    let accuracy = 0;


    if (totalQuestions > 0) {

        accuracy = (correct / totalQuestions) * 100;

    }


    window.location.href =
        "/result?total=" + totalQuestions +
        "&correct=" + correct +
        "&wrong=" + wrong +
        "&unattempted=" + unattempted +
        "&score=" + score +
        "&accuracy=" + accuracy.toFixed(2);

}


// Next button

nextButton.addEventListener("click", function () {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

        createQuestionNumbers();

    }

});


// Previous button

previousButton.addEventListener("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

        createQuestionNumbers();

    }

});


// Submit button

submitButton.addEventListener("click", function () {

    calculateResult();

});


// Timer

let timeLeft = 120 * 60;

const timerElement = document.getElementById("timer");


const timer = setInterval(function () {

    let minutes = Math.floor(timeLeft / 60);

    let seconds = timeLeft % 60;


    if (seconds < 10) {

        seconds = "0" + seconds;

    }


    timerElement.textContent = minutes + ":" + seconds;

    timeLeft--;


    if (timeLeft < 0) {

        clearInterval(timer);

        calculateResult(true);

    }

}, 1000);