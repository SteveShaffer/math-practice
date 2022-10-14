const answerEl = document.getElementById('answer');
const bodyEl = document.body;
const counterEl = document.getElementById('countCorrect');
const mainEl = document.getElementById('main');
const problemEl = document.getElementById('problem');
const responseEl = document.getElementById('response');
const timerEl = document.getElementById('timer');
const timerStartStopEl = document.getElementById('timerStartStop');

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
const timerStates = {
    0: { // Init
        text: 'Start',
        color: 'lightgreen',
        handler: startTimer
    },
    1: { // Running
        text: 'Stop',
        color: 'indianred',
        handler: stopTimer
    },
    2: { // Stopped
        text: 'Reset',
        color: 'lightgray',
        handler: resetTimer
    }
};

let correctAnswerText = '';
let countCorrect = 0;
let startTime;
let timerState;  // 0 = Ready to start, 1 = Running, 2 = Stopped
let timerIntervalId;

bodyEl.style.backgroundColor = backgroundColor;
answerEl.focus();
initProblem();
renderCounter();
resetTimer();

answerEl.addEventListener('input', answerUpdated);
timerStartStopEl.addEventListener('click', timerStartStopClicked);

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

function renderTimer() {
    let seconds = Math.floor((new Date() - startTime) / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes - hours * 60;
    timerEl.innerHTML = `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
}

function renderTimerStartStop() {
    const state = timerStates[timerState];
    timerStartStopEl.innerHTML = state.text;
    timerStartStopEl.style.backgroundColor = state.color;
}

function resetTimer() {
    stopTimer();
    timerEl.innerHTML = '00:00:00';
    timerState = 0;
    renderTimerStartStop();
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
    timerIntervalId = setInterval(renderTimer, 1000);
    timerState = 1;
    renderTimerStartStop();
}

function stopTimer() {
    startTime = undefined;
    timerIntervalId && clearInterval(timerIntervalId);
    timerState = 2;
    renderTimerStartStop();
}

function timerStartStopClicked() {
    timerStates[timerState].handler();
}

/**
 * Pads a number with a leading zero if it isn't already 2 digits
 * Intended to be used for padding the segments of a HH:MM:SS time clock.
 */
function zeroPad(number) {
    if(`${number}`.length === 1) {
        return `0${number}`;
    }
    return `${number}`;
}
