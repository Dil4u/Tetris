var matrix = document.getElementById("matrix");

for (let i = 0; i < matrix.rows.length; i++){
    for (let j = 0 ; j < matrix.rows[0].cells.length; j++){
        matrix.rows[i].cells[j].style.backgroundColor = "black";
    }
}

function get_cell(row, col){
    return matrix.rows[row].cells[col];
}




function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Cell{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.i = y;
        this.j = x;
        this.take = false;
        this.figure = undefined;
    }

    set_figure(figure){
        this.figure = figure;
        this.take = true;
    }

}

var cellMatrix = [];
for (let i = 0; i < matrix.rows.length; i++){
    let row = [];
    for (let j = 0; j < matrix.rows[0].cells.length; j++){
        row.push(new Cell(j, i));
    }
    cellMatrix.push(row);
}


function figures(start_point, number){
    let cells = [];
    
    // horizontal line 3x1
    if (number == 1 && start_point.x < 8){
        for(let i = 0; i < 3; i++){
            cells.push(cellMatrix[start_point.y][start_point.x+i]);
        }
    }

    // horizontal line 2x1
    else if (number == 2){
        for(let i = 0; i < 2; i++){
            cells.push(cellMatrix[start_point.y][start_point.x + i]);
        }
    }

    // square 2x2
    else if (number == 3){
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < 2; j++){
                cells.push(cellMatrix[start_point.y + i][start_point.x + j]);
            }
        }
    }

    // L 
    else if (number == 4){
        for(let i = 0; i < 3; i++){
            cells.push(cellMatrix[start_point.y + i][start_point.x]);
        }
        cells.push(cellMatrix[start_point.y + 2][start_point.x + 1]);
    }

    // L mirrored
    else if (number == 5){
        for(let i = 0; i < 3; i++){
            cells.push(cellMatrix[start_point.y + i][start_point.x + 1]);
        }
        cells.push(cellMatrix[start_point.y+2][start_point.x]);
    }


    // T
    else if (number == 6){
        for(let i = 0; i < 3; i++){
            cells.push(cellMatrix[start_point.y][start_point.x+i]);
        }
        cells.push(cellMatrix[start_point.y+1][start_point.x+1]);
    }



    return cells;


}



var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

class Figure{
    constructor(pos, number){
        this.cells = figures(pos, number);
        this.color = colors[random(0, colors.length - 1)];
        this.maxLeft = Math.min(...this.cells.map(cells => cells.x));
        this.maxRight = Math.max(...this.cells.map(cells => cells.x));
        this.maxTop = Math.min(...this.cells.map(cells => cells.y));
        this.maxBottom = Math.max(...this.cells.map(cells => cells.y));
        this.calculate_bottom();
        this.active = true;
    }

    calculate_bottom(){
        let lista = [];
        for (let current_x = this.maxLeft; current_x < this.maxRight+1; current_x++){
            let current_y = 0;
            for (let j = 0; j < this.cells.length; j++){
                if (this.cells[j].x == current_x){
                    if (current_y < this.cells[j].y){
                        current_y = this.cells[j].y;
                    }
                }
            }
            lista.push({x: current_x, y: current_y});
        }
        this.bottom = lista;
    }

    calculate_left(){
        let lista = [];
        for (let current_y = this.maxTop; current_y < this.maxBottom+1; current_y++){
            let current_x = 9;
            for (let j = 0; j < this.cells.length; j++){
                if (this.cells[j].y == current_y){
                    if (current_x > this.cells[j].x){
                        current_x = this.cells[j].x;
                    }
                }
            }
            lista.push({x: current_x, y: current_y});
        }
        this.left = lista;
    }

    calculate_right(){
        let lista = [];
        for (let current_y = this.maxTop; current_y < this.maxBottom+1; current_y++){
            let current_x = 0;
            for (let j = 0; j < this.cells.length; j++){
                if (this.cells[j].y == current_y){
                    if (current_x < this.cells[j].x){
                        current_x = this.cells[j].x;
                    }
                }
            }
            lista.push({x: current_x, y: current_y});
        }
        this.right = lista;
    }

    stable(){
        if (this.cells.some(cell => cell.y === matrix.rows.length - 1)){
            return true;
        }else if (this.bottom.some(bott => get_cell(bott.y+1, bott.x).style.backgroundColor !== "black")){
            return true;
        }
        else {
            return false;
        }
    }

    move_y(){
        if (!this.stable()){
            for (let k = 0; k < this.cells.length; k++) {
                this.cells[k] = cellMatrix[this.cells[k].i+1][this.cells[k].j] // Change the cells one down
            }
        }else{
            if (this.active){
                createFigure();
                this.active = false;
            }

        }
    }

    move_x(direction){
        if (this.maxLeft + direction >= 0 && this.maxRight + direction <= 9){
            this.clear();
            for (let k = 0; k < this.cells.length; k++){
                this.cells[k] = cellMatrix[this.cells[k].i][this.cells[k].j+direction]
            }
            this.draw();
            this.update_extremes();
        }
    }

    update(){
        this.clear()
        this.move_y(); // calculate new position
        this.calculate_bottom();
        this.draw();
    }

    clear(){
        this.cells.forEach(cell => {// clear
            matrix.rows[cell.i].cells[cell.j].style.backgroundColor = "black";
        });
    }

    draw(){
        this.cells.forEach(cell => {// draw
            matrix.rows[cell.y].cells[cell.x].style.backgroundColor = this.color;
        });
    }

    update_extremes(){
        this.maxLeft = Math.min(...this.cells.map(cells => cells.x));
        this.maxRight = Math.max(...this.cells.map(cells => cells.x));
    }

    posible_move(direction){
        
    }

    rotate(){
    
    }
}

class Line3 extends Figure{
    constructor(){
        super({x: random(0, 7), y: 0}, 1);
        this.state = "horizontal";
    }

    rotate(){
        this.center = this.cells[1];
        this.clear();
        if (this.state == "vertical"){
            if (this.center.x == 0){
                this.move_x(1);
                this.rotate();
            }else if (this.center.x == 9){
                this.move_x(-1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x + 1];
                this.state = "horizontal";
            }
        }else{            
            this.cells[0] = cellMatrix[this.center.y - 1][this.center.x];
            this.cells[2] = cellMatrix[this.center.y + 1][this.center.x];
            this.state = "vertical";
        }
        this.draw();
        this.calculate_bottom();
        this.update_extremes();
    }

}

class Line2 extends Figure{
    constructor(){
        super({x: random(0, 8), y: 0}, 2);
        this.state = 0;
    }
    rotate(){
        this.center = this.cells[0];
        this.clear();
        if (this.state == 0){
            this.cells[1] = cellMatrix[this.center.y + 1][this.center.x];
            this.state++;
        }else if (this.state == 1){
            if (this.center.x == 0){
                this.move_x(1);
                this.rotate();
            }else{
                this.cells[1] = cellMatrix[this.center.y][this.center.x - 1];
                this.state++;
            }
        }else if (this.state == 2){
            this.cells[1] = cellMatrix[this.center.y - 1][this.center.x];
            this.state++;
        } else if (this.state == 3){
            if (this.center.x == 9){
                this.move_x(-1);
                this.rotate();
            }else{
                this.cells[1] = cellMatrix[this.center.y][this.center.x + 1];
                this.state = 0;
            }
        }
        this.draw();
        this.calculate_bottom();
        this.update_extremes();
    }
}

class Square extends Figure{
    constructor(){
        super({x: random(0, 8), y: 0}, 3);
    }
}

class Lnormal extends Figure{
    constructor(){
        super({x: random(0, 8), y: 0}, 4);
        this.state = 0;
    }

    rotate(){
        this.center = this.cells[1];
        this.clear();
        if (this.state == 0){
            if (this.center.x == 0){
                this.move_x(1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x + 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[3] = cellMatrix[this.center.y + 1][this.center.x - 1];
                this.state = 1;
            }
        }else if (this.state == 1){
            this.cells[0] = cellMatrix[this.center.y + 1][this.center.x];
            this.cells[2] = cellMatrix[this.center.y - 1][this.center.x];
            this.cells[3] = cellMatrix[this.center.y - 1][this.center.x - 1];
            this.state = 2;
        }else if (this.state == 2){
            if (this.center.x == 9){
                this.move_x(-1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x + 1];
                this.cells[3] = cellMatrix[this.center.y - 1][this.center.x + 1];
                this.state = 3;
            }
        }else if (this.state == 3){
            this.cells[0] = cellMatrix[this.center.y - 1][this.center.x];
            this.cells[2] = cellMatrix[this.center.y + 1][this.center.x];
            this.cells[3] = cellMatrix[this.center.y + 1][this.center.x + 1];
            this.state = 0;
        }
        this.draw();
        this.calculate_bottom();
        this.update_extremes();
    }
}

class Lmirrored extends Figure{
    constructor(){
        super({x: random(1, 9), y: 0}, 5);
        this.state = 0;
    }

    rotate(){
        this.clear();
        this.center = this.cells[1];
        if (this.state == 0){
            if (this.center.x == 9){
                this.move_x(-1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x + 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[3] = cellMatrix[this.center.y - 1][this.center.x - 1];
                this.state = 1;
            }
        }else if (this.state == 1){
            this.cells[0] = cellMatrix[this.center.y + 1][this.center.x];
            this.cells[2] = cellMatrix[this.center.y - 1][this.center.x];
            this.cells[3] = cellMatrix[this.center.y - 1][this.center.x + 1];
            this.state = 2;
        }else if (this.state == 2){
            if (this.center.x == 0){
                this.move_x(1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x + 1];
                this.cells[3] = cellMatrix[this.center.y + 1][this.center.x + 1];
                this.state = 3;
            }
        }else if (this.state == 3){
            this.cells[0] = cellMatrix[this.center.y - 1][this.center.x];
            this.cells[2] = cellMatrix[this.center.y + 1][this.center.x];
            this.cells[3] = cellMatrix[this.center.y + 1][this.center.x - 1];
            this.state = 0;
        }
        this.draw();
        this.calculate_bottom();
        this.update_extremes();
    }
}

class T_piece extends Figure{
    constructor(){
        super({x: random(0, 7), y: 0}, 6);
        this.state = 0;
    }

    rotate(){
        this.center = this.cells[1];
        this.clear();
        if (this.state == 0){
            this.cells[2] = cellMatrix[this.center.y - 1][this.center.x];
            this.state = 1;
        }else if (this.state == 1){
            if (this.center.x == 9){
                this.move_x(-1);
                this.rotate();
            }else{
                this.cells[3] = cellMatrix[this.center.y][this.center.x + 1];
                this.state = 2;
            }
        }else if (this.state == 2){
            this.cells[0] = cellMatrix[this.center.y + 1][this.center.x];
            this.state = 3;
        }else if (this.state == 3){
            if (this.center.x == 0){
                this.move_x(1);
                this.rotate();
            }else{
                this.cells[0] = cellMatrix[this.center.y][this.center.x - 1];
                this.cells[2] = cellMatrix[this.center.y][this.center.x + 1];
                this.cells[3] = cellMatrix[this.center.y + 1][this.center.x];
                this.state = 0;
            }
        }
        this.draw();
        this.calculate_bottom();
        this.update_extremes();
    }
}


var current_figures = [];

function update_figures(){
    current_figures.forEach(figure => figure.update());
}


function createFigure(){
    current_figures.push(new pieces[random(0, pieces.length - 1)]());
    //current_figures.push(new Line2());
    active_figure = current_figures[current_figures.length - 1];

}


var pieces = [Line3, Line2, Square, Lnormal, Lmirrored, T_piece]



createFigure();
var interval = setInterval(update_figures, 1000); // update figures every second


document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowUp") {
        active_figure.rotate();
    }
});


// updating time
let isArrowDownPressed = false;
document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowDown" && !isArrowDownPressed) {
        clearInterval(interval);
        interval = setInterval(update_figures, 200);
        isArrowDownPressed = true;
    }
});
document.addEventListener('keyup', function(event) {
    if(event.key == "ArrowDown" && isArrowDownPressed) {
        clearInterval(interval);
        interval = setInterval(update_figures, 1000);
        isArrowDownPressed = false;
    }
});

// move left right
document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowLeft") {
        active_figure.move_x(-1);
    }else if(event.key == "ArrowRight"){
        active_figure.move_x(1);
    }
});

