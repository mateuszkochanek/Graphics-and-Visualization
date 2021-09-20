// klasa była opisywana w zadaniu 1, na dole metody dodane aby stworzyć fraktale
class TurtleGraphics {
    constructor(canvasById, minX, maxX, minY, maxY) {
        this.height = canvasById.height;
        this.width = canvasById.width;

        this.ctx = canvasById.getContext("2d");
        this.ctx.translate(0, this.height);
        this.ctx.moveTo(canvasById.width / 2, canvasById.height / 2);
        this.ctx.scale(1, -1);

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.scaleX = this.width / (maxX - minX);
        this.scaleY = this.height / (maxY - minY);
        this.tortle = {
            x: minX + (maxX - minX) / 2,
            y: minY + (maxY - minY) / 2,
            rotation: 0.0,
            isPenOn: true,
        };
    }

    runCommands(inputString) {
        const argList = inputString
            .replace(/\s+/g, " ")
            .trim()
            .toLocaleLowerCase()
            .split(" ");

        switch (argList[0]) {
            case "fd":
                this.forward(parseInt(argList[1]));
                break;
            case "bk":
                this.backward(parseInt(argList[1]));
                break;
            case "rt":
                this.right(parseInt(argList[1]));
                break;
            case "lt":
                this.left(parseInt(argList[1]));
                break;
            case "cc":
                this.changeColor(argList[1]);
                break;
            case "cw":
                this.changeWidth(parseInt(argList[1]));
                break;
            case "off":
                this.turnOff();
                break;
            case "on":
                this.turnOn();
                break;
            default:
                break;
        }
    }

    checkCoords(x, y) {
        return x <= this.maxX && x >= this.minX && y <= this.maxY && y >= this.minY;
    }

    transformCoords() { }

    move(x, y) {
        if (this.tortle.isPenOn) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.tortle.x * this.scaleX, this.tortle.y * this.scaleY);
            this.ctx.lineTo(x * this.scaleX, y * this.scaleY);
            this.ctx.stroke();
        } else {
            this.ctx.moveTo(x * this.scaleX, y * this.scaleY);
        }
        this.tortle.x = x;
        this.tortle.y = y;
    }

    backward(distance) {
        var currX =
            this.tortle.x -
            distance * Math.cos((this.tortle.rotation * Math.PI) / 180);
        var currY =
            this.tortle.y -
            distance * Math.sin((this.tortle.rotation * Math.PI) / 180);

        if (this.checkCoords(currX, currY)) {
            this.move(currX, currY);
        } else {
            this.ctx.moveTo(currX * this.scaleX, currY * this.scaleY);
            this.tortle.x = currX;
            this.tortle.y = currY;
        }
    }

    forward(distance) {
        var currX =
            this.tortle.x +
            distance * Math.cos((this.tortle.rotation * Math.PI) / 180);
        var currY =
            this.tortle.y +
            distance * Math.sin((this.tortle.rotation * Math.PI) / 180);

        if (this.checkCoords(currX, currY)) {
            this.move(currX, currY);
        } else {
            this.ctx.moveTo(currX * this.scaleX, currY * this.scaleY);
            this.tortle.x = currX;
            this.tortle.y = currY;
        }
    }

    left(degree) {
        this.tortle.rotation = (this.tortle.rotation + degree) % 360;
    }

    right(degree) {
        this.tortle.rotation = (this.tortle.rotation - degree) % 360;
    }

    changeColor(colorString) {
        this.ctx.strokeStyle = colorString;
    }

    changeWidth(value) {
        this.ctx.lineWidth = value;
    }

    turnOff() {
        this.tortle.isPenOn = false;
    }

    turnOn() {
        this.tortle.isPenOn = true;
    }

    // łatwo jest stworzyć rekurencyjnie krzywą kocha. Wykorzystuję to do narysowania
    // płatka kocha po prostu 3 razy rysując krzywe kocha pod odpowiednim kątem.
    koch(value) {
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
    }

    // częśc rekurencyjna generacji kocha
    kochRec(it, distance) {
        if (it < 1) {
            this.forward(distance);
        } else {
            this.kochRec(it - 1, distance / 3.0);
            this.left(60);
            this.kochRec(it - 1, distance / 3.0);
            this.right(120);
            this.kochRec(it - 1, distance / 3.0);
            this.left(60);
            this.kochRec(it - 1, distance / 3.0);
        }
    }

    //Funkcja rysuje rekurencyjnie trójkąt sierpińskiego. kiedy iteracja zejdzie do 1
    //rysuje po prostu trójkąt. Polecenia w elsie służa tylko do tego aby przesunąć żółwia
    //na odpowiednie miejsce do rysowania kolejnego trójkąta.
    sierpinski(value) {
        value = value
            .replace(/\s+/g, " ")
            .trim()
            .toLocaleLowerCase()
            .split(" ");
        var iterations = parseInt(value[0]);
        var distance = parseInt(value[1]);
        this.sierpinskiRec(iterations, distance);
    }

    // częśc rekurencyjna generacji sierpinskiego
    sierpinskiRec(it, distance) {
        if (it < 1) {
            this.forward(distance);
            this.left(120);
            this.forward(distance);
            this.left(120);
            this.forward(distance);
            this.left(120);
        } else {
            this.sierpinskiRec(it - 1, distance / 2.0);
            this.left(60);
            this.forward(distance/2.0);
            this.right(60)
            this.sierpinskiRec(it - 1, distance / 2.0);
            this.right(60);
            this.forward(distance/2.0);
            this.left(60);
            this.sierpinskiRec(it - 1, distance / 2.0);
            this.backward(distance/2);
        }
    }
}