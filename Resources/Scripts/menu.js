function leaveGame(){
    window.location.href = "https://github.com/Oxlytos/CatsAndZombies";
}
function startGame(){
    document.getElementById("mainMenu").remove();

    let gameLocation = document.getElementById("gameArea")

    const cat = new Image(400, 400)
    console.log(cat)
    cat.src = "Resources/Imgs/car.png"
    gameLocation.appendChild(cat)
}
function buildMenu(){
    
}