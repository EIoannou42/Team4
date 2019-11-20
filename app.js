function list() {

    fetch("https://codecyprus.org/th/api/list")
        .then(response=> response.json())
        .then(jsonObj =>{
            let th = jsonObj.treasureHunts;
            let uid = th[0].uuid;
            for(let i=0; i<th.length; i++){
                let listItem = document.createElement("li");
                let username = document.getElementById("username").value;
                listItem.innerHTML = "<a href='https://codecyprus.org/th/api/start?player="+username+"&app=Rocket&treasure-hunt-id=" + uid + "'>" + th[i].name + "</a>";
                ch.appendChild(listItem);
            }
        });
}


function start() {



}

function question() {
    
}
list();