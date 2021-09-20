// Klasa obługująca grę i zawierające w sobie grafikę wireframe.
class Game3d {
    constructor (wireframe, numberOfObstacles) {
        this.wireframe = wireframe;
        this.numberOfObstacles = numberOfObstacles;
        this.gameSize = {
            x : 8000,
            y : 8000,
            z : 8000
        };
        this.edgeSizeVar = 200;
    }

    run(){
        this.generatePolygons();
        this.wireframe.draw();
    }

    update(window){
        this.wireframe.draw();
        var collision = this.wireframe.checkCollisions()
        switch (collision){
            case 0:
                break;
            case 1:
                window.alert("You lost");
                window.location.reload(false);
                break;
            case 2:
                window.alert("You won");
                window.location.reload(false);
                break;
        }
    }

    // Generujemy losowe przeszkody a także nasz cel (konkretniej ich środki w przedziałach ustalonych w game size)
    generatePolygons(){
        var centreOfPolygon, centreOfTarget;
        var polygons = [];
        for(var i = 0; i < this.numberOfObstacles; i++){
            centreOfPolygon = new Point3d(
                (Math.random()-0.5)*2 * this.gameSize.x,
                (Math.random()-0.5)*2 * this.gameSize.y,
                (Math.random()-0.5)*2 * this.gameSize.z);
            polygons.push(new Polygon(centreOfPolygon, this.edgeSizeVar));
        }
        centreOfTarget = new Point3d(
            ((Math.random()-0.5)*2) * (this.gameSize.x - (this.gameSize.x-1000)) + this.gameSize.x,
            ((Math.random()-0.5)*2) * (this.gameSize.y - (this.gameSize.y-1000)) + this.gameSize.y,
            ((Math.random()-0.5)*2) * (this.gameSize.z - (this.gameSize.z-1000)) + this.gameSize.z)
        polygons.push(new Polygon(centreOfTarget, this.edgeSizeVar, "#ff3300"));
        this.wireframe.addPolygons(polygons);
    }

    // Na podstawie kątów generujemy macierze rotacyjne które zostaną przekazane i użyte w wireframe
    // do przeprowadzenia rotacji wokóf punktu origin, (0,0,0), czyli tego gdzie jest kamera.
    // Obracamy się wokół osiX lub osi Y. Pominąłem oś Z bo stwierdziłem, że to obracanie niewiele wnosi do gry.
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

        this.wireframe.rotateShapes(rotationX, rotationY)
    }

    // przekazujemy wartość o jaką sie mamy przesunąć do wireframe
    moveCamera(dz){
        this.wireframe.moveShapes(dz);
    }
}