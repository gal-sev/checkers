class BoardData {
    constructor(isWhiteFirst) {
        this.pieces = [];
        this.selected = [];
        this.placePieces();
        this.isWhiteTurn = isWhiteFirst;
        this.winner = false;
    }

    pushPiece(x, y, isQueen, isWhite) {
        this.pieces.push(new Piece(x, y, isQueen, isWhite));
    }

    getPiece(x, y) {
        for (const piece of this.pieces) {
            if (piece.x == x && piece.y == y) {
                return piece;
            }
        }
        return undefined;
    }

    removePiece(pieceToRemove) {
        this.pieces.splice(this.pieces.indexOf(pieceToRemove), 1);
    }

    eatPiece(lastSelectedPiece, selectedPiece, x, y) {
        this.removePiece(selectedPiece);
        this.movePiece(lastSelectedPiece, x, y);
    }

    movePiece(lastSelectedPiece, x, y) {
        this.changeTurn();
        lastSelectedPiece.x = x;
        lastSelectedPiece.y = y;
    }

    getMoves(x, y) {
        let output = [];
        //get possible moves for piece
        let piece = this.getPiece(x, y);

        if(piece != undefined) {
            piece.possibleMoves(this.pieces).forEach(move => {
                output.push(move);
            });
        }
        return output;
    }

    changeTurn() {
        if(this.isWhiteTurn) {
            const turn_display = document.getElementById("turn_display");
            turn_display.innerText = "Black's Move";
            turn_display.classList.add('blackMove');
            turn_display.classList.remove('whiteMove');
        } else {
            const turn_display = document.getElementById("turn_display");
            turn_display.innerText = "White's Move";
            turn_display.classList.add('whiteMove');
            turn_display.classList.remove('blackMove');
        }
        this.isWhiteTurn = !this.isWhiteTurn;
    }

    placePieces() {
        /* i loop is to generate the black and white separately
        line loop is to generate the the pieces in 3 lines with an order based on the line
        j loop is pushing the pieces to the right place based on everything before
        i !== 0 is to switch between white and black, i * 5 is to place the lines from the first row or the 5th row */
        for (let i = 0; i < 2; i++) {
            for (let line = 0; line < 3; line++) {
                if(line % 2 === 0) {
                    for (let j = 1 - i; j < 8; j= j + 2) {
                        this.pushPiece(j, i * 5 + line, false, i !== 0);
                    }
                } else {
                    for (let j = 0 + i; j < 8; j= j + 2) {
                        this.pushPiece(j, i * 5 + line, false, i !== 0);
                    }
                }
            }
            
        }
    }

}