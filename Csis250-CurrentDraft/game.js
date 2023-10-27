/*
* CSIS250
* Game: Tower Defense 
* Author: Carol El Souki
* Project: Final Project
*/

class Game{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
        this.sprites = [];
        this.canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:2px solid black";

        /// Start
        this.start = false;

        this.howToPlay = false;

        ///
        this.coins = 0;

        ///win
        this.enemies = [];

        /// end of game 
        this.endOfGame = false;
        /// pause
        this.pause = false;

        this.lives = 3;

        /// Elements of the path
        /// It will be a 2d array
        this.cellWidth = 64;
        this.cellHeight = 64;

        /// Image fot the path
        this.background = new Image();
        this.background.src = "effects/bg.png";

        // counter
        this.counter = 0 ;

        /// Sound effect
        this.backgroundSound = new Audio();
        this.backgroundSound.src = "effects/backgroundSound.mp3";
        this.backgroundSound.volume = 0.05;

        //backgroungimage
        this.backgroundPath = new Image();
        this.backgroundPath.src = "effects/TowerDefense.png";

        // background 2 
        this.backgroundColor = new Image();
        this.backgroundColor.src = "effects/brown.png";

        /// Background images for menu and how to play screen
        this.backgroundImage = new Image();
        this.backgroundImage.src = "effects/BACKGROUND.png";
        this.orcIntro = new Image();
        this.orcIntro.src = "effects/orcMenu.png";


    }
    draw(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);

        if(this.start == false && this.howToPlay == false){
            this.context.drawImage(this.backgroundColor,0, 0, this.canvas.width , this.canvas.height);
            this.drawMenu();
        }
        else if(this.start == true && this.howToPlay == false){
            this.context.drawImage(this.backgroundColor,0, 0, this.canvas.width , this.canvas.height);
            this.drawHowToPlay();
        }
        else if(this.start == true && this.howToPlay == true){
            this.context.drawImage(this.backgroundPath, 0,0, this.backgroundPath.width, this.backgroundPath.height);
            this.drawTop();
            this.backgroundSound.play();
        }
        for (var i = 0 ; i < this.sprites.length ; i ++){
            this.sprites[i].draw(this.context);
        }
    }
    update(){
        for (var i = 0 ; i < this.sprites.length ; i ++){
            this.sprites[i].update(this.context);
            /// Deleting bullet when touching an orc
            if(this.sprites[i] instanceof Bullets && this.sprites[i].dead){
                this.sprites.splice(i, 1);
            }

            /// Deleting orc when dead
            else if(this.sprites[i] instanceof Enemy && this.sprites[i].health <= 0){
                this.enemies.push(this.sprites[i]);
                this.coins+=50;
                this.sprites.splice(i, 1);
            }
            /// Deleting orc when it reaches the kingdom and substracting lives
            else if(this.sprites[i] instanceof Enemy && this.sprites[i].pass){
                this.enemies.push(this.sprites[i]);
                this.lives--;
                this.sprites.splice(i, 1);
            }
            /// Starting the game to display tower position
            else if(this.sprites[i] instanceof TowerPosition && this.sprites[i].start == false
                && this.sprites[i].start == false && this.howToPlay == true && this.start == true){
                    this.sprites[i].start = this.start;
                    this.sprites[i].howToPlay = this.howToPlay;
            }

            /// Setting coins, so we can light green if the user has enough coins to buy a tower
            else if(this.sprites[i] instanceof TowerPosition){
                this.sprites[i].coins = this.coins;
            }

            /// check if loss
            if(this.lives == 0){
                this.pause = true;
                this.drawloser();
            }
            if(this.lives > 0 && this.enemies.length > 25){
                this.counter++;
                if(this.counter == 35){
                    this.endOfGame = true;
                    this.pause = true;
                    this.drawWin();
                }
            }
        }
    }

    drawTop(){
        this.context.fillStyle = "black";
        this.context.lineWidth = 3;
        this.context.fillText("Available coins: " + this.coins, 100, 32);

        this.context.fillText("Lives: " + this.lives, 100, 64);
    }

    drawMenu(){

        this.context.beginPath();
        this.context.drawImage(this.backgroundImage, this.canvas.width/2 - 400, this.canvas.height/2 - 300, 800, 600);
        this.context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 200, 600, 400);
        this.context.fillStyle = "black";

        this.context.font = "50px Gumdrop";
        this.context.strokeText("TOWER DEFENSE", 630, 250, 550);

        this.context.drawImage(this.orcIntro, 150, 360, 400, 300);

        this.context.font="20px Arial";

        var text = "The king in Arvandor builds towers to defend his kingdom against \n a dark force."
        + " The towers become stronger over time \n and are improved with the help of skilled craftsmen and wizards.\n " + "As the enemy forces approach the capital city,\n" +
        "the towers become the last line of defense\n and ultimately defeat the enemies,\n"  + "saving the kingdom.";

        var newLine = text.split("\n");
        var positionY = 300;

        this.context.textAlign = "center";
        for(var i = 0 ; i < newLine.length ; i ++){
            this.context.fillText(newLine[i], 640, positionY);
            positionY += 30;
        }

        this.context.fillStyle = "red";
        this.context.fillText("Press space bar to start", 640, positionY + 10);
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.lineWidth = 3;
        this.context.closePath();
    }

    drawHowToPlay(){

        this.context.beginPath();
        this.context.drawImage(this.backgroundImage, this.canvas.width/2 - 400, this.canvas.height/2 - 300, 800, 600);
        this.context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 200, 600, 400);
        this.context.fillStyle = "black";

        this.context.font = "50px Gumdrop";
        this.context.strokeText("How to play", 630, 250, 550);

        this.context.drawImage(this.orcIntro, 150, 360, 400, 300);

        this.context.font="20px Arial";

        var text = "Welcome to tower defense! \nTo protect your kingdom you must" + 
        " build towers to shoot \nthe enemy before it reaches your castle!" + 
        "\n1- Place a tower to start the game. " +
        "\n2- Shoot enemies by clicking the mouse, \neach enemy gives you 50 coins.\n" +
        "3- By collecting coins you can buy more towers.\n" + "Each tower costs 100 coins.\n" + 
        "\n Good Luck!";

        var newLine = text.split("\n");
        var positionY = 300;

        // this.context.textAlign = "center";
        for(var i = 0 ; i < newLine.length ; i ++){
            this.context.fillText(newLine[i], 640, positionY);
            positionY += 22;
        }

        this.context.fillStyle = "red";
        this.context.fillText("Press space bar to start", 640, positionY + 5);
        this.context.fillText("Press P to pause/resume the game", 640, positionY + 30);
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.closePath();
    }
    
    /// Loser screen
    drawloser(){
        this.context.beginPath();
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.drawImage(this.backgroundImage, this.canvas.width/2 - 400, this.canvas.height/2 - 300, 800, 600);
        this.context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 200, 600, 200);
        this.context.fillStyle = "black";

        this.context.font = "50px Gumdrop";
        this.context.strokeText("OH OH! The orcs entered your kingdom.", 630, 300, 500);

        this.context.drawImage(this.orcIntro, 150, 360, 400, 300);

        this.context.font="20px Arial";

        this.context.fillStyle = "red";
        this.context.fillText("Press R to restart the game", 640, 350);
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.closePath();
    }

    /// draw pause 
    drawPause(){
        this.context.beginPath();
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.drawImage(this.backgroundImage, this.canvas.width/2 - 400, this.canvas.height/2 - 300, 800, 600);
        this.context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 200, 600, 200);
        this.context.fillStyle = "black";

        this.context.font = "50px Gumdrop";
        this.context.strokeText("Pause...", 630, 300, 500);

        this.context.drawImage(this.orcIntro, 150, 360, 400, 300);

        this.context.font="20px Arial";

        this.context.fillStyle = "red";
        this.context.fillText("Press P to continue the game", 640, 350);
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        // this.context.lineWidth = 3;
        this.context.closePath();
    }

    drawWin(){

        this.context.beginPath();
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.drawImage(this.backgroundImage, this.canvas.width/2 - 400, this.canvas.height/2 - 300, 800, 600);
        this.context.fillRect(this.canvas.width/2 - 300, this.canvas.height/2 - 200, 600, 400);
        this.context.fillStyle = "black";

        this.context.font = "50px Gumdrop";
        this.context.strokeText("Congratulations! \nYou have saved your kingdom", 630, 300, 500);

        this.context.drawImage(this.orcIntro, 150, 360, 400, 300);

        this.context.font="20px Arial";

        this.context.fillStyle = "red";
        this.context.fillText("Press R to restart the game", 640, 350);
        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.context.lineWidth = 3;
        this.context.closePath();
    }
}

class Sprites{
    constructor(){

    }
    draw(){

    }
    update(){

    }
}

class Enemy extends Sprites{
    constructor(game, positionX){
        super();
        this.positionX = positionX;
        this.positionY = 6.5 * game.cellHeight;

        this.cellWidth = game.cellWidth;
        this.cellHeight = game.cellHeight;

        this.orc = new Image();
        
        this.orc.src = "effects/orc.png";

        this.speed = 1;

        this.currentImage = 0;

        this.imageWidth = 106;
        this.imageHeight = 79;

        this.counter = 0;

        this.pass = false;

        this.start = game.start;
        this.howToPlay = game.howToPlay;

        this.health = 100;

    }
    draw(context){

        if(this.start == true && this.howToPlay == true){
            
            /// Health bar
            context.fillStyle = "red";
            context.fillRect(this.positionX + 10, this.positionY - 15, this.cellWidth, 10);
            
            /// Health bar
            context.fillStyle = "green";
            context.fillRect(this.positionX + 10, this.positionY - 15, this.cellWidth * this.health / 100, 10);
            context.fillStyle = "rgb(255,255,255, 0.2)";

            /// Drawing orc
            context.drawImage(this.orc, this.imageWidth * this.currentImage, 0, this.imageWidth, this.imageHeight,
                this.positionX, this.positionY, this.imageWidth - 6, this.imageHeight);

            /// if image reaches its limits we go back to the first image
            if(this.currentImage == 7){
                this.currentImage = 0;
            }

            /// Changing image every 20 counts
            else{
                if(this.counter == 20){
                    this.currentImage++;
                    this.counter = 0 ;
                }
                /// Increasing counter
                this.counter++;
            }
        }
    }
    update(){

        /// Right
        if(this.positionX < 4  * this.cellWidth || (this.positionY <= 1.5 * this.cellHeight && this.positionX >= 4 * this.cellHeight)
        || (this.positionY >= 8.5 * this.cellHeight && this.positionX >= 8 * this.cellWidth && this.positionX < 17 * this.cellWidth) || this.positionY < 3 * this.cellHeight && this.positionX >= 17 * this.cellWidth){
            this.positionX += this.speed;
        }

        /// Up
        if(this.positionX >= 4 * this.cellWidth && this.positionX < 6 * this.cellWidth && this.positionY <= 8 * this.cellHeight 
            && this.positionY > 1.5 * this.cellHeight || this.positionX >= 17 * this.cellWidth && this.positionY >= 3 * this.cellHeight){
            this.positionY -= this.speed;
        }

        /// Down
        if(this.positionX >= 10 * this.cellWidth && this.positionX < 17 * this.cellWidth && this.positionY >= 1.5 * this.cellHeight && this.positionY < 6 * this.cellHeight || 
            (this.positionY >= 6 * this.cellHeight && this.positionX <= 8 * this.cellHeight && this.positionX > 4 * this.cellWidth)){
                this.positionY+=this.speed;

        }

        /// Left

        if(this.positionY >= 6 * this.cellHeight && this.positionY < 8.5 * this.cellHeight && this.positionX <= 10 * this.cellWidth && this.positionX > 8 * this.cellWidth){
            this.positionX -= this.speed;

        }

        /// Checking if orc entered the kingdom

        if(this.positionX >= 1280){
            this.pass = true;
        }

    }
}

class TowerPosition extends Sprites {
    constructor(){
        super();

        /// 0 Representing available places to place the towers.
        this.board =[
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.cellSize = 64;

        this.positions = [];

        this.mouseX;
        this.mouseY;

        this.counter = 0;

        this.nbTowers = 0;

        this.start = false;
        this.howToPlay = false;

        this.coins = 0;
    }

    draw(context, positionX, positionY, cellsize){
        if(this.start == true && this.howToPlay == true){
            context.fillRect(positionX, positionY, cellsize, cellsize);
            context.fillStyle = "rgb(255,255,255, 0.2)";
        }
    }

    update(context){
            for(var row = 0 ; row < 13; row++){
                for(var col = 0 ; col < 20; col++){
                    if(this.board[row][col] == 0){
                        this.draw(context, col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
    
                        /// Creating an object to store towerspositions
                        /// Setting condition so we add the positions one time, no many times
                        if(this.counter == 0){
                            this.positions.push({
                                position: {
                                    positionX: col * this.cellSize,
                                    positionY: row * this.cellSize,
                                    occupied: false,
                                }
                            });
                        }
                    }
                }
            }
            this.counter++;

            if(this.start == true && this.howToPlay == true){
                for(var i = 0 ; i < this.positions.length ; i++){
                    if(this.mouseX > this.positions[i].position.positionX && 
                        this.mouseX < this.positions[i].position.positionX + this.cellSize &&
                        this.mouseY > this.positions[i].position.positionY && 
                        this.mouseY < this.positions[i].position.positionY + this.cellSize)
                        {
                            /// green if you have enough mone or you haven't place any tower
                            if(this.nbTowers < 1 || this.coins >= 100){
                                context.fillStyle = "rgba(150,255,150, 0.6)";
                            }

                            /// Red if already placed one tower or if you dont have enough money
                            else { 
                                context.fillStyle = "rgba(255,150,150, 0.6)";
                            }
                            this.draw(context, this.positions[i].position.positionX,
                                this.positions[i].position.positionY, this.cellSize);
                        }
    
                }
            }
    }
}

class Towers extends Sprites{
    constructor(towersPosition){

        super();

        this.positions = towersPosition.positions;
        this.cellSize = towersPosition.cellSize;

        this.currentImage = 0; 
        this.counter = 0;

        this.imageWidth = 128;
        this.imageHeight = 140;

        this.tower = new Image();
        this.tower.src = "effects/tower.png";

        this.toClear = new Image();
        this.toClear.src = "effects/toClear.png";

    }

    draw(context, positionX, positionY, cellSize){

        /// I am drawing the background over again to clear the image
        context.drawImage(this.toClear,positionX, positionY, this.imageWidth, this.imageHeight);

        /// Drawing towe
        context.drawImage(this.tower, this.imageWidth * this.currentImage, 0, this.imageWidth, this.imageHeight,
                positionX, positionY, cellSize * 2, cellSize * 2);

            /// changing the frame to 0 if it reaches its maximum
            if(this.currentImage == 19){
                this.currentImage = 0;
            }

            else{
                // every 20 counts we go to the next frame
                if(this.counter == 20){
                    this.currentImage++;
                    this.counter = 0 ;
                }
                this.counter++;
            }
    }

    update(context){
            for(var i = 0 ; i < this.positions.length ; i++){
                if(this.positions[i].position.occupied){
                    this.draw(context, this.positions[i].position.positionX,
                        this.positions[i].position.positionY, this.cellSize);
                }

            }
    }
}

class Bullets extends Sprites {
    constructor(positionX, positionY, angle, mouseX, mouseY, sprites){
        super();

        this.positionX = positionX;
        this.positionY = positionY;

        this.initialX = positionX;
        this.initialY = positionY;

        this.angle = angle;

        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.spritesArray = sprites;

        this.speed = 5;

        /// Formula to get speed in X and Y;
        this.speedX = this.speed * Math.cos(angle);
        this.speedY = this.speed * Math.sin(angle);

        this.bullet = new Image();
        this.bullet.src = "effects/bullet.png";

        this.sound = new Audio();
        this.sound.src = "effects/shooting.mp3";
        this.sound.volume = 0.4;

        this.ouch = new Audio();
        this.ouch.src = "effects/ouch.mp3";

        this.dead = false;
        // this.ouch.volume = 0.4;
    }

    draw(context){
        context.drawImage(this.bullet, this.positionX, this.positionY);
    }

    update(){

        /// changing bullet position in x and y
        this.positionX += this.speedX;
        this.positionY += this.speedY;

        /// checking for collision with the orcs
        for(var i = 0 ; i < this.spritesArray.length; i++){
            if(this.spritesArray[i] instanceof Enemy){
                if(this.positionX > this.spritesArray[i].positionX && this.positionX < this.spritesArray[i].positionX + 64
                    && this.positionY > this.spritesArray[i].positionY && this.positionY < this.spritesArray[i].positionY + 64){
                        
                        this.dead = true;
                        this.spritesArray[i].health -= 20;
                        this.ouch.play();
                    }
                    
                }
        }

        /// Setting range for the bullet 
        if(this.positionX > this.initialX + 200 || this.positionX < this.initialX - 200 
            || this.positionY > this.initialY + 200 || this.positionY < this.initialY - 200){
            this.dead = true;
        }

    }

}

var defenseTower = new Game();

var towersPosition = new TowerPosition();

/// Adding all event listeners
document.addEventListener("keypress", event => {
    if(event.keyCode == 32 &&  defenseTower.start == false){
        defenseTower.start = true;
    } else if(event.keyCode == 32 && defenseTower.start == true){
        defenseTower.howToPlay = true;
    }
});

/// showing if it is possible to set a tower
document.addEventListener("mousemove", event => {

    if(defenseTower.start == true && defenseTower.howToPlay  == true){
        towersPosition.mouseX = event.clientX - towersPosition.cellSize;
        towersPosition.mouseY = event.clientY;
    }
});

defenseTower.sprites.push(towersPosition);

var counter = 1;
var numberOfTowers = 0;
var nbOfEnemies = 0;

// to shoot bullets or place towers
document.addEventListener("click", event => {
        if(defenseTower.start == true && defenseTower.howToPlay  == true){
        for(var i = 0 ; i < towersPosition.positions.length ; i++){
            if(towersPosition.mouseX > towersPosition.positions[i].position.positionX && 
                towersPosition.mouseX < towersPosition.positions[i].position.positionX + towersPosition.cellSize &&
                towersPosition.mouseY > towersPosition.positions[i].position.positionY && 
                towersPosition.mouseY < towersPosition.positions[i].position.positionY + towersPosition.cellSize
                && towersPosition.positions[i].position.occupied == false)
                {
                    if(numberOfTowers == 0){
                        var enemy = new Enemy(defenseTower,0);
                        defenseTower.sprites.push(enemy);
                    }
                    if(numberOfTowers < 1 || defenseTower.coins >= 100){

                        if(defenseTower.coins >= 100){
                            defenseTower.coins -= 100;
                        }

                        var newTower = new Towers(towersPosition);
                        defenseTower.sprites.push(newTower);
                        towersPosition.positions[i].position.occupied = true;

                        /// updating number of towers
                        numberOfTowers++;
                        towersPosition.nbTowers = numberOfTowers;
                    }
                    return;
                }
    
        }

        ///checking for positions to shoot the bullet on mouse click
        var rect = defenseTower.canvas.getBoundingClientRect();
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

    for(var i = 0 ; i < towersPosition.positions.length ; i++){
        if(towersPosition.positions[i].position.occupied == true)
            {
                var x = towersPosition.positions[i].position.positionX;
                var y = towersPosition.positions[i].position.positionY;

                /// setting angle
                var angle = Math.atan((mouseY - y) / (mouseX - x));

                /// incrementing angle according to x posiiton
                if(x > mouseX){
                    angle += Math.PI;
                }

                /// creating bullet, shooting, and adding to sprites
                var bullet = new Bullets(x, y, angle, mouseX, mouseY, defenseTower.sprites);
                bullet.sound.play();
                defenseTower.sprites.push(bullet);

            }

    }

    /// creating enemies according to users' activity (onclick)
    if(counter % 5 == 0 && numberOfTowers != 0 && nbOfEnemies < 25){
        var newEnemy = new Enemy(defenseTower, 0);
        counter++;
        defenseTower.sprites.push(newEnemy);
        nbOfEnemies++;
        if(numberOfTowers == 3){
            newEnemy.speed = 2;
        }
        else if(numberOfTowers >= 4){
            newEnemy.speed = 4;
        }
    } else {
        counter++;
    }
        }
});

/// To pause the game
document.addEventListener("keypress", event => {
    if(event.keyCode == 112){
        defenseTower.pause = !defenseTower.pause;
    }
});

/// to reset the game 
document.addEventListener("keypress", event => {
    if(event.keyCode == 114 && (defenseTower.lives == 0 || defenseTower.endOfGame == true)){
        location.reload();
    }
});

let requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

gameEngineLoop();

function gameEngineLoop() {
    /// checking if false = false
    if(defenseTower.pause!=true){
        defenseTower.draw();
        defenseTower.update();
    }
    /// pausing the game
    else if(defenseTower.pause && defenseTower.lives != 0 && defenseTower.endOfGame == false){
        defenseTower.drawPause();
    }
    requestAnimFrame(gameEngineLoop);
}