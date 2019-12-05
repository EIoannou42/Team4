
function list() {
    fetch("https://codecyprus.org/th/api/list")//First We use fetch to get the available list of
        .then(response => response.json())
        .then(jsonObj => onlist(jsonObj));
    let x = document.cookie;
    console.log(x);
    document.getElementById("username").value = getCookie("username");
    session = getCookie("SessionCookie");

}
var username = "";
var startlink="https://codecyprus.org/th/api/start?player=";
var session = "";
var selectTH = 0;
var THlength = 0;

var longitude = 0;
var latitude = 0;
function onlist(jsonObj) {
    let th = jsonObj.treasureHunts;
    THlength = th.length;

    let ch = document.getElementById("thDiv");
    for(let i=0; i<th.length; i++) {
        let listCheckB = document.createElement("input");
        let listName = document.createElement("label");
        listCheckB.type = "radio";
        listCheckB.name = "list";
        listCheckB.value = th[i].name;
        listCheckB.id = "checkbox"+i;
        listCheckB.className = "Check";
        listName.htmlFor = "label"+i;
        listName.appendChild(document.createTextNode(th[i].name));
        ch.appendChild(listCheckB);
        ch.appendChild(listName);
        let br = document.createElement("br");
        ch.appendChild(br);
    }
    document.getElementById("checkbox0").checked = true;
    fetch("https://codecyprus.org/th/api/question?session=" + session)
        .then(res => res.json())
        .then(json => {
            let isCompleted = json.completed;
            if (isCompleted === false) {
                username = getCookie("username");
                resume(json);
            }
        });
}
function resume(json) {
    question(json);
}
function selectTHunt() {//The user calls this function when he wants to start the game. This tells us which treasure hunt the user selected.
    //Therefore allowing us to get the correct ID for the specific hunt the user wants to play.
    play();
    document.getElementById("start").type = "Hidden";
    for (let c=0; c<THlength; c++){
        let checkbox = document.getElementById("checkbox"+c);
        if (checkbox.checked === true){
            selectTH=c;

        }
    }
    fetch("https://codecyprus.org/th/api/list")
        .then(res => res.json())
        .then(json => {
            let th2 = json.treasureHunts;
            startlink = "https://codecyprus.org/th/api/start?player=" + username + "&app=Rocket&treasure-hunt-id="+th2[selectTH].uuid;
            fetch(startlink)
                .then(response => response.json())
                .then(json => start(json));
        });

}
getLocation(); //We call it once and then every 32 seconds.
setInterval(getLocation, 60000);
function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(sendPosition);
    }else {
        console.log("Geolocation is not supported on this browser.");
    }
}
function sendPosition(position) {
    //The console will print undefined location until the user starts the treasure hunt and gets a session
    longitude= position.coords.longitude;
    latitude = position.coords.latitude;
    fetch("https://codecyprus.org/th/api/location?session="+session+"&latitude="+latitude+"&longitude="+longitude)
        .then(res => res.json())
        .then(json => {
            let message = json.message;
            console.log(message);
        })

}

function save() {
    play();
    let usern = document.getElementById("username").value;
    setCookie("username", usern, 30);
    console.log(document.cookie);
    username = getCookie("username");//We reset
    let showStart = document.getElementById("start");
    showStart.type = "button";
    //window.location.reload(true);
}
function setCookie(cookieName, cookieValue, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}


function start(json) {
    session = json.session;
    console.log("session is: "+session);
    setCookie("SessionCookie",session,30);
    if(typeof session === 'undefined') {
        alert("Error:\nThe username you have selected is already in use.\nOR\nThe treasure hunt you have selected is unavailable!");
        window.location.reload(true);
    }else {
        fetch("https://codecyprus.org/th/api/question?session=" + session)
            .then(response => response.json())
            .then(json2 => question(json2)); //Just changing the names even tho it doesnt matter to differentiate them
    }
}
let firstTimeInt = true;
let firstTimeBT = true;
let firstTimeBF = true;
let firstTimeA = true;
let firstTimeB = true;
let firstTimeC = true;
let firstTimeD = true;

let score = 0;
function question(json2) {
    document.getElementById("textA").value = "";
    document.getElementById("thDiv").style.display="none";
    document.getElementById("Setup").style.display="none";


    score = getCookie("score");
    let scoreDisplay = document.getElementById("score");
    scoreDisplay.innerText = "Score: " + score;



    let currentQuestion = json2.questionText;
    let qType = json2.questionType;

    let canbeSkipped = json2.canBeSkipped;
    let completedTH = json2.completed;
    //Progress bar initializes here
    let totalQuestions = json2.numOfQuestions;
    let currentIndex = (json2.currentQuestionIndex)+1; //I added 1 so the user sees that he starts from question 1 not question 0.
    let progress = document.getElementById("progress");
    progress.innerText = "Question: "+currentIndex+"/"+totalQuestions;

    //Skip button appears if question can be skipped
    let skipButton = document.getElementById("skip");
    skipButton.type = "hidden";
    if(canbeSkipped){
        skipButton.type = "button";
        skipButton.value = "Skip";
    }

    console.log("qType: " + qType); //debug
    let isLocationSensitive = json2.requiresLocation;
    if(isLocationSensitive){
        getLocation();
    }
    //Question text displayed here
    let qText = document.getElementById("qText");
    qText.innerHTML = currentQuestion;
    //Initialization Zone

    let textAnswer = document.getElementById("textA");
    let textSubmit = document.getElementById("submit");
    let boolAnswerT = document.getElementById("boolT");
    let boolAnswerF = document.getElementById("boolF");
    let MCQ_A = document.getElementById("A");
    let MCQ_B = document.getElementById("B");
    let MCQ_C = document.getElementById("C");
    let MCQ_D = document.getElementById("D");
    //Hide everything and then choose which ones to display depending on their question type
    textAnswer.type= "Hidden";
    textSubmit.type = "Hidden";
    boolAnswerT.type = "Hidden";
    boolAnswerF.type = "Hidden";
    MCQ_A.type = "Hidden";
    MCQ_B.type = "Hidden";
    MCQ_C.type = "Hidden";
    MCQ_D.type = "Hidden";
    //Check if the user finished his treasure hunt.
    if(completedTH){
        document.getElementById("qDiv").style.display="none";
        document.getElementById("loaderText").style.display = "block";
        document.getElementById("loader").style.display = "block";
        thCompleted();
    }
    //Based on question type we display different things
    if(qType === "INTEGER" || qType === "NUMERIC" || qType === "TEXT"){
        //Display this when we need to input integer or numeric answer
        textAnswer.type = "text";

        //Button that will check if the question is wrong or not.
        textSubmit.type = "button";

        if(firstTimeInt) {
            textSubmit.addEventListener('click', function () {

                Answer(textAnswer.value);
            });
            firstTimeInt=false;
        }
        textSubmit.value = "Submit";

    }else if(qType === "BOOLEAN"){
        //Display this when we need to input true or false answers
        boolAnswerT.type = "button";
        boolAnswerT.value = "True";
        if(firstTimeBT) {
            boolAnswerT.addEventListener('click', function () {
                boolAnswerT.type = "Hidden";
                boolAnswerF.type = "Hidden";
                Answer("True");
            });
            firstTimeBT=false;
        }
        boolAnswerF.type = "button";

        boolAnswerF.value = "False";
        if(firstTimeBF) {
            boolAnswerF.addEventListener('click', function () {
                boolAnswerT.type = "Hidden";
                boolAnswerF.type = "Hidden";
                Answer("False");
            });
            firstTimeBF=false;
        }
    }else if(qType === "MCQ"){
        //Here I set every button with a different listener that gives a different argument for each button.
        //To make sure no more than one listener is added and actions are repeated I used a boolean to make it happen only once.
        MCQ_A.type = "button";
        MCQ_A.value = "A";
        if(firstTimeA) {
            MCQ_A.addEventListener('click', function () {
                MCQ_A.type = "Hidden";
                MCQ_B.type = "Hidden";
                MCQ_C.type = "Hidden";
                MCQ_D.type = "Hidden";
                Answer("A");
            });
            firstTimeA=false;
        }
        MCQ_B.type = "button";
        MCQ_B.value = "B";
        if(firstTimeB) {
            MCQ_B.addEventListener('click', function () {
                MCQ_A.type = "Hidden";
                MCQ_B.type = "Hidden";
                MCQ_C.type = "Hidden";
                MCQ_D.type = "Hidden";
                Answer("B");
            });
            firstTimeB=false;
        }
        MCQ_C.type = "button";
        MCQ_C.value = "C";
        if(firstTimeC) {
            MCQ_C.addEventListener('click', function () {
                MCQ_A.type = "Hidden";
                MCQ_B.type = "Hidden";
                MCQ_C.type = "Hidden";
                MCQ_D.type = "Hidden";
                Answer("C");
            });
            firstTimeC=false;
        }
        MCQ_D.type = "button";
        MCQ_D.value = "D";
        if(firstTimeD) {
            MCQ_D.addEventListener('click', function () {
                MCQ_A.type = "Hidden";
                MCQ_B.type = "Hidden";
                MCQ_C.type = "Hidden";
                MCQ_D.type = "Hidden";
                Answer("D");
            });
            firstTimeD=false;
        }
    }



}
let limit =10;
function thCompleted() {
    fetch("https://codecyprus.org/th/api/leaderboard?session="+session+"&sorted&limit="+limit)
        .then(res => res.json())
        .then(json => leaderboard(json))
}

function leaderboard(json) {
    //Here I display the leaderboard. Doing it this way the leaderboard is now scalable and can show as many people as you want.

    document.getElementById("leaderboard").style.display="block";
    let ranking = document.getElementById("THRanking");
    let leader= json.leaderboard;
    for (let i=0; i<limit; i++){
        let row=ranking.insertRow(i+1);//I added +1 here so the headings for the table will be on top instead of the bottom.
        row.insertCell(0).innerText = leader[i].player;
        row.insertCell(1).innerText = leader[i].score;
        row.insertCell(2).innerText = leader[i].completionTime;

    }
    fetch("https://codecyprus.org/th/api/score?session="+session)
        .then(res => res.json())
        .then(jsonObj => {
            document.getElementById("loader").style.display = "none";
            document.getElementById("loaderText").style.display = "none";
            let ServerScore = jsonObj.score;
            let finalscore = document.getElementById("finalScore");
            finalscore.innerText = "Congratulations! \nYou completed the treasure hunt\nYour Final score is: "+ServerScore;
        });
    //Resets the score once the user finishes
    setCookie("score", 0, 30);
}


function skip() {
    //Hiding the skip button so the user doesnt spam it.
    play();
    let skipButton = document.getElementById("skip");
    skipButton.type = "Hidden";
    fetch("https://codecyprus.org/th/api/skip?session="+session)
        .then(response => response.json())
        .then(json => scoreAdj(json));
}


function Answer(arg) {
    arg=arg.trim();
    if(arg === '' || arg === null){
        alert("Make sure you enter an answer!")
    }else {
        fetch("https://codecyprus.org/th/api/answer?session=" + session + "&answer=" + arg)
            .then(response => response.json())
            .then(json => scoreAdj(json));
    }

}
function scoreAdj(json) {

    let scoreMessage = json.message;
    let message = document.getElementById("message");
    message.innerText = scoreMessage;
    setTimeout(hideMessage,6000);

    fetch("https://codecyprus.org/th/api/score?session="+session)
        .then(res => res.json())
        .then(jsonObj => {
            let ServerScore = jsonObj.score;
            setCookie("score",ServerScore,30);

        });



    fetch("https://codecyprus.org/th/api/question?session="+session)
        .then(response => response.json())
        .then(json2 => question(json2));
}
function hideMessage() {
    let message = document.getElementById("message");
    message.innerText = "";
}




function getCookie(cname) {//Code found at W3 Schools that helps us set cookies by just calling the function.
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function play(){
    var audio = document.getElementById("audio");
    audio.play();
}