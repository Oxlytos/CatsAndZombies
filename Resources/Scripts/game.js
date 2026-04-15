//size and logic
let gameArea = new Array();

//the graphics
const cellMap = [];

let mainGameWindow;

//specify size
const sizeParameter = 5;

//first element is x axis
//second is y axis
let playerPos = [0, 0];

class Entity {
    constructor(name, imgSrc, hp, attack) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.hp = hp;
        this.attack = attack;
    }

}
const entityTypes =
    [
        new Entity("Oscar", "/Resources/Imgs/me.png", 5, 1),
        new Entity("Cat", "/Resources/Imgs/car.png", 99, 99),
    ]

//Fill at start
function fillGameArea() {

    //Game container 
    const gameDiv = document.getElementById("gameArea");

    //Clear at start
    gameDiv.innerHTML = "";

    mainGameWindow = new Image(400,400);
    gameDiv.appendChild(mainGameWindow);

    //Table to place stuff on
    const gameTable = document.createElement("table");
    gameTable.style.borderCollapse = "collapse";
    gameTable.classList.add("gameTable");

    //Constructs array
    buildGameArray();

    //render table
    for (let i = 0; i < gameArea.length; i++) {

        cellMap[i] = [];
        //X
        const tr = document.createElement("tr");
        for (let y = 0; y < gameArea[i].length; y++) {
            //Y

            //each cell
            //basic styling
            const td = document.createElement("td");
            //td.textContent = gameArea[i][y];
            td.classList.add("gameTable_td")
            const entity = getRandomEntity();

            //each cell has some kind of entity
            td.entity = entity;

            const entityImage = getEntityImage(entity);

            td.appendChild(entityImage);

            //this cell on x,y
            cellMap[i][y] = td

            tr.appendChild(td);
        }
        gameTable.append(tr);
    }
    gameDiv.appendChild(gameTable);

    buildPlayerButton();

}

function buildCoordinalDirectionButton(string, handler) {
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", string);
    buttonToReturn.onclick = handler;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}
function buildPlayerButton() {
    //https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_button_create
    const gameDiv = document.getElementById("gameArea");

    const buttonMap = document.createElement("table");
    for (let i = 0; i < 3; i++) {
        const tr = document.createElement("tr");
        for (let y = 0; y < 3; y++) {
            const td = document.createElement("td");
            tr.appendChild(td);
        }
        buttonMap.appendChild(tr);
    }
    gameDiv.appendChild(buttonMap);


    //north
    var nBut = buildCoordinalDirectionButton("Go North", goNorth)
    var sBut = buildCoordinalDirectionButton("Go South", goSouth);
    var wBut = buildCoordinalDirectionButton("Go West", goWest);
    var eBut = buildCoordinalDirectionButton("Go East", goEast);

    

    buttonMap.appendChild(nBut);
    buttonMap.appendChild(sBut);
    buttonMap.appendChild(eBut);
    buttonMap.appendChild(wBut);

    buttonMap.rows[0].cells[1].appendChild(nBut); // top middle
    buttonMap.rows[1].cells[0].appendChild(wBut); // middle left
    buttonMap.rows[1].cells[2].appendChild(eBut); // middle right
    buttonMap.rows[2].cells[1].appendChild(sBut); // bottom middle
}
function movePlayer(oldPos, newPos) {
    cellMap[oldPos[0]][oldPos[1]].classList.remove("active-player-in-cell");
    cellMap[newPos[0]][newPos[1]].classList.add("active-player-in-cell");
    updateGameScene();
}
function updateGameScene(){
    mainGameWindow.src = cellMap[playerPos[0]][playerPos[1]].entity.imgSrc;
}
function goNorth() {
    const oldPos = Array.from(playerPos);;
    playerPos[0] -= 1;
    movePlayer(oldPos, playerPos);

}
function goWest() {
    const oldPos = Array.from(playerPos);;
    playerPos[1] -= 1;
    movePlayer(oldPos, playerPos);
}
function goEast() {
    const oldPos = Array.from(playerPos);;
    playerPos[1] += 1;
    movePlayer(oldPos, playerPos);
}
function goSouth() {
    const oldPos = Array.from(playerPos);;
    playerPos[0] += 1;
    movePlayer(oldPos, playerPos);
}
function buildGameArray() {
    //X axis, rows
    for (var i = 0; i < sizeParameter; i++) {

        //Create a row element
        var row = [];
        //Y axis, columns
        for (var y = 0; y < sizeParameter; y++) {

            //5 rows of whatever element, be it an X or img elements
            row.push("X")
        }
        //Then push the row
        //Filled with element
        gameArea.push(row);
    }
    console.log(gameArea)
}

function getRandomEntity() {

    //Random based on available entities
    const index = Math.floor(Math.random() * entityTypes.length);

    //Return from that index => can return cat
    return entityTypes[index];
}

function getEntityImage(entity) {
    //image element
    const img = new Image();

    img.classList.add("gridElement");

    //available images based on entities
    img.src = entity.imgSrc;

    return img;
}

