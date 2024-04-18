document.addEventListener("DOMContentLoaded", function() {
   
    const scriptUrl = new URL(import.meta.url);
    const jsonPath = new URL('questions.json', scriptUrl).href;
    let data;

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;
            console.log("Everything ok..::)");
            startQuiz();
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        });

    const questionElement = document.getElementById('question');
    const answerButtons = Array.from(document.getElementById('answer-buttons').children);
    const nextButton = document.getElementById('next-quiz');
    const scoreBoard= document.getElementById('modal');
    const categoryBoard= document.getElementById('categories');
    const trueBoard= document.getElementById('true-score');
    const falseBoard= document.getElementById('false-score');
    const resetButton= document.getElementById('restart-quiz');

    let currentQuestionIndex = 0;
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    function startQuiz() {
        currentQuestionIndex = Math.floor(Math.random() * 543);
        showQuestion();
    }

    function showQuestion() {
        categoryBoard.innerHTML="";
        let currentQuestion = data[currentQuestionIndex];
        let questionNo = score + 1;
        questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

        Object.keys(currentQuestion.answers).forEach((key, index) => {
            answerButtons[index].innerHTML = key + ": " + currentQuestion.answers[key];
            answerButtons[index].dataset.key = key;
            answerButtons[index].addEventListener("click", selectAnswer);
            answerButtons[index].disabled = false; 
            answerButtons[index].classList.remove("correct", "incorrect"); 
        });

        currentQuestion.categories.forEach(value => {
            const cat= document.createElement('div');
            cat.classList.add('category');
            cat.innerHTML=value;
            categoryBoard.appendChild(cat);
        });
        nextButton.style.display = "none";
    }

    function selectAnswer(e) {
        const selectedAnswer = e.target;
        if (selectedAnswer.dataset.key === data[currentQuestionIndex].correct_answer) {
            correct++;
            selectedAnswer.classList.add("correct");
        } else {
            incorrect++;
            selectedAnswer.classList.add("incorrect");
        }

        answerButtons.forEach(button => {
            if (button.dataset.key === data[currentQuestionIndex].correct_answer) {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        if(score!=5){
            nextButton.style.display = "block";
        }else{
            nextButton.style.display = "hidden"
        }
    }

    function showScore(){
        scoreBoard.classList.remove("hidden");
        scoreBoard.style.display="block";
        trueBoard.innerHTML=correct;
        falseBoard.innerHTML=incorrect;
    }

    function handleNextButton(){
        score = score + 1;
        currentQuestionIndex++;
        if(currentQuestionIndex<data.length && score<5){showQuestion()}
        else{showScore()}
    }

    nextButton.addEventListener("click",()=>{
        if(currentQuestionIndex<data.length){handleNextButton()}
        else{startQuiz()}
    });

    resetButton.addEventListener("click",()=>{
        currentQuestionIndex = 0;
        score = 0;
        correct = 0;
        incorrect = 0;
        scoreBoard.style.display="none";
        scoreBoard.classList.add("hidden");

        startQuiz();
    });
});
