function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function figures(star_point){
    // horizontal line
    let cells = [star_point];
    for(let i = 1; i < 4; i++){
        cells.push({x: star_point.x + i, y: star_point.y});
    }

}



var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];

class Figure{
    constructor(){
        this.cells = [figures({x: random(0,9), y: 0})];
        this.color = colors[random(0, colors.length - 1)];
    }
    update(){
        this.cells.forEach(cell => cell.y++);
    }
}


function pruebas(lista){
    lista.forEach(juas => console.log(juas))
}



class Piece {
  constructor() {
    this.cells = [];
  }
}