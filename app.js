
function list() {
    fetch("https://codecyprus.org/th/api/list")//First We use fetch to get the available list of
        .then(response => response.json())
        .then(jsonObj => onlist(jsonObj));
    let x = document.cookie;
    console.log(x);
    document.getElementById("username").value = getCookie("username");
}
var username = "";
var startlink="https://codecyprus.org/th/api/start?player=";
var session = "";
var selectTH = 0;
var THlength = 0;
var score= 0;
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
        listName.htmlFor = "label"+i;
        listName.appendChild(document.createTextNode(th[i].name));
        ch.appendChild(listCheckB);
        ch.appendChild(listName);
    }


}
function selectTHunt() {//The user calls this function when he wants to start the game. This tells us which treasure hunt the user selected.
    //Therefore allowing us to get the correct ID for the specific hunt the user wants to play.
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

function save() {
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
function debug() {
    console.log("TH: "+selectTH);

}

function start(json) {
    session = json.session;
    console.log("session is: "+session);

    fetch("https://codecyprus.org/th/api/question?session="+session)
        .then(response => response.json())
        .then(json2 => question(json2)); //Just changing the names even tho it doesnt matter to differentiate them

}
let firstTimeInt = true;
let firstTimeBT = true;
let firstTimeBF = true;
function question(json2) {
    document.getElementById("thDiv").style.display="none";
    document.getElementById("Setup").style.display="none";

    let currentQuestion = json2.questionText;
    let qType = json2.questionType;
    console.log("qType: " + qType);//debug

    let qText = document.getElementById("qText");
    qText.innerHTML = currentQuestion;
    //Initialization Zone
    let qDiv = document.getElementById("qDiv");
    let intAnswer = document.getElementById("intA");
    let intSubmit = document.getElementById("submit");
    let boolAnswerT = document.getElementById("boolT");
    let boolAnswerF = document.getElementById("boolF");
    //Hide everything and then choose which ones to display depending on their question type
    intAnswer.type= "Hidden";
    intSubmit.type = "Hidden";
    boolAnswerT.type = "Hidden";
    boolAnswerF.type = "Hidden";
    //Removing the listeners so the actions dont happen more than once

    //Based on question type we display different things
    if(qType === "INTEGER" || qType === "NUMERIC"){
        //Display this when we need to input integer or numeric answer
        intAnswer.type = "text";
        intAnswer.id = "intA";
        //Button that will check if the question is wrong or not.
        intSubmit.type = "button";

        if(firstTimeInt) {
            intSubmit.addEventListener('click', function () {
                intSubmit.type = "Hidden";
                Answer(intAnswer.value);
            });
            firstTimeInt=false;
        }
        intSubmit.value = "Submit";

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


    }



}



function Answer(arg) {

    fetch("https://codecyprus.org/th/api/answer?session="+session+"&answer="+arg)
        .then(response => response.json())
        .then(json => scoreAdj(json));


}
function scoreAdj(json) {
    let scoreAdjust = json.scoreAdjustment;
    console.log("Score adjustment is: "+ scoreAdjust);
    score += scoreAdjust;
    let scoreDisplay = document.getElementById("score");
    scoreDisplay.innerText = "Score: "+score;
    fetch("https://codecyprus.org/th/api/question?session="+session)
        .then(response => response.json())
        .then(json2 => question(json2));
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
