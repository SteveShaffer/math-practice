const answerEl = document.getElementById('answer');
const counterEl = document.getElementById('counter');
const problemEl = document.getElementById('problem');
const responseEl = document.getElementById('response');

const delay = 200;  // ms

let correctAnswerText = '';
let countCorrect = 0;

initProblem();

answerEl.addEventListener('input', answerUpdated);

function answerUpdated(e) {
    const enteredAnswer = answerEl.value;
    if (correctAnswerText === enteredAnswer) {
        setResponse('YAY!', true);
        logCorrect();
        setTimeout(() => initProblem(), delay);
    }
    else if (correctAnswerText.startsWith(enteredAnswer)) {
        setResponse('Keep going...');
    }
    else {
        setResponse('Nope', true);
        // TODO: This is not graceful
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
    counterEl.innerHTML = countCorrect;
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function setAnswer(answerText) {
    setTimeout(() => {
        answerEl.value = answerText;
    }, delay);
}

function setResponse(responseText, isTemporary){
    responseEl.innerHTML = responseText;
    try {
        if (responseText.length > 0 && isTemporary) {
            setTimeout(() => setResponse(''), delay * 2);
        }
    } catch {
        // Do nothing
    }
}
