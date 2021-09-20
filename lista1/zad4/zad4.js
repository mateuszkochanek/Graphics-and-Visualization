var myCanvas;
var numberOfObstacles = 1000;
var perspective = 600;

window.addEventListener('load', () => {
    window.alert("Musisz znaleźć i dostać się do celu który jest czerowny.\n\n"+
    "Poruszanie się:\n"+
    "w - obraca kamerą do górę\n"+
    "s - obraca kamerą w dół\n"+
    "a - obraca kamerą w lewo\n"+
    "d - obraca kamerą w prawo\n"+
    "strzałka do przodu - poruszamy się w przestrzeni do przodu\n"+
    "strzałka do tyłu - poruszamy się w przestrzeni do tyłu\n");
    myCanvas = document.getElementById("myCanvas");
    var wireframe = new Wireframe(myCanvas, perspective, numberOfObstacles);
    var myGame = new Game3d(wireframe, numberOfObstacles);

    window.addEventListener('keydown', (event) => {
        event.preventDefault();
        if (event.key === 'd') {
            myGame.rotateCamera(0, Math.PI/90);
            myGame.update(window);
        } else if (event.key === 'a') {
            myGame.rotateCamera(0, -Math.PI/90);
            myGame.update(window);
        } else if (event.key === 'w') {
            myGame.rotateCamera(Math.PI/90, 0);
            myGame.update(window);
        } else if (event.key === 's') {
            myGame.rotateCamera(-Math.PI/90, 0);
            myGame.update(window);
        }else if (event.key === 'ArrowUp') {
            myGame.moveCamera(-40);
            myGame.update(window);
        } else if (event.key === 'ArrowDown') {
            myGame.moveCamera(40);
            myGame.update(window);
        } 
     });

    myGame.run()

});