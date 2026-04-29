let scoreDiv=document.querySelector(".score-div");
let startScreen=document.querySelector("#start-screen");
let startTitle=document.querySelector(".start-title");
let startButton=document.querySelector(".start-button");

let questionScreen=document.querySelector("#question-screen");
let questionText=document.querySelector(".question-class");
let timerClass=document.querySelector(".timer-class");
let buttonClass=document.querySelectorAll(".button-class");

let resultScreen=document.querySelector("#result-screen");
let resultScore=document.querySelector(".result-score");
let retryButton=document.querySelector(".retry-button");
let scoreBoard=document.querySelector(".scoreboard-class");

let questionsArray;
let arrayIndex=0;
let score=0;
let timerId;  // stores the setInterval reference id
let timerLeft=15;   // countdown variable
let url=`https://opentdb.com/api.php?amount=10&type=multiple`;

//fetch using async/await same as then() in weather project
//await keyword basically says "wait here until this is done before moving to the next line."
async function fetchQuestion() {
    const result=await fetch(url);
    const data= await result.json();
    questionsArray=data.results; //questions has the array 10 question
    console.log(questionsArray);
}

//shuffling by fisher-yates method gives better shuffling
//or useoptionsArray.sort(()=>return Math.random() - 0.5 ) less reliable         
function shuffle(array){
    for(let i=array.length -1; i>0 ;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}


//setInterval for timer
function startTimer(){
    clearInterval(timerId);//delete old timer duratn if not then it will be mix up
    timerId=setInterval(()=>{              
        timerLeft--;
        timerClass.textContent=timerLeft;

        if (timerLeft==0){           
            timerLeft=15;
            timerClass.textContent=timerLeft;
            arrayIndex++;
            displayQuestion(questionsArray)
        }
    },1000);
}

//will display the question 
function displayQuestion(questionsArray){
    if(arrayIndex==10){
            clearInterval(timerId);
            displayResult();
            return;
        }

    //displays (question,options)
    let rawQuestion=questionsArray[arrayIndex].question;
    questionText.textContent=rawQuestion;

    //spred method:add two arrayconst combined = [...arr1,...arr2];
    let optionsArray=[questionsArray[arrayIndex].correct_answer,...questionsArray[arrayIndex].incorrect_answers];

    //shuffle the elements
    shuffle(optionsArray);
    buttonClass[0].textContent=optionsArray[0];
    buttonClass[1].textContent=optionsArray[1];
    buttonClass[2].textContent=optionsArray[2];
    buttonClass[3].textContent=optionsArray[3];

    startTimer();
}

// will start the quiz
async function startQuiz(){
    await fetchQuestion();//do this then run below code
    startScreen.style.display="none";
    questionScreen.style.display="block";//block takes full width, starts on a new line (good for divs, sections)

    displayQuestion(questionsArray);
}

//display result screen
function displayResult(){
    questionScreen.style.display="none";
    scoreDiv.style.display="none";
    resultScreen.style.display="block";
    resultScore.classList.add("result-Score");
    resultScore.textContent=`Score is:- ${ score} /10`;
       
}

//retry button funtion
function retryques(){
    arrayIndex=0;
    resultScreen.style.display="none";
    scoreDiv.style.display="block";
    questionScreen.style.display="block";
    score=0;
    scoreDiv.textContent=score;
    timerLeft=15;
    timerClass.textContent=timerLeft;
    displayQuestion(questionsArray);
}

startButton.addEventListener("click",(e)=>{
    startQuiz();   
});

//checking if the answer is correct or no
//had to foreach coz buttonClass is an array
buttonClass.forEach((button,index)=>{
    button.addEventListener("click",()=>{
        //check
        if(button.textContent==questionsArray[arrayIndex].correct_answer){
            score++;
            scoreDiv.textContent=`score: ${score}`;           
        }
        arrayIndex++; //increment
        if(arrayIndex>=10){ //check if 10 ques passes
            clearInterval(timerId);
            displayResult();
            return;
        }
        // clearInterval(timerId);//delete old timer duratn
        timerLeft=15;
        timerClass.textContent=timerLeft;
        
        displayQuestion(questionsArray);//display if its not 10 ques
    })
    
})

retryButton.addEventListener("click",()=>{
    retryques();
})