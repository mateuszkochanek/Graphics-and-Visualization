class GraphicEngine {
    constructor(canvas, vertexShaderSource, fragmentShaderSource) {
        this.gl = canvas.getContext("webgl");
        WebglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
        this.fieldOfViewRadians = degToRad(80);
        this.background = GraphicsGenerator.generateBackground();
        this.textures = [];
        WebglUtils.createProgram(this.gl, vertexShaderSource, fragmentShaderSource).then((program) => {
            this.program = program;
            this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.texcoordLocation = this.gl.getAttribLocation(program, "a_texcoords");
            this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
            this.textureLocation = this.gl.getUniformLocation(program, "u_texture");
            this.positionBuffer = this.gl.createBuffer();
            this.textureBuffer = this.gl.createBuffer();
            this.loadTextures(['img/player.png', 'img/goblin.png', 'img/fireball.png', 'img/grass.png']);
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
            console.log(err);
        });
        WebglUtils.createProgram(this.gl, 'shaders/vertex_bg.glsl', 'shaders/fragment_bg.glsl').then((program) => {
            this.programBg = program;
            this.positionLocationBg = this.gl.getAttribLocation(this.programBg, "a_position");
            this.texcoordLocationBg = this.gl.getAttribLocation(this.programBg, "a_texcoords");
            this.matrixLocationBg = this.gl.getUniformLocation(this.programBg, "u_matrix");
            this.textureLocationBg = this.gl.getUniformLocation(this.programBg, "u_texture");
            this.positionBufferBg = this.gl.createBuffer();
            this.textureBufferBg = this.gl.createBuffer();
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
        
        this.gl.enableVertexAttribArray(this.texcoordLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(gameObject.textureCords), this.gl.STATIC_DRAW);
        var size = 2;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(
            this.texcoordLocation, size, type, normalize, stride, offset
        );

        matrix = Matrix4.translate(matrix, gameObject.translation[0], gameObject.translation[1], gameObject.translation[2]);
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    
        this.gl.uniform1i(this.textureLocation, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[gameObject.textureId]);

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


        this.gl.enableVertexAttribArray(this.texcoordLocationBg);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBufferBg);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from(this.background[1]), this.gl.STATIC_DRAW);
        var size = 2;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(
            this.texcoordLocationBg, size, type, normalize, stride, offset
        );
    
        this.gl.uniformMatrix4fv(this.matrixLocationBg, false, matrix);
        this.gl.uniform1i(this.textureLocationBg, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[3]);
    
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = this.background[0].length/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }


    loadTextures(srcs){
        var imagesToLoad = srcs.length;
        for (var i = 0; i < imagesToLoad; ++i) {
            this.textures.push(this.gl.createTexture());
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i]);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
                            new Uint8Array([0, 0, 255, 255]));

            loadImage(srcs[i], i).then((value) => {  
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[value.id]);    
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, value.image);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            }).catch(err => {
                alert('There was an error! Photo did not load correctly');
            });
        }
    }

}

class GraphicsGenerator {

    static generatePlayer(size){
        var points = [0, 0, -50];
        for(var i = 0; i < 6; i++){
            var angle_deg = 60 * i - 30;
            var angle_rad = Math.PI / 180 * angle_deg;
            points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50);
        }
        var angle_deg = -30;
        var angle_rad = Math.PI / 180 * angle_deg;
        points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50);
        return points;
    }

    static generatePlayerTextureCords(){
        return [
            0.5, 0.5,
            1, 1,
            1, 0,
            0.5, 0,
            0, 0,
            0, 1,
            0.5, 1,
            1, 1
        ];
    }

    static generateEnemy(size){
        var points = [0, 0, -50];
        for(var i = 0; i < 6; i++){
            var angle_deg = 60 * i - 30;
            var angle_rad = Math.PI / 180 * angle_deg;
            points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50);
        }
        var angle_deg = -30;
        var angle_rad = Math.PI / 180 * angle_deg;
        points.push(0 + size * Math.cos(angle_rad), 0 + size * Math.sin(angle_rad), -50);
        return points;
    }

    static generateEnemyTextureCords(){
        return [
            0.5, 0.5,
            1, 1,
            1, 0,
            0.5, 0,
            0, 0,
            0, 1,
            0.5, 1,
            1, 1
        ];
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

    static generateProjectileTextureCords(){
        return [
            0.5, 0.5, // Centre
            0.5, 1, //A
            1, 1, //B
            1, 0.33, //C
            1, 0.5, //D
            1, 0.9, //E
            0.5, 1, //F
            0, 0.9, //G
            0, -0.22, //H
            0, 0.5, //I
            0, 0.33, //J
            0.5, 0.5  //A
        ];
    }

    static generateBackground(){
        var points = [];
        var textureCords = [];
        var size = 10;
        var temp, start = {x:100, y:50};
        for(var j = 0; j < 10; j++){
            for(var i = 0; i < 20; i++){
                points.push(start.x - size * i, start.y - size * j, -60);
                textureCords.push(0,1);
                points.push(start.x - size * i, start.y - size * (j+1), -60);
                textureCords.push(0,0);
                points.push(start.x - size * (i+1), start.y - size * j, -60);
                textureCords.push(1,1);

                points.push(start.x - size * i, start.y - size * (j+1), -60);
                textureCords.push(0,0);
                points.push(start.x - size * (i+1), start.y - size * j, -60);
                textureCords.push(1,1);
                points.push(start.x - size * (i+1), start.y - size * (j+1), -60);
                textureCords.push(1,0);
            }
        }
        return [points, textureCords];
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

function loadImage(source, i) {
    let image = new Image();
    let value = {image: image, id: i};
    let promise = new Promise((resolve, reject) => {
        value.image.addEventListener('load', () => resolve(value));
        value.image.addEventListener('error', err => reject(err));
    });
    value.image.src = source;
    return promise;
}