/*
    Jest to klasa obsługująca grafikę żółwia. Zapisuje w sobie wszystkie informacje
    potrzebne do śledzenia gdzie żółw aktualnie jest i wykonywania na nim operacji
*/
class TurtleGraphics {
    // konstruuje i inicjalizuje wszystkie potrzebne wartości
    constructor(canvasById, minX, maxX, minY, maxY) {
        this.height = canvasById.height;
        this.width = canvasById.width;

        this.ctx = canvasById.getContext("2d");
        this.ctx.translate(0, this.height);
        this.ctx.moveTo(canvasById.width / 2, canvasById.height / 2);
        this.ctx.scale(1, -1);

        // to są granice za którymi żółw nie będzie rysował
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

        // tych skali będziemy używać żeby odpowiednio dostosowywać x i y zapisane na wymiary rzeczywiste
        this.scaleX = this.width / (maxX - minX);
        this.scaleY = this.height / (maxY - minY);

        this.tortle = {
            // żółw zaczyna ze środka
            x: minX + (maxX - minX) / 2,
            y: minY + (maxY - minY) / 2,
            rotation: 0.0,
            isPenOn: true,
        };
    }

    // funkcja która analizuje to co wpisaliśmy w polu tekstowym i wywołuje odpowiednią funkcję
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

    // sprawdzamy czy żółw nadal jest w granicach
    checkCoords(x, y) {
        return x <= this.maxX && x >= this.minX && y <= this.maxY && y >= this.minY;
    }

    // poruszamy żółwia z punktu w którym jest do punktu x,y, rysując jeżeli pędzel jest włączony
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
            //jesteśmy poza zasięgiem canvasu.
            //Możemy albo przesuwać żółwia i nie rysować, albo żółwia nie ruszać. 
            // Ja w tym przypadku go nie ruszam
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
            //jesteśmy poza zasięgiem canvasu.
            //Możemy albo przesuwać żółwia i nie rysować, albo żółwia nie ruszać. 
            // Ja w tym przypadku go nie ruszam
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
}