const SHIP_HEIGHT = 50;
const SHIP_WIDTH = 60;


let canvas;
let canvasWidth = 1920;
let canvasHeight = 1080;
let context;

let game = {};

let backgroundImage = new Image();
backgroundImage.src = "./assets/im2.png"

// Define canvas and context
game.canvas = document.getElementById('canvas');
game.ctx = game.canvas.getContext('2d');

// Define background color
game.backgroundColor = '#FF0000';

// Defines a function to handle the game loop
game.update = function() {
// Draw canvas background
    game.ctx.fillStyle = game.backgroundColor;
    game.ctx.fillRect(20, 20, game.canvas.width, game.canvas.height);
    game.ctx.drawImage(backgroundImage, 20, 20, canvasWidth, canvasHeight);

}

// Defines a function to handle key events
game.keydown = function(e) {

}      

// Defines a function to start the game loop
game.init = function() {

// Set the game loop
    game.interval = setInterval(game.update, 1000 / 60);
}

// Defines a function to stop the game loop
game.stop = function() {
clearInterval(game.interval);
}

// Defines a function to restart the game
game.restart = function() {
    game.stop();
    game.init();
}

// Start the game on window load
window.onload = game.init;

class Ship {
    constructor(collBox, imageURL) {
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.image = new Image();
        this.image.src = imageURL;
    }
}




class CollisionBox {
    constructor(x, y, width, height) {
        this.x = x; // X-coordinate of the top-left corner
        this.y = y; // Y-coordinate of the top-left corner
        this.width = width; // Width of the box
        this.height = height; // Height of the box
    }

    // Check if this box collides with another box
    collidesWith(otherBox) {
        return (
            this.x < otherBox.x + otherBox.width &&
            this.x + this.width > otherBox.x &&
            this.y < otherBox.y + otherBox.height &&
            this.y + this.height > otherBox.y
        );
    }
}


const box1 = new CollisionBox(100, 200, 50, 50); // Create a box
const box2 = new CollisionBox(150, 180, 60, 40); // Create another box

// Check if box1 collides with box2
if (box1.collidesWith(box2)) {
    console.log("Collision detected!");
} else {
    console.log("No collision.");
}