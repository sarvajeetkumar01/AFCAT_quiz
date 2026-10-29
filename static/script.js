```javascript
let questions = [];

let currentQuestion = 0;
let answers = [];
let isSubmitted = false;


// ==========================================
// HTML elements
// ==========================================

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const previousButton = document.getElementById("previous-btn");
const questionNumberElement = document.getElementById("question-number");
const totalQuestionsElement = document.getElementById("total-questions");
const questionNumbersElement = document.getElementById("question-numbers");
const submitButton = document.getElementById("submit-btn");


// ==========================================
// Only run quiz code on test page
// ==========================================

if (questionElement) {

    // ==========================================
    // Load normal AFCAT test questions
    // ==========================================

    fetch("/static/afcat_2_2026.json")
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Failed to load AFCAT questions.");
            }

            return response.json();

        })
        .then(function(data) {

            questions = data;

            if (questions.length === 0) {
                questionElement.textContent = "No questions available.";
                return;
            }

            answers = new Array(questions.length);

            showQuestion();
            createQuestionNumbers();

        })
        .catch(function(error) {

            console.error("Error loading questions:", error);

            questionElement.textContent =
                "Unable to load questions. Please refresh the page.";

        });


    // ==========================================
    // Show question
    // ==========================================

    function showQuestion() {

        if (questions.length === 0) {
            return;
        }

        questionElement.textContent =
            questions[currentQuestion].question;

        questionNumberElement.textContent =
            currentQuestion + 1;

        totalQuestionsElement.textContent =
            questions.length;

        optionsElement.innerHTML = "";


        Object.entries(
            questions[currentQuestion].options
        ).forEach(function([letter, option]) {

            const button = document.createElement("button");

            button.classList.add("option");

            button.textContent = option;


            // Show selected answer

            if (answers[currentQuestion] === letter) {

                button.style.backgroundColor = "black";
                button.style.color = "white";

            }


            // Select answer

            button.addEventListener("click", function() {

                answers[currentQuestion] = letter;

                showQuestion();
                createQuestionNumbers();

            });


            optionsElement.appendChild(button);

        });

    }


    // ==========================================
    // Create question numbers
    // ==========================================

    function createQuestionNumbers() {

        questionNumbersElement.innerHTML = "";


        questions.forEach(function(question, index) {

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


            // Navigate to selected question

            button.addEventListener("click", function() {

                currentQuestion = index;

                showQuestion();
                createQuestionNumbers();

            });


            questionNumbersElement.appendChild(button);

        });

    }


    // ==========================================
    // Calculate result
    // ==========================================

    function calculateResult(autoSubmit = false) {

        if (isSubmitted || questions.length === 0) {
            return;
        }


        let correct = 0;
        let wrong = 0;
        let unattempted = 0;


       