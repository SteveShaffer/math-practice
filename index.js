const answerEl = document.getElementById('answer');
const bodyEl = document.body;
const counterEl = document.getElementById('countCorrect');
const mainEl = document.getElementById('main');
const problemEl = document.getElementById('problem');
const responseEl = document.getElementById('response');

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

bodyEl.style.backgroundColor = backgroundColor;
answerEl.focus();
initProblem();
// TODO: Make an optional feature (and mark experimental?)
initSpeechRecognition();
renderCounter();

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

function initSpeechRecognition() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    // TODO: There's a slicker way to write this
    const numbers = [];
    for (let i=0; i<100; i++) {
        numbers.push(`${i}`);
    }
    
    const recognition = new SpeechRecognition();

    // TODO: Why isn't the grammar list working?
    if (SpeechGrammarList) {
        // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
        // This code is provided as a demonstration of possible capability. You may choose not to use it.
        var speechRecognitionList = new SpeechGrammarList();
        var grammar = '#JSGF V1.0; grammar numbers; public <number> = ' + numbers.join(' | ') + ' ;'
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
    }
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
        // TODO: Adding it directly in causes issues when the result is partially correct (due to the backspacing logic used for text inputs)
        answerEl.value = event.results[event.results.length - 1][0].transcript.trim();
        answerUpdated();
    }

    recognition.start();
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
