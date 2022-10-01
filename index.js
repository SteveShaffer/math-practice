const answerEl = document.getElementById('answer');
const bodyEl = document.body;
const counterEl = document.getElementById('countCorrect');
const problemEl = document.getElementById('problem');
const responseEl = document.getElementById('response');

const delay = 300;  // ms
const responses = {
    blank: {
        color: 'white',
        text: ''
    },
    correct: {
        color: 'green',
        text: 'YAY!'
    },
    keepGoing: {
        color: 'lightgreen',
        text: 'Keep going...'
    },
    wrong: {
        color: 'yellow',
        text: 'Nope'
    }
};

let correctAnswerText = '';
let countCorrect = 0;

answerEl.focus();
initProblem();
renderCounter();

answerEl.addEventListener('input', answerUpdated);

function answerUpdated(e) {
    const enteredAnswer = answerEl.value;
    if (correctAnswerText === enteredAnswer) {
        setResponse(responses.correct, true);
        logCorrect();
        setTimeout(() => initProblem(), delay);
    }
    else if (correctAnswerText.startsWith(enteredAnswer)) {
        setResponse(responses.keepGoing);
    }
    else {
        setResponse(responses.wrong, true);
        // TODO: This is not graceful?
        for (let i = enteredAnswer.length; i>0; i--) {
            const partialAnswer = enteredAnswer.substring(0,i);
            if (correctAnswerText.startsWith(partialAnswer)) {
                setAnswer(partialAnswer);
                return;
            }
        }
        setAnswer(null);
    }
}

// TODO: Allow things (one or both digits, operator) to be anchored
// TODO: Allow for other operators
// TODO: Allow customization of ranges
function initProblem() {
    const firstNum = randomDigit();
    const secondNum = randomDigit();
    const problemText = `${firstNum} x ${secondNum}`;
    correctAnswerText = `${firstNum * secondNum}`;

    problemEl.innerHTML = problemText;
    setAnswer(null);
}

function logCorrect() {
    countCorrect++;
    renderCounter();
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function renderCounter() {
    counterEl.innerHTML = countCorrect;
}

function setAnswer(answerText) {
    setTimeout(() => {
        answerEl.value = answerText;
    }, delay);
}

function setResponse(response, isTemporary){
    responseEl.innerHTML = response.text;
    bodyEl.style.backgroundColor = response.color;
    try {
        if (response.text.length > 0 && isTemporary) {
            setTimeout(() => setResponse(responses.blank), delay * 2);
        }
    } catch {
        // Do nothing
    }
}
