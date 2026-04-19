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