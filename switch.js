// ── Tab switching ──
        const tabSignup = document.getElementById('tab-signup');
        const tabLogin = document.getElementById('tab-login');
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');
        const errorBox = document.getElementById('auth-error');

        function switchTab(active, inactive, showForm, hideForm) {
            active.classList.add('active');
            inactive.classList.remove('active');
            showForm.style.display = 'block';
            hideForm.style.display = 'none';
            errorBox.style.display = 'none';
        }

        tabSignup.addEventListener('click', () => switchTab(tabSignup, tabLogin, signupForm, loginForm));
        tabLogin.addEventListener('click', () => switchTab(tabLogin, tabSignup, loginForm, signupForm));

        // ── Game Over overlay helpers ──
        // Call window.showGameOver(score, best, leaderboardEntries, playerRank) from app.js
        // leaderboardEntries: [{ name, score, isPlayer }]
        window.showGameOver = function (score, best, entries) {
            document.getElementById('go-score').textContent = score;
            

            const list = document.getElementById('go-lb-list');
            list.innerHTML = '';
            (entries || []).forEach((entry, i) => {
                const li = document.createElement('li');
                if (entry.isPlayer) {
                    li.classList.add('highlighted');
                    document.getElementById('go-best').textContent = entry.score;
                } 
                li.innerHTML = `
                    <span class="go-lb-rank">${i + 1}</span>
                    <span class="go-lb-name">${entry.name || 'Anonymous'}${entry.isNew ? '<span class="go-new-badge">NEW</span>' : ''}</span>
                    <span class="go-lb-score">${entry.score}</span>
                `;
                list.appendChild(li);
            });

            const overlay = document.getElementById('gameover-overlay');
            overlay.classList.add('show');
        };

        window.hideGameOver = function () {
            const overlay = document.getElementById('gameover-overlay');
            overlay.classList.remove('show');
        };

        // Play again button in modal
        document.getElementById('go-play-again').addEventListener('click', () => {
            window.hideGameOver();
            // Trigger the same start action as the main start button
            document.getElementById('startBtn').click();
        });

        // Also allow clicking outside modal to dismiss (optional)
        document.getElementById('gameover-overlay').addEventListener('click', function (e) {
            if (e.target === this) window.hideGameOver();
        });