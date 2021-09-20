var webGlGraphics;
var curveContainer;
var currFigIndex;

window.addEventListener('load', () => {
    curveContainer = document.getElementById("curveContainer");
    var canvas = document.getElementById("myCanvas");
    var figureManager = new FigureManager(canvas, 'shaders/vertex.glsl', 'shaders/fragment.glsl');


    document.getElementById('drawKochButton').addEventListener('click', () => {
        var degreeKoch =  parseFloat(document.getElementById('degKochInput').value);
        var lengthKoch =  parseFloat(document.getElementById('lenKochInput').value);
        var depthKoch =  parseFloat(document.getElementById('depKochInput').value);
        var col1Koch =  parseFloat(document.getElementById('colKochInput1').value);
        var col2Koch =  parseFloat(document.getElementById('colKochInput2').value);
        var col3Koch =  parseFloat(document.getElementById('colKochInput3').value);
        var figIndex = figureManager.createKoch(degreeKoch, lengthKoch, depthKoch, col1Koch, col2Koch, col3Koch);
        figureManager.drawScene();
        addFigurePicker(figIndex, col1Koch, col2Koch, col3Koch);
    });

    document.getElementById('drawSierpButton').addEventListener('click', () => {
        var degreeSierp =  parseFloat(document.getElementById('degSierpInput').value);
        var lengthSierp =  parseFloat(document.getElementById('lenSierpInput').value);
        var depthSierp =  parseFloat(document.getElementById('depSierpInput').value);
        var col1Sierp =  parseFloat(document.getElementById('colSierpInput1').value);
        var col2Sierp =  parseFloat(document.getElementById('colSierpInput2').value);
        var col3Sierp =  parseFloat(document.getElementById('colSierpInput3').value);
        var figIndex = figureManager.createSierp(degreeSierp, lengthSierp, depthSierp, col1Sierp, col2Sierp, col3Sierp);
        figureManager.drawScene();
        addFigurePicker(figIndex, col1Sierp, col2Sierp, col3Sierp);
    });

    document.getElementById('instructionButton').addEventListener('click', () => {
        var x = document.getElementById("instruction");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'd') {
            figureManager.figureTranslate(currFigIndex, 10, 0, 0);
        } else if (event.key === 'a') {
            figureManager.figureTranslate(currFigIndex, -10, 0, 0);
        } else if (event.key === 'w') {
            figureManager.figureTranslate(currFigIndex, 0, 10, 0);
        } else if (event.key === 's') {
            figureManager.figureTranslate(currFigIndex, 0, -10, 0);
        }else if (event.key === 'ArrowUp') {
            figureManager.figureTranslate(currFigIndex, 0, 0, 10);
        } else if (event.key === 'ArrowDown') {
            figureManager.figureTranslate(currFigIndex, 0, 0, -10);
        } 
     });
});

function addFigurePicker(figIndex, col1, col2, col3) {
    let figClicker = document.createElement('p');
    figClicker.style.border = `3px solid rgb(${col1}, ${col2}, ${col3})`
    var node = document.createTextNode(`${figIndex}`);
    figClicker.appendChild(node);
    figClicker.addEventListener('click', () => {
        var x = curveContainer.querySelectorAll("p");
        x.forEach(element => {
            element.style.backgroundColor = "rgb(0, 255, 242)";
        });
        currFigIndex = parseInt(figClicker.innerHTML);
        figClicker.style.background = "rgb(0, 255, 98)";
    });
    curveContainer.append(figClicker);
}