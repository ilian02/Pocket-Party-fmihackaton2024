const UP_BOUND = 200;
const DOWN_BOUND = 880;
let moveUp = true

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
        this.projectiles = [];
    }
  
    update() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.moveShip(this.ship.collBox.x, this.ship.collBox.y);
        this.ship.draw(this.ctx);

        if (getRandomInt(100) <= 10) {
            for(let asteroid of this.createAsteroids()){
                this.projectiles.push(this.createProjectile(this.ship.collBox));
            }
        }

        let deleteProjectilesIndexes = []
        for (let projecile of this.projectiles) {

            //console.log(asteroid.collBox.r);
            if (projecile.removeCondition()) {
                deleteProjectilesIndexes.push(this.projectiles.indexOf(projectile));
            }
            projecile.draw(this.ctx);
            
            //if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                //console.log("collides");
                //deleteAsteroidsIndexes.push(this.asteroids.indexOf(asteroid));
            //}
        }





        console.log(this.projectiles.length)


        if (getRandomInt(100) <= 10) {
            for(let asteroid of this.createAsteroids()){
                this.asteroids.push(asteroid);
            }
            
        }
        
        let deleteAsteroidsIndexes = []
        for (let asteroid of this.asteroids) {

            //console.log(asteroid.collBox.r);
            if (asteroid.removeCondition()) {
                deleteAsteroidsIndexes.push(this.asteroids.indexOf(asteroid));
            }
            asteroid.draw(this.ctx);
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                console.log("collides");
                deleteAsteroidsIndexes.push(this.asteroids.indexOf(asteroid));
            }
        }
        //console.log(this.asteroids.length);
        for (let index of deleteAsteroidsIndexes.reverse()) {
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
        if(moveUp) {
            this.ship.collBox.x = x;
            this.ship.collBox.y = y - 1;
        }
        else {
            this.ship.collBox.x = x;
            this.ship.collBox.y = y + 1;
        }
        if(this.ship.collBox.y <= UP_BOUND || this.ship.collBox.y >= DOWN_BOUND) {
            moveUp = !moveUp;
        }
    }

    createAsteroids() {
        let n = getRandomInt(10) - 8;
        let asteroids = []
        if(n < 0)
            return asteroids;
        for(let i=0; i<n; i++) {
            asteroids.push(new Asteroid(new CollisionBox(2000, getRandomInt(1080 + 480) - 200, 0, 0), getRandomAsteroidURL(), 
                            getRandomInt(4,8), getRandomSign() * getRandomInt(2,8)/2));

        }
        return asteroids;
    }

    createProjectile(shipCollBox) {
        return new Projectile(new CollisionBox(shipCollBox.x + shipCollBox.width + 3, shipCollBox.y + shipCollBox.height / 2, 0, 0));
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
        this.rotationSpeed = getRandomSign() * 0.01;
        
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
        

        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);

        //drawing over the coll box using its topleft cords

        this.collBox.x -= this.dx;
        this.collBox.y += this.dy;
    }

    removeCondition() {
        return (this.collBox.x + this.collBox.width < 0 || 
                this.collBox.y + this.collBox.height + 400 < 0 || 
                this.collBox.y - this.collBox.height - 400 > CANVAS_HEIGHT)     
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

class Projectile {
    constructor (collBox) {
        this.imageURLS = ["./assets/extras/projectiles/projectile1.png", 
                          "./assets/extras/projectiles/projectile2.png", 
                          "./assets/extras/projectiles/projectile3.png", 
                          "./assets/extras/projectiles/projectile4.png"];
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.images = [];
        for (let i = 0; i < 4 ; i++) {
            this.images[i] = new Image();
            this.images[i].src = this.imageURLS[i];
        }
        this.counter = 0;


        this.images[1].onload = () => {
            this.collBox.width = this.images[1].naturalWidth;
            this.collBox.height = this.images[1].naturalHeight;
        }
        
    }
    draw(ctx) {
        ctx.drawImage(this.images[this.counter % 4], this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        this.counter += 1;

        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //drawing over the coll box using its topleft cords
        this.collBox.x += 1;
    }
    removeCondition() {
        return (this.collBox.x > 2000);
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


