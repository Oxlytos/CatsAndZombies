//size and logic
let gameArea = new Array();

//the graphics
const cellMap = [];
const activeEntities = [];
let mainGameWindow;

let entityImage;
let entityName;
let entityHp;
let entityAttack;

//specify size
const sizeParameter = 5;

//first element is x axis
//second is y axis
let playerPos = [0, 0];

class Entity {
    constructor(name, imgSrc, hp, attack, posX, posY) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.hp = hp;
        this.attack = attack;
        this.posX=posX;
        this.posY=posY;
    }

    move(zombie){
        let valid = zombie.name.includes("O");
        console.log(valid);
        if(valid){
            //alert("move")
            console.log(zombie);
            console.log("Moving entity: " + "Id: " + zombie.id + ", Name: " + this.name + "Pos X: " + this.posX + " Pos Y: " + this.posY)
            console.log("Old pos:" + this.posX)
            console.log("Zombie old pos" + zombie.posX)
            zombie.posX++;
            console.log("New pos:" + this.posX)
            console.log("Zombie new pos" + zombie.posX)

        }
    }

}

const entityTypes =
    [
        new Entity("Oscar", "/Resources/Imgs/me.png", 5, 1, 0,0),
        new Entity("Cat", "/Resources/Imgs/car.png", 99, 99),
        new Entity("Nothing", "",0,0)
    ]

//Fill at start
function fillGameArea() {

    //Game container 
    const gameDiv = document.getElementById("gameArea");

    //Clear at start
    gameDiv.innerHTML = "";

    const imageHolder = document.createElement("div");
    imageHolder.style.display = "grid";
    imageHolder.style.placeItems = "center"; 

    //Big background
    mainGameWindow = new Image();
    mainGameWindow.classList.add("gameScreen");
    mainGameWindow.src = "/Resources/Imgs/bgMagic.png";
    mainGameWindow.style.gridArea = "1 / 1";
    mainGameWindow.style.zIndex = "1";


    entityImage = new Image();
    entityImage.classList.add("entityImage");
    entityImage.src = "/Resources/Imgs/car.png"; 
    entityImage.style.gridArea = "1 / 1";
    entityImage.style.zIndex = "5";

    imageHolder.appendChild(mainGameWindow);
    imageHolder.appendChild(entityImage);

    gameDiv.appendChild(imageHolder);

    //Table to place stuff on
    const gameTable = document.createElement("table");
    gameTable.style.borderCollapse = "collapse";
    gameTable.classList.add("gameTable");

    //Constructs array
    buildGameArray();

    //render table
     let zombieNumber = 0;
    for (let i = 0; i < gameArea.length; i++) {

        cellMap[i] = [];
        //X
        const tr = document.createElement("tr");
       
        for (let y = 0; y < gameArea[i].length; y++) {
            //Y
            zombieNumber++;
            //each cell
            //basic styling
            const td = document.createElement("td");
            //td.textContent = gameArea[i][y];
            td.classList.add("gameTable_td")
            let entity = getRandomEntity(zombieNumber);

            //entity.name += zombieNumber
            //entity.id === y;
            activeEntities.push(getRandomEntity());

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

    //console.log("Entities"  + activeEntities)
    playerPos[0] = 2;
    playerPos [1] = 2;
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


    //buttons
    var nBut = buildCoordinalDirectionButton("(N) Gå norr", goNorth)
    var sBut = buildCoordinalDirectionButton("(S) Gå söder", goSouth);
    var wBut = buildCoordinalDirectionButton("(V) Gå väster", goWest);
    var eBut = buildCoordinalDirectionButton("(Ö) Gå öster", goEast);

    buttonMap.appendChild(nBut);
    buttonMap.appendChild(sBut);
    buttonMap.appendChild(eBut);
    buttonMap.appendChild(wBut);

    buttonMap.rows[0].cells[1].appendChild(nBut); // top middle
    buttonMap.rows[1].cells[0].appendChild(wBut); // middle left
    buttonMap.rows[1].cells[2].appendChild(eBut); // middle right
    buttonMap.rows[2].cells[1].appendChild(sBut); // bottom middle
}

//Start new turn from here
function movePlayer(oldPos, newPos) {
    newTurn();
    cellMap[oldPos[0]][oldPos[1]].classList.remove("active-player-in-cell");
    cellMap[newPos[0]][newPos[1]].classList.add("active-player-in-cell");
    updateGameScene();
}

function newTurn(){

    alert("New turn")
    console.log("New turn")
    //activeEntities.forEach(e=>e.move(),this);

    //activeEntities.map(function(thisEntity) {thisEntity.move();})
    activeEntities.forEach(e => e.move(e));
    //dogs.forEach(dog => dog.sayName());
    //dogs.map(function(thisDog) { thisDog.sayName(); })
}

function updateGameScene(){
    entityImage.src = cellMap[playerPos[0]][playerPos[1]].entity.imgSrc;
}
function goNorth() {
    if (playerPos[0] - 1 >= 0) {
        const oldPos = Array.from(playerPos);;
        playerPos[0] -= 1;
        movePlayer(oldPos, playerPos);
    }
}
function goSouth() {
    if (playerPos[0] + 1 < cellMap[0].length) {
        const oldPos = Array.from(playerPos);;
        playerPos[0] += 1;
        movePlayer(oldPos, playerPos);
    }

}
function goWest() {
    if(playerPos[1] - 1 >= 0){
        const oldPos = Array.from(playerPos);;
        playerPos[1] -= 1;
        movePlayer(oldPos, playerPos);
    }
   
}
function goEast() {
    if (playerPos[1] + 1 < gameArea[0].length) {
        const oldPos = Array.from(playerPos);;
        playerPos[1] += 1;
        movePlayer(oldPos, playerPos);
    }

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

function getRandomEntity(id) {

    //Använd new entity med ctor
    let newEntity = {}
    //Random based on available entities
    const index = Math.floor(Math.random() * entityTypes.length);

    const randomX = Math.floor(Math.random() * gameArea[0].length);
    const randomY = Math.floor(Math.random() * gameArea[1].length);

    //Return from that index => can return cat
    let entity =  entityTypes[index];
    entity.id= id;

    console.log("Created enetity: " + entity.id + " " + entity.name)

    console.log("Entity name: " + this.name + " X: " + randomX + " Y: " + randomY)
    
    entity.posX=randomX;
    entity.posY=randomY;
    return entity;
}

function getEntityImage(entity) {
    //image element
    const img = new Image();

    img.classList.add("gridElement");

    //available images based on entities
    img.src = entity.imgSrc;

    return img;
}

