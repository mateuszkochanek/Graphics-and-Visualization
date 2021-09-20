var perspective = 300;

window.addEventListener('load', () => {
   
    var canvas = document.getElementById("myCanvas");
    var wireframe = new Wireframe(canvas, perspective);
    var turtleGraphics = new TurtleGraphics3d(wireframe, -300, 300, -300, 300, 100, 700);
    const commandInput = document.getElementById('commandInput');

    turtleGraphics.forward(100);
    turtleGraphics.up(90);
    turtleGraphics.changeColor("#33cc33");
    turtleGraphics.forward(100);
    turtleGraphics.up(90);
    turtleGraphics.forward(100);
    turtleGraphics.right(90);
    turtleGraphics.up(90);
    turtleGraphics.changeColor("#0000ff");
    turtleGraphics.right(90);
    turtleGraphics.forward(100);
    turtleGraphics.changeColor("red");
    turtleGraphics.left(90);
    turtleGraphics.up(90);
    turtleGraphics.forward(100);
    
    turtleGraphics.turnOff();
    turtleGraphics.changeColor("#ff9900");
    turtleGraphics.changeWidth(6);
    turtleGraphics.left(45);
    turtleGraphics.up(45);
    turtleGraphics.forward(200);
    turtleGraphics.turnOn();

    turtleGraphics.forward(100);
    turtleGraphics.up(90);
    turtleGraphics.changeColor("#33cc33");
    turtleGraphics.forward(100);
    turtleGraphics.up(90);
    turtleGraphics.forward(100);
    turtleGraphics.right(90);
    turtleGraphics.up(90);
    turtleGraphics.changeColor("#0000ff");
    turtleGraphics.right(90);
    turtleGraphics.forward(100);
    turtleGraphics.changeColor("red");
    turtleGraphics.left(90);
    turtleGraphics.up(90);
    turtleGraphics.forward(100);

    turtleGraphics.update();

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