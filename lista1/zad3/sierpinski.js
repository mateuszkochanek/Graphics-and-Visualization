var mySvg;
var x;
var y;
let points;
var rotation;
var g;
var pathTemplate;


window.addEventListener('load', () => {
    mySvg = document.getElementById("mySvg");
    commandInput.addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            let temp = commandInput.value;
            let path = document.querySelector('#p_template').cloneNode(true);
            mySvg.innerHTML = ``;
            mySvg.append(path);
            x = 100;
            y = 700;
            points = `${x}, ${y}, `;
            rotation = 0;
            commandInput.value = '';
            drawSierpinski(temp);
        }
    });

    document.getElementById('executeButton').addEventListener('click', () => {
        let path = document.querySelector('#p_template').cloneNode(true);
        mySvg.innerHTML = ``;
        mySvg.append(path);
        x = 100;
        y = 700;
        points = `${x}, ${y}, `;
        rotation = 0;
        drawSierpinski(commandInput.value);
    });
});

// Robiąc to zadanie chciałem potestować svg więc koch jest generowany inaczej niż sierpinski.
// tutaj znowu rekurencyjnie, zamiast punktów generuje odpowiednie ścieżki które potem dodaję
// do elementu svg. Sama logika generowania i rekurencji jest praktycznie identyczna do zadania 2.
function drawSierpinski(value) {
    value = value
        .replace(/\s+/g, " ")
        .trim()
        .toLocaleLowerCase()
        .split(" ");
    var iterations = parseInt(value[0]);
    var distance = parseInt(value[1]);
    sierpinskiRec(iterations, distance);
}

function sierpinskiRec(it, distance) {
    if (it < 1) {
        let path = document.querySelector('#p_template').cloneNode(true);
        path.setAttribute('id', null);

        var point = nextXY(distance);
        var data = []
        data.push('M');
        data.push(point[0]);
        data.push(point[1]);
        left(120);

        point = nextXY(distance);
        data.push('L');
        data.push(point[0]);
        data.push(point[1]);
        left(120);

        point = nextXY(distance);
        data.push('L');
        data.push(point[0]);
        data.push(point[1]);
        left(120);
        //  Close path
        data.push('Z');

        path.setAttribute('d', data.join(' '));
        mySvg.append(path);
    } else {
        sierpinskiRec(it - 1, distance / 2.0);
        left(60);
        nextXY(distance / 2.0);
        right(60)
        sierpinskiRec(it - 1, distance / 2.0);
        right(60);
        nextXY(distance / 2.0);
        left(60);
        sierpinskiRec(it - 1, distance / 2.0);
        nextXY(-distance / 2);
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
    return [currX, currY];
}

function left(degree) {
    rotation = (rotation - degree) % 360;
}

function right(degree) {
    rotation = (rotation + degree) % 360;
}