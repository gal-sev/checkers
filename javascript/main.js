window.addEventListener('load', mainFunc);

let game = new Game(true);
let boardData = game.boardData;

function mainFunc() {
    //create the table
    game.createTable(8, 8);
}

function clickedTD(event, x, y) {
    //TODO: add a game finish
    //TODO: think of a way to change the click handling to something nicer?
    let colorSelected = true;
    let prevSelectedPiece = boardData.getPiece(boardData.selected[1], boardData.selected[2]);
    let selectedPiece = boardData.getPiece(x, y);

    //try to move the piece if there was selection before & there isnt a winner
    if (boardData.selected.length !== 0 && !boardData.winner) {
        //get moves of previous select
        let prevMoves = boardData.getMoves(boardData.selected[1], boardData.selected[2]);

        //check if last clicked spot wasnt empty & piece color == turn color
        if(prevMoves.length > 0 && prevSelectedPiece.isWhite === boardData.isWhiteTurn) { //check if clicked spot is a move spot
            for (let i = 0; i < prevMoves[0].length; i+=2) {
                if(prevMoves[0][i] == x && prevMoves[0][i+1] == y) {
                    boardData.movePiece(prevSelectedPiece, x, y);
                    colorSelected = false;
                }
            }

            //check if clicked spot is a eat spot
            for (let i = 0; i < prevMoves[1].length; i+=2) {
                if(prevMoves[1][i] == x && prevMoves[1][i+1] == y) {
                    boardData.eatPiece(prevSelectedPiece, selectedPiece, x, y);
                    colorSelected = false;
                }
            }

        }
        if (selectedPiece !== undefined) {
            if (selectedPiece.isWhite === boardData.isWhiteTurn) {
                game.finishFrame(event.currentTarget, colorSelected, x, y);
            } else {
                //repaint the whole board
                game.finishFrame(event.currentTarget, false, x, y);
            }
        } else { //if the currentTarget is not containing any piece
            game.finishFrame(event.currentTarget, colorSelected, x, y);
        }

    //if there wasnt a selection before
    } else if(boardData.selected.length === 0) {
        if (selectedPiece !== undefined) {
            if (selectedPiece.isWhite === boardData.isWhiteTurn) {
                game.finishFrame(event.currentTarget, true, x, y);
            } else {
                game.finishFrame(event.currentTarget, false, x, y);
            }
        } else { //if the currentTarget is not containing any piece
            game.finishFrame(event.currentTarget, true, x, y);
        }
    }
}