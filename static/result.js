const params = new URLSearchParams(window.location.search);


const totalQuestions = params.get("total");

const correct = params.get("correct");

const wrong = params.get("wrong");

const unattempted = params.get("unattempted");

const score = params.get("score");

const accuracy = params.get("accuracy");


document.getElementById("total-questions").textContent = totalQuestions;

document.getElementById("correct-answers").textContent = correct;

document.getElementById("wrong-answers").textContent = wrong;

document.getElementById("unattempted").textContent = unattempted;

document.getElementById("score").textContent = score;

document.getElementById("accuracy").textContent = accuracy + "%";

document.getElementById("score-display").textContent = score;

document.getElementById("accuracy-display").textContent = accuracy + "% Accuracy";