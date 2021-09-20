class Wireframe {
    constructor(canvasById, perspective){
        this.height = canvasById.height;
        this.width = canvasById.width;
        this.projectionCenterX = canvasById.height/2;
        this.projectionCenterY = canvasById.width/2;

        this.ctx = canvasById.getContext("2d");

        this.perspective = perspective;
        this.lines = [];
        this.box = new Polygon(new Point3d(0, 0, 400), 300, "black");
        this.box.generatePoints()
        this.draw();
    }

    addLine(line) {
        this.lines.push(line);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var pointsToRender = [];
        this.box.points.forEach(point => {pointsToRender.push(point.project(this.perspective))});
        this.renderBox(pointsToRender, this.box.edges, this.box.style);
        this.lines.forEach(line => {
            this.render(line, line.style);
        });
    }

    render(line, style) {
        var start, end;
        start = line.start.project(this.perspective);
        end = line.end.project(this.perspective);
        this.ctx.beginPath();
        this.ctx.moveTo(start[0] + this.projectionCenterX, start[1] + this.projectionCenterY);
        this.ctx.lineTo(end[0] + this.projectionCenterX, end[1] + this.projectionCenterY);
        this.ctx.strokeStyle = style;
        this.ctx.lineWidth = line.width;
        this.ctx.stroke();
    }

    renderBox(pointsToRender, edges, style){
        this.ctx.beginPath();
        edges.forEach(edge => {
            this.ctx.moveTo(pointsToRender[edge[0]][0] + this.projectionCenterX, pointsToRender[edge[0]][1] + this.projectionCenterY);
            this.ctx.lineTo(pointsToRender[edge[1]][0] + this.projectionCenterX, pointsToRender[edge[1]][1] + this.projectionCenterY);
        });
        this.ctx.strokeStyle = style;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = style;  
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    moveShapes(dx, dz, turtlePoint) {
        this.lines.forEach(line => {
            line.start.x += dx;
            line.start.z += dz;
            line.end.x += dx;
            line.end.z += dz;
        });
        this.box.points.forEach(point => {
            point.x += dx;
            point.z += dz;
        });
        this.box.centre.x += dx;
        this.box.centre.z += dz;
        turtlePoint.x += dx;
        turtlePoint.z += dz;
        return turtlePoint;
    }

    rotateShape(matrixX, matrixY, turtlePoint) {
        this.lines.forEach(line => {
            line.start.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, line.start.toMatrix(this.perspective)),this.perspective);
            line.start.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, line.start.toMatrix(this.perspective)),this.perspective);
            line.end.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, line.end.toMatrix(this.perspective)),this.perspective);
            line.end.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, line.end.toMatrix(this.perspective)),this.perspective);
        });
        this.box.points.forEach(point => {
            point.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, point.toMatrix(this.perspective)),this.perspective);
            point.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, point.toMatrix(this.perspective)),this.perspective);
        });
        this.box.centre.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, this.box.centre.toMatrix(this.perspective)),this.perspective);
        this.box.centre.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, this.box.centre.toMatrix(this.perspective)),this.perspective);
        turtlePoint.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, turtlePoint.toMatrix(this.perspective)),this.perspective);
        turtlePoint.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, turtlePoint.toMatrix(this.perspective)),this.perspective);
        return turtlePoint;
    }

    multiplyMatrixAndPoint(matrix, point) {
        let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
        let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
        let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
        let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
      
        let x = point[0];
        let y = point[1];
        let z = point[2];
        let w = point[3];
      
        let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
        let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
        let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
        let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);
      
        return [resultX, resultY, resultZ, resultW];
      }
}

class Polygon {
    constructor(centre, edgeSize, style = 'blue'){
        this.centre = centre;
        this.radius = Math.floor(Math.random() * edgeSize +  10);
        this.edgeSize = edgeSize;
        this.style = style;
    }

    setCentreByMatrix(matrix){
        this.centre = new Point3d(
            matrix[0],
            matrix[1],
            matrix[2]
        );
    }

    generatePoints() {
        // TODO change to pick random polygon from templates
        this.edges = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]];
        this.points = [];
        this.vertices = [[-1, -1, -1],[1, -1, -1],[-1, 1, -1],[1, 1, -1],[-1, -1, 1],[1, -1, 1],[-1, 1, 1],[1, 1, 1]];
        this.vertices.forEach(vertice => {
            this.points.push( 
                new Point3d(
                    this.centre.x + (this.edgeSize * vertice[0]),
                    this.centre.y + (this.edgeSize * vertice[1]),
                    this.centre.z + (this.edgeSize * vertice[2])
                )
            )
        })
    }
}

class Line3d {
    constructor(start, end, style, width){
        this.start = start;
        this.end = end;
        this.style = style;
        this.width = width;
    }
}

class Point3d {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    project(perspective){
        return [
                perspective * this.x / Math.max(perspective + this.z, 0.01),
                perspective * this.y / Math.max(perspective + this.z, 0.01)
        ];
    }

    setCordsByMatrix(matrix, perspective){
        this.x = matrix[0];
        this.y = matrix[1];
        this.z = matrix[2] - perspective;
    }

    toMatrix(perspective) {
        return [this.x, this.y, this.z + perspective, 1];
    }
}