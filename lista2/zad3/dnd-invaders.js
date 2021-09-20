const PLAYER_COLOR = [3, 115, 252, 255];
const PLAYER_RADIUS = window.innerWidth / 1500;
const PLAYER_ACCELERATION = window.innerWidth / 1000;
const PLAYER_MAX_SPEED = window.innerWidth / 1000;
const PLAYER_DRAG = window.innerWidth / 7000;

const ENEMY_COLOR = [235, 64, 52, 255]
const ENEMY_RADIUS = window.innerWidth / 1400;

const RELOAD_TIME = 0.5;
const PROJECTILE_SIZE = 2;

/*
    W tej klasie w update znajdują się czynności wykonywane co odświerzenie animacji.
    Klasa ta przechowuje obiekty występujące w grze, usuwa przeciwników gdy zostaną zestrzeleni,
    usuwa pociski gdy wylecą za obręb pola widzenia lub zestrzelą przeciwnika, przesuwa przeciwników na początek
    jeżeli wyjdą za obręb i kończy grę gdy gracz dotnkie przeciwnika lub pokona wszystkich wrogów.
    Przekazuje GraphicEngine obiekty do narysowania i generuje je za pomocą GraphicsGenerator.
*/
class DndInvaders{
    constructor(canvas, vertexShaderSource, fragmentShaderSource) {
        this.graphicEngine = new GraphicEngine(canvas, vertexShaderSource, fragmentShaderSource);
        this.player = new Player(
            PLAYER_RADIUS,
            GraphicsGenerator.generatePlayer(PLAYER_RADIUS),
            PLAYER_COLOR,
            [0, -40, 0],
            this.graphicEngine.gl.TRIANGLE_FAN
        );
        this.enemySpeed = this.graphicEngine.gl.canvas.height/150;
        this.projectileSpeed = this.graphicEngine.gl.canvas.height/100;
        this.enemies = [];
        this.projectiles = [];
        this.lastPleyerShootTime = 0;
    }

    update(deltaTime, then){
        if(this.graphicEngine.program !== undefined){
            this.player.update(deltaTime)
            if(this.player.pressedKeys.shoot){
                this.shoot(then);
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            this.projectiles.forEach(projectile => {
                projectile.update(deltaTime);
            });
            this.checkCollisions();
            var gameObjects = [this.player, ...this.enemies, ...this.projectiles];
            this.graphicEngine.draw(gameObjects);
        } else {
            console.log("Game is loading!");
        }
    }

    checkCollisions(){
        this.checkProjectileHits();
        this.checkPlayerHit();
        this.checkIfWon();
    }

    checkProjectileHits(){
        this.projectiles.forEach(projectile => {
            if(projectile.translation[1] > 45){
                this.projectiles = this.projectiles.filter(function(item) {
                    return item !== projectile;
                });
            }
            this.enemies.forEach(enemy => {
                var dist = Math.sqrt( Math.pow((projectile.translation[0]-enemy.translation[0]), 2) + Math.pow((projectile.translation[1]-enemy.translation[1]), 2) );
                if( dist < projectile.hitRadius + enemy.hitRadius){
                    this.enemies = this.enemies.filter(function(item) {
                        return item !== enemy;
                    });
                    this.projectiles = this.projectiles.filter(function(item) {
                        return item !== projectile;
                    });
                }
            });
        });
    }

    checkPlayerHit(){
        this.enemies.forEach(enemy => {
            var dist = Math.sqrt( Math.pow((this.player.translation[0]-enemy.translation[0]), 2) + Math.pow((this.player.translation[1]-enemy.translation[1]), 2) );
            if( dist < this.player.hitRadius + enemy.hitRadius){
                window.location.reload(false);
                alert('You lost!');
            }
        });
    }

    checkIfWon(){
        if(this.enemies.length === 0){
            window.location.reload(false);
            alert('You won!');
        }
    }

    shoot(time){
        if(this.lastPleyerShootTime + RELOAD_TIME < time){
            var tempTrans = this.player.translation;
            this.projectiles.push(new Projectile(
                PROJECTILE_SIZE*0.5,
                GraphicsGenerator.generateProjectile(PROJECTILE_SIZE),
                [204, 0, 255, 255],
                [tempTrans[0], tempTrans[1]+3, tempTrans[2]],
                this.graphicEngine.gl.TRIANGLE_FAN,
                this.projectileSpeed
                )
            );
            this.lastPleyerShootTime = time;
        }
    }

    generateEnemies(col=10, row=3, color=ENEMY_COLOR){
        var groupStep = 5;
        for(var i = 1; i <= row; i++){
            for(var j = 1; j <= col; j++){
                this.enemies.push(new Enemy(
                        ENEMY_RADIUS,
                        GraphicsGenerator.generateEnemy(ENEMY_RADIUS),
                        color,
                        [0+j*groupStep,40+i*groupStep,0],
                        this.graphicEngine.gl.TRIANGLE_FAN,
                        this.enemySpeed
                    )
                );
                this.enemies.push(new Enemy(
                        ENEMY_RADIUS,
                        GraphicsGenerator.generateEnemy(ENEMY_RADIUS),
                        color,
                        [0-j*groupStep,40+i*groupStep,0],
                        this.graphicEngine.gl.TRIANGLE_FAN,
                        this.enemySpeed
                    )
                );
            }
        }

    }
}

class GameObject {
    constructor(hitRadius, points, color, translation, type) { // Translation tutaj będzie 3 eementowyą tablicą, odpowiednio x, y,z. Kolor 4 elementową.
        this.hitRadius = hitRadius;
        this.points = points;
        this.color = color;
        this.translation = translation;
        this.type = type;
    }
}

class Player extends GameObject {
    constructor(hitRadius, points, color, translation, type) {
        super(hitRadius, points, color, translation, type);
        this.pressedKeys = {
            shoot: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.vx = 0;
    }

    update(deltaTime) {
        if (this.pressedKeys.left){
            this.vx = Math.max(this.vx - deltaTime * PLAYER_ACCELERATION, -PLAYER_MAX_SPEED)
        }
        if (this.pressedKeys.right){
            this.vx = Math.min(this.vx + deltaTime * PLAYER_ACCELERATION, PLAYER_MAX_SPEED)
        }
        this.vx > 0 ? this.vx -= Math.min(PLAYER_DRAG * deltaTime, this.vx) : this.vx -= Math.max(-PLAYER_DRAG * deltaTime, this.vx);
        if(this.translation[0] >= 80 && this.vx > 0){
            this.vx = 0;
        } else if (this.translation[0] <= -80 && this.vx < 0) {
            this.vx = 0;
        }
        this.translation[0] += this.vx;
        this.controls = [false, false, false, false];
    }

    setPressedKeys(pressedKeys){
        this.pressedKeys = pressedKeys;
    }
}

class Enemy extends GameObject {
    constructor(hitRadius, points, color, translation, type, speed) {
        super(hitRadius, points, color, translation, type);
        this.speed = speed;
        this.vy = 0;
    }

    update(deltaTime) {
        this.vy = this.speed*deltaTime;
        this.translation[1] -= this.vy;
        if(this.translation[1] < -50){
            this.translation[1] = 50;
        }
    }
}

class Projectile extends GameObject {
    constructor(hitRadius, points, color, translation, type, speed) {
        super(hitRadius, points, color, translation, type);
        this.speed = speed;
        this.vy = 0;
    }

    update(deltaTime) {
        this.vy = this.speed*deltaTime;
        this.translation[1] += this.vy;
    }
}