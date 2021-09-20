// Klasa obsługująca wszystko dotyczące grafiki wirerame
class Wireframe {

    // szablony figur składające się z punktów dookoła (0,0,0) i tego jak powinny być połączone krawędziami
    static polygon_templates = [
        {
            edges : [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]], //cube
            vertices : [[-1, -1, -1],[1, -1, -1],[-1, 1, -1],[1, 1, -1],[-1, -1, 1],[1, -1, 1],[-1, 1, 1],[1, 1, 1]]
        }
    ]

    constructor(canvasById, perspective, numberOfObstacles){
        this.numberOfObstacles = numberOfObstacles;
        this.height = canvasById.height;
        this.width = canvasById.width;
        this.projectionCenterX = canvasById.width/2;
        this.projectionCenterY = canvasById.height/2;
        this.ctx = canvasById.getContext("2d");
        this.perspective = perspective;
        this.polygons = [];
    }

    addPolygons(polygons) {
        polygons.forEach(polygon => {
            polygon.generatePoints(Wireframe.polygon_templates[0]);
        })
        this.polygons = [...this.polygons, ...polygons];
    }

    // funkcja przygotowywująca elementy w wireframe do renderingu
    draw() {
        var pointsToRender;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.polygons.forEach(polygon => {
            pointsToRender = [];
            polygon.points.forEach(point => {pointsToRender.push(point.project(perspective))});
            this.render(pointsToRender, polygon.edges, polygon.style);
        });
    }

    // render, w tym przypadku bezpośrednie rysowanie na canvasie
    render(pointsToRender, edges, style) {
        this.ctx.beginPath();
        edges.forEach(edge => {
            this.ctx.moveTo(pointsToRender[edge[0]][0] + this.projectionCenterX, pointsToRender[edge[0]][1] + this.projectionCenterY);
            this.ctx.lineTo(pointsToRender[edge[1]][0] + this.projectionCenterX, pointsToRender[edge[1]][1] + this.projectionCenterY);
        });
        this.ctx.strokeStyle = style;
        this.ctx.stroke();
    }

    // Sprawdzamy jak daleko jest centrum każdego polygonu od centrum układu gdzie jest gracz.
    // Jeżeli jest za blisko to rejestrujemy kolizję.
    checkCollisions(){
        var pow = Math.pow;
        var collision = 0;
        this.polygons.forEach(polygon => {
            if((Math.sqrt(pow(polygon.centre.x, 2) + pow(polygon.centre.y, 2) + pow(polygon.centre.z + this.perspective, 2)) <= polygon.radius) ){
                if(polygon.style != 'blue')
                    collision = 2;
                else
                    collision = 1;
            }
        });
        return collision;
    }

    // Funkcja wywołana gdy chcemy się poruszyć. Przesuwa wszystkie elementy w wireframe na osi Z o pewną wartość.
    moveShapes(dz) {
        this.polygons.forEach(polygon => {
            polygon.points.forEach(point => {
                point.z += dz;
            });
            polygon.centre.z += dz;
        });
    }

    // Funkcja wywoływana kiedy chcemy się obrócić. Obraca wszystkie elementy dookoła punku origin
    // używając macierzy obrotu wygenerowanych przez game3d.
    rotateShapes(matrixX, matrixY) {
        this.polygons.forEach(polygon => {
            polygon.points.forEach(point => {
                point.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, point.toMatrix(this.perspective)),this.perspective);
                point.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, point.toMatrix(this.perspective)),this.perspective);
            });
            polygon.centre.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixX, polygon.centre.toMatrix(this.perspective)),this.perspective);
            polygon.centre.setCordsByMatrix(this.multiplyMatrixAndPoint(matrixY, polygon.centre.toMatrix(this.perspective)),this.perspective);
        });
    }

    // Mnożenie macierzy i punktu w 3d. Jako, że nasze macierze transformacji mają wymiary 4x4, żeby można je było ładnie pomnożyć
    // musimy dodać do punktu jeden dodatkowy wymiar, który w tym przypadku zawsze wstawiamy na 1. W ten sposób
    // wykonujemy mnożenie, a wymiar w nie ma wpływu na wyniki x,y,z.
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

// klasa zarządzająca figurami
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

    // generujemy punkty figury dookoła centrum
    generatePoints(template) {
        this.edges = template.edges;
        this.points = [];
        template.vertices.forEach(vertice => {
            this.points.push( 
                new Point3d(
                    this.centre.x + (this.radius * vertice[0]),
                    this.centre.y + (this.radius * vertice[1]),
                    this.centre.z + (this.radius * vertice[2])
                )
            )
        })
    }
}

// Klasa punktu w 3d, zawierająca metody transformujące punkt w macierz jak i równierz
// najważniejszą metodę pozwalającą na projekcję punktu z 2d do 3d.
class Point3d {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Project zmienia punkty 3d na ich odpowiedniki w 2d. Perspektywa w tym przypadku 
    // określa jak powinna zachowywać się kamera i jak mocna powinna być perspektywa.
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