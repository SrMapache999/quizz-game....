const questionsDatabase = {
    general: [
        {
            question: "¿Cuál es el río más largo del mundo?",
            options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"],
            correct: 1,
            explanation: "El río Amazonas es el más largo del mundo con aproximadamente 7,062 km."
        },
        {
            question: "¿En qué año llegó el hombre a la luna?",
            options: ["1965", "1969", "1972", "1975"],
            correct: 1,
            explanation: "El Apollo 11 llegó a la luna el 20 de julio de 1969."
        },
        {
            question: "¿Cuál es el océano más grande del mundo?",
            options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
            correct: 2,
            explanation: "El océano Pacífico es el más grande del mundo."
        },
        {
            question: "¿Qué país tiene forma de bota?",
            options: ["España", "Italia", "Francia", "Grecia"],
            correct: 1,
            explanation: "Italia tiene forma de bota en el mapa."
        },
        {
            question: "¿Cuál es el animal más rápido del mundo?",
            options: ["Leopardo", "Guepardo", "Águila", "León"],
            correct: 1,
            explanation: "El guepardo puede alcanzar 120 km/h."
        }
    ],
    tech: [
        {
            question: "¿Qué lenguaje se usa para desarrollo web frontend?",
            options: ["Python", "Java", "JavaScript", "C++"],
            correct: 2,
            explanation: "JavaScript es el lenguaje principal para frontend."
        },
        {
            question: "¿Qué significa HTML?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            correct: 0,
            explanation: "HTML significa Hyper Text Markup Language."
        },
        {
            question: "¿Qué compañía creó Windows?",
            options: ["Apple", "Microsoft", "Google", "IBM"],
            correct: 1,
            explanation: "Microsoft creó el sistema operativo Windows."
        },
        {
            question: "¿Qué significa CPU?",
            options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"],
            correct: 0,
            explanation: "CPU significa Central Processing Unit."
        },
        {
            question: "¿Qué navegador desarrolló Google?",
            options: ["Firefox", "Safari", "Chrome", "Edge"],
            correct: 2,
            explanation: "Google desarrolló el navegador Chrome."
        }
    ],
    science: [
        {
            question: "¿Cuál es el elemento más abundante en el universo?",
            options: ["Oxígeno", "Carbono", "Hierro", "Hidrógeno"],
            correct: 3,
            explanation: "El hidrógeno es el elemento más abundante."
        },
        {
            question: "¿Qué planeta es conocido como 'planeta rojo'?",
            options: ["Venus", "Marte", "Júpiter", "Saturno"],
            correct: 1,
            explanation: "Marte es conocido como el planeta rojo."
        },
        {
            question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
            options: ["206", "300", "150", "250"],
            correct: 0,
            explanation: "El cuerpo humano adulto tiene 206 huesos."
        },
        {
            question: "¿Qué gas usan las plantas para la fotosíntesis?",
            options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"],
            correct: 2,
            explanation: "Las plantas usan dióxido de carbono."
        },
        {
            question: "¿Qué partícula tiene carga positiva?",
            options: ["Electrón", "Neutrón", "Protón", "Fotón"],
            correct: 2,
            explanation: "El protón tiene carga positiva."
        }
    ],
    entertainment: [
        {
            question: "¿Qué actor interpretó a Iron Man?",
            options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
            correct: 1,
            explanation: "Robert Downey Jr. interpretó a Iron Man."
        },
        {
            question: "¿Qué película ganó el Oscar 2020?",
            options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"],
            correct: 0,
            explanation: "'Parasite' ganó el Oscar a Mejor Película 2020."
        },
        {
            question: "¿Quién es 'La Reina del Pop'?",
            options: ["Beyoncé", "Madonna", "Lady Gaga", "Rihanna"],
            correct: 1,
            explanation: "Madonna es conocida como 'La Reina del Pop'."
        },
        {
            question: "¿En qué serie aparecen Jon Snow y Daenerys?",
            options: ["The Walking Dead", "Game of Thrones", "Stranger Things", "The Crown"],
            correct: 1,
            explanation: "Estos personajes son de 'Game of Thrones'."
        },
        {
            question: "¿Qué videojuego tiene un fontanero llamado Mario?",
            options: ["Zelda", "Sonic", "Super Mario", "Donkey Kong"],
            correct: 2,
            explanation: "Mario es el personaje de 'Super Mario'."
        }
    ]
};

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
        const questions =window.questionsDatabase[this.currentCategory];
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
        const questions = window.questionsDatabase[this.currentCategory];
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



