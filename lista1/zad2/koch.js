window.addEventListener('load', () => {
    var canvas = document.getElementById("myCanvas");
    turtleGraphics = new TurtleGraphics(canvas,0.0,800.0,0.0,800.0);
    const commandInput = document.getElementById('commandInput');

    commandInput.addEventListener('keyup', (event) => {
       event.preventDefault();
       if (event.key === 'Enter') {
           let temp = commandInput.value;
           commandInput.value = '';
           turtleGraphics.koch(temp);
       }
    });

    document.getElementById('executeButton').addEventListener('click', () => {
        turtleGraphics.koch(commandInput.value);
    });
});