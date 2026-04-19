//size and logic
let gameArea = new Array();

let cheatModeActivated = false;
let oscarMode = false;

//the graphics
const cellMap = [];
const activeEntities = [];
let mainGameWindow;

//Adjust as needed
let maxPlayerHealth = 3;
let playerHealth;
let maxEntities = 20;


let initalCatCount = 5;
let catCount = initalCatCount;

let initalZombieCount = 4;
let zombieCount = initalZombieCount;

let initalTravelerCount = 4;
let travelerCount = initalTravelerCount;


let turnCounter = 0;
let timeInterval;

let currentEntity;
let battleLogEntity;

let entityImage;
let entityName;
let entityHp;
let entityAttack;

//Roll between these
let cardinalDirections = ["North", "West", "South", "East", "Stand Still"];

//For 1 3x3 area
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

//Timer starts after pressing "start"
function startTimer() {

    const gameStart = Date.now();
    timeInterval = setInterval(() => {

        let timer = document.getElementById("timer");
        if (!timer) {
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

    catCount=initalCatCount;
    zombieCount=initalZombieCount;
    travelerCount=initalTravelerCount;


    startTimer();
    turnCounter = 0;
    //Game container 
    const gameDiv = document.getElementById("gameArea");

    var cheatButton = document.createElement("input");
    cheatButton.setAttribute("type", "button");
    cheatButton.setAttribute("value", "Cheat");
    cheatButton.onclick = cheat;
    cheatButton.classList.add("settingButton");

    var oscarButton = document.createElement("input");
    oscarButton.setAttribute("type", "button");
    oscarButton.setAttribute("value", "Oscar Mode");
    oscarButton.onclick = oscarModeActivationStatus;
    oscarButton.classList.add("settingButton");

    var playerHealthDisplay = document.createElement("p")
    playerHealthDisplay.id = "player_health_display"
    playerHealth = maxPlayerHealth;
    playerHealthDisplay.innerHTML = "Hälsa: " + playerHealth;
    //Clear at start
    gameDiv.innerHTML = "";

    gameDiv.prepend(cheatButton);
    gameDiv.prepend(oscarButton);
    gameDiv.prepend(playerHealthDisplay);



    const imageHolder = document.createElement("div");
    imageHolder.style.display = "grid";
    imageHolder.style.placeItems = "center";

    //Big background
    mainGameWindow = new Image();
    mainGameWindow.classList.add("gameScreen");
    mainGameWindow.src = randomBackground();
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

            const tdImg = document.createElement("img");
            tdImg.width = 32;
            td.appendChild(tdImg);

            //this cell on x,y
            cellMap[i][y] = tdImg

            tr.appendChild(td);
        }
        gameTable.append(tr);
    }



    let minimapName = document.createElement("p");
    minimapName.textContent = "Karta";
    gameDiv.appendChild(minimapName);
        gameDiv.appendChild(gameTable);


    createEntities();
    redrawEntities();
    buildStatScreen();
    buildPlayerButton();
    updateStats();

    cellMap[playerPos[0]][playerPos[1]].parentElement.classList.add("active-player-in-cell");
    drawNearbyEntitiesIcons();


}
function buildStatScreen() {

    //Game container 
    const gameDiv = document.getElementById("gameArea");

    let statscreen = document.createElement("div");
    statscreen.classList.add("statsScreen");

    let statTitle = document.createElement("p");
    statTitle.textContent = "Statistik för spel omgång"

    let turnStat = document.createElement("p");
    turnStat.id = "turn_stat"
    turnStat.textContent = "Drag: " + turnCounter;

    let catsActive = document.createElement("p");
    catsActive.id = "active_cats"
    catsActive.textContent = "Katter på kartan: " + catCount;

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
    if (!turnStat) {
        return;
    }
    turnStat.textContent = "Drag: " + turnCounter;


    let catStats = document.getElementById("active_cats");
    catStats.textContent = "Katter på kartan: " + catCount; ""
}

//Just create entities by top properties/settings
function createEntities() {
    let entityId = 0;

    for (let i = 0; i < catCount; i++) {
        entityId++;
        let cat = getEntity("Cat", entityId);
        cat.imgSrc = getRandomCatPic();
        activeEntities.push(cat);
    }

    for (let z = 0; z < zombieCount; z++) {
        entityId++;
        let zombie = getEntity("Zombie", entityId);
        activeEntities.push(zombie);
    }

    for (let t = 0; t < travelerCount; t++) {
        entityId++;
        let traveler = getEntity("Traveler", entityId);
        activeEntities.push(traveler);
    }

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
    buttonMap.id = "button_map";
    buttonMap.classList.add("button_map");
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

    mainGameWindow.src = randomBackground()

    drawNearbyEntitiesIcons();
}
//New turn allows to register when player is on a entity
//Moves enemies
function newTurn() {

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
    entitiesToMove.forEach(e => e.move(priorToMovementSnap, reservedSpots));
    redrawEntities();

}

//Redraw entities, can limit to only drawing certain in the future
function redrawEntities() {

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

            if (!oscarMode) {
                if (entity.name === "Traveler") {
                    entity.imgSrc = "Resources/Imgs/Wandering_Trader.png";
                }
                if (entity.name === "Zombie") {
                    entity.imgSrc = "Resources/Imgs/zombie2.png";
                }
            }
            else {
                if (entity.name === "Traveler") {
                    entity.imgSrc = "Resources/Imgs/notme.png";
                }
                if (entity.name === "Zombie") {
                    entity.imgSrc = "Resources/Imgs/zombie.png";
                }
            }
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
//Draw on the minimap that there are entities nearby
async function drawNearbyEntitiesIcons() {

    for (let x = 0; x < sizeParameter; x++) {
        for (let y = 0; y < sizeParameter; y++) {
            const thisCell = cellMap[x][y];

            [...thisCell.classList].forEach(cssStyling => {
                if (cssStyling.startsWith("entity-")) {
                    thisCell.classList.remove(cssStyling);
                }
            })
        }
    }


    const nearbyEnteties = activeEntities.filter(e =>
        Math.abs(e.posX - playerPos[0]) <= 1 &&
        Math.abs(e.posY - playerPos[1]) <= 1)

    if (nearbyEnteties.length > 0) {
        nearbyEnteties.forEach
            (n => {
                const thisCell = cellMap[n.posX][n.posY];
                //Add colours based on type
                thisCell.classList.add(`entity-nearby-${n.name.toLowerCase()}`);
            })

    }
    //cellMap[oldPos[0]][oldPos[1]].parentElement.classList.remove("active-player-in-cell");
}

//Updates logic
async function updateGameScene() {
    let oldCatFact = document.getElementById("fact");
    if (oldCatFact) {
        oldCatFact.remove();
    }

    //Player has same coordinates as entity
    const thisValidEntity = activeEntities.find(e => e.posX === playerPos[0] && e.posY === playerPos[1]);

    entityImage.src = thisValidEntity ? thisValidEntity.imgSrc : "";
    if (thisValidEntity) {

        const index = activeEntities.indexOf(thisValidEntity);

        //Other method here later, check if class is Cat or something
        if (thisValidEntity.name === "Cat") {
             document.getElementById("button_map").remove();
            let fact = await getCatFact();
            let factoidP = document.createElement("p");
            factoidP.id = "fact";
            factoidP.innerHTML = fact;
            factoidP.innerHTML += String.fromCharCode(13);

            //Can't spell for 5 cents
            //https://verb.woxikon.se/sv/l%C3%A4ka
            factoidP.innerHTML += " Katten läkte dina sår!"

            playerHealth = maxPlayerHealth;
            updatePlayerHealth();

            let gameDiv = document.getElementById("gameArea");
            gameDiv.appendChild(factoidP);

            activeEntities.splice(index, 1)
            catCount--;
            if (catCount === 0) {
                setTimeout(winGame, 2000)
                return;
            }
            else {

                updateStats();
                setTimeout(buildPlayerButton, 2000)
                redrawEntities();
            }

        }
        if (thisValidEntity.name === "Traveler") {

            document.getElementById("button_map").remove();
            var quiz = await getTravelerQuiz();
            buildQuizButtons(quiz);
        }
        if (thisValidEntity.name === "Zombie") {
            document.getElementById("button_map").remove();
            getBattleButtons(thisValidEntity);
        }

    }
}
function buildBattleButton(flavourText, damage) {
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", flavourText);
    buttonToReturn.dataset.damage = damage;
    buttonToReturn.onclick = attackEnemy
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}

function loseGame() {
    let gameDiv = document.getElementById("gameArea");
    gameDiv.innerHTML = "";
    buildMenu()

}
function updateEnemyHealth() {
    const enemyHealth = document.getElementById("enemy_health")
    enemyHealth.innerHTML = "Fiendes hälsa: " + currentEntity.hp;
}
function updatePlayerHealth() {
    if(playerHealth===0){
       entityImage.src = monthyPythonGif + `?reload=${performance.now()}`;
        setTimeout(loseGame, 4000)    }
    var playerHealthDisplay = document.getElementById("player_health_display")
    playerHealthDisplay.innerHTML = "Hälsa: " + playerHealth;
}

function addToBattleLog(input) {
    battleLogEntity.innerHTML = input;
}

//Start battle
async function getBattleButtons(enemy) {
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
    buttonMap.classList.add("button_map");
    //Build question element
    const enemyHealth = document.createElement("p");
    enemyHealth.id = "enemy_health"
    enemyHealth.innerHTML = "Fiendes hälsa: " + enemy.hp;

    const battleLog = document.createElement("p");
    battleLog.id = "battle_log"
    battleLogEntity = battleLog;

    gameDiv.appendChild(enemyHealth);
    gameDiv.appendChild(battleLog);

    buttonMap.id = "button_map";
    gameDiv.appendChild(buttonMap);


    const attackButton = buildBattleButton("Slå!", 1)
    buttonMap.rows[2].cells[1].appendChild(attackButton);

    battleEncounter(enemy);

}
function battleEncounter(enemy) {

    console.log("Battle start!")
    currentEntity = enemy;
    entityAttack = enemy.attack;
}
function battleTurn() {
    //Enemy gets to attack
    if (currentEntity != null) {
        addToBattleLog("Fiende attackerar!")
        playerHealth -= entityAttack;
        updatePlayerHealth();
    }

}

function endBattleEncoubter() {

    console.log("Ending battle encounter....")
    currentEntity = null;
    entityImage.src = "";
    const battleLog = document.getElementById("battle_log")
    battleLog.remove();
    battleLogEntity = null;
    document.getElementById("enemy_health").remove();
    document.getElementById("button_map").remove();
    clearEntity();
    redrawEntities();
    buildPlayerButton();
    nearbyEnteties();
    return;
}


function winGame() {
    let gameDiv = document.getElementById("gameArea");
    alert("Du vinner!")
    gameDiv.innerHTML = "";
    buildMenu()

}
//Build quiz button for traveler
function buildQuizButtons(quiz) {

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
    buttonMap.classList.add("button_map");
    gameDiv.appendChild(buttonMap);

    //Build button contnent
    const answerButtons = [
        buildQuizButton(quiz.correctAnswer, true),
        //... spreads array out
        //Each item in array gets mapped as individual items
        ...quiz.wrongAnswers.map(ans => buildQuizButton(ans, false))
    ];

    //Shuffle by Fisher Yates formula
    shuffle(answerButtons);

    //Map to cell, with randomized array
    answerButtons.map((button, i) => {
        const [row, col] = buttonMapPositions[i];
        buttonMap.rows[row].cells[col].appendChild(button);
    })



}

//Remove after quiz
function clearEntity() {

    console.log("Clearing entity")
    const thisValidEntity = activeEntities.findIndex(e => e.posX === playerPos[0] && e.posY === playerPos[1]);
    if (thisValidEntity !== -1) {
        console.log("Removing...")
        activeEntities.splice(thisValidEntity, 1);

    }
    redrawEntities();
    drawNearbyEntitiesIcons();


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
    if (playerPos[1] - 1 >= 0) {
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

        const occupied = activeEntities.find(e => e.posX == x && e.posY == y)

        const playerCheck = playerPos[0]===x && playerPos[1]===y;
        if (!occupied && !playerCheck) {
            return [x, y];
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
    if (roll > entityTemplate.spawnChance) {

        const randomCords = getRandomPosition();

        //Return from that index => can return cat
        let entity = new Entity
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


        return entity;
    }

    //rolled under threshold
    else {
        return null;
    }
}

