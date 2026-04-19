//size and logic
let gameArea = new Array();

let cheatModeActivated = false;
let oscarMode = false;

//the graphics
const cellMap = [];
const activeEntities = [];
let mainGameWindow;

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

const catUrls =
[
    "/Resources/Imgs/Cat_imgs/637504925_1335737565027348_2711308338909549589_n.jpg",
    "Resources/Imgs/Cat_imgs/660767968_917762301081010_9115556837267146554_n.jpg",
    "Resources/Imgs/Cat_imgs/664289471_1269822081362012_8331023428841532884_n.jpg",
    "Resources/Imgs/Cat_imgs/664314779_4295383360710403_6088586368347165983_n.jpg",
    "Resources/Imgs/Cat_imgs/664407134_1566596684441549_5811764716995801580_n.jpg",
    "Resources/Imgs/Cat_imgs/664736669_1256136733401406_7196935068568418556_n.jpg",
    "Resources/Imgs/Cat_imgs/668725798_1924485681519500_3053834524083633537_n.jpg",
    "Resources/Imgs/Cat_imgs/674355909_3663844083757492_1608850253477360552_n.jpg",
    "Resources/Imgs/Cat_imgs/674289537_2489377444853863_8398338929150350460_n.jpg",
    "Resources/Imgs/Cat_imgs/674282111_1544716550592483_7888726547957021478_n.jpg",
    "Resources/Imgs/Cat_imgs/672058427_1512018353848697_1784022992676750907_n.jpg",
    "Resources/Imgs/Cat_imgs/671917859_2077870696436880_3634519222949420882_n.jpg",
    "Resources/Imgs/Cat_imgs/671482879_2066345033959054_1830653845744358347_n.jpg",
    "Resources/Imgs/Cat_imgs/672246585_1490957996012889_5473808342241986718_n.jpg",
    "Resources/Imgs/Cat_imgs/672698888_971797435310351_3830883337602556168_n.jpg",
    "Resources/Imgs/Cat_imgs/674269607_977601484735101_6987560780554890258_n.jpg",
    "Resources/Imgs/Cat_imgs/676611456_1457976455344828_2842205839786196458_n.jpg",
    "Resources/Imgs/Cat_imgs/670949033_1944228476185719_1861560299095997069_n.jpg",
    "Resources/Imgs/Cat_imgs/670498323_838273165981259_6238886998631735477_n.jpg",
    "Resources/Imgs/Cat_imgs/668697765_1619328522682189_7460610787278644291_n.jpg",
    "Resources/Imgs/Cat_imgs/670815812_2776012699450960_351813636283348826_n.jpg",
    "Resources/Imgs/Cat_imgs/673648097_1137751025158707_2384731684045986050_n.jpg",
    "Resources/Imgs/Cat_imgs/674269607_977601484735101_6987560780554890258_n.jpg",
    "Resources/Imgs/Cat_imgs/672151500_971211542103187_6015264400719865680_n.jpg"
]

const bgUrls =[
    "Resources/Imgs/Bg_imgs/7sUvju2B.jpg",
    "Resources/Imgs/Bg_imgs/ciooWP2n.jpg",
    "Resources/Imgs/Bg_imgs/gfbKm-XN.jpg",
    "Resources/Imgs/Bg_imgs/Hs_JMe0S.jpg",
    "Resources/Imgs/Bg_imgs/leWuoHQD.jpg",
    "Resources/Imgs/Bg_imgs/oF6wHfan.jpg",
    "Resources/Imgs/Bg_imgs/rzJbTJKy.jpg",
    "Resources/Imgs/Bg_imgs/vLr7IfSE.jpg"
];

//specify size
const sizeParameter = 9;

//first element is x axis
//second is y axis
let playerPos = [0, 0];

class Entity {
    constructor(id, name, imgSrc, hp, attack, posX, posY, spawnChance) {
        this.id = id
        this.name = name;
        this.imgSrc = imgSrc;
        this.hp = hp;
        this.attack = attack;
        this.posX = posX;
        this.posY = posY;
        this.spawnChance = spawnChance;
    }

    move(priorToMovementSnap, reservedSpots) {
        //Handle enteties we want to move, i e zombies or other
        let zomnbie = this.name.includes("Z");
        if (zomnbie) {
            moveTowardsPlayer(this, priorToMovementSnap, reservedSpots);
        }
        let traveler = this.name.includes("r")
        if (traveler) {
            moveToUnoccupiedSpot(this, priorToMovementSnap, reservedSpots);
        }
        let cat = this.name.includes("C")
        if(cat){
            //Static, stay on spot
            console.log("meeeow")
            reservedSpots[this.posX][this.posY] = true;
        }

    }

}
class Quiz {
    constructor(question, correctAnswer, wrongAnswers) {
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
        hp: 2,
        attack: 1,
        spawnChance: 0.7
    },
    {
        name: "Cat",
        imgSrc: "/Resources/Imgs/car.png",
        hp: 99,
        attack: 99,
        spawnChance: 0.7
    },
    {
        name: "Traveler",
        imgSrc: "/Resources/Imgs/notme.png",
        hp: 1,
        attack: 99,
        spawnChance: 0.7
    },

];

//Cheat mode to test everything
function cheat() {

    console.log("Changing cheat mode")
    cheatModeActivated = cheatModeActivated === 1 ? 0 : 1;
    redrawEntities();
}
function oscarModeActivationStatus(){
    oscarMode = oscarMode === 1 ? 0: 1;
    redrawEntities();
}

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

function moveTowardsPlayer(zombieEntity, priorToMovementSnap, reservedSpots) {
    //Player X: 5 | Zombie X: 3
    //Result 5 -3 => 2
    //Player Y: 10 | Zombie Y : 2
    //Result 10-2 => 8
    //Bigger numner is prioritized
    let dZombieX = playerPos[0] - zombieEntity.posX;
    let dZombieY = playerPos[1] - zombieEntity.posY;

    let newZombiePosX = zombieEntity.posX;
    let newZombiePosY = zombieEntity.posY;
    //Use math.abs to just get a tile number difference
    //I.E ignore if its to the left or right, up or down at start
    //Math.Abs returns absolute number from input value
    //Math.abs(5) returns 5
    //Math.abs(-3) returns 3
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs 

    const randomMovement = Math.floor(Math.random() * 5);
    if (randomMovement <= 1) {
        console.log("random movement")
        if (randomMovement === 0) {

            const left = Math.floor(Math.random() * 2)
            if (left === 1) {
                newZombiePosX--;
            }
            else {
                newZombiePosX++;
            }
        }
        else if (randomMovement === 1) {
            const up = Math.floor(Math.random() * 2)
            if (up === 1) {
                newZombiePosY--;
            }
            else {
                newZombiePosY++;
            }
        }
    }
    else {

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
    if (reservedSpots[newZombiePosX][newZombiePosY]) {
        return;
    }

    //Spots reserved by this entity
    reservedSpots[newZombiePosX][newZombiePosY] = true;
    zombieEntity.posX = newZombiePosX;
    zombieEntity.posY = newZombiePosY;

}
function moveToUnoccupiedSpot(movingEntity, priorToMovementSnap, reservedSpots) {
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

    for (const direction of directions) {

        //Save current to modify, or not modify later
        let newPosX = movingEntity.posX;
        let newPosY = movingEntity.posY;

        //Up in the table
        if (direction == "North") {
            newPosY--;
        }
        //Down
        if (direction == "South") {
            newPosY++;
        }
        //Left
        if (direction == "West") {
            newPosX--;
        }
        //Right
        if (direction == "East") {
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
        if (!occupied && !reservedSpots[newPosX][newPosY]) {
            movingEntity.posX = newPosX;
            movingEntity.posY = newPosY;

            //This spot is now occupied
            reservedSpots[newPosX][newPosY] = true;
            return;
        }

        //Stay still
        //Re roll function to try and move again?
    }

}
function getRandomCatPic(){

    shuffle(catUrls);
     const index = Math.floor(Math.random() * catUrls.length);
    return catUrls[index];
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
function getEntity(entityName, entityId) {


    const index = entityTypes.findIndex(e => e.name.toLowerCase() === entityName.toLowerCase());
    const entityTemplate = entityTypes[index];

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
function randomBackground() {
    shuffle(bgUrls);
    const index = Math.floor(Math.random() * bgUrls.length);
    return bgUrls[index];
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
            factoidP.innerHTML += "Katten läckte dina sår!"

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
function attackEnemy(event) {

    if (currentEntity) {
        const button = event.target;
        currentEntity.hp -= button.dataset.damage;
        addToBattleLog("Spelare attackerar!")
        updateEnemyHealth();
        if (currentEntity.hp <= 0) {
            addToBattleLog("Spelare vinner!");
            setTimeout(endBattleEncoubter, 1000);
        }
        else if(playerHealth===0){
            
           entityImage.src = monthyPythonGif + `?reload=${performance.now()}`;

        setTimeout(loseGame, 4000)
        }
        else {
            setTimeout(battleTurn, 1000);

        }
    }
}
function loseGame() {
    let gameDiv = document.getElementById("gameArea");
    gameDiv.innerHTML = "";
    buildMenu()

}
function updateEnemyHealth() {
    const enemyHealth = document.getElementById("enemy_health")
    enemyHealth.innerHTML = currentEntity.hp;
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
    enemyHealth.innerHTML = enemy.hp;

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
    return;
}

function shuffle(inputArray) {
    for (let i = inputArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = inputArray[i];

        inputArray[i] = inputArray[j];
        inputArray[j] = k;
    }
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
//From API call, throw in the answer (string) and if its correct or not
function buildQuizButton(answer, isCorrect) {
    var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", answer);
    buttonToReturn.dataset.isCorrect = isCorrect;
    buttonToReturn.onclick = answerQuestion;
    buttonToReturn.classList.add("gameButton");
    return buttonToReturn;
}


//From button, check if input has isCorrect
function answerQuestion(event) {

    const gameDiv = document.getElementById("gameArea");
    const button = event.target;

    if (button.dataset.isCorrect === "true") {
        console.log("Correct!");
        document.getElementById("question").remove();
        document.getElementById("button_map").remove();
        buildPlayerButton();
        clearEntity();

    } else {

        console.log("Wrong!");
        entityImage.src = monthyPythonGif;
        entityImage.src = monthyPythonGif + `?reload=${performance.now()}`;
        setInterval(loseGame, 4000)
        //Game over
    }
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
        if (!occupied) {
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
//Get traveler quiz
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
        if (cheatModeActivated) {
            console.log(correctAnswer)

        }

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
