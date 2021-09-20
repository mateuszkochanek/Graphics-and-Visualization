var input;
var graphDrawer;
var fn;

window.addEventListener('load', () => {
    var canvas = document.getElementById("myCanvas");
    input = document.getElementById('functionInput');
    graphDrawer = new GraphDrawer(canvas, 'shaders/vertex.glsl', 'shaders/fragment.glsl')

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') { //rotation
            graphDrawer.rotate(-15, 0);
            graphDrawer.draw();
        } else if (event.key === 'ArrowDown') {
            graphDrawer.rotate(15, 0);
            graphDrawer.draw();
        } else if (event.key === 'ArrowRight') {
            graphDrawer.rotate(0, 15);
            graphDrawer.draw();
        } else if (event.key === 'ArrowLeft') {
            graphDrawer.rotate(0, -15);
            graphDrawer.draw();
        }else if (event.key === 'w') { //closer/further
            graphDrawer.translate(0, 0, 20);
            graphDrawer.draw();
        }else if (event.key === 's') {
            graphDrawer.translate(0, 0, -20);
            graphDrawer.draw();
        }
     });

    document.getElementById('drawPointsGraph').addEventListener('click', () => {
        with (Math) {
            fn = null
            try {
                fn = eval(`(x, y) => ${input.value}`);
            } catch (e) {
                alert('Erroneous function');
            }
            if(fn !== null){
                graphDrawer.generatePointsForFunction(fn);
                graphDrawer.draw();
            }
        }
    });

    document.getElementById('drawTrianglesGraph').addEventListener('click', () => {
        with (Math) {
            fn = null
            try {
                fn = eval(`(x, y) => ${input.value}`);
            } catch (e) {
                alert('Erroneous function');
            }
            if(fn !== null){
                graphDrawer.generateTrianglesForFunction(fn);
                graphDrawer.draw();
            }
        }
    });
});