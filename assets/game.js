const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const timerText = document.getElementById('timer');
const progressBarFull = document.getElementById('progressBarFull');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timer;
let timerCount;

let questions = [
    {
        question: 'Which one is a primitive value',
        choice1: 'Boolean',
        choice2: 'Const',
        choice3: 'Let',
        choice4: 'Var',
        answer: 1
    },
    {
        question: 'What does the abbreviation HTML stand for?',
        choice1: 'HighText Markup Language',
        choice2: 'HyperText Markup Language',
        choice3: 'HyperText Markdown Language',
        choice4: 'None of the Above',
        answer: 2
    },
    {
        question: 'Which of the following keywords is used to define a variable in JavaScript?',
        choice1: 'var',
        choice2: 'let',
        choice3: 'Both A and B',
        choice4: 'None of the above',
        answer: 3
    },
    {
        question: 'Which of the following methods is used to access HTML elements using JavaScript?',
        choice1: 'getElementbyId()',
        choice2: 'getElementsByClassName()',
        choice3: 'Both A and B',
        choice4: 'None of the above',
        answer: 3
    },
    {
        question: 'How can we change the background color of an element in CSS?',
        choice1: 'background-color',
        choice2: 'color',
        choice3: 'Both A and B',
        choice4: 'None of the above',
        answer: 1
    }
]

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;
const TIME_PENALTY = -10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    timerCount = 60
    availableQuestions = [...questions];
    getNewQuestion();
    startTimer();
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        // go to the end page
        return window.location.assign('./end.html');
    }
    questionCounter++;
    progressText.innerText = questionCounter + '/' + MAX_QUESTIONS;
    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

// Timer

function startTimer() {
    timer = setInterval(function() {
        timerCount--;
        timerText.textContent = timerCount;
        if (timerCount === 0) {
            timerEnd()
        }
    },1000);
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

            if(classToApply === 'correct') {
                incrementScore(CORRECT_BONUS);
            } else {
                decrementTime(TIME_PENALTY);
            }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
}

decrementTime = TIME_PENALTY => {
    timerCount -= 10;
    var timerText = document.getElementById('timer');
    timerText.classList.add('flash-red');
    setTimeout(function(){
        timerText.classList.remove('flash-red');
    }, 1000)
}

// ADD TIMER STOP AT 0 => LOSE
timerEnd = () => {
    if (confirm('You ran out of time! Would you like to play again?')) {
        startGame();}
// go back to home screen
        else {window.location.assign('./index.html')}
}

startGame ();