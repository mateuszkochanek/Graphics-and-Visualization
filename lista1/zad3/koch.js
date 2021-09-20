
var mySvg;
var x;
var y;
let points;
var rotation;


window.addEventListener('load', () => {
    mySvg = document.getElementById("mySvg");

    commandInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            mySvg.removeChild(mySvg.lastChild);
            x = 200;
            y = 300;
            points = `${x}, ${y}, `;
            rotation = 0;
            let temp = commandInput.value;
            commandInput.value = '';
            drawKoch(temp);
        }
    });

    document.getElementById('executeButton').addEventListener('click', () => {
        mySvg.removeChild(mySvg.lastChild);
        x = 200;
        y = 300;
        points = `${x}, ${y}, `;
        rotation = 0;
        drawKoch(commandInput.value);
    });
});

// Robiąc to zadanie chciałem potestować svg więc koch jest generowany inaczej niż sierpinski.
// Kocha generuje bardzo podobnie do zadania 2, jedyna różnica jest taka, że zamiast rysować na bierząco,
// zapisuje punkty jakie na samym końcu wpisuję do innerHTML-a elementu svg jako polyline points.
// Jako że wpisując je zachowujemy poprwaną kolejność wykonania powstaje nam poprawny płatek kocha.
function drawKoch(value) {
    value = value
        .replace(/\s+/g, " ")
        .trim()
        .toLocaleLowerCase()
        .split(" ");
    var iterations = parseInt(value[0]);
    var distance = parseInt(value[1]);
    this.kochRec(iterations, distance);
    this.right(120);
    this.kochRec(iterations, distance);
    this.right(120);
    this.kochRec(iterations, distance);
    points = points.slice(0, -2);
    mySvg.innerHTML = '<polyline points="' + points + '" style="fill:none;stroke:black;stroke-width:1" />';
}

function kochRec(it, distance) {
    if (it < 1) {
        points += nextXY(distance);
    } else {
        kochRec(it - 1, distance / 3.0);
        left(60);
        kochRec(it - 1, distance / 3.0);
        right(120);
        kochRec(it - 1, distance / 3.0);
        left(60);
        kochRec(it - 1, distance / 3.0);
    }
}

function nextXY(distance) {
    var currX =
        x +
        distance * Math.cos((rotation * Math.PI) / 180);
    var currY =
        y +
        distance * Math.sin((rotation * Math.PI) / 180);
    x = currX;
    y = currY;
    return `${currX}, ${currY}, `;
}

function left(degree) {
    rotation = (rotation - degree) % 360;
}

function right(degree) {
    rotation = (rotation + degree) % 360;
}