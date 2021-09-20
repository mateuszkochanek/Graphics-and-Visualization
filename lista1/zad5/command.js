var perspective = 300;

window.addEventListener('load', () => {
    window.alert("Grafika żółwia w 3d.\n\n"+
    "Obracanie kamery dookoła pola rysowania:\n"+
    "strzałka do góry - obraca kamerą do górę\n"+
    "strzałka w dół - obraca kamerą w dół\n"+
    "strzałka w lewo - obraca kamerą w lewo\n"+
    "strzałka w prawo - obraca kamerą w prawo\n");
    var canvas = document.getElementById("myCanvas");
    var wireframe = new Wireframe(canvas, perspective);
    var turtleGraphics = new TurtleGraphics3d(wireframe, -300, 300, -300, 300, 100, 700);
    const commandInput = document.getElementById('commandInput');

    commandInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
           let temp = commandInput.value;
           commandInput.value = '';
           turtleGraphics.runCommands(temp);
           turtleGraphics.update();
        }
    });

    document.getElementById('executeButton').addEventListener('click', () => {
        let temp = commandInput.value;
        commandInput.value = '';
        turtleGraphics.runCommands(temp);
        turtleGraphics.update();
    });

    document.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'ArrowRight') {
            turtleGraphics.moveShapes(0,-400-perspective)
            turtleGraphics.rotateCamera(0, -Math.PI/10);
            turtleGraphics.moveShapes(0,400+perspective)
            turtleGraphics.update();
        } else if (event.key === 'ArrowLeft') {
            turtleGraphics.moveShapes(0,-400-perspective)
            turtleGraphics.rotateCamera(0, Math.PI/10);
            turtleGraphics.moveShapes(0,400+perspective)
            turtleGraphics.update();
        } else if (event.key === 'ArrowUp') {
            turtleGraphics.moveShapes(0,-400-perspective)
            turtleGraphics.rotateCamera(-Math.PI/10, 0);
            turtleGraphics.moveShapes(0,400+perspective)
            turtleGraphics.update();
        } else if (event.key === 'ArrowDown') {
            turtleGraphics.moveShapes(0,-400-perspective)
            turtleGraphics.rotateCamera(Math.PI/10, 0);
            turtleGraphics.moveShapes(0,400+perspective)
            turtleGraphics.update();
        }
     });


});