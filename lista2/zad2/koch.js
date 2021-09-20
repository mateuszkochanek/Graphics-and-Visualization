/*
    Klasa generująca płatki kocha dla głównej klasy.
*/
class KochGenerator {
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

    generateKoch(degree, length, z) {
        this.points.push(this.x,this.y,z)
        this.kochRec(degree, length, z);
        this.right(120);
        this.kochRec(degree, length, z);
        this.right(120);
        this.kochRec(degree, length, z);
    }
    
    kochRec(it, distance, z) {
        if (it < 1) {
            var [x,y] = this.nextXY(distance);
            this.points.push(x,y,z)
        } else {
            this.kochRec(it - 1, distance / 3.0, z);
            this.left(60);
            this.kochRec(it - 1, distance / 3.0, z);
            this.right(120);
            this.kochRec(it - 1, distance / 3.0, z);
            this.left(60);
            this.kochRec(it - 1, distance / 3.0, z);
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
        return [currX,currY];
    }
    
    left(degree) {
        this.rotation = (this.rotation - degree) % 360;
    }
    
    right(degree) {
        this.rotation = (this.rotation + degree) % 360;
    }
}
