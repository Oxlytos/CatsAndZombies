//frågesport api: https://opentdb.com/api_config.php
async function getCatFact() {
    const url = "https://catfact.ninja/fact?max_length=60";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result.fact;

    } catch (error) {
        console.error(error.message);
    }
}
//Get traveler quiz
async function getTravelerQuiz(params) {
    const url = "https://opentdb.com/api.php?amount=1&type=multiple";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();

        let question = result.results[0].question;
        let wrongAnswers = result.results[0].incorrect_answers;
        let correctAnswer = result.results[0].correct_answer;
        if (cheatModeActivated) {
            console.log(correctAnswer)

        }

        let quiz = new Quiz(
            question,
            correctAnswer,
            wrongAnswers
        );
        return quiz;

    } catch (error) {
        console.error(error.message);
    }
}
//From API call, throw in the answer (string) and if its correct or not
function buildQuizButton(answer, isCorrect) {
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", answer);
    buttonToReturn.dataset.isCorrect = isCorrect;
    buttonToReturn.onclick = answerQuestion;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}


//From button, check if input has isCorrect
function answerQuestion(event) {

    const gameDiv = document.getElementById("gameArea");
    const button = event.target;

    if (button.dataset.isCorrect === "true") {
        console.log("Correct!");
        document.getElementById("question").remove();
        document.getElementById("button_map").remove();
        buildPlayerButton();
        clearEntity();

    } else {

        console.log("Wrong!");
        entityImage.src = monthyPythonGif;
        entityImage.src = monthyPythonGif + `?reload=${performance.now()}`;
        setTimeout(loseGame, 4000)
        //Game over
    }
}
