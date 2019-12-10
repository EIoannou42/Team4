

function testList() {
    let num = prompt("Please enter the number of Treasure Hunts you want to display ", "3");

    if (num == null || num === "") {
        alert("Not Valid Input");
    } else {
        fetch("https://codecyprus.org/th/test-api/list?number-of-ths="+num)
            .then(response => response.json())
            .then(json => {
                let th = json.treasureHunts;


                let ch = document.getElementById("testList");
                for(let i=0; i<th.length; i++) {
                    let listCheckB = document.createElement("input");
                    let listName = document.createElement("label");
                    listCheckB.type = "radio";
                    listCheckB.name = "list";
                    listCheckB.value = th[i].name;
                    listCheckB.id = "checkbox"+i;
                    listCheckB.className = "CheckTest";
                    listName.htmlFor = "label"+i;
                    listName.appendChild(document.createTextNode(th[i].name));
                    ch.appendChild(listCheckB);
                    ch.appendChild(listName);
                    let br = document.createElement("br");
                    ch.appendChild(br);
                }
            });
    }

}


function testLeader() {
    let num = prompt("Please enter how many contestants you want to display.", "40");

    if (num == null || num === "") {
        alert("Not Valid Input");
    } else {
        fetch("https://codecyprus.org/th/test-api/leaderboard?sorted&hasPrize&size="+num)
            .then(res => res.json())
            .then(json => {
                let ranking = document.getElementById("TestTable");
                let leader = json.leaderboard;


                for (let i = 0; i < num; i++) {
                    let row = ranking.insertRow(i + 1);//I added +1 here so the headings for the table will be on top instead of the bottom.
                    row.insertCell(0).innerText = leader[i].player;
                    row.insertCell(1).innerText = leader[i].score;
                    let date = new Date(leader[i].completionTime * 1000);
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let seconds = "0" + date.getSeconds();
                    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                    row.insertCell(2).innerText = formattedTime;

                }
            });
    }

}

