buildMenu();
function leaveGame(){
    window.location.href = "https://github.com/Oxlytos/CatsAndZombies";
}
function startGame(){
    document.getElementById("mainMenu").remove();
    fillGameArea();
}


function buildMenu(){
    let centeredDiv = document.getElementById("main_centered_div");
    let mainMenu = document.createElement("div");
    mainMenu.id = "mainMenu";

    mainMenu.classList.add("center-flex");

    let h1Title = document.createElement("h1");
    h1Title.innerHTML="Katter & Zombies!"

    let h2Title = document.createElement("h2");
    h2Title.innerHTML="Av Oscar";

    let ulList = document.createElement("ul");
    let li1 = document.createElement("li");
    let li2 = document.createElement("li")
    let li3 = document.createElement("li");

    let startButton = buildMainMenuButton("Starta!", startGame)
    let aboutButton = buildMainMenuButton("Om projektet", aboutGame);
    let quitButton =  buildMainMenuButton("Avsluta (lämna sida)", leaveGame)

    li1.appendChild(startButton);
    li2.appendChild(aboutButton);
    li3.appendChild(quitButton);

    ulList.appendChild(li1)
    ulList.appendChild(li2)
    ulList.appendChild(li3)

    ulList.classList.add("ul_spaced")

    mainMenu.appendChild(ulList);
    mainMenu.prepend(h2Title);
    mainMenu.prepend(h1Title);
    centeredDiv.appendChild(mainMenu);

   
}
function buildMainMenuButton(buttonValue, handler){
     var buttonToReturn = document.createElement("input");
    buttonToReturn.setAttribute("type", "button");
    buttonToReturn.setAttribute("value", buttonValue);
    buttonToReturn.onclick=handler;
    buttonToReturn.classList.add("menuButton");
    return buttonToReturn;
}
function aboutGame(){

    let gameLocation = document.getElementById("gameArea")
    let infoCheck = document.getElementById("info")
    if(infoCheck){
        infoCheck.remove();
    }

    let info = document.createElement("p");
    
    info.id="info"


    info.innerHTML = `
  Gjort av Oscar<br>
  API:er som används är;<br>
  Frågesport: https://opentdb.com/ <br>
  Katt fakta: https://catfact.ninja/ <br>
  Gif:en är från; <br>Gilliam, T & Jones, T. (Regissörer). (1975). Monty Python and the Holy Grail [Film]. EMI Films. <br>
  Fiender är antingen jag, eller från Minecraft; <br>
  Mojang Studios. (2011) Minecraft (26.1.2) [Datorspel] https://www.minecraft.net/sv-se <br>
  Katterna är Andreas, Erikas och Kalles.

`;
info.classList.add("spaced_p");
    gameLocation.appendChild(info);
}