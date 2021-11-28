// question counter
var qC = 0;
// answer counter
var aC = 0;
// total seconds for interval
var sec = 60;
// total score
var score = 0;
// defining var for timer to be accessible
// throughout the whole script
var timerI;

var highscoreArray = [];

// Check if a question has been answered already
// to avoid the possibility of multiple clicks
// on answers for one question
// while the timeout is running
var check = false;

// Checks if High Scores element is displayed on the page
var checkHSDisplayed = false;

// High Scores
var hScores = [];
// If hScores exists in localStorage
if (localStorage.getItem("hScores")) {
    // import it
    hScores = JSON.parse(localStorage.getItem("hScores"));
    // display it on the page
    hScores.forEach(function (oneScore) {
        $(".hs-list").append($("<li>").text(oneScore));
    })
}


// Generates elements for the welcome screen,
// to be showed when opening or refreshing
// the website
function welcomeScreen() {
    // Section for the welcome header
    $("main").append($("<section>").attr("class", "welcome-h-section"));
    // Welcome header
    $(".welcome-h-section").append($("<h1>").attr("class", "welcome-h").text(arr.pageText.welcomeH));

    // Section for the welcome text
    $("main").append($("<section>").attr("class", "welcome-text-section"));
    // Looping through all the paragraphs with welcome text
    arr.pageText.welcomeP.forEach(function (p) {
        $(".welcome-text-section").append($("<p>").attr("class", "welcome-text").text(p));
    })

    // Section for the start button
    $("main").append($("<section>").attr("class", "start-button-section"));
    // Start button
    $(".start-button-section").append($("<button>").attr("class", "start-button").text("Start!"));
}

function stopTimer() {
    clearInterval(timerI);
    // Coloring timer red to signify the end of the quiz
    $("#seconds").attr("style", "color: #E00000;");
    // Ending the quiz
    endQuiz();
}


// Generates questions and answers 
function generateQueAns() {

    // Check if out of seconds
    if (sec <= 0) {
        return false;
    }

    // Section for question
    // with an if conditional to not generate if already exists
    // (preserve resources)
    if (!$(".question-section")[0]) {
        $("main").append($("<section>").attr("class", "question-section"))
    }

    // Displays Question
    $(".question-section").append($("<h2>").attr("class", "question").text(arr.quizQuestions.que[qC]));


    // Generates a "section" to put our buttons in
    // with an if conditional to not generate if already exists
    // (preserve resources)
    if (!$(".buttons-section")[0]) {

        $("main").append($("<section>").attr("class", "buttons-section"));
    }

    // Displays Answers
    for (aC = 0; aC < arr.quizQuestions.ans[qC].length; aC++) {
        $(".buttons-section").append($("<button>").attr("class", "answer-button").text(arr.quizQuestions.ans[qC][aC]));
    }

}

// Clears questions and answers sections
function clearQueAns() {
    // Emptying <h4> for questions
    $(".question-section").empty();
    // Emptying <section> for answers
    $(".buttons-section").empty();
}

// Starts the quiz by calling other functions
// in order to build the structure
// and display questions and answers
function startQuiz() {
    console.log("starting the quiz");
    // Changing the text initially to be displayed right after the click
    // (no need to wait for 1000ms for the timer to change it)
    $("#seconds").text(sec);
    // Timer interval performs every second
    timerI = setInterval(
        function () {
            sec--;
            // checking if the timer is out of time
            // seconds always 0, never negative
            if (sec <= 0) {
                $("#seconds").text("0");
                stopTimer();
            } else {
                $("#seconds").text(sec);
            }
        }

        , 1000);

    // Clearing the Welcome Screen
    $("main").empty();

    // Generating first question
    generateQueAns();
}


function endQuiz() {
    // Clearing everything on the page
    $("main").empty();

    // Section for headers and score
    $("main").append($("<section>").attr("class", "end-section"));

    // Generating an end header
    $(".end-section").append($("<h2>").attr("class", "end").text("End of the Quiz!"));
    // Generating final score
    $(".end-section").append($("<h3>").attr("class", "score").text(`Your final score is: ${score} !`));

    // Section for the submit elements
    $("main").append($("<section>").attr("class", "submit-section"));

    // Adding an input field and a label
    $(".submit-section").append($("<label>").attr("for", "initials").text("Enter your initials:"));
    $(".submit-section").append($("<input>").attr({
        "type": "text",
        "id": "initials",
        "name": "initials"
    }).text("Enter your initials:"));

    // Adding a submit button
    $(".submit-section").append($("<button>").attr("class", "submit-results").text("Submit!"));

    // Section for a start-over button
    $("main").append($("<section>").attr("class", "start-over-section"));

    // Adding a start-over button
    $(".start-over-section").append($("<button>").attr("class", "start-button").text("Start over!"));
}

function generateCorrectIncorrect(bool) {
    if (bool === true) {
        $("main").prepend($("<section>").attr("class", "float-left icon-section").append($("<img>").attr({
            "src": "assets/icons/correct.svg",
            "class": "correct"
        })));
    } else {
        $("main").prepend($("<section>").attr("class", "float-right icon-section").append($("<img>").attr({
            "src": "assets/icons/incorrect.svg",
            "class": "incorrect"
        })));
    }
}

function clearCorrectIncorrect() {
    $(".icon-section").remove();
}


// Generating the Welcome Screen
welcomeScreen();

//eventListener for the start quiz button
// Starts the quiz
$("body").on("click", ".start-button", function () {
    // Making sure all the values are defaulted
    // question counter
    qC = 0;
    // answer counter
    aC = 0;
    // seconds left
    sec = 60;
    // removing any added styles from the seconds counter
    $("#seconds").attr("style", "");

    // Starting the quiz
    startQuiz();

});

// eventListener for answer buttons
$("body").on("click", ".answer-button", function (event) {
    if (check) {
        return false;
    }
    if (qC === arr.quizQuestions.que.length - 1) {
        // Stopping the timer
        stopTimer();
    } else {
        // Checking whether the answer given is right or wrong;
        var answerCheck = event.target.innerHTML === arr.quizQuestions.corA[qC];
        if (answerCheck) {
            score += 10;
        } else {
            score -= 10;
            // also subtracting the time
            sec -= 10;
            // and updating immediately
            // always 0, never negative
            if (sec <= 0) {
                $("#seconds").text("0");
            } else {
                $("#seconds").text(sec);
            }
        }
        // Generating blocks of code to show the user if he was right or wrong
        generateCorrectIncorrect(answerCheck);
        // checks whether an answer was answered already
        check = true;
        // Waiting for a brief moment so that the user can acknowledge his answer
        setTimeout(function () {
            // Clearing Correct/Incorrect icons
            clearCorrectIncorrect();
            // Generating next questions and answers elements
            clearQueAns();
            qC++;
            generateQueAns();
            check = false;
        }, 1000);



    }
});

// eventListener for submit button
$("body").on("click", ".submit-results", function () {
    // Submitting the result
    if ($("#initials").val()) {
        var thisHScore = $("#initials").val();
        // Pushing the result to the hScores array
        hScores.push(`${thisHScore}: ${score}`);
        // Updating the localStorage variable
        localStorage.setItem("hScores", JSON.stringify(hScores));
        // Clearing the input field after the result has been submitted
        $(initials).val("");

        // Adding it to the page itself
        $(".hs-list").append($("<li>").text(`${thisHScore}: ${score}`));
    }


});

// eventListener for the View High Scores button
$("body").on("click", ".view-high-scores", function () {
    if (!checkHSDisplayed) {
        $("aside").attr("style", "display: block; position: absolute; left: 0px; top: 5rem;");
        checkHSDisplayed = true;
    } else {
        $("aside").attr("style", "display: none; position: absolute; left: 0px; top: 5rem;");
        checkHSDisplayed = false;
    }
})

// eventListener for the Reset scores button
$("body").on("click", ".reset-button", function () {
    console.log('lssssa');
    // emptying the array with scores
    highscoreArray = []
    // removing the value from local storage
    localStorage.removeItem("hScores");
    // emptying the element with data
    $(".hs-list").empty();
})