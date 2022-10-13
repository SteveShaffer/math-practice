const answerEl = document.getElementById('answer');
const bodyEl = document.body;
const counterEl = document.getElementById('countCorrect');
const mainEl = document.getElementById('main');
const problemEl = document.getElementById('problem');
const responseEl = document.getElementById('response');
const timerEl = document.getElementById('timer');

const delay = 300;  // ms
const backgroundColor = Math.floor(Math.random()*16777215).toString(16);  // Random color
const responses = {
    blank: {
        text: ''
    },
    correct: {
        color: 'green',
        isTemporary: true,
        text: 'YAY!'
    },
    keepGoing: {
        color: 'lightgreen',
        text: 'Keep going...'
    },
    wrong: {
        color: 'yellow',
        isTemporary: true,
        text: 'Nope'
    }
};

let correctAnswerText = '';
let countCorrect = 0;
let startTime;

bodyEl.style.backgroundColor = backgroundColor;
answerEl.focus();
initProblem();
renderCounter();
startTimer();

answerEl.addEventListener('input', answerUpdated);

function answerUpdated(e) {
    const enteredAnswer = answerEl.value;
    if (correctAnswerText === enteredAnswer) {
        setResponse(responses.correct);
        logCorrect();
        setTimeout(() => initProblem(), delay);
    }
    else if (correctAnswerText.startsWith(enteredAnswer)) {
        setResponse(responses.keepGoing);
    }
    else {
        setResponse(responses.wrong);
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

function setResponse(response) {
    responseEl.innerHTML = response.text;
    mainEl.style.backgroundColor = response.color || null;
    try {
        if (response.text.length > 0 && response.isTemporary) {
            setTimeout(() => setResponse(responses.blank), delay * 2);
        }
    } catch {
        // Do nothing
    }
}

function startTimer() {
    startTime = new Date();
    setInterval(() => {
        let seconds = Math.floor( (new Date() - startTime) / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
        // TODO: Ensure double-digit segments
        timerEl.innerHTML = `${hours || '00'}:${minutes || '00'}:${seconds || '00'}`;
    }, 1000);
}
