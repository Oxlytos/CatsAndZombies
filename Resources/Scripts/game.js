//size and logic
let gameArea = new Array();

let cheatModeActivated = false;

//the graphics
const cellMap = [];
const activeEntities = [];
let mainGameWindow;

let playerHealth=3;
let maxEntities = 20;
let catCount = 3;
let zombieCount = 5;
let travelerCount = 2;


let turnCounter =0;
let timeInterval;

let entityImage;
let entityName;
let entityHp;
let entityAttack;

let cardinalDirections = ["North", "West", "South", "East", "Stand Still"];

const buttonMapPositions = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1]
];

//specify size
const sizeParameter = 9;

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
        let zomnbie = this.name.includes("Z");
        if(zomnbie){
            moveTowardsPlayer(this,priorToMovementSnap, reservedSpots);
        }
        let traveler = this.name.includes("r")
        if(traveler){
            console.log("Travler moves")
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

const monthyPythonGif = "/Resources/Imgs/The_Bridge_of_Death_Monty_Python_and_the_Holy_Grail.gif"

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

function cheat(){

    console.log("Changing cheat mode")
    cheatModeActivated = cheatModeActivated === 1 ? 0 : 1;
    redrawEntities();
}
function startTimer(){

    const gameStart = Date.now();
    timeInterval =setInterval(() => {

        let timer = document.getElementById("timer");
        if(!timer){
            clearInterval(timeInterval);
            return;
        }
        const timeElapsed = Date.now() - gameStart;

        const seconds = Math.floor(timeElapsed / 1000) % 60;
        const minutes = Math.floor(timeElapsed / 60000) % 60;
        const hours = Math.floor(timeElapsed / 3600000);

         document.getElementById("timer").textContent =
            `${hours.toString().padStart(2, "0")}:` +
            `${minutes.toString().padStart(2, "0")}:` +
            `${seconds.toString().padStart(2, "0")}`;
    }, 1000);

}
//Fill at start

function fillGameArea() {

    startTimer();
    //Game container 
    const gameDiv = document.getElementById("gameArea");

    var cheatButton = document.createElement("input");
    cheatButton.setAttribute("type", "button");
    cheatButton.setAttribute("value", "Cheat");
    cheatButton.onclick = cheat;
    cheatButton.classList.add("gameButton");

   
    //Clear at start
    gameDiv.innerHTML = "";

     gameDiv.prepend(cheatButton);
     
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
     //Inital player position
     let randomX = getRandomPosition();
     let randomY = getRandomPosition();
     playerPos[0] = randomX[0];
     playerPos[1] = randomY[1];
   
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


    let minimapName = document.createElement("p");
    minimapName.textContent ="Karta";
    gameTable.appendChild(minimapName);

    createEntities();
    redrawEntities();
    buildStatScreen();
    buildPlayerButton();
    updateStats();

}
function buildStatScreen(){
    
      //Game container 
    const gameDiv = document.getElementById("gameArea");

    let statscreen = document.createElement("div");
    statscreen.classList.add("statsScreen");

    let statTitle = document.createElement("p");
    statTitle.textContent = "Statistik för spel omgång"

    let turnStat = document.createElement("p");
    turnStat.id = "turn_stat"
    turnStat.textContent = "Runda: " + turnCounter;

    let catsActive = document.createElement("p");
    catsActive.id="active_cats"
    catsActive.textContent="Katter på kartan: " + catCount;

    statscreen.appendChild(statTitle);
    statscreen.appendChild(turnStat);
    statscreen.appendChild(catsActive);

    let timer = document.createElement("p");
    timer.id = "timer";
    statscreen.appendChild(timer);
    
    gameDiv.appendChild(statscreen);
}

function updateStats() {
    let turnStat = document.getElementById("turn_stat")
    if(!turnStat){
        return;
    }
    turnStat.textContent = "Runda: " + turnCounter;


    let catStats = document.getElementById("active_cats");
    catStats.textContent = "Katter på kartan: " + catCount; ""
}

function moveTowardsPlayer(zombieEntity,priorToMovementSnap, reservedSpots) {
    //Player X: 5 | Zombie X: 3
    //Result 5 -3 => 2
    //Player Y: 10 | Zombie Y : 2
    //Result 10-2 => 8
    //Bigger numner is prioritized
    let dZombieX = playerPos[0] - zombieEntity.posX ;
    let dZombieY = playerPos[1] - zombieEntity.posY ;

    let newZombiePosX = zombieEntity.posX;
    let newZombiePosY = zombieEntity.posY;
    //Use math.abs to just get a tile number difference
    //I.E ignore if its to the left or right, up or down at start
    //Math.Abs returns absolute number from input value
    //Math.abs(5) returns 5
    //Math.abs(-3) returns 3
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs 

    const randomMovement = Math.floor(Math.random() * 5);
    if(randomMovement<=1){
        console.log("random movement")
        if(randomMovement===0){

            const left = Math.floor(Math.random() * 2)
            if(left===1){
                newZombiePosX--;
            }
            else{
                newZombiePosX++;
            }
        }
        else if(randomMovement===1){
            const up = Math.floor(Math.random() * 2)
            if(up===1){
                newZombiePosY--;
            }
            else{
                newZombiePosY++;
            }
        }
    }
    else{

        //So here, if X distance is higher than Y distance
        if (Math.abs(dZombieX) > Math.abs(dZombieY)) {

            //If the difference is negative, move left
            if (dZombieX < 0) {
                newZombiePosX--;
            }
            //If the difference is in the positives, move right
            else if (dZombieX > 0) {
                newZombiePosX++;
            }
            //Neutral, at same axis pos more or less
            else {
            }
        }
        else {
            //Zombie goes up in the table
            if (dZombieY < 0) {
                newZombiePosY--;
            }
            //If player is below
            //Move down
            else if (dZombieY > 0) {
                newZombiePosY++;
            }
            else {
                //Don't move here either
            }
        }
}
    //Make sure its within params of the table
    newZombiePosX = Math.max(0, Math.min(sizeParameter - 1, newZombiePosX));
    newZombiePosY = Math.max(0, Math.min(sizeParameter - 1, newZombiePosY));

    //Check if spot is reserved, if it is, quit operation
    if(reservedSpots[newZombiePosX][newZombiePosY]){
        return;
    }

    //Spots reserved by this entity
    reservedSpots[newZombiePosX][newZombiePosY] = true;
    zombieEntity.posX = newZombiePosX;
    zombieEntity.posY = newZombiePosY;

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

        //Save current to modify, or not modify later
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
        //Stand still
        if (direction == "Stand Still") {
            console.log("Standing still")
            //We reserve our own space and stand still
            reservedSpots[newPosX][newPosY] = true;
            return;
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
        //And no other entity has already planned to move there
        //If not occupied, but there's something there, then we can't move
        if(!occupied && !reservedSpots[newPosX][newPosY]){
            movingEntity.posX=newPosX;
            movingEntity.posY=newPosY;

            //This spot is now occupied
            reservedSpots[newPosX][newPosY] = true;
            return;
        }

        //Stay still
        //Re roll function to try and move again?
    }
    
}
//Just create entities by top properties/settings
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
function getEntity(entityName, entityId) {


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
//Handler as in "handle this function"
function buildCoordinalDirectionButton(string, handler) {
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", string);
    buttonToReturn.onclick = handler;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}

//Create a table, create button, append to positions
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
//Move everthhing, clear old posiiton, highligh new pos
function movePlayer(oldPos, newPos) {
    newTurn();
    cellMap[oldPos[0]][oldPos[1]].parentElement.classList.remove("active-player-in-cell");
    
    updateGameScene();
    cellMap[newPos[0]][newPos[1]].parentElement.classList.add("active-player-in-cell");
}

//New turn allows to register when player is on a entity
//Moves enemies
function newTurn(){

    turnCounter++;
    updateStats();
    //Store old positions
     const priorToMovementSnap = activeEntities.map(e => ({
        x: e.posX, //all entiteis cords
        y: e.posY,
    }));

    //Create a mapping of the table
    //All spaces are available to be occupied
    //Unless another entity is already going to that spot
    //Parking system with a reservation
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

//Redraw entities, can limit to only drawing certain in the future
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

        if (img) {
            if (cheatModeActivated) {
                console.log("Drawing..")
                img.src = entity.imgSrc;
            }
            else if (!cheatModeActivated) {
                //
            }
            //
        }
    })
}

//Updates logic
async function updateGameScene(){
    let oldCatFact = document.getElementById("fact");
    if(oldCatFact){
        oldCatFact.remove();
    }

    //Player has same coordinates as entity
    const thisValidEntity = activeEntities.find(e=>e.posX===playerPos[0] && e.posY === playerPos[1]);

    entityImage.src = thisValidEntity ? thisValidEntity.imgSrc : "";
    if (thisValidEntity) {

        const index = activeEntities.indexOf(thisValidEntity);

        //Other method here later, check if class is Cat or something
        if (thisValidEntity.name === "Cat") {
            let fact = await getCatFact();
            let factoidP = document.createElement("p");
            factoidP.id = "fact";
            factoidP.innerHTML = fact;
            document.getElementById("button_map").remove();

            let gameDiv = document.getElementById("gameArea");
            gameDiv.appendChild(factoidP);

            activeEntities.splice(index,1)
            catCount--;
            if(catCount===0){
               setTimeout(winGame, 2000)
               return;
            }
            else{
                updateStats();
                setTimeout(buildPlayerButton, 2000)
                redrawEntities();
            }
            
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
function winGame(){
    let gameDiv = document.getElementById("gameArea");
     alert("Du vinner!")
    gameDiv.innerHTML = "";
   
}
//Build quiz button for traveler
function buildQuizButtons(quiz){

    //Button mapping in a 3x3 grid
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

    //Build question element
    const question = document.createElement("p");
    question.id = "question"
    question.innerHTML = quiz.question;
    gameDiv.appendChild(question);

    //Put buttonmapping under question
    buttonMap.id = "button_map";
    gameDiv.appendChild(buttonMap);
  
    //Build button contnent
    const answerButtons = [
        buildQuizButton(quiz.correctAnswer, true),
        ...quiz.wrongAnswers.map(ans => buildQuizButton(ans, false))
    ];

    //Shuffle by Fisher Yates formula
    shuffle(answerButtons);

    //Map to cell, with randomized array
    answerButtons.map((button, i) => {
        const[row,col] = buttonMapPositions[i];
        buttonMap.rows[row].cells[col].appendChild(button);
    })



}
//From API call, throw in the answer (string) and if its correct or not
function buildQuizButton(answer, isCorrect){
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", answer);
    buttonToReturn.dataset.isCorrect = isCorrect;
    buttonToReturn.onclick = answerQuestion;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}


//From button, check if input has isCorrect
function answerQuestion(event){

    const gameDiv = document.getElementById("gameArea");
    const button = event.target;

    if (button.dataset.isCorrect === "true") {
        console.log("Correct!");
        document.getElementById("question").remove();
        document.getElementById("button_map").remove();
        buildPlayerButton();
        clearTraveler();

    } else {
        
        console.log("Wrong!");
        entityImage.src = monthyPythonGif;
        setInterval(leaveGame, 4000)
        //Game over
    }
}

//Remove after quiz
function clearTraveler(){

    console.log("Clearing traveler")
    const thisValidEntity = activeEntities.findIndex(e=>e.posX===playerPos[0] && e.posY === playerPos[1]);

    if (thisValidEntity !== -1) {
        console.log("Removing...")
        activeEntities.splice(thisValidEntity, 1);

    }

    redrawEntities();

}
//Refactor into a "playerGo", then theck textcontent or something
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


//Give a random position, if its not occupied
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


//Not in use
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
