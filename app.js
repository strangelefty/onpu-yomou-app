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
    chordStartX: 130,       // 和音表示時のX開始位置
    chordSpacing: 100,      // 和音間のスペース
};

// Note definitions for Treble Clef (ト音記号): C4 to C5 (1オクターブ)
const TREBLE_NOTES = [
    { name: 'ド', pitch: 'C4', y: 160, ledgerLines: [160] },  // Middle C with ledger line
    { name: 'レ', pitch: 'D4', y: 150, ledgerLines: [] },
    { name: 'ミ', pitch: 'E4', y: 140, ledgerLines: [] },
    { name: 'ファ', pitch: 'F4', y: 130, ledgerLines: [] },
    { name: 'ソ', pitch: 'G4', y: 120, ledgerLines: [] },
    { name: 'ラ', pitch: 'A4', y: 110, ledgerLines: [] },
    { name: 'シ', pitch: 'B4', y: 100, ledgerLines: [] },
    { name: 'ド', pitch: 'C5', y: 90, ledgerLines: [] },      // 高いド
];

// Note definitions for Bass Clef (ヘ音記号): C3 to C4 (1オクターブ)
// 五線譜: y=60(第5線/上), y=80(第4線), y=100(第3線), y=120(第2線), y=140(第1線/下)
// ヘ音記号では第4線(y=80)がファ(F3)
const BASS_NOTES = [
    { name: 'ド', pitch: 'C3', y: 110, ledgerLines: [] },      // 第2間（低いド）
    { name: 'レ', pitch: 'D3', y: 100, ledgerLines: [] },      // 第3線
    { name: 'ミ', pitch: 'E3', y: 90, ledgerLines: [] },       // 第3間
    { name: 'ファ', pitch: 'F3', y: 80, ledgerLines: [] },     // 第4線 ← ヘ音記号の基準
    { name: 'ソ', pitch: 'G3', y: 70, ledgerLines: [] },       // 第4間
    { name: 'ラ', pitch: 'A3', y: 60, ledgerLines: [] },       // 第5線（一番上）
    { name: 'シ', pitch: 'B3', y: 50, ledgerLines: [] },       // 上第1間
    { name: 'ド', pitch: 'C4', y: 40, ledgerLines: [40] },     // 上第1線（高いド）= Middle C
];

// ============================================
// Chord Definitions (主要3和音 - ハ長調)
// ============================================

// ト音記号用の和音定義
const TREBLE_CHORDS = [
    {
        name: 'I',
        displayName: 'I のわおん',
        notes: [
            { name: 'ド', pitch: 'C4', y: 160, ledgerLines: [160] },
            { name: 'ミ', pitch: 'E4', y: 140, ledgerLines: [] },
            { name: 'ソ', pitch: 'G4', y: 120, ledgerLines: [] },
        ]
    },
    {
        name: 'IV',
        displayName: 'IV のわおん',
        notes: [
            { name: 'ファ', pitch: 'F4', y: 130, ledgerLines: [] },
            { name: 'ラ', pitch: 'A4', y: 110, ledgerLines: [] },
            { name: 'ド', pitch: 'C5', y: 90, ledgerLines: [] },
        ]
    },
    {
        name: 'V',
        displayName: 'V のわおん',
        notes: [
            { name: 'ソ', pitch: 'G4', y: 120, ledgerLines: [] },
            { name: 'シ', pitch: 'B4', y: 100, ledgerLines: [] },
            { name: 'レ', pitch: 'D5', y: 80, ledgerLines: [] },
        ]
    },
];

// ヘ音記号用の和音定義
const BASS_CHORDS = [
    {
        name: 'I',
        displayName: 'I のわおん',
        notes: [
            { name: 'ド', pitch: 'C3', y: 110, ledgerLines: [] },
            { name: 'ミ', pitch: 'E3', y: 90, ledgerLines: [] },
            { name: 'ソ', pitch: 'G3', y: 70, ledgerLines: [] },
        ]
    },
    {
        name: 'IV',
        displayName: 'IV のわおん',
        notes: [
            { name: 'ファ', pitch: 'F3', y: 80, ledgerLines: [] },
            { name: 'ラ', pitch: 'A3', y: 60, ledgerLines: [] },
            { name: 'ド', pitch: 'C4', y: 40, ledgerLines: [40] },
        ]
    },
    {
        name: 'V',
        displayName: 'V のわおん',
        notes: [
            { name: 'ソ', pitch: 'G3', y: 70, ledgerLines: [] },
            { name: 'シ', pitch: 'B3', y: 50, ledgerLines: [] },
            { name: 'レ', pitch: 'D4', y: 30, ledgerLines: [40] },
        ]
    },
];

// ============================================
// Level 3: High Note Definitions (高い音・低い音)
// ============================================

// ト音記号用の高い音符定義（高いドレミファソ: C5-G5）
// 五線譜: y=60(第5線), y=80(第4線), y=100(第3線), y=120(第2線), y=140(第1線)
const TREBLE_HIGH_NOTES = [
    { name: 'ド', pitch: 'C5', y: 90, ledgerLines: [] },      // 高いド（第3間）
    { name: 'レ', pitch: 'D5', y: 80, ledgerLines: [] },      // 第4線
    { name: 'ミ', pitch: 'E5', y: 70, ledgerLines: [] },      // 第4間
    { name: 'ファ', pitch: 'F5', y: 60, ledgerLines: [] },    // 第5線
    { name: 'ソ', pitch: 'G5', y: 50, ledgerLines: [] },      // 上第1間
];

// ヘ音記号用の下降音符定義（1オクターブ下のドシラソ: C3, B2, A2, G2）
// 五線譜: y=60(第5線), y=80(第4線), y=100(第3線), y=120(第2線), y=140(第1線/下)
const BASS_DESC_NOTES = [
    { name: 'ド', pitch: 'C3', y: 110, ledgerLines: [] },     // 第2間（低いド）
    { name: 'シ', pitch: 'B2', y: 120, ledgerLines: [] },     // 第2線
    { name: 'ラ', pitch: 'A2', y: 130, ledgerLines: [] },     // 第1間
    { name: 'ソ', pitch: 'G2', y: 140, ledgerLines: [] },     // 第1線（一番下）
];
// Piano Sound (Tone.js)
// ============================================

let piano = null;
let audioStarted = false;

/**
 * Initialize piano synth
 */
function initPiano() {
    if (piano) return;
    // PolySynth with a piano-like sound
    piano = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
            attack: 0.02,
            decay: 0.3,
            sustain: 0.4,
            release: 1.2
        }
    }).toDestination();
    piano.volume.value = -6; // Slightly reduce volume
}

/**
 * Play a note with the piano
 */
async function playNote(pitch) {
    try {
        // Start audio context on first user interaction
        if (!audioStarted) {
            await Tone.start();
            audioStarted = true;
        }
        if (!piano) {
            initPiano();
        }
        piano.triggerAttackRelease(pitch, '0.8');
    } catch (e) {
        console.log('Audio playback error:', e);
    }
}

// ============================================
// Game State
// ============================================

const state = {
    level: 1,         // 1 = 単音, 2 = 和音
    mode: 'treble',   // 'treble' or 'bass'
    currentNotes: [], // レベル1用
    currentChords: [], // レベル2用
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
};

// ============================================
// Stamp System State (saved to localStorage)
// ============================================

const STAMP_CONFIG = {
    streakForStamp: 5,      // 5連続正解でスタンプ獲得
    stampsForBigStamp: 20,  // 20スタンプで大スタンプ獲得
};

let stampState = {
    currentStreak: 0,       // 現在の連続正解数
    miniStamps: 0,          // ミニスタンプ数
    bigStamps: 0,           // 大スタンプ数
};

/**
 * Load stamp state from localStorage
 */
function loadStampState() {
    const saved = localStorage.getItem('onpu-stamp-state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            stampState = { ...stampState, ...parsed };
        } catch (e) {
            console.log('Failed to load stamp state:', e);
        }
    }
}

/**
 * Save stamp state to localStorage
 */
function saveStampState() {
    localStorage.setItem('onpu-stamp-state', JSON.stringify(stampState));
}

// ============================================
// DOM Elements
// ============================================

const elements = {
    trebleBtn: document.getElementById('treble-btn'),
    bassBtn: document.getElementById('bass-btn'),
    level1Btn: document.getElementById('level1-btn'),
    level2Btn: document.getElementById('level2-btn'),
    level3Btn: document.getElementById('level3-btn'),
    clefSymbol: document.getElementById('clef-symbol'),
    notesContainer: document.getElementById('notes-container'),
    currentQuestion: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    scoreDisplay: document.getElementById('score'),
    answerButtons: document.getElementById('answer-buttons'),
    answerSectionNotes: document.getElementById('answer-section-notes'),
    answerSectionChords: document.getElementById('answer-section-chords'),
    answerSectionHigh: document.getElementById('answer-section-high'),
    chordButtons: document.getElementById('chord-buttons'),
    answerButtonsHigh: document.getElementById('answer-buttons-high'),
    feedback: document.getElementById('feedback'),

    resultModal: document.getElementById('result-modal'),
    resultStars: document.getElementById('result-stars'),
    resultTotal: document.getElementById('result-total'),
    resultCorrect: document.getElementById('result-correct'),
    resultMessage: document.getElementById('result-message'),
    restartBtn: document.getElementById('restart-btn'),

    // Stamp system elements
    streakProgress: document.getElementById('streak-progress'),
    streakCount: document.getElementById('streak-count'),
    miniStampCount: document.getElementById('mini-stamp-count'),
    bigStampCount: document.getElementById('big-stamp-count'),
    stampNotification: document.getElementById('stamp-notification'),
    stampNotificationIcon: document.getElementById('stamp-notification-icon'),
    stampNotificationText: document.getElementById('stamp-notification-text'),
    stampNotificationSub: document.getElementById('stamp-notification-sub'),
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
 * Get random notes for the current round (Level 1)
 */
function getRandomNotes(count) {
    const notes = state.mode === 'treble' ? TREBLE_NOTES : BASS_NOTES;
    const shuffled = shuffleArray(notes);
    return shuffled.slice(0, count);
}

/**
 * Get random chords for the current round (Level 2)
 */
function getRandomChords(count) {
    const chords = state.mode === 'treble' ? TREBLE_CHORDS : BASS_CHORDS;
    const result = [];
    for (let i = 0; i < count; i++) {
        const shuffled = shuffleArray(chords);
        result.push(shuffled[0]);
    }
    return result;
}

/**
 * Get random high notes for the current round (Level 3)
 * ト音記号: 高いドレミファソ (C5-G5)
 * ヘ音記号: ドシラソ (C4, B3, A3, G3)
 */
function getRandomHighNotes(count) {
    const notes = state.mode === 'treble' ? TREBLE_HIGH_NOTES : BASS_DESC_NOTES;
    const shuffled = shuffleArray(notes);
    // 音符が少ないので、繰り返しも許可
    const result = [];
    for (let i = 0; i < count; i++) {
        const shuffledAgain = shuffleArray(notes);
        result.push(shuffledAgain[0]);
    }
    return result;
}

/**
 * Create a note SVG element (Level 1)
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
 * Create a chord SVG element (Level 2 - 3 notes stacked)
 */
function createChordSVG(chord, index, isHighlighted = false) {
    const x = CONFIG.chordStartX + index * CONFIG.chordSpacing;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('chord-group');
    group.setAttribute('data-index', index);

    // Collect all ledger lines needed for this chord
    const allLedgerLines = new Set();
    chord.notes.forEach(note => {
        note.ledgerLines.forEach(lineY => allLedgerLines.add(lineY));
    });

    // Draw ledger lines
    allLedgerLines.forEach(lineY => {
        const ledgerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ledgerLine.classList.add('ledger-line');
        ledgerLine.setAttribute('x1', x - 20);
        ledgerLine.setAttribute('y1', lineY);
        ledgerLine.setAttribute('x2', x + 20);
        ledgerLine.setAttribute('y2', lineY);
        group.appendChild(ledgerLine);
    });

    // Draw each note in the chord
    chord.notes.forEach((note) => {
        const noteHead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        noteHead.classList.add('chord-note-head');
        if (isHighlighted) {
            noteHead.classList.add('highlight');
        }
        noteHead.setAttribute('cx', x);
        noteHead.setAttribute('cy', note.y);
        noteHead.setAttribute('rx', 12);
        noteHead.setAttribute('ry', 9);
        noteHead.setAttribute('transform', `rotate(-15, ${x}, ${note.y})`);
        group.appendChild(noteHead);
    });

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
    if (state.level === 1) {
        state.currentNotes = getRandomNotes(CONFIG.questionsPerRound);
        state.currentChords = [];
    } else if (state.level === 2) {
        // Level 2: Chords
        state.currentChords = getRandomChords(CONFIG.questionsPerRound);
        state.currentNotes = [];
    } else {
        // Level 3: High notes (ト音: 高いドレミファソ、ヘ音: ドシラソ)
        state.currentNotes = getRandomHighNotes(CONFIG.questionsPerRound);
        state.currentChords = [];
    }
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.answered = false;

    updateUI();
    updateLevel3Buttons();  // レベル3の回答ボタンを動的に更新
    renderDisplay();
    enableAnswerButtons();
    elements.resultModal.classList.add('hidden');
}

/**
 * Render notes or chords on the staff
 */
function renderDisplay() {
    elements.notesContainer.innerHTML = '';

    if (state.level === 1 || state.level === 3) {
        // Level 1 and 3: Single notes
        state.currentNotes.forEach((note, index) => {
            const isHighlighted = index === state.currentQuestionIndex;
            const noteSVG = createNoteSVG(note, index, isHighlighted);
            elements.notesContainer.appendChild(noteSVG);
        });
    } else {
        // Level 2: Chords
        state.currentChords.forEach((chord, index) => {
            const isHighlighted = index === state.currentQuestionIndex;
            const chordSVG = createChordSVG(chord, index, isHighlighted);
            elements.notesContainer.appendChild(chordSVG);
        });
    }
}

/**
 * Update the highlight on notes/chords
 */
function updateHighlight() {
    if (state.level === 1 || state.level === 3) {
        const noteHeads = elements.notesContainer.querySelectorAll('.note-head');
        noteHeads.forEach((head, index) => {
            head.classList.remove('highlight', 'correct', 'wrong');
            if (index === state.currentQuestionIndex && !state.answered) {
                head.classList.add('highlight');
            }
        });
    } else {
        const chordGroups = elements.notesContainer.querySelectorAll('.chord-group');
        chordGroups.forEach((group, index) => {
            const noteHeads = group.querySelectorAll('.chord-note-head');
            noteHeads.forEach(head => {
                head.classList.remove('highlight', 'correct', 'wrong');
                if (index === state.currentQuestionIndex && !state.answered) {
                    head.classList.add('highlight');
                }
            });
        });
    }
}

/**
 * Mark current note/chord as correct or wrong
 */
function markCurrent(isCorrect) {
    if (state.level === 1 || state.level === 3) {
        const noteHeads = elements.notesContainer.querySelectorAll('.note-head');
        const currentHead = noteHeads[state.currentQuestionIndex];
        if (currentHead) {
            currentHead.classList.remove('highlight');
            currentHead.classList.add(isCorrect ? 'correct' : 'wrong');
        }
    } else {
        const chordGroups = elements.notesContainer.querySelectorAll('.chord-group');
        const currentGroup = chordGroups[state.currentQuestionIndex];
        if (currentGroup) {
            const noteHeads = currentGroup.querySelectorAll('.chord-note-head');
            noteHeads.forEach(head => {
                head.classList.remove('highlight');
                head.classList.add(isCorrect ? 'correct' : 'wrong');
            });
        }
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

    // Update level buttons
    elements.level1Btn.classList.toggle('active', state.level === 1);
    elements.level2Btn.classList.toggle('active', state.level === 2);
    elements.level3Btn.classList.toggle('active', state.level === 3);

    // Show/hide answer sections based on level
    elements.answerSectionNotes.classList.add('hidden');
    elements.answerSectionChords.classList.add('hidden');
    elements.answerSectionHigh.classList.add('hidden');

    if (state.level === 1) {
        elements.answerSectionNotes.classList.remove('hidden');
    } else if (state.level === 2) {
        elements.answerSectionChords.classList.remove('hidden');
    } else {
        elements.answerSectionHigh.classList.remove('hidden');
    }
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

// ============================================
// Stamp System Functions
// ============================================

/**
 * Update stamp display UI
 */
function updateStampUI() {
    // Update streak progress bar
    const streakPercent = (stampState.currentStreak / STAMP_CONFIG.streakForStamp) * 100;
    elements.streakProgress.style.width = `${streakPercent}%`;
    elements.streakCount.textContent = `${stampState.currentStreak}/${STAMP_CONFIG.streakForStamp}`;

    // Update stamp counts
    elements.miniStampCount.textContent = stampState.miniStamps;
    elements.bigStampCount.textContent = stampState.bigStamps;
}

/**
 * Show stamp notification popup
 */
function showStampNotification(type) {
    if (type === 'mini') {
        elements.stampNotificationIcon.textContent = '⭐';
        elements.stampNotificationText.textContent = 'スタンプをゲット！';
        elements.stampNotificationSub.textContent = `${stampState.miniStamps}/20`;
    } else if (type === 'big') {
        elements.stampNotificationIcon.textContent = '🏆';
        elements.stampNotificationText.textContent = '大スタンプをゲット！';
        elements.stampNotificationSub.textContent = `これで ${stampState.bigStamps} こ！`;
    }

    elements.stampNotification.classList.remove('hidden');

    // Hide after delay
    setTimeout(() => {
        elements.stampNotification.classList.add('hidden');
    }, 1500);
}

/**
 * Handle correct answer for stamp system
 */
function handleCorrectForStamps() {
    stampState.currentStreak++;

    // Check if earned a mini stamp
    if (stampState.currentStreak >= STAMP_CONFIG.streakForStamp) {
        stampState.currentStreak = 0;
        stampState.miniStamps++;

        // Check if earned a big stamp
        if (stampState.miniStamps >= STAMP_CONFIG.stampsForBigStamp) {
            stampState.miniStamps = 0;
            stampState.bigStamps++;
            saveStampState();
            updateStampUI();

            // Show big stamp notification with delay
            setTimeout(() => {
                showStampNotification('big');
                // Add animation to big stamp icon
                const bigStampEl = document.querySelector('.big-stamps');
                if (bigStampEl) {
                    bigStampEl.classList.add('big-stamp-earned');
                    setTimeout(() => bigStampEl.classList.remove('big-stamp-earned'), 1000);
                }
            }, 200);
        } else {
            saveStampState();
            updateStampUI();

            // Show mini stamp notification
            setTimeout(() => {
                showStampNotification('mini');
                // Add animation to mini stamp icon
                const miniStampEl = document.querySelector('.mini-stamps');
                if (miniStampEl) {
                    miniStampEl.classList.add('stamp-earned');
                    setTimeout(() => miniStampEl.classList.remove('stamp-earned'), 600);
                }
            }, 200);
        }
    } else {
        saveStampState();
        updateStampUI();
    }
}

/**
 * Handle wrong answer for stamp system
 */
function handleWrongForStamps() {
    stampState.currentStreak = 0;
    saveStampState();
    updateStampUI();
}

/**
 * Handle answer button click (Level 1 - Single Notes)
 */
function handleAnswer(selectedNote) {
    if (state.answered || state.level !== 1) return;

    const currentNote = state.currentNotes[state.currentQuestionIndex];
    const isCorrect = selectedNote === currentNote.name;

    showFeedback(isCorrect);
    markCurrent(isCorrect);

    if (isCorrect) {
        state.score++;
        state.answered = true;
        handleCorrectForStamps();  // Update stamp system
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
    } else {
        handleWrongForStamps();  // Reset streak on wrong answer
    }
}

/**
 * Handle chord button click (Level 2 - Chords)
 */
function handleChordAnswer(selectedChord) {
    if (state.answered || state.level !== 2) return;

    const currentChord = state.currentChords[state.currentQuestionIndex];
    const isCorrect = selectedChord === currentChord.name;

    showFeedback(isCorrect);
    markCurrent(isCorrect);

    if (isCorrect) {
        state.score++;
        state.answered = true;
        handleCorrectForStamps();  // Update stamp system
        updateUI();
        disableChordButtons();

        // Check if round is complete
        if (state.currentQuestionIndex >= CONFIG.questionsPerRound - 1) {
            // Show result after feedback
            setTimeout(() => showResult(), CONFIG.feedbackDuration + 100);
        } else {
            // 自動で次の問題へ進む
            setTimeout(() => nextQuestion(), CONFIG.autoAdvanceDelay);
        }
    } else {
        handleWrongForStamps();  // Reset streak on wrong answer
    }
}

/**
 * Handle high note answer button click (Level 3)
 */
function handleHighNoteAnswer(selectedNote) {
    if (state.answered || state.level !== 3) return;

    const currentNote = state.currentNotes[state.currentQuestionIndex];
    const isCorrect = selectedNote === currentNote.name;

    showFeedback(isCorrect);
    markCurrent(isCorrect);

    if (isCorrect) {
        state.score++;
        state.answered = true;
        handleCorrectForStamps();
        updateUI();
        disableHighNoteButtons();

        if (state.currentQuestionIndex >= CONFIG.questionsPerRound - 1) {
            setTimeout(() => showResult(), CONFIG.feedbackDuration + 100);
        } else {
            setTimeout(() => nextQuestion(), CONFIG.autoAdvanceDelay);
        }
    } else {
        handleWrongForStamps();
    }
}

/**
 * Update Level 3 answer buttons based on mode
 * ト音記号: ドレミファソ
 * ヘ音記号: ドシラソ
 */
function updateLevel3Buttons() {
    if (!elements.answerButtonsHigh) return;

    elements.answerButtonsHigh.innerHTML = '';

    let notes;
    if (state.mode === 'treble') {
        notes = ['ド', 'レ', 'ミ', 'ファ', 'ソ'];
    } else {
        notes = ['ソ', 'ラ', 'シ', 'ド'];
    }

    notes.forEach(note => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.note = note;
        btn.textContent = note;
        btn.addEventListener('click', () => handleHighNoteAnswer(note));
        elements.answerButtonsHigh.appendChild(btn);
    });
}

/**
 * Disable high note buttons (Level 3)
 */
function disableHighNoteButtons() {
    const buttons = elements.answerButtonsHigh.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Move to next question
 */
function nextQuestion() {
    state.currentQuestionIndex++;
    state.answered = false;

    updateUI();
    updateHighlight();
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
    if (state.level === 1) {
        const buttons = elements.answerButtons.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = false);
    } else if (state.level === 2) {
        const buttons = elements.chordButtons.querySelectorAll('.chord-btn');
        buttons.forEach(btn => btn.disabled = false);
    } else {
        const buttons = elements.answerButtonsHigh.querySelectorAll('.answer-btn');
        buttons.forEach(btn => btn.disabled = false);
    }
}

/**
 * Disable answer buttons
 */
function disableAnswerButtons() {
    const buttons = elements.answerButtons.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
}

/**
 * Disable chord buttons
 */
function disableChordButtons() {
    const buttons = elements.chordButtons.querySelectorAll('.chord-btn');
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

/**
 * Switch level
 */
function switchLevel(level) {
    if (state.level === level) return;
    state.level = level;
    initGame();
}

// ============================================
// Event Listeners
// ============================================

// Mode buttons
elements.trebleBtn.addEventListener('click', () => switchMode('treble'));
elements.bassBtn.addEventListener('click', () => switchMode('bass'));

// Level buttons
elements.level1Btn.addEventListener('click', () => switchLevel(1));
elements.level2Btn.addEventListener('click', () => switchLevel(2));
elements.level3Btn.addEventListener('click', () => switchLevel(3));

// Answer buttons (Level 1)
elements.answerButtons.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleAnswer(btn.dataset.note);
    });
});

// Chord buttons (Level 2)
elements.chordButtons.querySelectorAll('.chord-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleChordAnswer(btn.dataset.chord);
    });
});

// Restart button
elements.restartBtn.addEventListener('click', initGame);

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load saved stamp state first
    loadStampState();
    updateStampUI();

    // Then initialize the game
    initGame();
});
