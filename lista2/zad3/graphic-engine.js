/*
    Skomplikowana i trochę pogmatwana klasa. Rysuje gameObjecty jakie dostanie od klasy DndInvaders. 
    Dodatkowo rysuje wygenerowane przez GraphicsGenerator tło.
*/
class GraphicEngine {
    constructor(canvas, vertexShaderSource, fragmentShaderSource) {
        this.gl = canvas.getContext("webgl");
        WebglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
        this.fieldOfViewRadians = degToRad(80);
        this.background = GraphicsGenerator.generateBackground();
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
        WebglUtils.createProgram(this.gl, 'shaders/vertex_bg.glsl', 'shaders/fragment_bg.glsl').then((program) => {
            this.programBg = program;
            this.positionLocationBg = this.gl.getAttribLocation(this.programBg, "a_position");
            this.colorLocationBg = this.gl.getAttribLocation(this.programBg, "a_color");
            this.matrixLocationBg = this.gl.getUniformLocation(this.programBg, "u_matrix");
            this.positionBufferBg = this.gl.createBuffer();
            this.colorBufferBg = this.gl.createBuffer();
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly for BAckground');
            console.log(err);
        });
    }
    
    draw(gameObjects){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.program);

        var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        var projectionMatrix = Matrix4.perspective(this.fieldOfViewRadians, aspect, 1, 1000);

        for (var index = 0; index < gameObjects.length; ++index) {
            this.drawObject(gameObjects[index], projectionMatrix);
        }
        this.gl.useProgram(this.programBg);
        this.drawBackground(projectionMatrix);
    }

    drawObject(gameObject, matrix){
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(gameObject.points), this.gl.STATIC_DRAW);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(
            this.positionLocation, size, type, normalize, stride, offset
        );
    
        this.gl.uniform4f(this.colorLocation, gameObject.color[0]/255, gameObject.color[1]/255, gameObject.color[2]/255,  gameObject.color[3]/255);
        matrix = Matrix4.translate(matrix, gameObject.translation[0], gameObject.translation[1], gameObject.translation[2]);
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    
        var primitiveType = gameObject.type;
        var offset = 0;
        var count = gameObject.points.length/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    drawBackground(matrix){
        this.gl.enableVertexAttribArray(this.positionLocationBg);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBufferBg);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(this.background[0]), this.gl.STATIC_DRAW);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(
            this.positionLocationBg, size, type, normalize, stride, offset
        );

        this.gl.enableVertexAttribArray(this.colorLocationBg);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBufferBg);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, Uint8Array.from(this.background[1]), this.gl.STATIC_DRAW);
        var size = 3;                 
        var type = this.gl.UNSIGNED_BYTE;  
        var normalize = true;         
        var stride = 0;               
        var offset = 0;              
        this.gl.vertexAttribPointer(
            this.colorLocationBg, size, type, normalize, stride, offset);
    
        this.gl.uniformMatrix4fv(this.matrixLocationBg, false, matrix);
    
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = this.background[0].length/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }
}

/*
    Klasa generująca wierzchołki dla przeciwnika, gracza, pocisku.
    Dodatkowo generuje tło i losuje dla niego kolory.
*/
class GraphicsGenerator {

    static generatePlayer(size){
        var points = [];
        for(var i = 0; i < 6; i++){
            var angle_deg = 60 * i - 30;
            var angle_rad = Math.PI / 180 * angle_deg;
            points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50)
        }
        return points;
    }

    static generateEnemy(size){
        var points = [];
        for(var i = 0; i < 6; i++){
            var angle_deg = 60 * i - 30;
            var angle_rad = Math.PI / 180 * angle_deg;
            points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50)
        }
        return points;
    }

    static generateProjectile(size){
        return [
            0,0,-50, // Centre
            0,0.5*size,-50, //A
            0.3*size,0.39*size,-50, //B
            0.5*size,0,-50, //C
            0.29*size,-0.22*size,-50, //D
            0.11*size,-0.7*size,-50, //E
            0,-1.31*size,-50, //F
            -0.11*size,-0.7*size,-50, //G
            -0.29*size,-0.22*size,-50, //H
            -0.5*size,0,-50, //I
            -0.3*size,0.39*size,-50, //J
            0,0.5*size,-50  //A
        ];
    }

    static generateBackground(){
        var points = [];
        var colors = [];
        var colorPicker = [
            [144,238,144],
            [168,228,160],
            [119,221,119],
            [152,255,152],
            [152,251,152],
            [123,182,97],
        ]
        var size = 10;
        var temp, start = {x:100, y:50};
        for(var j = 0; j < 10; j++){
            for(var i = 0; i < 20; i++){
                points.push(start.x - size * i, start.y - size * j, -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);
                points.push(start.x - size * i, start.y - size * (j+1), -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);
                points.push(start.x - size * (i+1), start.y - size * j, -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);

                points.push(start.x - size * i, start.y - size * (j+1), -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);
                points.push(start.x - size * (i+1), start.y - size * j, -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);
                points.push(start.x - size * (i+1), start.y - size * (j+1), -60);
                colors.push(...colorPicker[getRandomInt(0,5)]);
            }
        }
        return [points, colors];
    }

}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}