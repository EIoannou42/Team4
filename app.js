
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
function onlist(jsonObj) {
    let th = jsonObj.treasureHunts;
    THlength = th.length;
    username = getCookie("username");
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


}

function question() {

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
//list();