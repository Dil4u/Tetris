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


class Piece{
    constructor(){
        this.cells = []
    }

    move(direction){// left: 0, right: 1
        for (let i = 0 ; i < this.cells.length ; i++){
            this.cells[i].x = this.cells[i].x + direction
        }

        this.cells.forEach(cell => cell.x = cell.x + direction)
    }
}



function figures(start_point, number){
    let cells = [];
    
    // horizontal line 3x1
    if (number == 1 && start_point.x < 8){
        for(let i = 0; i < 3; i++){
            cells.push({x: start_point.x + i, y: start_point.y});
        }
    }

    // horizontal line 2x1
    else if (number == 2){
        for(let i = 0; i < 2; i++){
            cells.push({x: start_point.x + i, y: start_point.y});
        }
    }

    // square 2x2
    else if (number == 3){
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < 2; j++){
                cells.push({x: start_point.x + i, y: start_point.y + j});
            }
        }
    }

    // L 
    else if (number == 4){
        for(let i = 0; i < 3; i++){
            cells.push({x: start_point.x, y: start_point.y + i});
        }
        cells.push({x: start_point.x + 1, y: start_point.y + 2});
    }

    // L mirrored
    else if (number == 5){
        for(let i = 0; i < 3; i++){
            cells.push({x: start_point.x + 1, y: start_point.y + i});
        }
        cells.push({x: start_point.x, y: start_point.y + 2});
    }


    // T
    else if (number == 6){
        for(let i = 0; i < 3; i++){
            cells.push({x: start_point.x + i, y: start_point.y});
        }
        cells.push({x: start_point.x + 1, y: start_point.y + 1});
    }



    return cells;


}



var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

class Figure{
    constructor(pos, number){
        this.cells = figures(pos, number);
        this.color = colors[random(0, colors.length - 1)];
        this.left = Math.min(...this.cells.map(cells => cells.x));
        this.right = Math.max(...this.cells.map(cells => cells.x));
        this.calculate_bottom();
        this.active = true;
    }

    calculate_bottom(){
        let lista = [];
        for (let current_x = this.left; current_x < this.right+1; current_x++){
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
            console.log("moving");
            this.cells.forEach(cell => cell.y++); // move down
        }else{
            if (this.active){
                createFigure();
                this.active = false;
            }

        }
    }

    move_x(direction){
        this.cells.forEach(cell => {cell.x = cells + direction;})
    }

    update(){

        this.cells.forEach(cell => {// clear
            matrix.rows[cell.y].cells[cell.x].style.backgroundColor = "black";
        });
        this.move_y(); // calculate new position
        this.calculate_bottom();
        this.cells.forEach(cell => {// draw
            matrix.rows[cell.y].cells[cell.x].style.backgroundColor = this.color;
        });
    }

    rotate(){
    
    }
}

class Line3 extends Figure{
    constructor(){
        super({x: random(0, 7), y: 0}, 1);
        this.state = "horizontal";
        this.center = this.cells[1]
    }

    rotate(){
        if (this.state == "vertical"){
            if (this.center.x == 0){
                this.move(1)
            }else if (this.center.x == 9){
                this.move(-1)
            }
            this.cells[0] = {x: this.center.x - 1, y: this.center.y}
            this.cells[2] = {x: this.center.x + 1, y: this.center.y}
        }else{
            this.cells[0] = {x: this.center.x, y: this.center.y - 1}
            this.cells[2] = {x: this.center.x, y: this.center.y + 1}
        }
        this.calculate_bottom();
    }

}

class Line2 extends Figure{
    constructor(){
        super({x: random(0, 8), y: 0}, 2);
        this.state = 0;
        this.center = this.cells[0];
    }
    rotate(){
        if (this.state == 0){
            this.cells[1] = {x: this.center.x, y: this.center.y + 1};
        }else if (this.state == 1){
            if (this.center.x == 0){
                this.move(1);
            }
            this.cells[1] = {x: this.center.x - 1, y: this.center.y};
        }else if (this.state == 2){
            this.cells[1] = {x: this.center.x, y: this.center.y - 1};
        } else if (this.state == 3){
            if (this.center.x == 9){
                this.move(-1);
            }
            this.cells[1] = {x: this.center.x + 1, y: this.center.y};
        }
        this.calculate_bottom();
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
        this.center = this.cells[1];
    }

    rotate(){
        if (this.state == 0){
            if (this.center.x == 0){
                this.move(1);
            }
            this.cells[0] = {x: this.center.x + 1, y: this.center.y};
            this.cells[2] = {x: this.center.x-1, y: this.center.y};
            this.cells[3] = {x: this.center.x-1, y: this.center.y + 1};
            this.state = 1;
        }else if (this.state == 1){
            this.cells[0] = {x: this.center.x, y: this.center.y + 1};
            this.cells[2] = {x: this.center.x, y: this.center.y -1 };
            this.cells[3] = {x: this.center.x - 1, y: this.center.y - 1};
            this.state == 2;
        }else if (this.state == 2){
            if (this.center.x == 9){
                this.move(-1);
            }
            this.cells[0] = {x: this.center.x - 1, y: this.center.y};
            this.cells[2] = {x: this.center.x + 1, y: this.center.y};
            this.cells[3] = {x: this.center.x + 1, y: this.center.y - 1};
            this.state = 3;
        }else if (this.state == 3){
            this.cells[0] = {x: this.center.x, y: this.center.y - 1};
            this.cells[2] = {x: this.center.x, y: this.center.y + 1};
            this.cells[3] = {x: this.center.x + 1, y: this.center.y + 1};
            this.state = 0;
        }
        this.calculate_bottom();
    }
}

class Lmirrored extends Figure{
    constructor(){
        super({x: random(1, 9), y: 0}, 5);
        this.state = 0;
        this.center = this.cells[1];
    }

    rotate(){
        if (this.state == 0){
            if (this.center.x == 9){
                this.move(-1);
            }
            this.cells[0] = {x: this.center.x + 1, y: this.center.y};
            this.cells[2] = {x: this.center.x - 1, y: this.center.y};
            this.cells[3] = {x: this.center.x - 1, y: this.center.y - 1};
            this.state = 1;
        }else if (this.state == 1){
            this.cells[0] = {x: this.center.x, y: this.center.y + 1};
            this.cells[2] = {x: this.center.x, y: this.center.y - 1};
            this.cells[3] = {x: this.center.x + 1, y: this.center.y - 1};
            this.state = 2;
        }else if (this.state == 2){
            if (this.center.x == 0){
                this.move(1);
            }
            this.cells[0] = {x: this.center.x, y: this.center.y + 1};
            this.cells[2] = {x: this.center.x, y: this.center.y - 1};
            this.cells[3] = {x: this.center.x + 1, y: this.center.y - 1};
            this.state = 3;
        }else if (this.state == 3){
            this.cells[0] = {x: this.center.x - 1, y: this.center.y};
            this.cells[2] = {x: this.center.x + 1, y: this.center.y};
            this.cells[3] = {x: this.center.x + 1, y: this.center.y - 1};
            this.state = 0;
        }
        this.calculate_bottom();
    }
}

class T_piece extends Figure{
    constructor(){
        super({x: random(0, 7), y: 0}, 6);
        this.state = 0;
        this.center = this.cells[1];
    }

    rotate(){
        if (this.state == 0){
            this.cells[2] == {x: this.center.x, y: this.center.y - 1};
            this.state = 1;
        }else if (this.state == 1){
            if (this.center.x == 9){
                this.move(-1);
            }
            this.cells[3] == {x: this.center.x + 1, y: this.center.y};
            this.state = 2;
        }else if (this.state == 2){
            this.cells[0] == {x: this.center.x, y: this.center.y + 1};
            this.state = 3;
        }else if (this.state == 3){
            if (this.center.x == 0){
                this.move(1);
            }
            this.cells[0] == {x: this.center.x - 1, y: this.center.y};
            this.cells[2] == {x: this.center.x + 1, y: this.center.y}
            this.cells[3] == {x: this.center.x, y: this.center.y - 1};
            this.state = 0;
        }
    }
}



var current_figures = [];

function update_figures(){
    console.log("updating figures")
    current_figures.forEach(figure => figure.update());
}


function createFigure(){
    console.log("creating figure")
    current_figures.push(new pieces[random(0, pieces.length - 1)]());

}


var pieces = [Line3, Line2, Square, Lnormal, Lmirrored, T_piece]

createFigure();
setInterval(update_figures, 1000); // update figures every second




