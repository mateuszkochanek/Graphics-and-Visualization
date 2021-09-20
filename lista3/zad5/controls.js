let then = 0;
var graphAnimator;
var fn;

window.addEventListener('load', () => {
    var canvas = document.getElementById("myCanvas");
    graphAnimator = new GraphAnimator(canvas, 'shaders/vertex.glsl', 'shaders/fragment.glsl');
    animateScene(then);
});

function animateScene(time){
    time *= 0.001;
    var deltaTime = time - then;
    then = time;
    graphAnimator.update(deltaTime, then);
    then = time;
    requestAnimationFrame(animateScene);
}