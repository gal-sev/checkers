window.addEventListener('load', mainFunc);

let game = new Game(true);
let boardData = game.boardData;

function mainFunc() {
    //create the table
    game.createTable(8, 8);
}

function clickedTD(event, x, y) {
    let colorSelected = true;
    let prevSelectedPiece = boardData.getPiece(boardData.selected[0], boardData.selected[1]);
    let selectedPiece = boardData.getPiece(x, y);
    //get moves of previous select
    let prevMoves = boardData.getMoves(boardData.selected[0], boardData.selected[1]);

    //if last piece can keep eating
    if(boardData.keepPieceEating !== undefined) {
        //check if clicked spot is a eat spot
        if(boardData.isMoveOrEatSpot(x,y, false, prevMoves)) {
            boardData.eatPiece(prevSelectedPiece, x, y);
            colorSelected = false;
        }

        //if didnt eat again: remove keepPieceEating
        if(colorSelected) {
            boardData.keepPieceEating = undefined;
        }

        //check if there is no moves / pieces for the opposite color
        if(boardData.countPiecesByColor(!prevSelectedPiece.isWhite) === 0 || !boardData.teamCanMove(!prevSelectedPiece.isWhite)) {
            boardData.setWinner();
            game.finishGame(prevSelectedPiece.isWhite);
        }
    }   //try to move the piece if there was selection before & there isnt a winner
    else if (boardData.selected.length !== 0 && !boardData.winner) {
        //remove keepPieceEating so it wont continue to happen
        boardData.keepPieceEating = undefined;

        //check if last clicked spot wasnt empty & piece color == turn color
        if(prevMoves.length > 0 && prevSelectedPiece.isWhite === boardData.isWhiteTurn) { 
            //check if clicked spot is a move spot
            if(boardData.isMoveOrEatSpot(x,y, true, prevMoves)) {
                boardData.movePiece(prevSelectedPiece, x, y);
                colorSelected = false;
                boardData.changeTurn();
            }

            //check if clicked spot is a eat spot
            if(boardData.isMoveOrEatSpot(x,y, false, prevMoves)) {
                boardData.eatPiece(prevSelectedPiece, x, y);
                colorSelected = false;
                boardData.changeTurn();
            }

            //check if there is no moves / pieces for the opposite color
            if(boardData.countPiecesByColor(!prevSelectedPiece.isWhite) === 0 || !boardData.teamCanMove(!prevSelectedPiece.isWhite)) {
                boardData.setWinner();
                game.finishGame(prevSelectedPiece.isWhite);
            }
        }
    }
    //finish updating the board display based on click:
    boardData.setSelected(x, y);
    if(boardData.keepPieceEating !== undefined) {
        game.finishFrame(event.currentTarget, true, x, y);
    } else if (selectedPiece !== undefined) {
        //if the selected piece is same color as the current turn:
        if (selectedPiece.isWhite === boardData.isWhiteTurn) {
            game.finishFrame(event.currentTarget, colorSelected, x, y);
        } else {
            game.finishFrame(event.currentTarget, false, x, y);
        }
    } else { //if the currentTarget doesnt contain any piece: repaint the board
        game.finishFrame(event.currentTarget, colorSelected, x, y);
    }
}