import { saveHighScore, getPlayerHighScore, getLeaderboard } from './database.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { config } from './config.js';

let userSeq = [], gameSeq = [], scoreSeq = [];
let started = false, level = 0;
const colors = ['red', 'blue', 'orange', 'violet'];
const status = document.getElementById('status');
const root = document.getElementById('game-page');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    if (!started) { started = true; levelUp(); }
});

document.addEventListener('keydown', () => {
    if (!started) startBtn.click();
});

function levelUp() {
    level++;
    status.textContent = `Level ${level}`;
    const c = colors[Math.floor(Math.random() * 4)];
    gameSeq.push(c);
    btnFlash(document.querySelector(`.game-btn.${c}`));
}

document.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (!started) return;
        userFlash(this); pressAnim(this);
        userSeq.push(this.dataset.color);
        checkAns(userSeq.length - 1);
    });
});

async function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) { userSeq = []; setTimeout(levelUp, 800); }
    } else {
        bodyFlash();
        const finalScore = level - 1;
        scoreSeq.push(finalScore);

        const auth = getAuth();
        const user = auth.currentUser;
        const currentUid = user ? user.uid : null;
        const displayName = user ? (user.displayName || user.email.split('@')[0]) : 'You';

        status.innerHTML = `Game over! Score: <b style="color:#fff">${finalScore}</b><br>Best: <b style="color:#ffd700">${getHigh()}</b><br>Press any key or click Start`;

        // Reset game state immediately so the player can restart
        gameSeq = []; userSeq = []; level = 0; started = false;

        // Show overlay right away with a loading indicator for the leaderboard
        window.showGameOver(finalScore, getHigh(), [
            { name: displayName, score: '…', isPlayer: true, isNew: false, isLoading: true }
        ]);

        if (user) {
            const username = user.displayName || user.email.split('@')[0] || 'Player';

            // 1. Save the score (only stored if it's a new high score)
            await saveHighScore(username, finalScore);

            // 2. Fetch the real leaderboard — all scores are highScores from Firebase
            const players = await getLeaderboard();

            const entries = players.map((p) => ({
                name:     p.username || 'Anonymous',
                score:    p.highScore,           // ← always the stored high score
                isPlayer: p.uid === currentUid,
                // "NEW" badge only when this game produced a new personal best
                isNew:    p.uid === currentUid && p.highScore === finalScore,
            }));

            window.showGameOver(finalScore, getHigh(), entries);
        }
    }
}

function btnFlash(el) {
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 270);
}

function userFlash(el) {
    el.classList.add('userflash');
    setTimeout(() => el.classList.remove('userflash'), 270);
}

function pressAnim(el) {
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 130);
}

function bodyFlash() {
    root.classList.add('bodyflash');
    setTimeout(() => root.classList.remove('bodyflash'), 300);
}

function getHigh() {
    return scoreSeq.length ? Math.max(...scoreSeq) : 0;
}