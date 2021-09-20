/*
    Prosta klasa obsł↓gująca testową grafikę, tworzy program, shadery, zapamiętuje punkty i przy kliknięciu rysuje je na nowo
    z innym typem.
*/
class TestGraphics {
    constructor(canvas, gl, vertexShader, fragmentShader) {
        this.canvas = canvas;
        this.gl = gl;
        this.points = [];
        this.type = this.gl["POINTS"];

        this.pointsBuffer = null;
        this.drawCount = 0;

        TestGraphics.createProgram(this.gl, vertexShader, fragmentShader).then((program) => {
            this.program = program;
            this.gl.bindAttribLocation(this.program, 7, 'a_position')
            this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        }).catch(err => {
            alert('There was an error! Shaders did not load correctly');
        });
    }

    static createShader(gl, type, source) {
        return new Promise((resolve, reject) => {
            fetch(source).then(code => code.text().then(src => {
                let shader = gl.createShader(type);
                gl.shaderSource(shader, src);
                gl.compileShader(shader);
                if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    resolve(shader);
                } else {
                    reject(gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                }
            }));
        });
    }

    static async createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        var program = gl.createProgram();
        var vertexShader = await TestGraphics.createShader(gl, gl.VERTEX_SHADER,vertexShaderSource);
        var fragmentShader = await TestGraphics.createShader(gl, gl.FRAGMENT_SHADER,fragmentShaderSource);
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
          return program;
        }     
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    addPoint(myMouseLoc){
        this.points.push(myMouseLoc.x);
        this.points.push(myMouseLoc.y);
        this.bufferPositions();
        this.draw();
    }

    changeType(tType){
        this.type = this.gl[tType];
        this.bufferPositions();
        this.draw();
    }

    bufferPositions() { 
        this.drawCount = this.points.length / 2;
        this.pointsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
    }

    draw() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsBuffer);
        let size = 2;
        let type = this.gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);
        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.drawArrays(this.type, 0, this.drawCount);
    }

    // Ta funkcja wyświetla w przegladarce uniformy i atrybuty
    showInfo(infoBox){
        var info;
        var node;
        var para;
        infoBox.innerHTML = "";
        var numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; ++i) {
            info = this.gl.getActiveAttrib(this.program, i);
            para = document.createElement("p")
            node = document.createTextNode(`name: ${info.name}, type: ${info.type}, size: ${info.size}`);
            para.appendChild(node);
            infoBox.appendChild(para);
        }
        var numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; ++i) {
            info = this.gl.getActiveUniform(this.program, i);
            para = document.createElement("p")
            node = document.createTextNode(`name: ${info.name}, type: ${info.type}, size: ${info.size}`);
            para.appendChild(node);
            infoBox.appendChild(para);
        }
    }
}