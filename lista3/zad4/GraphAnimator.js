class GraphAnimator {
    constructor(canvas, vertexShaderSource, fragmentShaderSource, vertexStencilShaderSource, fragmentStencilShaderSource) {
        this.gl = canvas.getContext('webgl', {stencil: true, preserveDrawingBuffer: true});
        WebglUtils.resizeCanvasToDisplaySize(canvas);

        this.withTriangles = false;

        this.height = this.gl.canvas.height;
        this.width = this.gl.canvas.width;

        this.precision = 500;
        this.xBound = [-6, 6];
        this.yBound = [-6, 6];

        this.graph1 = new Graph();
        this.graph2 = new Graph();

        this.graphSize = 1000;

        WebglUtils.createProgram(this.gl, vertexStencilShaderSource, fragmentStencilShaderSource).then((program) => {
            this.stencilProgram = program;
            this.positionStencilLocation = this.gl.getAttribLocation(this.stencilProgram, "a_position");
            this.stencilBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.stencilBuffer );
            this.gl.bufferData(this.gl.ARRAY_BUFFER, 
                  new Float32Array([
                             -1, -1, 
                             -1,  1, 
                              1,  1,
                              1, -1] ) , this.gl.STATIC_DRAW ); // load object's shape
            this.createStencilBuffer();
            
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
            console.log(err);
        });

        WebglUtils.createProgram(this.gl, vertexShaderSource, fragmentShaderSource).then((program) => {
            this.program = program;
            this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.normalLocation = this.gl.getAttribLocation(this.program, "a_normal");
            this.colorLocation = this.gl.getUniformLocation(this.program, "u_color");
            this.reverseLightDirectionLocation = this.gl.getUniformLocation(this.program, "u_reverseLightDirection");
            this.worldViewProjectionLocation = this.gl.getUniformLocation(this.program, "u_worldViewProjection");
            this.worldInverseTransposeLocation = this.gl.getUniformLocation(this.program, "u_worldInverseTranspose");
            this.positionBuffer1 = this.gl.createBuffer();
            this.normalBuffer1 = this.gl.createBuffer();
            this.positionBuffer2 = this.gl.createBuffer();
            this.normalBuffer2 = this.gl.createBuffer();
            this.generateTrianglesForFunctions();
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
            console.log(err);
        });
    }

    createStencilBuffer(){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.REPLACE);

        this.gl.stencilFunc(this.gl.ALWAYS, 1, 0xff);
        this.gl.stencilMask(0xff);
        this.gl.depthMask(false);
        this.gl.colorMask(false, false, false, false);

        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.STENCIL_TEST);
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        this.gl.useProgram( this.stencilProgram );
        this.gl.enableVertexAttribArray(this.positionStencilLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.stencilBuffer );
        this.gl.vertexAttribPointer(this.positionStencilLocation, 2, this.gl.FLOAT, false, 0 , 0);
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0 , 4 );
    }

    update(time, then){
        this.graph1.rotate(0,1)
        this.graph2.rotate(0,-1)
        this.draw()
    }

    draw() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.KEEP);
        this.gl.depthMask(true);
        this.gl.colorMask(true, true, true, true);
        this.gl.stencilMask(0x00);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.program);

        var aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        // Graph 1 Calculations and drawing
        var matrices = this.graph1.calculateMatrices(aspect);
        this.gl.uniformMatrix4fv(this.worldViewProjectionLocation, false, matrices[0]);
        this.gl.uniformMatrix4fv(this.worldInverseTransposeLocation, false, matrices[1]);

        this.gl.uniform4f(this.colorLocation, 0, 0.8, 0.2, 1);
        this.gl.uniform3fv(this.reverseLightDirectionLocation, Matrix4.normalize([0.5, 0.7, 1]));

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer1);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
            
        this.gl.enableVertexAttribArray(this.normalLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer1);
        var size = 3;
        var type = this.gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        this.gl.vertexAttribPointer(this.normalLocation, size, type, normalize, stride, offset)

        this.gl.stencilFunc(this.gl.EQUAL, 1, 0xff);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = this.graph1.pointsLength/3;
        this.gl.drawArrays(primitiveType, offset, count);

        // Graph 2 Calculations and drawing
        var matrices = this.graph2.calculateMatrices(aspect);
        this.gl.uniformMatrix4fv(this.worldViewProjectionLocation, false, matrices[0]);
        this.gl.uniformMatrix4fv(this.worldInverseTransposeLocation, false, matrices[1]);

        this.gl.uniform4f(this.colorLocation, 0, 1, 1, 1);
        this.gl.uniform3fv(this.reverseLightDirectionLocation, Matrix4.normalize([0.5, 0.7, 1]));

        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer2);
        var size = 3;          
        var type = this.gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
            
        this.gl.enableVertexAttribArray(this.normalLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer2);
        var size = 3;
        var type = this.gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        this.gl.vertexAttribPointer(this.normalLocation, size, type, normalize, stride, offset)

        this.gl.stencilFunc(this.gl.EQUAL, 0, 0xff);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = this.graph2.pointsLength/3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    generateTrianglesForFunctions() {
        var points1 = []
        var normals1 = []
        var points2 = []
        var normals2 = []
        var stepX = (this.xBound[1] - this.xBound[0]) / this.precision;
        var stepY = (this.yBound[1] - this.yBound[0]) / this.precision;
        var scale = this.graphSize / (this.yBound[1] - this.yBound[0]);
        for (let x = 0; x < this.precision; x++) {
            for (let y = 0; y < this.precision; y++) {
                if (x !== this.fidelity - 1 && y !== this.fidelity - 1) {
                    var func1Vals = this.calculateVals(scale, x, y, stepX, stepY, this.func1);
                    var func2Vals = this.calculateVals(scale, x, y, stepX, stepY, this.func2);
                    var func1T = this.createTriangles(x, y, func1Vals);
                    var func2T = this.createTriangles(x, y, func2Vals);

                    var func1UpperNormal = this.normalizeTriangle(func1T[0]);
                    var func1BottomNormal = this.normalizeTriangle(func1T[1]);
                    var func2UpperNormal = this.normalizeTriangle(func2T[0]);
                    var func2BottomNormal = this.normalizeTriangle(func2T[1]);
                    
                    points1.push(...func1T[0], ...func1T[1]);
                    normals1.push(
                        ...func1UpperNormal,
                        ...func1UpperNormal,
                        ...func1UpperNormal,
                        ...func1BottomNormal,
                        ...func1BottomNormal,
                        ...func1BottomNormal
                    )

                    points2.push(...func2T[0], ...func2T[1]);
                    normals2.push(
                        ...func2UpperNormal,
                        ...func2UpperNormal,
                        ...func2UpperNormal,
                        ...func2BottomNormal,
                        ...func2BottomNormal,
                        ...func2BottomNormal
                    )
                    
                }
            }
        }
        this.graph1.setLengths(points1.length, normals1.length);
        this.graph2.setLengths(points2.length, normals2.length);
        //this.graph1.rotate(10,0);
        //this.graph2.rotate(-10,0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer1);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points1), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer1);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals1), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer2);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points2), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer2);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals2), this.gl.STATIC_DRAW);
    }

    calculateVals(scale, x, y, stepX, stepY, fn){
        var val1 = fn(
            this.xBound[0] + x * stepX,
            this.yBound[0] + y * stepY
        ) * scale;

        var val2 = fn(
            this.xBound[0] + (x+1) * stepX,
            this.yBound[0] + y * stepY
        ) * scale;

        var val3 = fn(
            this.xBound[0] + x * stepX,
            this.yBound[0] + (y+1) * stepY
        ) * scale;

        var val4 = fn(
            this.xBound[0] + (x+1) * stepX,
            this.yBound[0] + (y+1) * stepY
        ) * scale;
        return [val1, val2, val3, val4];
    }

    createTriangles(x, y, vals){
        var upperT = [];
        var bottomT = [];
        upperT.push(
            this.getDrawingPoint(x),
            this.getDrawingPoint(y),
            vals[0],
            this.getDrawingPoint(x+1),
            this.getDrawingPoint(y),
            vals[1],
            this.getDrawingPoint(x),
            this.getDrawingPoint(y+1),
            vals[2]
        );

        bottomT.push(
            this.getDrawingPoint(x+1),
            this.getDrawingPoint(y+1),
            vals[3],
            this.getDrawingPoint(x),
            this.getDrawingPoint(y+1),
            vals[2],
            this.getDrawingPoint(x+1),
            this.getDrawingPoint(y),
            vals[1]
        );
        return [upperT, bottomT]
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

    func1(x,y){
        return Math.sin(x*y);
    }

    func2(x,y){
        return Math.cos(x*y);
    }
}

class Graph{
    constructor(){
        this.translation = [0, 0, 1000]
        this.rotation = [0, 0, 0]
        this.pointsLength = 0;
        this.normalsLength = 0;
    }

    calculateMatrices(aspect){
        var projectionMatrix = Matrix4.perspective(degToRad(80), aspect, 1, 5000);

        var target = [0, 0, 0];
        var up = [0, 1, 0];
        var cameraMatrix = Matrix4.lookAt(this.translation, target, up);

        var viewMatrix = Matrix4.inverse(cameraMatrix);

        var viewProjectionMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

        var worldMatrix = Matrix4.xRotation(degToRad(this.rotation[0]));
        worldMatrix = Matrix4.yRotate(worldMatrix, degToRad(this.rotation[1]));

        var worldViewProjectionMatrix = Matrix4.multiply(viewProjectionMatrix, worldMatrix);
        var worldInverseMatrix = Matrix4.inverse(worldMatrix);
        var worldInverseTransposeMatrix = Matrix4.transpose(worldInverseMatrix);
        return [worldViewProjectionMatrix, worldInverseTransposeMatrix]
    }

    rotate(rx=0, ry=0){
        this.rotation[0] = (this.rotation[0] + rx) % 360;
        this.rotation[1] = (this.rotation[1] + ry) % 360;
    }

    translate(vx=0, vy=0, vz=0){
        this.translation[0] += vx;
        this.translation[1] += vy;
        this.translation[2] += vz;
    }

    setLengths(pointsL, normalsL){
        this.pointsLength = pointsL;
        this.normalsLength = normalsL;
    }
}