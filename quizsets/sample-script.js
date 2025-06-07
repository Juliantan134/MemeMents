// Just a test script to change values dynamically
// Can be deleted later on actual Backend Development

document.addEventListener("DOMContentLoaded", () => {

// ------------------------ INITIALIZATION OF ELEMENTS ------------------------


    // Text Values
    var score = document.querySelector("#score");
    var questionText = document.querySelector("#question-text");

    // Option Texts
    var optA = document.querySelector("#opt-a-value");
    var optB = document.querySelector("#opt-b-value");
    var optC = document.querySelector("#opt-c-value");
    var optD = document.querySelector("#opt-d-value");

    // Buttons
    var optAButton = document.querySelector("#opt-a");
    var optBButton = document.querySelector("#opt-b");
    var optCButton = document.querySelector("#opt-c");
    var optDButton = document.querySelector("#opt-d");

    // Meme Image
    var memeImage = document.querySelector("#meme-image");

    // Timer Bar
    var timerBar = document.querySelector('#timer-bar');

    // Elements
    var memeImageContainer = document.querySelector(".meme-image-section");
    var questionIcon = document.querySelector(".question-img");

    // Progress Bar
    var progressBar = document.querySelector("#progress-bar");
    var progressValue = document.querySelector("#progress-value");

    // Global Values
    var FinalScore = 0;


    // Checking Modal
    var checkingModal = document.querySelector("#checking-modal");
    var nextButton = document.querySelector("#next-button");

    var checkingIcon = document.querySelector("#checking-icon");        // Yung icon. Can only be Check or Cross depending on answer
    var checkingTagline = document.querySelector("#checking-tagline");  // Yung malaki
    var checkingTrivia = document.querySelector("#checking-trivia");    // Yung text description


    // Evaluation Page (Final Page)
    var evaluationPage = document.querySelector('#evaluation-container');
    var resetButton = document.querySelector('.reset-section');
    var quitButton = document.querySelector('.quit-section');

    var finalScoreText = document.querySelector('#final-score');

    var ratingText = document.querySelector('#rating-text');
    var ratingBar = document.querySelector('#rating-bar-img');
    var ratingImg = document.querySelector("#meme-image-eval");
    var ratingImgContainer = document.querySelector(".meme-image-section-eval");

    // Evaluation Past Answers
    var ans1 = document.querySelector("#item1-ans");
    var ans2 = document.querySelector("#item2-ans");
    var ans3 = document.querySelector("#item3-ans");
    var ans4 = document.querySelector("#item4-ans");
    var ans5 = document.querySelector("#item5-ans");

    var ansIcon1 = document.querySelector("#item1-img");
    var ansIcon2 = document.querySelector("#item2-img");
    var ansIcon3 = document.querySelector("#item3-img");
    var ansIcon4 = document.querySelector("#item4-img");
    var ansIcon5 = document.querySelector("#item5-img");

    // Store them in an array to iterate on the last page
    const answerTexts = [ans1, ans2, ans3, ans4, ans5];
    const answerIcons = [ansIcon1, ansIcon2, ansIcon3, ansIcon4, ansIcon5];



    // Index Control

    var currentIndex = 0;
    var maxRounds = 5;

    const questionSet = [
        "Sample Question 1?",
        "Sample Question 2?",
        "Sample Question 3?",
        "Sample Question 4?",
        "Sample Question 5?"
      ];
    
    const selectedAnswers = [];
    var answerState = [];

    // Initial load for round 1
    changeContent(currentIndex);
    animateElements();
    optAButton.addEventListener("click", () => {
        selectedAnswers[currentIndex] = optA.textContent;
        alert("Option A clicked: " + optA.textContent);
        answerState[currentIndex] = true; // Logic for checking if current answer is true or false, store it in array to be accessed at the final page
        checkingModal.classList.add("active");
        initializeCheckingModal(currentIndex, answerState[currentIndex]);


    });
    
    optBButton.addEventListener("click", () => {
        selectedAnswers[currentIndex] = optB.textContent;
        alert("Option B clicked: " + optB.textContent);
        answerState[currentIndex] = false; // Logic for checking if current answer is true or false, store it in array to be accessed at the final page
        checkingModal.classList.add("active");
        initializeCheckingModal(currentIndex, answerState[currentIndex]);


    });
    
    optCButton.addEventListener("click", () => {
        selectedAnswers[currentIndex] = optC.textContent;
        alert("Option C clicked: " + optC.textContent);
        answerState[currentIndex] = false; // Logic for checking if current answer is true or false, store it in array to be accessed at the final page
        checkingModal.classList.add("active");
        initializeCheckingModal(currentIndex, answerState[currentIndex]);


    
    });
    
    optDButton.addEventListener("click", () => {
        selectedAnswers[currentIndex] = optD.textContent;
        alert("Option D clicked: " + optD.textContent);
        answerState[currentIndex] = false; // Logic for checking if current answer is true or false, store it in array to be accessed at the final page
        checkingModal.classList.add("active");
        initializeCheckingModal(currentIndex, answerState[currentIndex]);


    
    });
    

// ------------------------ CHECKING MODALS ------------------------






    function changeContent(index){
        score.textContent = FinalScore.toString();
        questionText.textContent = questionSet[index]; // Ikaw na bahala magconnect nito sa JSON Structure, for now, nilagay ko muna sa Array
        optA.textContent = "Option A";
        optB.textContent = "Option B";
        optC.textContent = "Option C";
        optD.textContent = "Option D";

        memeImage.src = `../../images/quiz-assets/meme-img-easy/${(index+1).toString()}.jpg`
        
    }

    function animateElements(){

        optAButton.classList.add("slideRightA");
        optBButton.classList.add("slideRightB");
        optCButton.classList.add("slideRightC");
        optDButton.classList.add("slideRightD");

        // Image Container
        memeImageContainer.classList.add("slidetopMemeImageContainer")

        // Questions
        questionIcon.classList.add('iconPopup');
        questionText.classList.add('questionFadeIn');

        // Timer
        timerBar.classList.add('shrinkTimer');
    }

    function resetAnimate(){

        optAButton.classList.remove("slideRightA");
        optBButton.classList.remove("slideRightB");
        optCButton.classList.remove("slideRightC");
        optDButton.classList.remove("slideRightD");

        // Image Container
        memeImageContainer.classList.remove("slidetopMemeImageContainer")

        // Questions
        questionIcon.classList.remove('iconPopup');
        questionText.classList.remove('questionFadeIn');

        // Timer
        timerBar.classList.remove('shrinkTimer');

        // 🔁 Force a reflow (triggers the browser to recalculate layout)
        void optAButton.offsetWidth;
    }



    function progressUpdate(index){
        const totalQuestions = 5;
        let percentage = (index / totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
        progressValue.textContent = `${Math.round(percentage)}%`;
    
        // Automatically Update Progress Bar based on current Index
    }

    function initializeCheckingModal(index, answerState){
        if (answerState === true){
            checkingIcon.src = "../../images/icons/check.png"
            FinalScore += 100;
        } else if (answerState === false) {
            checkingIcon.src = "../../images/icons/cross.png"
        }
        checkingTagline.textContent = "Galing naman ni Idol"; // According to Index, placeholder only
        checkingTrivia.textContent = "Alam mo ba na ganito ganyan. Hatdog"; // According to Index, placeholder only

        // Animate
        checkingIcon.classList.add('iconPopup3');
        checkingTagline.classList.add('taglineFadeIn');
        checkingTrivia.classList.add('triviaFadeIn');
        nextButton.classList.add('iconPopup4');
    
    }

    function initializeEvaluationModal(){
        evaluationPage.classList.add('active');

        resetButton.addEventListener('click', ()=>{
            // Logic for Resetting
            alert("Reset");
        });

        quitButton.addEventListener('click', ()=> {
            // Logic for Quitting
            alert("Quit");
        });

        finalScoreText.textContent = FinalScore.toString();

        switch (FinalScore) {
            case 0:
                ratingText.textContent = "SANA SINAKTAN MO NA LANG AKO";
                ratingText.classList.add("text-red-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar0.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/0.png";
                break;
            case 100:
                ratingText.textContent = "SUSMARYOSEP, KAYA PA BA TEH";
                ratingText.classList.add("text-red-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar1.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/1.png";
                break;
            case 200:
                ratingText.textContent = "JUZKODAI, ANYARE SA’YO?";
                ratingText.classList.add("text-red-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar2.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/2.png";
                break;
            case 300:
                ratingText.textContent = "SIGE NA NGA, OKAY NA ‘TO";
                ratingText.classList.add("text-orange-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar3.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/3.png";
                break;
            case 400:
                ratingText.textContent = "TAAS NAMAN, KAKA-FB MO YAN";
                ratingText.classList.add("text-green-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar4.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/4.png";
                break;
            case 500:
                ratingText.textContent = "GRABE, MEMER GODZ SI IDOLORDZ";
                ratingText.classList.add("text-blue-gradient");
                ratingBar.src = "../../images/quiz-assets/rating-bar/rating-bar5.png";
                ratingImg.src = "../../images/quiz-assets/rating-img/5.png";
                break;
            default:
                break;
        }
        
        ratingImgContainer.classList.add("slidetopMemeImageContainer"); // Animation for the Image

        // Dynamically Displaying previous answers and their states
        for (let i = 0; i < 5; i++) {
            if (answerState[i] === true) {
                answerIcons[i].src = "../../images/icons/check.png";
                answerTexts[i].textContent = selectedAnswers[i];
            } else {
                answerIcons[i].src = "../../images/icons/cross.png";
                answerTexts[i].textContent = selectedAnswers[i];
            }
        }

    }


    // Waits for Next Button Click
    nextButton.addEventListener('click', () => {
        currentIndex++;
        resetCheckingModal(); // Reset Checking Modal Animation
        checkingModal.classList.remove('active'); // Remove Checking Modal
        
    
        if (currentIndex < maxRounds) {
            changeContent(currentIndex);
            resetAnimate();
            animateElements();
            progressUpdate(currentIndex); 
        } else {
            progressUpdate(maxRounds);
            initializeEvaluationModal();
        }
    });


    function resetCheckingModal(){
        checkingIcon.classList.remove('iconPopup3');
        checkingTagline.classList.remove('taglineFadeIn');
        checkingTrivia.classList.remove('triviaFadeIn');
        nextButton.classList.remove('iconPopup4');
        void checkingIcon.offsetWidth;
    }


    /*

      INITIALIZATION OF ELEMENTS

      ALl opacity to 0
      Change content to Index
        - Question Text
        - Options
        - Image
      Add Animations
        - Question Icon
        - Question Text
        - Image
        - Options
        - Timer


      Click
        - Save Answer (Option Text Content to an Array)
        - Save Answer Status (Correct or Wrong)
        - Update Score (Add 100 if Correct)
        - Display the Modal

      Timer Runs Out
        - Save Answer (None or Timer Ran Out text)
        - Save Answer Status (Automatically Wrong)
        - No Update Score
        - Display the Modal


      Displaying the Modal
        - Change content according to index
          - Tagline
          - Description

        - Change Icon according to status
          - Correct
          - Wrong

        - Apply Animations
          - Icon
          - Tagline
          - Text

      Click Next Button
        - Change content to Index

    */



});
