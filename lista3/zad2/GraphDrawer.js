class GraphDrawer {
    constructor(canvas, vertexShaderSource, fragmentShaderSource) {
        this.gl = canvas.getContext('webgl');
        WebglUtils.resizeCanvasToDisplaySize(canvas);
        this.fieldOfViewRadians = degToRad(80);

        this.withTriangles = false;

        this.height = this.gl.canvas.height;
        this.width = this.gl.canvas.width;
        this.translation = [0, 0, 1000]
        this.rotation = [0, 0, 0]

        this.points = [];
        this.normals = [];

        this.precision = 500;
        this.xBound = [-6, 6];
        this.yBound = [-6, 6];

        this.graphSize = 1000;

        WebglUtils.createProgram(this.gl, vertexShaderSource, fragmentShaderSource).then((program) => {
            this.program = program;
            this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.normalLocation = this.gl.getAttribLocation(this.program, "a_normal");
            this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
            this.reverseLightDirectionLocation = this.gl.getUniformLocation(this.program, "u_reverseLightDirection");
            this.worldViewProjectionLocation = this.gl.getUniformLocation(this.program, "u_worldViewProjection");
            this.worldInverseTransposeLocation = this.gl.getUniformLocation(this.program, "u_worldInverseTranspose");
            this.positionBuffer = this.gl.createBuffer();
            this.normalBuffer = this.gl.createBuffer();
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
            console.log(err);
        });
    }

    translate(vx=0, vy=0, vz=0){
        this.translation[0] += vx;
        this.translation[1] += vy;
        this.translation[2] += vz;
    }

    rotate(rx=0, ry=0){
        this.rotation[0] += rx;
        this.rotation[1] += ry;
    }

    generatePointsForFunction(functionToDraw) {
        this.fn = functionToDraw;
        this.withTriangles = false;
        this.points = [];
        this.normals = [];
        var stepX = (this.xBound[1] - this.xBound[0]) / this.precision;
        var stepY = (this.yBound[1] - this.yBound[0]) / this.precision;
        var scale = this.graphSize / (this.yBound[1] - this.yBound[0]);
        for (let x = 0; x < this.precision; x++) {
            for (let y = 0; y < this.precision; y++) {
                const val = this.fn(
                    this.xBound[0] + x * stepX,
                    this.yBound[0] + y * stepY
                ) * scale;

                this.points.push(
                    this.getDrawingPoint(x),
                    this.getDrawingPoint(y),
                    val
                );
            }
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
    }

    generateTrianglesForFunction(functionToDraw) {
        this.fn = functionToDraw;
        this.withTriangles = true;
        this.points = [];
        this.normals = [];
        var stepX = (this.xBound[1] - this.xBound[0]) / this.precision;
        var stepY = (this.yBound[1] - this.yBound[0]) / this.precision;
        var scale = this.graphSize / (this.yBound[1] - this.yBound[0]);
        for (let x = 0; x < this.precision; x++) {
            for (let y = 0; y < this.precision; y++) {
                if (x !== this.fidelity - 1 && y !== this.fidelity - 1) {
                    var upperT = []
                    var bottomT = []
                    const val1 = this.fn(
                        this.xBound[0] + x * stepX,
                        this.yBound[0] + y * stepY
                    ) * scale;

                    const val2 = this.fn(
                        this.xBound[0] + (x+1) * stepX,
                        this.yBound[0] + y * stepY
                    ) * scale;

                    const val3 = this.fn(
                        this.xBound[0] + x * stepX,
                        this.yBound[0] + (y+1) * stepY
                    ) * scale;

                    const val4 = this.fn(
                        this.xBound[0] + (x+1) * stepX,
                        this.yBound[0] + (y+1) * stepY
                    ) * scale;

                    upperT.push(
                        this.getDrawingPoint(x),
                        this.getDrawingPoint(y),
                        val1,
                        this.getDrawingPoint(x+1),
                        this.getDrawingPoint(y),
                        val2,
                        this.getDrawingPoint(x),
                        this.getDrawingPoint(y+1),
                        val3
                    );

                    bottomT.push(
                        this.getDrawingPoint(x+1),
                        this.getDrawingPoint(y+1),
                        val4,
                        this.getDrawingPoint(x),
                        this.getDrawingPoint(y+1),
                        val3,
                        this.getDrawingPoint(x+1),
                        this.getDrawingPoint(y),
                        val2
                    );

                    var upperNormal = this.normalizeTriangle(upperT);
                    var bottomNormal = this.normalizeTriangle(bottomT);

                    this.points.push(...upperT, ...bottomT);
                    this.normals.push(
                        ...upperNormal,
                        ...upperNormal,
                        ...upperNormal,
                        ...bottomNormal,
                        ...bottomNormal,
                        ...bottomNormal
                    )

                }
            }
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
    }

    normalizeTriangle(triangle) {
        var A = [triangle[3]-triangle[0], triangle[4]-triangle[1], triangle[5]-triangle[2]];
        var B = [triangle[6]-triangle[0], triangle[7]-triangle[1], triangle[8]-triangle[2]];

        /*Nx = Ay * Bz - Az * By
        Ny = Az * Bx - Ax * Bz
        Nz = Ax * By - Ay * Bx*/
        return [
            A[1] * B[2] - A[2] * B[1],
            A[2] * B[0] - A[0] * B[2],
            A[0] * B[1] - A[1] * B[0]
        ]
    }

    getDrawingPoint(cord){
        return cord * this.graphSize / this.precision - this.graphSize / 2
    }

    draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.program);
//__________________________________________________
        var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        var projectionMatrix = Matrix4.perspective(this.fieldOfViewRadians, aspect, 1, 5000);

        var target = [0, 0, 0];
        var up = [0, 1, 0];
        var cameraMatrix = Matrix4.lookAt(this.translation, target, up);

        var viewMatrix = Matrix4.inverse(cameraMatrix);

        var viewProjectionMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

        var worldMatrix = Matrix4.xRotation(this.rotation[0]);
        worldMatrix = Matrix4.yRotate(worldMatrix, this.rotation[1]);

        var worldViewProjectionMatrix = Matrix4.multiply(viewProjectionMatrix, worldMatrix);
        var worldInverseMatrix = Matrix4.inverse(worldMatrix);
        var worldInverseTransposeMatrix = Matrix4.transpose(worldInverseMatrix);
        this.gl.uniformMatrix4fv(this.worldViewProjectionLocation, false, worldViewProjectionMatrix);
        this.gl.uniformMatrix4fv(this.worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
//_____________________________________________________

        this.gl.uniform4f(this.colorLocation, 0, 0.8, 0.2, 1);
        this.gl.uniform3fv(this.reverseLightDirectionLocation, Matrix4.normalize([0.5, 0.7, 1]));

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
            
        if(this.withTriangles){
            this.gl.enableVertexAttribArray(this.normalLocation);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
            var size = 3;
            var type = this.gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            this.gl.vertexAttribPointer(this.normalLocation, size, type, normalize, stride, offset)

            var primitiveType = this.gl.TRIANGLES;
        } else {
            var primitiveType = this.gl.POINTS;
        }
        
        var offset = 0;
        var count = this.points.length/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }
}