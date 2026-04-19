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

function shuffle(inputArray) {
    for (let i = inputArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = inputArray[i];

        inputArray[i] = inputArray[j];
        inputArray[j] = k;
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