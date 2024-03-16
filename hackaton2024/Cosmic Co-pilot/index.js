const SHIP_HEIGHT = 50;
const SHIP_WIDTH = 60;

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

class SpaceshipGame {
    constructor(canvasId, backgroundColor) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.backgroundImage = new Image();
        this.backgroundImage.src = "./assets/im2.png";

        this.ship = new Ship(new CollisionBox(100, 100, SHIP_WIDTH, SHIP_HEIGHT), "./assets/testship.png");
    }
  
    // Function to draw the background and update visuals
    update() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.moveShip(this.ship.collBox.x + 1, this.ship.collBox.y + 1);
        this.ship.draw(this.ctx); // Delegate drawing to the Ship class
    }
    
    // Function to start the game loop
    start() {
        this.intervalId = setInterval(this.update.bind(this), 1000 / 60);
        window.addEventListener('keydown', this.moveShip); // Add event listener for keydown
    }
  
    // Function to stop the game loop
    stop() {
        clearInterval(this.intervalId);
        //window.removeEventListener('keydown', this.handleKeyDown); // Remove event listener for keydown
    }
  
    // Function to restart the game
    restart() {
        this.stop();
        this.start();
    }

    // Function to handle key presses (placeholder for now)
    moveShip(x, y) {
        this.ship.collBox.x = x;
        this.ship.collBox.y = y;
    }


    
}
  
  // Start the game on window load
window.onload = function() {
    const game = new SpaceshipGame('canvas', '#FF0000');
    game.start();
};

class Ship {
    constructor(collBox, imageURL) {
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.image = new Image();
        this.image.src = imageURL;
        this.image.width = collBox.width;
        this.image.height = collBox.height;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
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