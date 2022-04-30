window.addEventListener('load', mainFunc);

let game = new Game(true);
let boardData = game.boardData;

function mainFunc() {
    //create the table
    game.createTable(8, 8);
}

function clickedTD(event, x, y) {
    //TODO: add click handling
}