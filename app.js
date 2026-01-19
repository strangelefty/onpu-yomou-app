/**
 * おんぷをよもう！ - Music Note Reading Practice App
 * 幼児向け音符読み練習アプリ
 */

// ============================================
// Constants & Configuration
// ============================================

const CONFIG = {
    questionsPerRound: 5,
    feedbackDuration: 500,  // フィードバック表示時間を短縮
    autoAdvanceDelay: 600,  // 正解後、自動で次に進むまでの時間
    noteSpacing: 100,
    startX: 130,
};

// Note definitions for Treble Clef (ト音記号): C4 to G5
const TREBLE_NOTES = [
    { name: 'ド', pitch: 'C4', y: 160, ledgerLines: [160] },  // Middle C with ledger line
    { name: 'レ', pitch: 'D4', y: 150, ledgerLines: [] },
    { name: 'ミ', pitch: 'E4', y: 140, ledgerLines: [] },
    { name: 'ファ', pitch: 'F4', y: 130, ledgerLines: [] },
    { name: 'ソ', pitch: 'G4', y: 120, ledgerLines: [] },
    { name: 'ラ', pitch: 'A4', y: 110, ledgerLines: [] },
    { name: 'シ', pitch: 'B4', y: 100, ledgerLines: [] },
    { name: 'ド', pitch: 'C5', y: 90, ledgerLines: [] },
    { name: 'レ', pitch: 'D5', y: 80, ledgerLines: [] },
    { name: 'ミ', pitch: 'E5', y: 70, ledgerLines: [] },
    { name: 'ファ', pitch: 'F5', y: 60, ledgerLines: [] },
    { name: 'ソ', pitch: 'G5', y: 50, ledgerLines: [] },
];

// Note definitions for Bass Clef (ヘ音記号): G2 to D4
// 五線譜: y=60(第1線), y=80(第2線), y=100(第3線), y=120(第4線), y=140(第5線)
// ヘ音記号では第4線(y=120)がファ(F3)
const BASS_NOTES = [
    { name: 'ソ', pitch: 'G2', y: 160, ledgerLines: [160] },   // 下第1線
    { name: 'ラ', pitch: 'A2', y: 150, ledgerLines: [] },      // 下第1間
    { name: 'シ', pitch: 'B2', y: 140, ledgerLines: [] },      // 第1線
    { name: 'ド', pitch: 'C3', y: 130, ledgerLines: [] },      // 第1間
    { name: 'レ', pitch: 'D3', y: 120, ledgerLines: [] },      // 第2線
    { name: 'ミ', pitch: 'E3', y: 110, ledgerLines: [] },      // 第2間
    { name: 'ファ', pitch: 'F3', y: 100, ledgerLines: [] },    // 第3線
    { name: 'ソ', pitch: 'G3', y: 90, ledgerLines: [] },       // 第3間
    { name: 'ラ', pitch: 'A3', y: 80, ledgerLines: [] },       // 第4線
    { name: 'シ', pitch: 'B3', y: 70, ledgerLines: [] },       // 第4間
    { name: 'ド', pitch: 'C4', y: 60, ledgerLines: [] },       // 第5線 (Middle C)
    { name: 'レ', pitch: 'D4', y: 50, ledgerLines: [] },       // 上第1間
];

// ============================================
// Game State
// ============================================

const state = {
    mode: 'treble', // 'treble' or 'bass'
    currentNotes: [],
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    trebleBtn: document.getElementById('treble-btn'),
    bassBtn: document.getElementById('bass-btn'),
    clefSymbol: document.getElementById('clef-symbol'),
    notesContainer: document.getElementById('notes-container'),
    currentQuestion: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    scoreDisplay: document.getElementById('score'),
    answerButtons: document.getElementById('answer-buttons'),
    feedback: document.getElementById('feedback'),

    resultModal: document.getElementById('result-modal'),
    resultStars: document.getElementById('result-stars'),
    resultTotal: document.getElementById('result-total'),
    resultCorrect: document.getElementById('result-correct'),
    resultMessage: document.getElementById('result-message'),
    restartBtn: document.getElementById('restart-btn'),
};

// ============================================
// Utility Functions
// ============================================

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random notes for the current round
 */
function getRandomNotes(count) {
    const notes = state.mode === 'treble' ? TREBLE_NOTES : BASS_NOTES;
    const shuffled = shuffleArray(notes);
    return shuffled.slice(0, count);
}

/**
 * Create a note SVG element
 */
function createNoteSVG(note, index, isHighlighted = false) {
    const x = CONFIG.startX + index * CONFIG.noteSpacing;
    const y = note.y;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('note');
    group.setAttribute('data-index', index);

    // Add ledger lines if needed
    note.ledgerLines.forEach(lineY => {
        const ledgerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ledgerLine.classList.add('ledger-line');
        ledgerLine.setAttribute('x1', x - 20);
        ledgerLine.setAttribute('y1', lineY);
        ledgerLine.setAttribute('x2', x + 20);
        ledgerLine.setAttribute('y2', lineY);
        group.appendChild(ledgerLine);
    });

    // Note head (ellipse)
    const noteHead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    noteHead.classList.add('note-head');
    if (isHighlighted) {
        noteHead.classList.add('highlight');
    }
    noteHead.setAttribute('cx', x);
    noteHead.setAttribute('cy', y);
    noteHead.setAttribute('rx', 12);
    noteHead.setAttribute('ry', 9);
    noteHead.setAttribute('transform', `rotate(-15, ${x}, ${y})`);
    group.appendChild(noteHead);

    return group;
}

/**
 * Create confetti effect
 */
function createConfetti() {
    const colors = ['#FFB5C5', '#D8B5FF', '#B5D8FF', '#B5FFD8', '#FFF5B5', '#FFD4B5'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ============================================
// Game Logic
// ============================================

/**
 * Initialize or reset the game
 */
function initGame() {
    state.currentNotes = getRandomNotes(CONFIG.questionsPerRound);
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answered = false;

    updateUI();
    renderNotes();
    enableAnswerButtons();
    elements.resultModal.classList.add('hidden');
}

/**
 * Render notes on the staff
 */
function renderNotes() {
    elements.notesContainer.innerHTML = '';

    state.currentNotes.forEach((note, index) => {
        const isHighlighted = index === state.currentQuestionIndex;
        const noteSVG = createNoteSVG(note, index, isHighlighted);
        elements.notesContainer.appendChild(noteSVG);
    });
}

/**
 * Update the highlight on notes
 */
function updateNoteHighlight() {
    const noteHeads = elements.notesContainer.querySelectorAll('.note-head');
    noteHeads.forEach((head, index) => {
        head.classList.remove('highlight', 'correct', 'wrong');
        if (index === state.currentQuestionIndex && !state.answered) {
            head.classList.add('highlight');
        }
    });
}

/**
 * Mark current note as correct or wrong
 */
function markCurrentNote(isCorrect) {
    const noteHeads = elements.notesContainer.querySelectorAll('.note-head');
    const currentHead = noteHeads[state.currentQuestionIndex];
    if (currentHead) {
        currentHead.classList.remove('highlight');
        currentHead.classList.add(isCorrect ? 'correct' : 'wrong');
    }
}

/**
 * Update UI elements
 */
function updateUI() {
    elements.currentQuestion.textContent = state.currentQuestionIndex + 1;
    elements.totalQuestions.textContent = CONFIG.questionsPerRound;
    elements.scoreDisplay.textContent = state.score;

    // Update clef symbol
    elements.clefSymbol.textContent = state.mode === 'treble' ? '𝄞' : '𝄢';

    // Update mode buttons
    elements.trebleBtn.classList.toggle('active', state.mode === 'treble');
    elements.bassBtn.classList.toggle('active', state.mode === 'bass');
}

/**
 * Show feedback message
 */
function showFeedback(isCorrect) {
    elements.feedback.classList.remove('hidden', 'correct', 'wrong');
    elements.feedback.classList.add(isCorrect ? 'correct' : 'wrong');

    const feedbackText = elements.feedback.querySelector('.feedback-text');
    feedbackText.textContent = isCorrect ? 'せいかい！' : 'もういちど！';

    // Hide feedback after duration
    setTimeout(() => {
        elements.feedback.classList.add('hidden');
    }, CONFIG.feedbackDuration);
}

/**
 * Handle answer button click
 */
function handleAnswer(selectedNote) {
    if (state.answered) return;

    const currentNote = state.currentNotes[state.currentQuestionIndex];
    const isCorrect = selectedNote === currentNote.name;

    showFeedback(isCorrect);
    markCurrentNote(isCorrect);

    if (isCorrect) {
        state.score++;
        state.answered = true;
        updateUI();
        disableAnswerButtons();

        // Check if round is complete
        if (state.currentQuestionIndex >= CONFIG.questionsPerRound - 1) {
            // Show result after feedback
            setTimeout(() => showResult(), CONFIG.feedbackDuration + 100);
        } else {
            // 自動で次の問題へ進む
            setTimeout(() => nextQuestion(), CONFIG.autoAdvanceDelay);
        }
    }
}

/**
 * Move to next question
 */
function nextQuestion() {
    state.currentQuestionIndex++;
    state.answered = false;

    updateUI();
    updateNoteHighlight();
    enableAnswerButtons();
}

/**
 * Show final result
 */
function showResult() {
    elements.resultModal.classList.remove('hidden');
    elements.resultTotal.textContent = CONFIG.questionsPerRound;
    elements.resultCorrect.textContent = state.score;

    // Generate stars based on score
    const starCount = Math.ceil((state.score / CONFIG.questionsPerRound) * 5);
    elements.resultStars.textContent = '⭐'.repeat(starCount);

    // Set message based on score
    const percentage = state.score / CONFIG.questionsPerRound;
    let message = '';
    if (percentage === 1) {
        message = 'パーフェクト！ すごい！ 🎉';
        createConfetti();
    } else if (percentage >= 0.8) {
        message = 'とってもじょうず！ ✨';
    } else if (percentage >= 0.6) {
        message = 'よくがんばったね！ 😊';
    } else if (percentage >= 0.4) {
        message = 'もうすこし れんしゅうしよう！ 💪';
    } else {
        message = 'つぎは がんばろう！ 🌟';
    }
    elements.resultMessage.textContent = message;
}

/**
 * Enable answer buttons
 */
function enableAnswerButtons() {
    const buttons = elements.answerButtons.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = false);
}

/**
 * Disable answer buttons
 */
function disableAnswerButtons() {
    const buttons = elements.answerButtons.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Switch clef mode
 */
function switchMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    initGame();
}

// ============================================
// Event Listeners
// ============================================

// Mode buttons
elements.trebleBtn.addEventListener('click', () => switchMode('treble'));
elements.bassBtn.addEventListener('click', () => switchMode('bass'));

// Answer buttons
elements.answerButtons.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleAnswer(btn.dataset.note);
    });
});



// Restart button
elements.restartBtn.addEventListener('click', initGame);

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', initGame);
