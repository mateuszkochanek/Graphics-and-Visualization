/*
    Klasa generująca trójkąty sierpieńskiego dla głównej klasy.
*/
class SierpGenerator {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.points = [];
    }

    getPoints(){
        return this.points;
    }

    resetGen(){
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.points = [];
    }

    generateSierpinski(degree, length, z) {
        this.sierpinskiRec(degree, length, z);
    }
    
    sierpinskiRec(it, distance, z) {
        if (it < 1) {
            var [x,y] = this.nextXY(distance);
            this.points.push(x,y,z)
            this.left(120);
    
            [x,y] = this.nextXY(distance);
            this.points.push(x,y,z)
            this.left(120);
    
            [x,y] = this.nextXY(distance);
            this.points.push(x,y,z)
            this.left(120);
        } else {
            this.sierpinskiRec(it - 1, distance / 2.0, z);
            this.left(60);
            this.nextXY(distance / 2.0);
            this.right(60)
            this.sierpinskiRec(it - 1, distance / 2.0, z);
            this.right(60);
            this.nextXY(distance / 2.0);
            this.left(60);
            this.sierpinskiRec(it - 1, distance / 2.0, z);
            this.nextXY(-distance / 2.0);
        }
    }
    
    nextXY(distance) {
        var currX =
            this.x +
            distance * Math.cos((this.rotation * Math.PI) / 180);
        var currY =
            this.y +
            distance * Math.sin((this.rotation * Math.PI) / 180);
        this.x = currX;
        this.y = currY;
        return [currX, currY];
    }
    
    left(degree) {
        this.rotation = (this.rotation + degree) % 360;
    }
    
    right(degree) {
        this.rotation = (this.rotation - degree) % 360;
    }
}


