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