const SHIP_HEIGHT = 50;
const SHIP_WIDTH = 60;

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

class SpaceshipGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.backgroundImage = new Image();
        this.backgroundImage.src = "./assets/backgrounds/im3.png";

        this.ship = new Ship(new CollisionBox(200, 500, SHIP_WIDTH, SHIP_HEIGHT), "./assets/testship.png");
        this.asteroids = [];
    }
  
    update() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.moveShip(this.ship.collBox.x, this.ship.collBox.y);
        this.ship.draw(this.ctx);
        if (getRandomInt(100) <= 10) {
            for(let asteroid of this.createAsteroids()){
                this.asteroids.push(asteroid);
            }
            
        }
        let deleteIndex = []
        for (let asteroid of this.asteroids) {

            console.log(this.asteroids.length)
            if (asteroid.removeCondition()) {
                deleteIndex.push(this.asteroids.indexOf(asteroid));
            }
            asteroid.draw(this.ctx);

            if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                console.log("collides");
            }


            //this.ship.collBox.collidesWith(asteroid.collBox);
        }
        for (let index of deleteIndex) {
            this.asteroids.splice(index, 1);
        }



        
    }
    
    start() {
        this.intervalId = setInterval(this.update.bind(this), 1000 / 60);
        window.addEventListener('keydown', this.moveShip); // Add event listener for keydown
    }
  
    stop() {
        clearInterval(this.intervalId);
        //window.removeEventListener('keydown', this.handleKeyDown); // Remove event listener for keydown
    }
  
    restart() {
        this.stop();
        this.start();
    }

    moveShip(x, y) {
        this.ship.collBox.x = x;
        this.ship.collBox.y = y;
    }

    createAsteroids() {
        let n = getRandomInt(10) - 8;
        let asteroids = []
        if(n < 0)
            return asteroids;
        for(let i=0; i<n; i++) {
            asteroids.push(new Asteroid(new CollisionBox(1800, getRandomInt(1080),0,0), getRandomAsteroidURL(), 
                            getRandomInt(4,8), getRandomSign() * getRandomInt(2,8)/2));

        }
        return asteroids;
    }

    
}
  
window.onload = function() {
    const game = new SpaceshipGame('canvas', '#FF0000');
    game.start();
};


//animations!!!!!!!!!!
class Ship {
    constructor (collBox, imageURL) {
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.image = new Image();
        this.image.src = imageURL;
        this.image.width = collBox.width;
        this.image.height = collBox.height;

        //this.collBox.width = this.image.width;
        //this.collBox.height = this.image.height;

    }
    draw(ctx) {
        ctx.drawImage(this.image, this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //drawing over the coll box using its topleft cords

    }
}

class Asteroid {
    constructor (collBox, imageURL, dx, dy) {
        this.collBox = collBox;
        this.image = new Image();
        this.image.src = imageURL;
        this.dx = dx;
        this.dy = dy;

        this.collBox.width = this.image.width;
        this.collBox.height = this.image.height;


    }

    draw(ctx) {
        ctx.drawImage(this.image, this.collBox.x, this.collBox.y);
        this.collBox.x -= this.dx;
        this.collBox.y += this.dy;
    }

    removeCondition() {
        return (this.collBox.x + this.collBox.width < 0 || this.collBox.y + this.collBox.height < 0 || this.collBox.y - this.collBox.height > CANVAS_HEIGHT)     
    }



}


class CollisionBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y; 
        this.width = width;
        this.height = height;
        this.centerx = (this.x + this.width) / 2;
        this.centery = (this.y + this.height) / 2;

    }


    collidesWith(other) {
        return (
        //     this.x < otherBox.x + otherBox.width &&
        //     this.x + this.width > otherBox.x &&
        //     this.y < otherBox.y + otherBox.height &&
        //     this.y + this.height > otherBox.y
        // );
            this.x < other.x + other.width &&
            other.x < this.x + this.width &&
            this.y < other.y + other.height &&
            other.y < this.y + this.height
        );
    }
}


function getRandomAsteroidURL() {
    let asteroidNumber = getRandomInt(16) + 1;
    return "./assets/comets/Picture" + asteroidNumber + ".png";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function getRandomSign() {
    return Math.random() < 0.5 ? -1 : 1;
}

