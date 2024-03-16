//board
let board;
let boardWidth = 1960;
let boardHeight = 1080;
let contex;

window.onload = function() {
    board=document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");
    
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