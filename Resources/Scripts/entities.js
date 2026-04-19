
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


const entityTypes = [

    {
        name: "Zombie",
        imgSrc: "Resources/Imgs/zombie.png",
        hp: 2,
        attack: 1,
        spawnChance: 0.7
    },
    {
        name: "Cat",
        imgSrc: "Resources/Imgs/car.png",
        hp: 99,
        attack: 99,
        spawnChance: 0.7
    },
    {
        name: "Traveler",
        imgSrc: "Resources/Imgs/notme.png",
        hp: 1,
        attack: 99,
        spawnChance: 0.7
    },

];

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
