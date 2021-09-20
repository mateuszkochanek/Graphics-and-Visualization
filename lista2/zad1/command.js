var myMouseLoc = {x:0, y:0};
var testGraphics;
window.addEventListener('load', main);

function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");
    testGraphics = new TestGraphics(canvas, gl, 'shaders/vertex.glsl', 'shaders/fragment.glsl');


    document.getElementById('myCanvas').onclick = function(e) {
        myMouseLoc.x = e.offsetX;
        myMouseLoc.y = e.offsetY;
        testGraphics.addPoint(myMouseLoc);
    };

    document.getElementById('showInfo').onclick = function(e) {
        var infoBox = document.getElementById('info')
        testGraphics.showInfo(infoBox);
    };

    document.querySelector('#canvasControls').addEventListener('click', event => {
        if (event.target.id) {
            const type = event.target.id.toUpperCase();
            testGraphics.changeType(type);
        }
    });
}