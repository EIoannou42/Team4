
function list() {
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObj => onlist(jsonObj));
    let x = document.cookie;
    console.log(x);
    document.getElementById("username").value = getCookie("username");
}


function onlist(jsonObj) {
    let th = jsonObj.treasureHunts;
    let uid = th[0].uuid;
    for(let i=0; i<th.length; i++) {
        let listItem = document.createElement("li");
        let username = getCookie("username");
        listItem.innerHTML = "<a href='https://codecyprus.org/th/api/start?player=" + username + "&app=Rocket&treasure-hunt-id=" + uid + "'>" + th[i].name + "</a>";
        ch.appendChild(listItem);
    }
}
function save() {
    let usern = document.getElementById("username").value;
    setCookie("username", usern, 30);
    console.log(document.cookie);
    // window.location.reload(true);
}
function setCookie(cookieName, cookieValue, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}


function start() {



}

function question() {
    
}
function getCookie(cname) {
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