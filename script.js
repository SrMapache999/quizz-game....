class QuizGame {
    constructor() {
        this.currentCategory = 'general';
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.initializeGame();
    }

    initializeGame() {
        this.setupEventListeners();
        this.showScreen('start-screen');
    }

    setupEventListeners() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.currentCategory = e.target.dataset.category;
            });
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.checkAnswer(parseInt(e.target.dataset.index));
            });
        });

        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.showScreen('start-screen');
        });
    }

    startGame() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.updateScore();
        this.showScreen('game-screen');
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        const questions = questionsDatabase[this.currentCategory];
        if (this.currentQuestionIndex >= questions.length) {
            this.endGame();
            return;
        }

        const currentQ = questions[this.currentQuestionIndex];
        document.getElementById('question-text').textContent = currentQ.question;
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, index) => {
            btn.textContent = currentQ.options[index];
            btn.className = 'option-btn';
            btn.disabled = false;
        });

        document.getElementById('feedback').className = 'feedback';
    }

    checkAnswer(selectedIndex) {
        const questions = questionsDatabase[this.currentCategory];
        const currentQ = questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach(btn => btn.disabled = true);
        
        options.forEach((btn, index) => {
            if (index === currentQ.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && index !== currentQ.correct) {
                btn.classList.add('wrong');
            }
        });

        const feedback = document.getElementById('feedback');
        if (selectedIndex === currentQ.correct) {
            this.score += 10;
            this.updateScore();
            feedback.textContent = `✅ Correcto! ${currentQ.explanation}`;
            feedback.className = 'feedback correct';
        } else {
            feedback.textContent = `❌ Incorrecto. ${currentQ.explanation}`;
            feedback.className = 'feedback wrong';
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
            this.resetTimer();
        }, 2000);
    }

    startTimer() {
        this.timeLeft = 60;
        this.updateTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 3000);
    }

    resetTimer() {
        clearInterval(this.timer);
        this.startTimer();
    }

    updateTimer() {
        document.getElementById('time-left').textContent = this.timeLeft;
    }

    timeUp() {
        clearInterval(this.timer);
        const feedback = document.getElementById('feedback');
        feedback.textContent = '⏰ ¡Tiempo agotado!';
        feedback.className = 'feedback wrong';
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.loadQuestion();
            this.resetTimer();
        }, 1500);
    }

    updateScore() {
        document.getElementById('current-score').textContent = this.score;
    }

    endGame() {
        clearInterval(this.timer);
        this.showScreen('results-screen');
        document.getElementById('final-score').textContent = this.score;
        
        const message = document.getElementById('score-message');
        if (this.score >= 40) {
            message.textContent = '🎉 ¡Excelente!';
        } else if (this.score >= 30) {
            message.textContent = '👍 ¡Buen trabajo!';
        } else {
            message.textContent = '💪 ¡Sigue intentándolo!';
        }
        
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
        leaderboard.push({
            score: this.score,
            category: this.currentCategory,
            date: new Date().toLocaleDateString()
        });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
        
        const highScoresList = document.getElementById('high-scores');
        highScoresList.innerHTML = '';
        leaderboard.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${item.score} puntos - ${item.category}`;
            highScoresList.appendChild(li);
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();

});

