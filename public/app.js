

let userSeq = [], gameSeq = [], scoreSeq = [];
let started = false, level = 0;
const colors = ['red', 'blue', 'orange', 'violet'];
const status = document.getElementById('status');
const root = document.getElementById('game-page');
const lb = document.getElementById('leaderboard');
const lbList = document.getElementById('lb-list');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    if (!started) { started = true; lb.style.display = 'none'; levelUp(); }
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

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) { userSeq = []; setTimeout(levelUp, 800); }
    } else {
        bodyFlash();
        scoreSeq.push(level-1);
        status.innerHTML = `Game over! Score: <b style="color:#fff">${level-1}</b><br>Best: <b style="color:#ffd700">${getHigh()}</b><br>Press a key to start again`;
        showLB(level);
        gameSeq = []; userSeq = []; level = 0; started = false;
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

var prev = -1;
function showLB(latest) {
    const sorted = [...scoreSeq].sort((a, b) => b - a).slice(0, 5);
    lbList.innerHTML = sorted.map((s, i) => {
        if (latest == prev) {
            const isNew = '';
        } else {
            const isNew = '<span class="new-badge">NEW</span>';
        }
        var prev = latest;
        return `<li><span style="color:#555;font-size:.55rem">#${i + 1}</span><div style="display: flex; width: 30%; justify-content:space-between; align-items:center;"><span>Score</span><span class="sv">${s}</span></div><div style="width: 20%";>${isNew}</div></li>`;
    }).join('');
    lb.style.display = 'block';
}