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

        this.ship = new Ship(new CollisionBox(200, 500, 10, 10), "./assets/Ship6/Ship6.png");
        

        this.ship.collBox.collidesWith(this.ship.collBox)
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

            //console.log(asteroid.collBox.r);
            if (asteroid.removeCondition()) {
                deleteIndex.push(this.asteroids.indexOf(asteroid));
            }
            asteroid.draw(this.ctx);
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                console.log("collides");
                deleteIndex.push(this.asteroids.indexOf(asteroid));
            }


            //this.ship.collBox.collidesWith(asteroid.collBox);
        }
        console.log(this.asteroids.length);
        for (let index of deleteIndex.reverse()) {
            this.asteroids.splice(index, 1);
        }
    }
    
    start() {
        this.intervalId = setInterval(this.update.bind(this), 1000 / 60);
        //window.addEventListener('keydown', this.moveShip); // Add event listener for keydown
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


        this.image.onload = () => {
            this.collBox.width = this.image.naturalWidth;
            this.collBox.height = this.image.naturalHeight;
        }

    }
    draw(ctx) {
        //console.log("img widht" + this.collBox.width);
        //console.log("img height" + this.collBox.height);

        ctx.drawImage(this.image, this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
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
        this.rotation = 0;
        this.rotationSpeed = 0.01;
        
        this.image.onload = () => {
            this.collBox.width = this.image.naturalWidth;
            this.collBox.height = this.image.naturalHeight;
        }


    }

    draw(ctx) {
        
        //console.log("aster widht" + this.collBox.width);
        //console.log("aster height" + this.collBox.height);

        //ctx.drawImage(this.image, this.collBox.x, this.collBox.y);

        ctx.save();  // Save context state for later restoration
        ctx.translate(this.collBox.x + this.collBox.width / 2, this.collBox.y + this.collBox.height / 2);  // Translate to center
        ctx.rotate(this.rotation);  // Apply rotation
        ctx.drawImage(this.image, -this.collBox.width / 2, -this.collBox.height / 2);  // Draw image centered
        ctx.restore();  // Restore context state`
        



        this.collBox.x -= this.dx;
        this.collBox.y += this.dy;
    }

    removeCondition() {
        return (this.collBox.x + this.collBox.width < 0 || 
                this.collBox.y + this.collBox.height < 0 || 
                this.collBox.y - this.collBox.height > CANVAS_HEIGHT)     
    }



}


class CollisionBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y; 
        this.width = width;
        this.height = height;


    }

    collidesWith(other) {
        return(this.x < other.x + other.width &&
            other.x < this.x + this.width &&
            this.y < other.y + other.height &&
            other.y < this.y + this.height);
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


