let then = 0;
var gameInstance;

// Mamy tutaj requestAnimationFrame(animateScene); 
window.addEventListener('load', () => {
    window.alert("Gra na podstawie Space Invaders, DnDInvaders! Bez tekstur.\n"+
    "Postać gracza możemy kontrolować poprzez:\n"+
    "a - przesuwa Postać gracza w lewno\n"+
    "d - przesuwa Postać gracza w prawo\n"+
    "spacja - strzelanie\n");
    curveContainer = document.getElementById("curveContainer");
    var canvas = document.getElementById("myCanvas");
    gameInstance = new DndInvaders(canvas, 'shaders/vertex.glsl', 'shaders/fragment.glsl')
    gameInstance.generateEnemies();

    var pressedKeys = {
        shoot: false,
        left: false,
        right: false,
        up: false,
        down: false
    };
    
    var keyMap = {
        32: 'shoot',
        68: 'right',
        65: 'left',
        87: 'up',
        83: 'down'
    };
    
    function keydown(event) {
        var key = keyMap[event.keyCode];
        pressedKeys[key] = true;
        gameInstance.player.setPressedKeys(pressedKeys);
    }
    
    function keyup(event) {
        var key = keyMap[event.keyCode];
        pressedKeys[key] = false;
        gameInstance.player.setPressedKeys(pressedKeys);
    }

    window.addEventListener("keydown", keydown, false)
    window.addEventListener("keyup", keyup, false)

    animateScene(then);
});

function animateScene(time){
    time *= 0.001;
    var deltaTime = time - then;
    then = time;
    gameInstance.update(deltaTime, then);
    then = time;
    requestAnimationFrame(animateScene);
}