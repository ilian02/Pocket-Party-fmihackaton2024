const UP_BOUND = 200;
const DOWN_BOUND = 880;
const FPS_CAP = 60;
let moveUp = true

const SHIP_PROJECTILE_URLS = ["./assets/extras/projectiles/projectile1.png", 
                                "./assets/extras/projectiles/projectile2.png", 
                                "./assets/extras/projectiles/projectile3.png", 
                                "./assets/extras/projectiles/projectile4.png"];

const BOSS_PROJECTILE_URLS = ["./assets/extras/projectiles/boss_projectile1.png", 
                                "./assets/extras/projectiles/boss_projectile2.png", 
                                "./assets/extras/projectiles/boss_projectile3.png", 
                                "./assets/extras/projectiles/boss_projectile4.png"];

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

class SpaceshipGame {
    constructor(canvasId) {
        this.tick = 0;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.backgroundImage = new Image();
        this.backgroundImage.src = "./assets/backgrounds/im3.png";

        this.ship = new Ship(new CollisionBox(200, 500, 10, 10), "./assets/Ship6/Ship6.png");
        
        this.boss = new Boss(new CollisionBox(1200, 340, 0, 0), "./assets/extras/boss.png");

        this.asteroids = [];
        this.projectiles = [];
        this.bossProjectiles = [];
    }
  
    update() {
        let deleteAsteroidsIndexes = [];


        this.tick += 1;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.moveShip(this.ship.collBox.x, this.ship.collBox.y);
        this.ship.draw(this.ctx);


        if (this.tick <= 0 * FPS_CAP) {
                //Spawning and moving asteroids
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
        else if (this.asteroids.length != 0) { 
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
        else {
            console.log("boss time");
            //boss projectile spawning
            if ((this.tick + 10) % 120 == 0) {
                for(let projectile of this.createBossAttack(this.boss.collBox)) {
                    this.bossProjectiles.push(projectile);
                }
            }

            let deleteBossProjectilesIndexes = []
            for (let projectile of this.bossProjectiles) {

                //console.log(asteroid.collBox.r);
                if (projectile.removeCondition()) {
                    deleteBossProjectilesIndexes.push(this.bossProjectiles.indexOf(projectile));
                }
                projectile.draw(this.ctx);
                
                //if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                    //console.log("collides");
                    //deleteAsteroidsIndexes.push(this.asteroids.indexOf(asteroid));
                //}
            }

            for (let index of deleteBossProjectilesIndexes.reverse()) {
                this.bossProjectiles.splice(index, 1);
            }
            //boss
            this.boss.draw(this.ctx);
            //spawn ship projectiles
            if (this.tick % 60 == 0) {
                this.projectiles.push(this.createShipProjectile(this.ship.collBox));
            }

            let deleteProjectilesIndexes = []
            for (let projectile of this.projectiles) {

                //console.log(asteroid.collBox.r);
                if (projectile.removeCondition()) {
                    deleteProjectilesIndexes.push(this.projectiles.indexOf(projectile));
                }
                projectile.draw(this.ctx);
                
                //if (this.ship.collBox.collidesWith(asteroid.collBox)) {
                    //console.log("collides");
                    //deleteAsteroidsIndexes.push(this.asteroids.indexOf(asteroid));
                //}
            }

            for (let index of deleteProjectilesIndexes.reverse()) {
                this.projectiles.splice(index, 1);
            }

        
        }
        
        
    }
    
    start() {
        this.intervalId = setInterval(this.update.bind(this), 1000 / FPS_CAP);
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

    createShipProjectile(shipCollBox) {
        return new Projectile(new CollisionBox(shipCollBox.x + shipCollBox.width + 3, 
                                                             shipCollBox.y + shipCollBox.height / 2, 0, 0), SHIP_PROJECTILE_URLS);
    }

    createBossAttack(bossCollBox){
        let projectiles = [];
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "right"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "left"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "top"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "bottom"));
        
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "topleft"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "topright"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "bottomleft"));
        projectiles.push(new BossProjectile(new CollisionBox(bossCollBox.x + bossCollBox.width / 2, 
            bossCollBox.y + bossCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS, "bottomright"));
                    
        return projectiles;
    }
    //createBossProjectile(shipCollBox) {
    //    return new BossProjectile(new CollisionBox(shipCollBox.x + shipCollBox.width + 3, 
    //                                                         shipCollBox.y + shipCollBox.height / 2, 0, 0), BOSS_PROJECTILE_URLS);
    //}

    
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

class Boss {
    constructor (collBox, imageURL) {
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.image = new Image();
        this.image.src = imageURL;
        
        this.dx = getRandomSign() * (getRandomInt(4) + 2);
        this.dy = getRandomSign() * (getRandomInt(4) + 2);


        this.image.onload = () => {
            this.collBox.width = this.image.naturalWidth;
            this.collBox.height = this.image.naturalHeight;
        }

    }
    draw(ctx, shipCollBox) {

        ctx.drawImage(this.image, this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //drawing over the coll box using its topleft cords
        this.collBox.x += this.dx;
        this.collBox.y += this.dy;

        if (this.collBox.x <= 200 || this.collBox.x >= 1560){
            this.dx = -signOf(this.dx) * (getRandomInt(5) + 3);
            this.dy = getRandomInt(11) - 6;
        }
        if (this.collBox.y <= 20 || this.collBox.y >= 680){
            this.dy = -signOf(this.dy) * (getRandomInt(5) + 3);
            this.dx = getRandomInt(11) - 6;
        }

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
    constructor (collBox, imageURLS) {
        this.imageURLS = imageURLS;
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
        ctx.drawImage(this.images[Math.floor((this.counter % 12) / 3)], this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        this.counter += 1;

        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //drawing over the coll box using its topleft cords
        this.collBox.x += 5;
    }
    removeCondition() {
        return (this.collBox.x >= 2000 || this.collBox.x <= -100 || this.collBox.y >= 1100 || this.collBox.y <= -100);
    }


}

class BossProjectile {
    constructor (collBox, imageURLS, type) {
        this.imageURLS = imageURLS;
        this.collBox = collBox;  //CollisionBox(100, 100, settings.SHIP_WIDTH, settings.SHIP_HEIGHT);
        this.images = [];
        for (let i = 0; i < 4 ; i++) {
            this.images[i] = new Image();
            this.images[i].src = this.imageURLS[i];
        }
        this.counter = 0;
        this.type = type;


        this.images[1].onload = () => {
            this.collBox.width = this.images[1].naturalWidth;
            this.collBox.height = this.images[1].naturalHeight;
        }
        
    }
    draw(ctx) {
        ctx.drawImage(this.images[Math.floor((this.counter % 12) / 3)], this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        this.counter += 1;

        //ctx.fillStyle = "red";
        //ctx.fillRect(this.collBox.x, this.collBox.y, this.collBox.width, this.collBox.height);
        //drawing over the coll box using its topleft cords
        if(this.type == "left")
            this.collBox.x -= 7;
        else if(this.type == "right")
            this.collBox.x += 7;
        else if(this.type == "top")
            this.collBox.y -= 7;
        else if(this.type == "bottom")
            this.collBox.y += 7;
        else if(this.type == "topleft") {
            this.collBox.x -= 5;
            this.collBox.y -= 5;
        }
        else if(this.type == "topright") {
            this.collBox.x += 5;
            this.collBox.y -= 5;
        }
        else if(this.type == "bottomleft") {
            this.collBox.x -= 5;
            this.collBox.y += 5;
        }
        else if(this.type == "bottomright") {
            this.collBox.x += 5;
            this.collBox.y += 5;
        }

    }
    removeCondition() {
        return (this.collBox.x >= 2000 || this.collBox.x <= -100 || this.collBox.y >= 1100 || this.collBox.y <= -100);
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

function signOf(num){
    if (num>0) {
        return 1;
    }
    else {
        return -1;
    }
}
