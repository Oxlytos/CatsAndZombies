//size and logic
let gameArea = new Array();

//the graphics
const cellMap = [];
const activeEntities = [];
let mainGameWindow;

let maxEntities = 20;
let catCount = 3;
let zombieCount = 5;
let travelerCount = 2;


let entityImage;
let entityName;
let entityHp;
let entityAttack;

let cardinalDirections = ["North", "West", "South", "East"];

const buttonMapPositions = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1]
];

//specify size
const sizeParameter = 5;

//first element is x axis
//second is y axis
let playerPos = [0, 0];

class Entity {
    constructor(id, name, imgSrc, hp, attack, posX, posY,spawnChance) {
        this.id = id
        this.name = name;
        this.imgSrc = imgSrc;
        this.hp = hp;
        this.attack = attack;
        this.posX=posX;
        this.posY=posY;
        this.spawnChance = spawnChance;
    }

    move(priorToMovementSnap, reservedSpots){
        //Handle enteties we want to move, i e zombies or other
        let valid = this.name.includes("Z");
        if(valid){
            moveToUnoccupiedSpot(this, priorToMovementSnap, reservedSpots);

        }
    }

}
class Quiz{
    constructor(question, correctAnswer, wrongAnswers){
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
    }
}

const entityTypes = [
   
    {
        name: "Zombie",
        imgSrc: "/Resources/Imgs/zombie.png",
        hp: 5,
        attack: 1,
        spawnChance:0.7
    },
    {
        name: "Cat",
        imgSrc: "/Resources/Imgs/car.png",
        hp: 99,
        attack: 99,
        spawnChance:0.7
    },
    {
        name: "Traveler",
        imgSrc: "/Resources/Imgs/notme.png",
        hp: 99,
        attack: 99,
        spawnChance:0.7
    },
    
];

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
    entityImage.style.gridArea = "1 / 1";
    entityImage.style.zIndex = "5";

    imageHolder.appendChild(mainGameWindow);
    imageHolder.appendChild(entityImage);

    gameDiv.appendChild(imageHolder);

    //Table to place stuff on
    const gameTable = document.createElement("table");
    gameTable.style.borderCollapse = "collapse";
    gameTable.classList.add("gameTable");

     //console.log("Entities"  + activeEntities)
    playerPos[0] = 2;
    playerPos [1] = 2;

    //Constructs array
    buildGameArray()

    //render table
    for (let i = 0; i < sizeParameter; i++) {

        cellMap[i] = [];
        //X
        const tr = document.createElement("tr");
       
        for (let y = 0; y < sizeParameter; y++) {
            //each cell
            //basic styling
            const td = document.createElement("td");
            td.classList.add("gameTable_td")

            const tdImg =  document.createElement("img");
            tdImg.width=32;
            td.appendChild(tdImg);

            //this cell on x,y
            cellMap[i][y] = tdImg

            tr.appendChild(td);
        }
        gameTable.append(tr);
    }

    gameDiv.appendChild(gameTable);

    createEntities();
    redrawEntities();

    
    buildPlayerButton();

}
function moveToUnoccupiedSpot(movingEntity, priorToMovementSnap, reservedSpots)
{
    //Copy array
    const directions = [...cardinalDirections];
    //Fisher yates random function
    //https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort_random2
    for (let i = directions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = directions[i];

        directions[i] = directions[j];
        directions[j] = k;
    }

    for(const direction of directions){

        let newPosX = movingEntity.posX;
        let newPosY = movingEntity.posY;

        //Up in the table
        if(direction=="North"){
            newPosY--;
        }
        //Down
        if(direction=="South"){
            newPosY++;
        }
        //Left
        if(direction=="West"){
            newPosX--;
        }
        //Right
        if(direction=="East"){
            newPosX++;
        }

        //Within bounds
        if (
            newPosX < 0 || newPosY < 0 ||
            newPosX >= sizeParameter ||
            newPosY >= sizeParameter
        ) {
            continue;
        }

        //Occupied slot
        const occupied = priorToMovementSnap.find(e => e.x === newPosX && e.y === newPosY);

        //Not occupied
        if(!occupied && !reservedSpots[newPosX][newPosY]){
            movingEntity.posX=newPosX;
            movingEntity.posY=newPosY;

            //This spot is now occupied
            reservedSpots[newPosX][newPosY] = true;
            return;
        }

        //Stay still
    }
    
}
function createEntities() {
    let entityId = 0;
    for(let i = 0; i<catCount; i++){
        entityId++;
        let cat = getEntity("Cat", entityId);
        activeEntities.push(cat);
    }
    for(let z = 0; z<zombieCount; z++){
        entityId++;
        let zombie = getEntity("Zombie", entityId);
        activeEntities.push(zombie);
    }
    for(let t= 0; t<travelerCount; t++){
        entityId++;
        let traveler = getEntity("Traveler", entityId);
        activeEntities.push(traveler);
    }
   
}
function getEntity(entityName, entityId){
const index = entityTypes.findIndex(e => e.name.toLowerCase() === entityName.toLowerCase());
    const entityTemplate = entityTypes[index];

    const randomCords = getRandomPosition();

    //Return from that index => can return cat
    let entity =  new Entity
    (
        entityId,
        entityTemplate.name,
        entityTemplate.imgSrc,
        entityTemplate.hp,
        entityTemplate.attack,
        randomCords[0],
        randomCords[1]
    )
    return entity;

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
    buttonMap.id ="button_map";
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
    cellMap[oldPos[0]][oldPos[1]].parentElement.classList.remove("active-player-in-cell");
    
    updateGameScene();
    cellMap[newPos[0]][newPos[1]].parentElement.classList.add("active-player-in-cell");
}

function newTurn(){
     const priorToMovementSnap = activeEntities.map(e => ({
        x: e.posX, //all entiteis cords
        y: e.posY,
    }));

    const reservedSpots = Array.from(
        {
            length: sizeParameter
        },
        () => Array(sizeParameter).fill(false)
    );

    //Just move moveable entities
    const entitiesToMove = [...activeEntities].sort(() => Math.random() - 0.5);
    entitiesToMove.forEach(e => e.move(priorToMovementSnap,reservedSpots));
    redrawEntities();
    
}
function redrawEntities()
{
    //clear 
    for (let x = 0; x < sizeParameter; x++) {
        for (let y = 0; y < sizeParameter; y++) {
            cellMap[x][y].src = "";
        }
    }
    //draw at cells positions by entites
    activeEntities.forEach(entity => {
        let img = cellMap[entity.posX][entity.posY]

        if(img){
            img.src = entity.imgSrc;
        }
    })
}

async function updateGameScene(){
    let oldCatFact = document.getElementById("fact");
    if(oldCatFact){
        oldCatFact.remove();
    }
    const thisValidEntity = activeEntities.find(e=>e.posX===playerPos[0] && e.posY === playerPos[1]);

    entityImage.src = thisValidEntity ? thisValidEntity.imgSrc : "";
    if (thisValidEntity) {

        const index = activeEntities.indexOf(thisValidEntity);
        if (thisValidEntity.name === "Cat") {
            let fact = await getCatFact();
            let factoidP = document.createElement("p");
            factoidP.id = "fact";
            factoidP.innerHTML = fact;

            let gameDiv = document.getElementById("gameArea");
            gameDiv.prepend(factoidP);

            activeEntities.splice(index,1)
            redrawEntities();
        }
        if(thisValidEntity.name==="Traveler"){

            var quiz = await getTravelerQuiz();
            document.getElementById("button_map").remove();
            buildQuizButtons(quiz);
        }

    }
}
function shuffle(inputArray){
     for (let i = inputArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = inputArray[i];

        inputArray[i] = inputArray[j];
        inputArray[j] = k;
    }
}
function buildQuizButtons(quiz){


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

    const question = document.createElement("p");
    question.id = "question"
    question.innerHTML = quiz.question;
    gameDiv.appendChild(question);


    buttonMap.id = "button_map";
    gameDiv.appendChild(buttonMap);

  
    //buttons
    const answerButtons = [
        buildQuizButton(quiz.correctAnswer, true),
        ...quiz.wrongAnswers.map(ans => buildQuizButton(ans, false))
    ];

    shuffle(answerButtons);

    answerButtons.map((button, i) => {
        const[row,col] = buttonMapPositions[i];
        buttonMap.rows[row].cells[col].appendChild(button);
    })



}
function buildQuizButton(answer, isCorrect){
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", answer);
    buttonToReturn.dataset.isCorrect = isCorrect;
    buttonToReturn.onclick = answerQuestion;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}

function answerQuestion(event){

    const button = event.target;

    if (button.dataset.isCorrect === "true") {
        console.log("Correct!");
        document.getElementById("question").remove();
        document.getElementById("button_map").remove();
        buildPlayerButton();
        clearTraveler();

    } else {
        console.log("Wrong!");
          window.location.href = "https://github.com/Oxlytos/CatsAndZombies";
        //Game over
    }
}
function clearTraveler(){

    console.log("Clearing traveler")
    const thisValidEntity = activeEntities.findIndex(e=>e.posX===playerPos[0] && e.posY === playerPos[1]);

    if (thisValidEntity !== -1) {
        console.log("Removing...")
        activeEntities.splice(thisValidEntity, 1);

    }

    redrawEntities();

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
    if (playerPos[1] + 1 < sizeParameter) {
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
function getRandomPosition() {

    while (true) {
        const x = Math.floor(Math.random() * sizeParameter);
        const y = Math.floor(Math.random() * sizeParameter);

        const occupied = activeEntities.find(e=>e.posX==x&&e.posY==y)
        if(!occupied){
            return [x,y];
        }
    }
}

function getRandomEntity(entityId) {

    console.log("Id iteration nr: " + entityId);
    //Använd new entity med ctor
    //Random based on available entities
    const index = Math.floor(Math.random() * entityTypes.length);

    const entityTemplate = entityTypes[index];

    //roll a die
    //higher than spawn chance, spawn
    const roll = Math.random();
    if(roll>entityTemplate.spawnChance){

    const randomCords = getRandomPosition();

    //Return from that index => can return cat
    let entity =  new Entity
    (
        entityId,
        entityTemplate.name,
        entityTemplate.imgSrc,
        entityTemplate.hp,
        entityTemplate.attack,
        randomCords[0],
        randomCords[1]
    )


    console.log("Created entity;")
    console.log(entity)

    
    return entity;}

    //rolled under threshold
    else{
        return null;
    }
}

function getEntityImage(entity) {
    //image element
    const img = new Image();

    img.classList.add("gridElement");

    //available images based on entities
    img.src = entity.imgSrc;

    return img;
}
//advice api haha: https://api.adviceslip.com/advice

//frågesport api: https://opentdb.com/api_config.php
async function getCatFact() {
    const url = "https://catfact.ninja/fact?max_length=60";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result.fact;

    } catch (error) {
        console.error(error.message);
    }
}
async function getTravelerQuiz(params) {
    const url = "https://opentdb.com/api.php?amount=1&type=multiple";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();

        let question = result.results[0].question;
        let wrongAnswers = result.results[0].incorrect_answers;
        let correctAnswer = result.results[0].correct_answer;
        console.log(correctAnswer)

        let quiz = new Quiz(
            question, 
            correctAnswer, 
            wrongAnswers
        );
        return quiz;

    } catch (error) {
        console.error(error.message);
    }
}
