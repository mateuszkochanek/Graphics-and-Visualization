/*
    Klasa zarządzająca rysowanymi przez nas figurami. Zapamiętuje je i przesuwa. Korzysta z klasy WebglUtils, KochGenerator i SierpGenerator.
*/
class FigureManager {
    constructor(canvas, vertexShaderSource, fragmentShaderSource) {
        this.gl = canvas.getContext("webgl");
        this.fieldOfViewRadians = degToRad(80);
        this.figures = [];
        this.kochGenerator = new KochGenerator();
        this.sierpGenerator = new SierpGenerator();
        WebglUtils.createProgram(this.gl, vertexShaderSource, fragmentShaderSource).then((program) => {
            this.program = program;
            this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
            this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
            this.positionBuffer = this.gl.createBuffer();
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
            console.log(err);
        });
    } 

    drawScene(){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.program);

        var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        var projectionMatrix = Matrix4.perspective(this.fieldOfViewRadians, aspect, 1, 1000);

        for (var index = 0; index < this.figures.length; ++index) {
            this.drawFigure(this.figures[index], projectionMatrix);
        }
    }


    drawFigure(figure, matrix){
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(figure.points), this.gl.STATIC_DRAW);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(
        this.positionLocation, size, type, normalize, stride, offset);
    
        this.gl.uniform4f(this.colorLocation, figure.color[0]/255, figure.color[1]/255, figure.color[2]/255, 1);
        matrix = Matrix4.translate(matrix, figure.translation[0], figure.translation[1], figure.translation[2]);
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    
        var primitiveType = figure.type;
        var offset = 0;
        var count = figure.points.length/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    createKoch(degree, length, depth, col1, col2, col3){
        this.kochGenerator.resetGen();
        this.kochGenerator.generateKoch(degree, length, depth);
        var points = this.kochGenerator.getPoints();
        this.figures.push(new Figure(points, [col1, col2, col3, 255], 0, this.gl.LINE_LOOP));
        return this.figures.length-1;
    }
    

    createSierp(degree, length, depth, col1, col2, col3){
        this.sierpGenerator.resetGen();
        this.sierpGenerator.generateSierpinski(degree, length, depth);
        var points = this.sierpGenerator.getPoints();
        this.figures.push(new Figure(points, [col1, col2, col3, 255], 0, this.gl.TRIANGLES));
        return this.figures.length-1;
    }

    figureTranslate(index ,sx , sy, sz){
        this.figures[index].translation[0] += sx;
        this.figures[index].translation[1] += sy;
        this.figures[index].translation[2] += sz;
        this.drawScene();
    }
}

class Figure {
    constructor(points, color, depth, type){
        this.points = points;
        this.color = color;
        this.translation = [0, 0, depth];
        this.type = type;
    }
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}