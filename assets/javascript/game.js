
var allQuestions = [];
var orderedQuestions;
function TriviaQuestion(question, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, image){
    this.question = question;
    this.answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
    this.answerSubmit = function(guess) {
        if(guess.toString().toLowerCase() === this.answers[0].toString().toLowerCase()){
            return true;
        } else {
            return false;
        }
    }
    
    this.getQuestion = function () {
        return this.question;
    }
    this.getCorrectAnswer = function() {
        if(this.question != "How many sides does a circle have? (may be a riddle)"){
            return this.answers[0];
        } else {
            return this.answers[0] + " (an inSIDE and an outSIDE)";
        }
    }
    this.getAnswer = function(x) {
        if(parseInt(x) <= this.answers.length){
            return this.answers[x];
        }
    }
    this.getImage = function() {
        var imageSource = "assets/images/" + image;
        return imageSource;
    }
    allQuestions.push(this);
}

var addition = new TriviaQuestion("What is 4 + 9?",
"13", "9", "31", "Goku", "math.jpg"); 
var circle = new TriviaQuestion("How many sides does a triangle have?",
"3", "2", "180", "Goku", "triangle.jpg"); 
var spiderman = new TriviaQuestion("What is Spiderman's secret identity?",
"Peter Parker", "Harry Potter", "Tony Stark", "Goku", "spiderman.jpg"); 
var findingDory = new TriviaQuestion("What film was the sequel to Finding Nemo?",
"Finding Dory", "Up", "Wreck-It Ralph", "Goku", "dory.jpg");
var buzzlightyear = new TriviaQuestion("To infinity and _______!",
"beyond", "eternity", "zero", "Goku", "buzz.png");
var circle = new TriviaQuestion("How many sides does a circle have? (may be a riddle)", "2", "5", "45", "Goku", "circle.jpg");
var silence = new TriviaQuestion("I cannot be held by a million men but with a single clap I break. What am I?", 
"silence", "air", "Goku", "a leaf", "silence.jpg");
var actuallyGoku = new TriviaQuestion("Who defeated Frieza (on Namek)?", "Goku", "Thanos", "Peter Parker", "Trunks", "goku.jpg")



function countDownToGame(){
    $(".triviaRow").empty(); //empty the Trivia Row to avoid... shenanigans
    var countDownColumn = $("<div>", {"class":"col-md-12 countDown"});
    var countDownTimer = 5;
    countDownColumn.text("Trivia Game beginning in " + countDownTimer);
    $(".triviaRow").append(countDownColumn);
    var countDownInterval;
    countDownInterval = setInterval(function() {
        countDownTimer--;
        countDownColumn.text("Trivia Game beginning in " + countDownTimer);
        if(countDownTimer === 0){
            clearInterval(countDownInterval);
            startGame();
        }
    }, 1000);
}

function startGame(){
    console.log("startGame called");
    orderedQuestions = []; //this array will be the order in which the questions are given
    var takenQuestions = [];
    $(".triviaRow").empty();
    var questionColumn = $("<div>", {"class":"col-md-6 questionColumn"});
    var answerColumn = $("<div>", {"class":"col-md-6 answerColumn"});
    $(".triviaRow").append(questionColumn, answerColumn);
    for(var i = 0;i < allQuestions.length;i++){
        var questionIndex = Math.floor(Math.random() * allQuestions.length);
        if(takenQuestions.includes(questionIndex)){
            i--; //ensures that the same question isn't added twice
        } else {
            takenQuestions.push(questionIndex);
            orderedQuestions.push(allQuestions[questionIndex]); //adds the question
        }
    }
    for(var i = 0;i < orderedQuestions.length;i++){
        console.log(orderedQuestions[i].getCorrectAnswer());
    }
    startTrivia(orderedQuestions.length - 1, 0, 0);
    
}

function assignQuestion(x){
    $(".questionColumn").empty();
    $(".answerColumn").empty();
    $(".questionColumn").text(x.getQuestion());
    var answerRow = $("<div>", {"class": "row answerRow"});
    $(".answerColumn").append(answerRow);
    var takenAnswers = [];
    for(var i = 0;i < x.answers.length;i++){
        var answersIndex = Math.floor(Math.random() * x.answers.length);
        if(takenAnswers.includes(answersIndex)){
            i--; //ensures that the same answer isn't added twice
        } else {
            takenAnswers.push(answersIndex);
            var answerAddition = $("<div>", {"class": "col-md-12"});
            answerRow.append(answerAddition);
            var answerButton = $("<button>", {id: "button" + i, "class": "answerButton"})
            answerButton.text(x.getAnswer(answersIndex));
            answerAddition.append(answerButton);
        }
    }
}

function startTrivia(questionIterator, correctAnswers, incorrectAnswers){
    $(".questionColumn").empty();
    $(".answerColumn").empty();
    if(questionIterator < 0){
        concludeTrivia(correctAnswers, incorrectAnswers);
    } else {
        var nextQuestionInterval;
        var nextQuestionTimer = 6;
        var answerInterval;
        var answerTimer = 6;
        assignQuestion(orderedQuestions[questionIterator]);
        var timeWarning = $("<p>");
        $(".questionColumn").append(timeWarning);
        var breakLine = $("<br>");
        var answerImage = $("<img>");
        answerImage.attr("src", orderedQuestions[questionIterator].getImage());
        answerImage.css({"height":"80%", "width":"auto"});
        answerInterval = setInterval(function() {
            answerTimer--;
            if(answerTimer === 1){
                timeWarning.text(answerTimer + " second remaining!");
            } else {
                timeWarning.text(answerTimer + " seconds remaining!");
            }
            if(answerTimer <= 0){
                clearInterval(answerInterval);
                wrongAnswer();
                questionIterator--;
                nextQuestionInterval = setInterval(function() {
                nextQuestionTimer--;
                $(".answerColumn").text("Next question beginning in " + nextQuestionTimer);
                if(nextQuestionTimer < 0){
                    clearInterval(nextQuestionInterval);
                    startTrivia(questionIterator, correctAnswers, incorrectAnswers);
                }
            }, 1000);
            }
        }, 1000)
        $(".answerButton").on("click", function(e) {
            var selectedButton = $("#" + e.target.id);
            if(orderedQuestions[questionIterator].answerSubmit(selectedButton.text())){
                clearInterval(answerInterval);
                $(".questionColumn").empty();
                $(".answerColumn").empty();
                $(".questionColumn").text("Correct! The answer was " + 
                orderedQuestions[questionIterator].getCorrectAnswer() + "!");
                $(".questionColumn").append(breakLine, answerImage);
                correctAnswers++;
            } else {
                clearInterval(answerInterval);
                wrongAnswer();
            }
            questionIterator--;
            nextQuestionInterval = setInterval(function() {
                nextQuestionTimer--;
                $(".answerColumn").text("Next question beginning in " + nextQuestionTimer);
                if(nextQuestionTimer < 0){
                    clearInterval(nextQuestionInterval);
                    startTrivia(questionIterator, correctAnswers, incorrectAnswers);
                }
            }, 1000);
        })
    }
    function wrongAnswer(){
        $(".questionColumn").empty();
        $(".answerColumn").empty();
        $(".questionColumn").text("Incorrect! The answer was " + 
        orderedQuestions[questionIterator].getCorrectAnswer() + "!");
        $(".questionColumn").append(breakLine, answerImage);
        incorrectAnswers++;
    }
}

function concludeTrivia(correctAnswers, incorrectAnswers){
    $(".questionColumn").empty();
    $(".answerColumn").empty();
    var correctAnswersQuestion;
    var incorrectAnswersQuestion;
    if(correctAnswers === 1){
        correctAnswersQuestion = "question";
    } else {
        correctAnswersQuestion = "questions";
    }
    if(incorrectAnswers === 1){
        incorrectAnswersQuestion = "question";
    } else {
        incorrectAnswersQuestion = "questions";
    }

    $(".answerColumn").text("Trivia Over! You answered " + correctAnswers
    + " " + correctAnswersQuestion + " right and " + incorrectAnswers +
    " " + incorrectAnswersQuestion + " wrong! Click the Reset button to play again!");
    var resetButton = $("<button>", {"class":"resetButton"});
    resetButton.text("Reset the Trivia!");
    $(".questionColumn").append(resetButton);
    resetButton.on("click", function() {
        countDownToGame();
    })

}
countDownToGame();