/* ==========================================
   QUERIES PAGE - Interactive Q&A (Firebase RTDB — Live Sync)
   ========================================== */

const questions = [
    "Apna Anniversary date kya hai?",
    "Apna first kiss day?",
    "Apko hmse aur kya kya improvement chahiye?",
    "Apko mujh me sbse aacha kya lgta hai?",
    "Apko mujhe me sbse kharab kya lgta hai?",
    "App kya chahte hai hum apke liye aur kya kre jis se aap khus rhe?",
    "Aap mujhe aur kya kya naam se bulana pasand krte hai?",
    "Apka mere sath sbse aacha pal kaun sa hai?",
    "Apka mere sath sbse kharab pal kab rha?",
    "Kya sbse jyada safe kiske sath feel krte ho?",
    "Kya aap mere sath comfortable feel krte hai?",
    "In future kabhi aisa ho skta hai ki aap mujhe chor k ja sakte hai?",
    "In case mera career banane me late ho jaye to tb bhi aap mujh se shadi krogi?"
];

let currentQuestion = 0;
let answers = [];

// Load saved answers from Firebase
function loadAnswers() {
    return dbLoad('love-site/queries/answers').then(saved => {
        if (saved && Array.isArray(saved)) {
            answers = saved;
        } else {
            answers = new Array(questions.length).fill('');
        }
    });
}

// Save answers to Firebase
function saveAnswers() {
    dbSave('love-site/queries/answers', answers);
}

// Save the current answer before switching
function saveCurrentAnswer() {
    const input = document.getElementById('answerInput');
    answers[currentQuestion] = input.value;
    saveAnswers();
}

// Display a specific question
function showQuestion(index) {
    const card = document.getElementById('queryCard');
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const answerInput = document.getElementById('answerInput');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'slideIn 0.5s ease forwards';

    questionNumber.textContent = `Q${index + 1}`;
    questionText.textContent = questions[index];
    answerInput.value = answers[index] || '';

    const progress = ((index + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
    progressText.textContent = `${index + 1} / ${questions.length}`;

    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

    if (index === questions.length - 1) {
        nextBtn.textContent = 'Submit ✅';
    } else {
        nextBtn.textContent = 'Next →';
    }

    setTimeout(() => answerInput.focus(), 300);
}

// Start the queries
window.startQueries = function () {
    loadAnswers().then(() => {
        document.getElementById('queryIntro').style.display = 'none';
        document.getElementById('queryContainer').style.display = 'flex';
        currentQuestion = 0;
        showQuestion(currentQuestion);
    });
}

// Next Question
window.nextQuestion = function () {
    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        showCompletionScreen();
    }
}

// Previous Question
window.prevQuestion = function () {
    saveCurrentAnswer();

    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Show completion screen
function showCompletionScreen() {
    document.getElementById('queryContainer').style.display = 'none';
    document.getElementById('queryComplete').style.display = 'flex';

    if (typeof createHeartAnimation === 'function') {
        for (let i = 0; i < 20; i++) {
            createHeartAnimation();
        }
    }
}

// Review Answers — live from Firebase
window.reviewAnswers = function () {
    document.getElementById('queryComplete').style.display = 'none';
    document.getElementById('queryReview').style.display = 'block';

    // Listen for live answers
    dbListen('love-site/queries/answers', (liveAnswers) => {
        if (liveAnswers && Array.isArray(liveAnswers)) {
            answers = liveAnswers;
        }

        const reviewList = document.getElementById('reviewList');
        reviewList.innerHTML = '';

        questions.forEach((q, i) => {
            const item = document.createElement('div');
            item.classList.add('review-item');

            const questionEl = document.createElement('div');
            questionEl.classList.add('review-question');
            questionEl.textContent = `Q${i + 1}. ${q}`;

            const answerEl = document.createElement('div');
            answerEl.classList.add('review-answer');

            if (answers[i] && answers[i].trim() !== '') {
                answerEl.textContent = answers[i];
            } else {
                answerEl.textContent = '(No answer yet)';
                answerEl.classList.add('empty');
            }

            item.appendChild(questionEl);
            item.appendChild(answerEl);
            reviewList.appendChild(item);
        });
    });
}

// Go back from review to completion
window.goBackToComplete = function () {
    // Stop listening when leaving review
    db.ref('love-site/queries/answers').off('value');
    document.getElementById('queryReview').style.display = 'none';
    document.getElementById('queryComplete').style.display = 'flex';
}

// Allow Enter key to go to next question (Shift+Enter for new line)
document.addEventListener('keydown', function (e) {
    const answerInput = document.getElementById('answerInput');
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement === answerInput) {
        e.preventDefault();
        nextQuestion();
    }
});
