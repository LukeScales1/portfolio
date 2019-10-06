
var Enemy = function(yVal, xRate) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = yVal;
    this.speed = xRate;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed*dt;
    // Reset the Enemy's x value once they go off screen
    if(this.x > 505) {
        this.x = -100;
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-boy.png'
    this.x = 200;
    this.y = 400;
};

Player.prototype.handleInput = function(keyVal) {
    // if this.y === -15, Player is in the water; yvals = [-15, 68, 151, 234, 317, 400];
    const ydt = 83;
    const xdt = 100;

    // Moves Player character depending on key pressed and prevents Player from moving out of bounds
    if(keyVal === 'up' && this.y > -15) {
        this.y -= ydt;
    } else if(keyVal === 'down' && this.y < 400) {
        this.y += ydt;
    } else if(keyVal === 'left' && this.x > 0) {
        this.x -= xdt;
    } else if(keyVal === 'right' && this.x < 400) {
        this.x += xdt;
    }
};

Player.prototype.update = function(dt) {
    // yVals is an array of potential y values for the player; each value represents a tile
    const yVals = [-15, 68, 151, 234, 317, 400];

    // game won condition - Player has reached the water
    if(this.y === yVals[0]) {
        alert("Congrats! You have won the game!");
        player = new Player();
    }
    // enemyIndex gives the index to entry in allEnemies array for the Enemy the Player can currently (potentially) 
    // collide with Enemy objects added to array in ascending order of y values - if Player is on the top most tile,
    // the Player.y value will be 68, i.e. at index 1 in the yVals array. This corresponds with the enemy1,
    // i.e. allEnemies[0], so the enemyIndex must be the yVals.indexOf(Player.y) - 1
    let enemyIndex = yVals.indexOf(this.y) - 1;
    //  
    if(enemyIndex < 3 && enemyIndex > -1) {
        let loLimit = this.x - 80;
        let hiLimit = this.x + 60;
        if(allEnemies[enemyIndex].x > loLimit && allEnemies[enemyIndex].x < hiLimit) {
            player = new Player();
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var player = new Player();
var enemy1 = new Enemy(60, 50);
var enemy2 = new Enemy(140, 120);
var enemy3 = new Enemy(220, 80);
var allEnemies = [enemy1, enemy2, enemy3];


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
