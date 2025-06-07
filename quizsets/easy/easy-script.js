const MAX_ROUNDS = 5;
const SCORE_PER_CORRECT = 100;

let currentIndex = 0;
let finalScore = 0;
let selectedAnswers = [];
let answerState = [];
let isPaused = false;
let timerInterval = null;
let remainingTime = 100;
let bgmPlaying = true;
let bgmAudio = null;

const quizData = [
    {
        question: "Who is the girl featured in the \"Okay na toh.\" meme?",
        options: {
            a: "Dani Barretto",
            b: "Jessica Villarubin",
            c: "Angelica Panganiban",
            d: "Grace Tanfelix"
        },
        correctAnswer: "d",
        correctFeedback: "Tumpak!",
        incorrectFeedback: "Ayusin mo pagpili teh!",
        trivia: "Grace Tanfelix became viral for her chill cooking energy and the now-iconic line \"Okay na toh.\" in her Facebook reels."
    },
    {
        question: "What iconic line did Neneng B say in her viral video?",
        options: {
            a: "Ma, gutom na ako.",
            b: "Ma, anong oras na?",
            c: "Ma, ano ulam?",
            d: "Ma, may jowa na ako."
        },
        correctAnswer: "c",
        correctFeedback: "Tama! Gutom speaks louder than words!",
        incorrectFeedback: "Todo na yan? Ulam na lang mali pa!",
        trivia: "Neneng B caught netizens' attention when she said \"Ma, ano ulam?\"."
    },
    {
        question: "Which nickname is often associated with Malupiton?",
        options: {
            a: "Sir",
            b: "Boss/Bossing",
            c: "Love/Mahal",
            d: "Kuya"
        },
        correctAnswer: "b",
        correctFeedback: "Slayable ka sis! Alpha energy 'yan!",
        incorrectFeedback: "Ano? Kaya pa ba?",
        trivia: "Malupiton is known for his sassy \"bossing\" energy and impersonations."
    },
    {
        question: "In a statement made by …, Tama? Tayo ay nasa __________.",
        options: {
            a: "Fast food chain",
            b: "Fine dining restaurant",
            c: "Five star hotel",
            d: "Karindirya"
        },
        correctAnswer: "b",
        correctFeedback: "Sobrang sosyalin ang peg!",
        incorrectFeedback: "Nye, anyare? Di bagay!",
        trivia: "This meme was from Toni Fowler's reality show."
    },
    {
        question: "What is the name of Toni Fowler's daughter?",
        options: {
            a: "Trisha",
            b: "Tyronia",
            c: "Tanya",
            d: "Trixie"
        },
        correctAnswer: "b",
        correctFeedback: "Aura pa lang, panalo na! Next gen content creator unlocked!",
        incorrectFeedback: "Hala siya?? Sumbong kita diyan kay Mami Oni",
        trivia: "Toni Fowler's 13 year old daughter, Tyronia, is often featured in her viral vlogs and content."
    }
  ];

const audioSystem = {
    bgm: new Audio("../../audio/bgm.mp3"),
    correctAnswer: new Audio("../../audio/correct.mp3"),
    wrongAnswer: new Audio("../../audio/wrong.mp3"),
    timeout: new Audio("../../audio/timeout.mp3"),
    buttonClick: new Audio("../../audio/click.mp3"),
    voicelines: [
        new Audio("../../audio/q1.mp3"),
        new Audio("../../audio/q2.mp3"),
        new Audio("../../audio/q3.mp3"),
        new Audio("../../audio/q4.mp3"),
        new Audio("../../audio/q5.mp3"),
    ],
    
    init() {
        this.bgm.loop = true;
        this.bgm.volume = 0.4;
        this.bgm.preload = "auto";
        
        this.correctAnswer.volume = 0.7;
        this.wrongAnswer.volume = 0.7;
        this.timeout.volume = 0.7;
        this.buttonClick.volume = 0.5;
        
        this.voicelines.forEach(voice => {
            voice.volume = 0.8;
            voice.preload = "auto";
        });
    },
    
    playBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
        
        const playPromise = this.bgm.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    bgmPlaying = true;
                    console.log("BGM started successfully");
                })
                .catch(error => {
                    console.warn("BGM autoplay prevented:", error);
                    bgmPlaying = false;
                });
        } else {
            bgmPlaying = true;
        }
    },
    
    pauseBGM() {
        this.bgm.pause();
        bgmPlaying = false;
    },
    
    playQuestionVoice(index) {
        this.voicelines.forEach(voice => {
            voice.pause();
            voice.currentTime = 0;
        });
        
        if (this.voicelines[index]) {
            this.voicelines[index].play().catch(error => {
                console.warn("Voice playback prevented:", error);
            });
        }
    },
    
    playCorrect() {
        this.correctAnswer.currentTime = 0;
        this.correctAnswer.play().catch(error => {
            console.warn("Sound playback prevented:", error);
        });
    },
    
    playWrong() {
        this.wrongAnswer.currentTime = 0;
        this.wrongAnswer.play().catch(error => {
            console.warn("Sound playback prevented:", error);
        });
    },
    
    playTimeout() {
        this.timeout.currentTime = 0;
        this.timeout.play().catch(error => {
            console.warn("Sound playback prevented:", error);
        });
    },
    
    playClick() {
        this.buttonClick.currentTime = 0;
        this.buttonClick.play().catch(error => {
            console.warn("Sound playback prevented:", error);
        });
    }
};

const elements = {
    quiz: {
        score: document.querySelector("#score"),
        questionText: document.querySelector("#question-text"),
        questionIcon: document.querySelector(".question-img"),
        memeImage: document.querySelector("#meme-image"),
        memeImageContainer: document.querySelector(".meme-image-section"),
        timerBar: document.querySelector('#timer-bar'),
        resetButton: document.querySelector('.reset-img'),
        resetSection: document.querySelector('.reset-section'),
        pauseButton: document.querySelector('.pause-img'),
        pauseSection: document.querySelector('.pause-section')
    },
    options: {
        textA: document.querySelector("#opt-a-value"),
        textB: document.querySelector("#opt-b-value"),
        textC: document.querySelector("#opt-c-value"),
        textD: document.querySelector("#opt-d-value"),
        buttonA: document.querySelector("#opt-a"),
        buttonB: document.querySelector("#opt-b"),
        buttonC: document.querySelector("#opt-c"),
        buttonD: document.querySelector("#opt-d")
    },
    progress: {
        bar: document.querySelector("#progress-bar"),
        value: document.querySelector("#progress-value")
    },
    pauseModal: {
        container: document.createElement("div"),
        resumeButton: document.createElement("div"),
        audioControls: document.createElement("div"),
        audioTitle: document.createElement("div"),
        bgmToggle: document.createElement("button"),
        sfxToggle: document.createElement("button")
    },
    checkingModal: {
        container: document.querySelector("#checking-modal"),
        icon: document.querySelector("#checking-icon"),
        tagline: document.querySelector("#checking-tagline"),
        trivia: document.querySelector("#checking-trivia"),
        nextButton: document.querySelector("#next-button")
    },
    resetConfirmModal: {
        container: document.createElement("div"),
        message: document.createElement("div"),
        buttonContainer: document.createElement("div"),
        confirmButton: document.createElement("button"),
        cancelButton: document.createElement("button")
    },
    evaluation: {
        container: document.querySelector('#evaluation-container'),
        resetButton: document.querySelector('#evaluation-container .reset-img'),
        resetSection: document.querySelector('#evaluation-container .reset-section'),
        quitButton: document.querySelector('.quit-section'),
        finalScore: document.querySelector('#final-score'),
        ratingText: document.querySelector('#rating-text'),
        ratingBar: document.querySelector('#rating-bar-img'),
        ratingImg: document.querySelector("#meme-image-eval"),
        ratingImgContainer: document.querySelector(".meme-image-section-eval"),
        answers: [
            document.querySelector("#item1-ans"),
            document.querySelector("#item2-ans"),
            document.querySelector("#item3-ans"),
            document.querySelector("#item4-ans"),
            document.querySelector("#item5-ans")
        ],
        answerIcons: [
            document.querySelector("#item1-img"),
            document.querySelector("#item2-img"),
            document.querySelector("#item3-img"),
            document.querySelector("#item4-img"),
            document.querySelector("#item5-img")
        ]
    }
};

initializeGame();

function initializeGame() {
    audioSystem.init();
    
    createPauseModal();
    createResetConfirmationModal(); 
    updateContent(currentIndex);
    animateElements();
    setupEventListeners();
    startTimer();

    audioSystem.playBGM();
    
    document.body.addEventListener('click', function() {
        if (!bgmPlaying) {
            audioSystem.playBGM();
        }
    }, { once: true });
}

function setupEventListeners() {
    elements.options.buttonA.addEventListener("click", () => {
        audioSystem.playClick();
        handleOptionClick("a");
    });
    elements.options.buttonB.addEventListener("click", () => {
        audioSystem.playClick();
        handleOptionClick("b");
    });
    elements.options.buttonC.addEventListener("click", () => {
        audioSystem.playClick();
        handleOptionClick("c");
    });
    elements.options.buttonD.addEventListener("click", () => {
        audioSystem.playClick();
        handleOptionClick("d");
    });

    elements.checkingModal.nextButton.addEventListener('click', () => {
        audioSystem.playClick();
        handleNextButtonClick();
    });
    
    elements.quiz.resetButton.addEventListener('click', () => {
        askResetConfirmation(); // Change this line
    });
    elements.quiz.resetSection.addEventListener('click', () => {
        askResetConfirmation(); // Change this line
    });
    
    elements.evaluation.resetButton.addEventListener('click', () => {
        askResetConfirmation(); // Change this line
    });
    elements.evaluation.resetSection.addEventListener('click', () => {
        askResetConfirmation(); // Change this line
    });
    
    if (elements.quiz.pauseButton) {
        elements.quiz.pauseButton.addEventListener('click', () => {
            audioSystem.playClick();
            pauseGame();
        });
    }
    if (elements.quiz.pauseSection) {
        elements.quiz.pauseSection.addEventListener('click', () => {
            audioSystem.playClick();
            pauseGame();
        });
    }

    elements.evaluation.quitButton.addEventListener('click', () => {
        audioSystem.playClick();
    });
}

function handleOptionClick(selectedOption) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    const currentQuestion = quizData[currentIndex];
    const selectedText = currentQuestion.options[selectedOption];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    selectedAnswers[currentIndex] = selectedText;
    answerState[currentIndex] = isCorrect;
    
    if (isCorrect) {
        finalScore += SCORE_PER_CORRECT;
        audioSystem.playCorrect();
    } else {
        audioSystem.playWrong();
    }
    
    showCheckingModal(currentIndex, isCorrect);
}

function pauseGame() {
    if (!isPaused) {
        isPaused = true;
        
        if (timerInterval) {
            clearInterval(timerInterval);
            remainingTime = parseFloat(elements.quiz.timerBar.style.width) || 
                            (elements.quiz.timerBar.offsetWidth / elements.quiz.timerBar.parentElement.offsetWidth * 100);
        }
        
        elements.quiz.timerBar.style.animationPlayState = "paused";
        elements.quiz.timerBar.classList.remove('shrinkTimer');
        
        updateAudioButtonStates();
        
        elements.pauseModal.container.style.display = "flex";
    }
}

function updateAudioButtonStates() {
    if (bgmPlaying) {
        elements.pauseModal.bgmToggle.innerHTML = "🎵 Music: ON";
        elements.pauseModal.bgmToggle.style.backgroundColor = "#3498db";
    } else {
        elements.pauseModal.bgmToggle.innerHTML = "🎵 Music: OFF";
        elements.pauseModal.bgmToggle.style.backgroundColor = "#e74c3c";
    }
    
    if (!audioSystem.correctAnswer.muted) {
        elements.pauseModal.sfxToggle.innerHTML = "🔊 Sound: ON";
        elements.pauseModal.sfxToggle.style.backgroundColor = "#3498db";
    } else {
        elements.pauseModal.sfxToggle.innerHTML = "🔊 Sound: OFF";
        elements.pauseModal.sfxToggle.style.backgroundColor = "#e74c3c";
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        audioSystem.playClick();
        
        elements.pauseModal.container.style.display = "none";
        
        elements.quiz.timerBar.style.animationPlayState = "running";
        
        startTimer(remainingTime);
    }
}

function toggleBGM() {
    if (bgmPlaying) {
        audioSystem.pauseBGM();
        elements.pauseModal.bgmToggle.innerHTML = "🎵 Music: OFF";
        elements.pauseModal.bgmToggle.style.backgroundColor = "#e74c3c";
    } else {
        audioSystem.playBGM();
        elements.pauseModal.bgmToggle.innerHTML = "🎵 Music: ON";
        elements.pauseModal.bgmToggle.style.backgroundColor = "#3498db";
    }
}

function toggleSFX() {
    if (audioSystem.correctAnswer.muted) {
        audioSystem.correctAnswer.muted = false;
        audioSystem.wrongAnswer.muted = false;
        audioSystem.timeout.muted = false;
        audioSystem.buttonClick.muted = false;
        audioSystem.voicelines.forEach(voice => {
            voice.muted = false;
        });
        elements.pauseModal.sfxToggle.innerHTML = "🔊 Sound: ON";
        elements.pauseModal.sfxToggle.style.backgroundColor = "#3498db";
    } else {
        audioSystem.correctAnswer.muted = true;
        audioSystem.wrongAnswer.muted = true;
        audioSystem.timeout.muted = true;
        audioSystem.buttonClick.muted = true;
        audioSystem.voicelines.forEach(voice => {
            voice.muted = true;
        });
        elements.pauseModal.sfxToggle.innerHTML = "🔊 Sound: OFF";
        elements.pauseModal.sfxToggle.style.backgroundColor = "#e74c3c";
    }
}

function startTimer(startFrom = 100) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    elements.quiz.timerBar.style.width = `${startFrom}%`;
    
    const decrementAmount = 0.1; 
    timerInterval = setInterval(() => {
        if (!isPaused) {
            let currentWidth = parseFloat(elements.quiz.timerBar.style.width);
            
            if (currentWidth <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            } else {
                currentWidth -= decrementAmount;
                elements.quiz.timerBar.style.width = `${currentWidth}%`;
            }
        }
    }, 10); 
}

function handleTimeout() {
    audioSystem.playTimeout();
    
    selectedAnswers[currentIndex] = "Time's up";
    answerState[currentIndex] = false;
    
    showCheckingModal(currentIndex, false);
    
    elements.checkingModal.tagline.textContent = "Oops! Time's up!";
    elements.checkingModal.trivia.textContent = "Remember to answer more quickly next time!";
    
    console.log(`Question ${currentIndex + 1} timed out and marked as incorrect`);
}

function handleNextButtonClick() {
    currentIndex++;
    resetCheckingModal();
    elements.checkingModal.container.classList.remove('active');
    
    if (currentIndex < MAX_ROUNDS) {
        updateContent(currentIndex);
        resetAnimate();
        animateElements();
        updateProgressBar(currentIndex);

        audioSystem.playQuestionVoice(currentIndex);
        
        startTimer();
    } else {
        updateProgressBar(MAX_ROUNDS);
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        showEvaluationScreen();
    }
}

function updateContent(index) {
    elements.quiz.score.textContent = finalScore.toString();
    elements.quiz.questionText.textContent = quizData[index].question;
    elements.options.textA.textContent = quizData[index].options.a;
    elements.options.textB.textContent = quizData[index].options.b;
    elements.options.textC.textContent = quizData[index].options.c;
    elements.options.textD.textContent = quizData[index].options.d;
    elements.quiz.memeImage.src = `../../images/quiz-assets/gifs/E${(index + 1).toString()}.gif`;

    setTimeout(() => {
        audioSystem.playQuestionVoice(index);
    }, 1000);
}

function updateProgressBar(index) {
    const percentage = (index / MAX_ROUNDS) * 100;
    elements.progress.bar.style.width = `${percentage}%`;
    elements.progress.value.textContent = `${Math.round(percentage)}%`;
}

function showCheckingModal(index, isCorrect) {
    elements.checkingModal.container.classList.add("active");
    
    elements.checkingModal.icon.src = isCorrect 
        ? "../../images/icons/check.png" 
        : "../../images/icons/cross.png";
        
    const currentQuestion = quizData[index];
    
    if (isCorrect) {
        elements.checkingModal.tagline.textContent = currentQuestion.correctFeedback;
    } else {
        elements.checkingModal.tagline.textContent = currentQuestion.incorrectFeedback;
    }
    
    elements.checkingModal.trivia.textContent = currentQuestion.trivia;
    
    elements.checkingModal.icon.classList.add('iconPopup3');
    elements.checkingModal.tagline.classList.add('taglineFadeIn');
    elements.checkingModal.trivia.classList.add('triviaFadeIn');
    elements.checkingModal.nextButton.classList.add('iconPopup4');
}

function resetCheckingModal() {
    elements.checkingModal.icon.classList.remove('iconPopup3');
    elements.checkingModal.tagline.classList.remove('taglineFadeIn');
    elements.checkingModal.trivia.classList.remove('triviaFadeIn');
    elements.checkingModal.nextButton.classList.remove('iconPopup4');
    
    void elements.checkingModal.icon.offsetWidth;
}

function createPauseModal() {
    elements.pauseModal.container.className = "pause-modal";
    elements.pauseModal.container.style.position = "fixed";
    elements.pauseModal.container.style.top = "0";
    elements.pauseModal.container.style.left = "0";
    elements.pauseModal.container.style.width = "100%";
    elements.pauseModal.container.style.height = "100%";
    elements.pauseModal.container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    elements.pauseModal.container.style.display = "none";
    elements.pauseModal.container.style.justifyContent = "center";
    elements.pauseModal.container.style.alignItems = "center";
    elements.pauseModal.container.style.zIndex = "1000";
    elements.pauseModal.container.style.flexDirection = "column";
    elements.pauseModal.container.style.gap = "20px";
    
    elements.pauseModal.audioTitle.textContent = "SOUND SETTINGS";
    elements.pauseModal.audioTitle.style.color = "white";
    elements.pauseModal.audioTitle.style.fontSize = "24px";
    elements.pauseModal.audioTitle.style.fontWeight = "bold";
    elements.pauseModal.audioTitle.style.marginBottom = "10px";

    elements.pauseModal.audioControls.className = "audio-controls-pause";
    elements.pauseModal.audioControls.style.display = "flex";
    elements.pauseModal.audioControls.style.flexDirection = "column";
    elements.pauseModal.audioControls.style.gap = "15px";
    elements.pauseModal.audioControls.style.marginBottom = "20px";

    elements.pauseModal.bgmToggle.className = "audio-button";
    elements.pauseModal.bgmToggle.innerHTML = "🎵 Music: ON";
    elements.pauseModal.bgmToggle.style.padding = "12px 30px";
    elements.pauseModal.bgmToggle.style.backgroundColor = "#3498db";
    elements.pauseModal.bgmToggle.style.color = "white";
    elements.pauseModal.bgmToggle.style.border = "none";
    elements.pauseModal.bgmToggle.style.borderRadius = "8px";
    elements.pauseModal.bgmToggle.style.fontSize = "16px";
    elements.pauseModal.bgmToggle.style.fontWeight = "bold";
    elements.pauseModal.bgmToggle.style.cursor = "pointer";
    elements.pauseModal.bgmToggle.style.width = "200px";
    elements.pauseModal.bgmToggle.style.textAlign = "center";

    elements.pauseModal.sfxToggle.className = "audio-button";
    elements.pauseModal.sfxToggle.innerHTML = "🔊 Sound: ON";
    elements.pauseModal.sfxToggle.style.padding = "12px 30px";
    elements.pauseModal.sfxToggle.style.backgroundColor = "#3498db";
    elements.pauseModal.sfxToggle.style.color = "white";
    elements.pauseModal.sfxToggle.style.border = "none";
    elements.pauseModal.sfxToggle.style.borderRadius = "8px";
    elements.pauseModal.sfxToggle.style.fontSize = "16px";
    elements.pauseModal.sfxToggle.style.fontWeight = "bold";
    elements.pauseModal.sfxToggle.style.cursor = "pointer";
    elements.pauseModal.sfxToggle.style.width = "200px";
    elements.pauseModal.sfxToggle.style.textAlign = "center";

    elements.pauseModal.resumeButton.className = "resume-button blue-gradient";
    elements.pauseModal.resumeButton.textContent = "RESUME GAME";
    elements.pauseModal.resumeButton.style.padding = "15px 30px";
    elements.pauseModal.resumeButton.style.borderRadius = "8px";
    elements.pauseModal.resumeButton.style.fontSize = "18px";
    elements.pauseModal.resumeButton.style.fontWeight = "bold";
    elements.pauseModal.resumeButton.style.cursor = "pointer";
    elements.pauseModal.resumeButton.style.width = "200px";
    elements.pauseModal.resumeButton.style.textAlign = "center";

    elements.pauseModal.bgmToggle.addEventListener('click', () => {
        audioSystem.playClick();
        toggleBGM();
    });
    
    elements.pauseModal.sfxToggle.addEventListener('click', () => {
        audioSystem.playClick();
        toggleSFX();
    });

    elements.pauseModal.audioControls.appendChild(elements.pauseModal.bgmToggle);
    elements.pauseModal.audioControls.appendChild(elements.pauseModal.sfxToggle);

    elements.pauseModal.container.appendChild(elements.pauseModal.audioTitle);
    elements.pauseModal.container.appendChild(elements.pauseModal.audioControls);
    elements.pauseModal.container.appendChild(elements.pauseModal.resumeButton);

    document.body.appendChild(elements.pauseModal.container);

    elements.pauseModal.resumeButton.addEventListener('click', resumeGame);
}

function showEvaluationScreen() {
    elements.evaluation.container.classList.add('active');
    elements.evaluation.finalScore.textContent = finalScore.toString();

    if (finalScore >= 400) {
        audioSystem.playCorrect(); 
    } else if (finalScore >= 200) {
        audioSystem.playClick(); 
    } else {
        audioSystem.playWrong(); 
    }

    const ratingConfig = getRatingConfig(finalScore);
    elements.evaluation.ratingText.textContent = ratingConfig.text;
    elements.evaluation.ratingText.className = ''; 
    elements.evaluation.ratingText.classList.add(ratingConfig.class);
    elements.evaluation.ratingBar.src = ratingConfig.barImage;
    elements.evaluation.ratingImg.src = ratingConfig.characterImage;
    
    elements.evaluation.ratingImgContainer.classList.add("slidetopMemeImageContainer");
    
    for (let i = 0; i < MAX_ROUNDS; i++) {
        elements.evaluation.answerIcons[i].src = answerState[i] 
            ? "../../images/icons/check.png" 
            : "../../images/icons/cross.png";
            
        elements.evaluation.answers[i].textContent = selectedAnswers[i] || "No answer";
    }
}

function getRatingConfig(score) {
    const configs = {
        0: {
            text: "SANA SINAKTAN MO NA LANG AKO",
            class: "text-red-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar0.png",
            characterImage: "../../images/quiz-assets/rating-img/0.png"
        },
        100: {
            text: "SUSMARYOSEP, KAYA PA BA TEH",
            class: "text-red-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar1.png",
            characterImage: "../../images/quiz-assets/rating-img/1.png"
        },
        200: {
            text: "JUZKODAI, ANYARE SA'YO?",
            class: "text-red-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar2.png",
            characterImage: "../../images/quiz-assets/rating-img/2.png"
        },
        300: {
            text: "SIGE NA NGA, OKAY NA 'TO",
            class: "text-orange-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar3.png",
            characterImage: "../../images/quiz-assets/rating-img/3.png"
        },
        400: {
            text: "TAAS NAMAN, KAKA-FB MO YAN",
            class: "text-green-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar4.png",
            characterImage: "../../images/quiz-assets/rating-img/4.png"
        },
        500: {
            text: "GRABE, MEMER GODZ SI IDOLORDZ",
            class: "text-blue-gradient",
            barImage: "../../images/quiz-assets/rating-bar/rating-bar5.png",
            characterImage: "../../images/quiz-assets/rating-img/5.png"
        }
    };
    
    return configs[score] || configs[0];
}


function createResetConfirmationModal() {
    elements.resetConfirmModal.container.className = "reset-confirm-modal";
    elements.resetConfirmModal.container.style.position = "fixed";
    elements.resetConfirmModal.container.style.top = "0";
    elements.resetConfirmModal.container.style.left = "0";
    elements.resetConfirmModal.container.style.width = "100%";
    elements.resetConfirmModal.container.style.height = "100%";
    elements.resetConfirmModal.container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    elements.resetConfirmModal.container.style.display = "none";
    elements.resetConfirmModal.container.style.justifyContent = "center";
    elements.resetConfirmModal.container.style.alignItems = "center";
    elements.resetConfirmModal.container.style.zIndex = "1000";
    elements.resetConfirmModal.container.style.flexDirection = "column";
    
    elements.resetConfirmModal.message.textContent = "Are you sure you want to reset the current quiz?";
    elements.resetConfirmModal.message.style.color = "white";
    elements.resetConfirmModal.message.style.fontSize = "24px";
    elements.resetConfirmModal.message.style.fontWeight = "bold";
    elements.resetConfirmModal.message.style.marginBottom = "20px";
    elements.resetConfirmModal.message.style.textAlign = "center";
    
    elements.resetConfirmModal.buttonContainer.style.display = "flex";
    elements.resetConfirmModal.buttonContainer.style.gap = "20px";
    
    elements.resetConfirmModal.confirmButton.textContent = "Confirm";
    elements.resetConfirmModal.confirmButton.className = "confirm-button blue-gradient";
    elements.resetConfirmModal.confirmButton.style.padding = "12px 20px";
    elements.resetConfirmModal.confirmButton.style.borderRadius = "8px";
    elements.resetConfirmModal.confirmButton.style.fontSize = "16px";
    elements.resetConfirmModal.confirmButton.style.fontWeight = "bold";
    elements.resetConfirmModal.confirmButton.style.cursor = "pointer";
    elements.resetConfirmModal.confirmButton.style.border = "none";
    elements.resetConfirmModal.confirmButton.style.color = "white";
    elements.resetConfirmModal.confirmButton.style.backgroundColor = "#e74c3c";
    
    elements.resetConfirmModal.cancelButton.textContent = "Cancel";
    elements.resetConfirmModal.cancelButton.className = "cancel-button";
    elements.resetConfirmModal.cancelButton.style.padding = "12px 20px";
    elements.resetConfirmModal.cancelButton.style.borderRadius = "8px";
    elements.resetConfirmModal.cancelButton.style.fontSize = "16px";
    elements.resetConfirmModal.cancelButton.style.fontWeight = "bold";
    elements.resetConfirmModal.cancelButton.style.cursor = "pointer";
    elements.resetConfirmModal.cancelButton.style.border = "none";
    elements.resetConfirmModal.cancelButton.style.color = "white";
    elements.resetConfirmModal.cancelButton.style.backgroundColor = "#3498db";
    
    elements.resetConfirmModal.buttonContainer.appendChild(elements.resetConfirmModal.confirmButton);
    elements.resetConfirmModal.buttonContainer.appendChild(elements.resetConfirmModal.cancelButton);
    
    elements.resetConfirmModal.container.appendChild(elements.resetConfirmModal.message);
    elements.resetConfirmModal.container.appendChild(elements.resetConfirmModal.buttonContainer);
    
    document.body.appendChild(elements.resetConfirmModal.container);

    elements.resetConfirmModal.confirmButton.addEventListener('click', () => {
        audioSystem.playClick();
        elements.resetConfirmModal.container.style.display = "none";
        executeResetQuiz();
    });
    
    elements.resetConfirmModal.cancelButton.addEventListener('click', () => {
        audioSystem.playClick();
        elements.resetConfirmModal.container.style.display = "none";
    });
}


function askResetConfirmation() {
    elements.resetConfirmModal.container.style.display = "flex";
    audioSystem.playClick();
}

function executeResetQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    isPaused = false;
    remainingTime = 100;
    
    elements.pauseModal.container.style.display = "none";
    
    currentIndex = 0;
    finalScore = 0;
    selectedAnswers = [];
    answerState = [];
    
    updateContent(currentIndex);
    updateProgressBar(0);
    
    elements.checkingModal.container.classList.remove('active');
    elements.evaluation.container.classList.remove('active');
    
    resetAnimate();
    animateElements();

    startTimer();
    
    console.log("Quiz has been reset!");
}

function animateElements() {
    elements.options.buttonA.classList.add("slideRightA");
    elements.options.buttonB.classList.add("slideRightB");
    elements.options.buttonC.classList.add("slideRightC");
    elements.options.buttonD.classList.add("slideRightD");
    
    elements.quiz.memeImageContainer.classList.add("slidetopMemeImageContainer");
    elements.quiz.questionIcon.classList.add('iconPopup');
    elements.quiz.questionText.classList.add('questionFadeIn');
    elements.quiz.timerBar.classList.add('shrinkTimer');
}

function resetAnimate() {
    elements.options.buttonA.classList.remove("slideRightA");
    elements.options.buttonB.classList.remove("slideRightB");
    elements.options.buttonC.classList.remove("slideRightC");
    elements.options.buttonD.classList.remove("slideRightD");
    
    elements.quiz.memeImageContainer.classList.remove("slidetopMemeImageContainer");
    elements.quiz.questionIcon.classList.remove('iconPopup');
    elements.quiz.questionText.classList.remove('questionFadeIn');
    elements.quiz.timerBar.classList.remove('shrinkTimer');
    
    void elements.options.buttonA.offsetWidth;
    void elements.options.buttonB.offsetWidth;
    void elements.options.buttonC.offsetWidth;
    void elements.options.buttonD.offsetWidth;
    void elements.quiz.memeImageContainer.offsetWidth;
    void elements.quiz.questionIcon.offsetWidth;
    void elements.quiz.questionText.offsetWidth;
}