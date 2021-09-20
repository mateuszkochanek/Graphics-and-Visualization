class TurtleGraphics3d {
    constructor(wireframe, minX, maxX, minY, maxY, minZ, maxZ) {
        this.wireframe = wireframe;

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;

        this.tortle = {
            x:0,
            y:0,
            z:400,
            rotation: {
                xRotation : 0,
                yRotation: 0
            },
            isPenOn: true,
            color: "red",
            width: 2
        };
    }

    update(){
        this.wireframe.draw();
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
            case "ut":
                this.up(parseInt(argList[1]));
                break;
            case "dt":
                this.down(parseInt(argList[1]));
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

    checkCoords(x, y, z) {
        return x <= this.maxX && x >= this.minX && y <= this.maxY && y >= this.minY && z <= this.maxZ && z >= this.minZ;
    }

    move(x, y, z) {
        var start = new Point3d(this.tortle.x, this.tortle.y, this.tortle.z);
        var end = new Point3d(x, y, z);
        if (this.tortle.isPenOn) {
            this.wireframe.addLine(new Line3d(start, end, this.tortle.color, this.tortle.width));
        }
        this.tortle.x = x;
        this.tortle.y = y;
        this.tortle.z = z;
    }

    backward(distance) {
        var currX =
            this.tortle.x -
            distance * Math.cos(this.tortle.rotation.yRotation * Math.PI / 180) * 
            Math.sin(this.tortle.rotation.xRotation * Math.PI / 180);
        var currY =
            this.tortle.y -
            distance * Math.cos(this.tortle.rotation.yRotation * Math.PI / 180) *
            Math.cos(this.tortle.rotation.xRotation * Math.PI / 180);
        var currZ =
            this.tortle.z -
            distance /** Math.cos(this.tortle.rotation.xRotation * Math.PI / 180)*/ * 
            Math.sin(this.tortle.rotation.yRotation * Math.PI / 180);

        if (this.checkCoords(currX, currY, currZ)) {
            this.move(currX, currY, currZ);
        } else {
            this.tortle.x = currX;
            this.tortle.y = currY;
            this.tortle.z = currZ;
        }
    }

    forward(distance) {
        var currX =
            this.tortle.x +
            distance * Math.cos(this.tortle.rotation.yRotation * Math.PI / 180) * 
            Math.sin(this.tortle.rotation.xRotation * Math.PI / 180);
        var currY =
            this.tortle.y +
            distance * Math.cos(this.tortle.rotation.yRotation * Math.PI / 180) *
            Math.cos(this.tortle.rotation.xRotation * Math.PI / 180);
        var currZ =
            this.tortle.z +
            distance /** Math.cos(this.tortle.rotation.xRotation * Math.PI / 180)*/ * 
            Math.sin(this.tortle.rotation.yRotation * Math.PI / 180);

        if (this.checkCoords(currX, currY, currZ)) {
            this.move(currX, currY, currZ);
        } else {
            this.tortle.x = currX;
            this.tortle.y = currY;
            this.tortle.z = currZ;
        }
    }

    left(degree) {
        this.tortle.rotation.xRotation = (this.tortle.rotation.xRotation - degree + 360) % 360;
    }

    right(degree) {
        this.tortle.rotation.xRotation = (this.tortle.rotation.xRotation + degree+ 360) % 360;
    }

    up(degree) {
        this.tortle.rotation.yRotation = (this.tortle.rotation.yRotation - degree+ 360) % 360;
    }

    down(degree) {
        this.tortle.rotation.yRotation = (this.tortle.rotation.yRotation + degree+ 360) % 360;
    }

    changeColor(colorString) {
        this.tortle.color = colorString;
    }

    changeWidth(value) {
        this.tortle.width = value;
    }

    turnOff() {
        this.tortle.isPenOn = false;
    }

    turnOn() {
        this.tortle.isPenOn = true;
    }

    moveShapes(dx, dz){
        var turtlePoint = new Point3d(this.tortle.x, this.tortle.y, this.tortle.z)
        turtlePoint = this.wireframe.moveShapes(dx, dz, turtlePoint);
        this.tortle.x = turtlePoint.x;
        this.tortle.y = turtlePoint.y;
        this.tortle.z = turtlePoint.z;
    }

    rotateCamera(xAngle, yAngle) {
        var xSin, xCos, ySin, yCos;

        xSin = Math.sin(xAngle);
        xCos = Math.cos(xAngle);
        ySin = Math.sin(yAngle);
        yCos = Math.cos(yAngle);

        var rotationX = [
            1,       0,     0,      0,
            0,      xCos,   -xSin,  0,
            0,      xSin,   xCos,   0,
            0,       0,     0,      1
        ];
        var rotationY = [
            yCos,   0, ySin,    0,
             0,   1,      0,    0,
            -ySin,   0, yCos,   0,
            0,   0,      0,     1
        ];

        var turtlePoint = new Point3d(this.tortle.x, this.tortle.y, this.tortle.z)
        turtlePoint = this.wireframe.rotateShape(rotationX, rotationY, turtlePoint)
        this.tortle.x = turtlePoint.x;
        this.tortle.y = turtlePoint.y;
        this.tortle.z = turtlePoint.z;
    }
}