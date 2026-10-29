let questions = [];

let currentQuestion = 0;
let answers = [];
let isSubmitted = false;


// ==========================================
// Random Quiz button
// ==========================================

const randomQuizButton = document.getElementById("random-quiz-btn");

if (randomQuizButton) {

    randomQuizButton.addEventListener("click", function () {

        fetch("/static/random.json")
            .then(function(response) {

                return response.json();

            })
            .then(function(data) {

                // Shuffle questions
                data.sort(function() {

                    return Math.random() - 0.5;

                });


                // Pick 10 random questions
                const randomQuestions = data.slice(0, 10);


                // Save random questions
                sessionStorage.setItem(
                    "randomQuestions",
                    JSON.stringify(randomQuestions)
                );


                // Remember that this is a random quiz
                sessionStorage.setItem("testType", "random");


                // Go to test page
                window.location.href = "/test";

            })
            .catch(function(error) {

                console.error("Error loading questions:", error);

            });

    });

}


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
    // Check for Random Quiz questions
    // ==========================================

    const savedRandomQuestions =
        sessionStorage.getItem("randomQuestions");


    if (savedRandomQuestions) {

        questions = JSON.parse(savedRandomQuestions);

        // Remove them so refreshing /test
        // does not reuse the same random quiz
        sessionStorage.removeItem("randomQuestions");

        showQuestion();
        createQuestionNumbers();

    }


    else {

        // ==========================================
        // Load normal full test
        // ==========================================

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

    }


    // ==========================================
    // Show question
    // ==========================================

    function showQuestion() {

        questionElement.textContent =
            questions[currentQuestion].question;

        questionNumberElement.textContent =
            currentQuestion + 1;

        totalQuestionsElement.textContent =
            questions.length;

        optionsElement.innerHTML = "";


        Object.entries(
            questions[currentQuestion].options
        ).forEach(function ([letter, option]) {

            const button = document.createElement("button");

            button.classList.add("option");

            button.textContent = option;


            // ==========================================
            // Show selected answer
            // ==========================================

            if (answers[currentQuestion] === letter) {

                button.style.backgroundColor = "black";

                button.style.color = "white";

            }


            // ==========================================
            // Select answer
            // ==========================================

            button.addEventListener("click", function () {

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


        questions.forEach(function (question, index) {

            const button = document.createElement("button");

            button.textContent = index + 1;


            // ==========================================
            // Current question
            // ==========================================

            if (index === currentQuestion) {

                button.style.backgroundColor = "black";

                button.style.color = "white";

            }


            // ==========================================
            // Answered question
            // ==========================================

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


    // ==========================================
    // Calculate result
    // ==========================================

    function calculateResult(autoSubmit = false) {

        if (isSubmitted) {

            return;

        }


        let correct = 0;

        let wrong = 0;

        let unattempted = 0;


        // ==========================================
        // Check all answers
        // ==========================================

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


        // ==========================================
        // Confirm normal submission
        // if questions are unanswered
        // ==========================================

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


        // ==========================================
        // Calculate score
        // ==========================================

        let totalQuestions = questions.length;

        let score = correct;

        let accuracy = 0;


        if (totalQuestions > 0) {

            accuracy =
                (correct / totalQuestions) * 100;

        }


        // ==========================================
        // Calculate time taken
        // ==========================================

        let timeTaken = totalTime - timeLeft;

        let timeTakenMinutes =
            Math.floor(timeTaken / 60);

        let timeTakenSeconds =
            timeTaken % 60;


        // Make seconds two digits
        timeTakenSeconds =
            String(timeTakenSeconds).padStart(2, "0");


        // ==========================================
        // Send result to result page
        // ==========================================

        window.location.href =

            "/result?total=" + totalQuestions +

            "&correct=" + correct +

            "&wrong=" + wrong +

            "&unattempted=" + unattempted +

            "&score=" + score +

            "&accuracy=" + accuracy.toFixed(2) +

            "&time=" +
            timeTakenMinutes + ":" +
            timeTakenSeconds;

    }


    // ==========================================
    // Next button
    // ==========================================

    nextButton.addEventListener("click", function () {

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;

            showQuestion();

            createQuestionNumbers();

        }

    });


    // ==========================================
    // Previous button
    // ==========================================

    previousButton.addEventListener("click", function () {

        if (currentQuestion > 0) {

            currentQuestion--;

            showQuestion();

            createQuestionNumbers();

        }

    });


    // ==========================================
    // Submit button
    // ==========================================

    submitButton.addEventListener("click", function () {

        calculateResult();

    });


    // ==========================================
    // Timer
    // ==========================================

    let timeLeft = 120 * 60;

    // Total allowed time
    let totalTime = 120 * 60;

    const timerElement =
        document.getElementById("timer");


    const timer = setInterval(function () {

        let minutes =
            Math.floor(timeLeft / 60);

        let seconds =
            timeLeft % 60;


        if (seconds < 10) {

            seconds = "0" + seconds;

        }


        timerElement.textContent =
            minutes + ":" + seconds;


        timeLeft--;


        // ==========================================
        // Time finished
        // ==========================================

        if (timeLeft < 0) {

            clearInterval(timer);

            calculateResult(true);

        }

    }, 1000);

}