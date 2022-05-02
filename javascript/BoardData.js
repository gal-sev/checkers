class BoardData {
    constructor(isWhiteFirst) {
        this.pieces = [];
        this.selected = [];
        this.placePieces();
        this.isWhiteTurn = isWhiteFirst;
        this.winner = false;
        this.keepPieceEating = undefined;
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

    //returns general direction between two positions on the same plane
    calcDirection(lastSelectedPiece, x, y) {
        return [this.calcAxisGeneralDir(lastSelectedPiece.x, x), this.calcAxisGeneralDir(lastSelectedPiece.y, y)];
    }

    //returns the general direction between two positions on the same axis
    calcAxisGeneralDir(prev_x, x) {
        if(prev_x - x > 0) {
            return 1;
        } else if(prev_x - x < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    eatPiece(prevSelectedPiece, x, y) {
        const directionToEat = this.calcDirection(prevSelectedPiece, x, y);
        this.removePiece(this.getPiece(x + directionToEat[0], y + directionToEat[1]));
        this.movePiece(prevSelectedPiece, x, y);
        this.keepPieceEating = this.canKeepEating(prevSelectedPiece);
    }

    canKeepEating(prevSelectedPiece) {
        //for every move check if piece can eat, if yes then change keepPieceEating
        let posMoves = this.getMoves(prevSelectedPiece.x, prevSelectedPiece.y, true);
        if(posMoves.length > 0 && posMoves[1].length > 0) {
            return prevSelectedPiece;
        }
        return undefined;
    }

    movePiece(prevSelectedPiece, x, y) {
        prevSelectedPiece.x = x;
        prevSelectedPiece.y = y;
        //promote the piece to a queen
        if((prevSelectedPiece.isWhite && y === 0) || (!prevSelectedPiece.isWhite && y === 7)) {
            prevSelectedPiece.isQueen = true;
        }
    }

    countPiecesByColor(isWhite) {
        let counter = 0;
        for (const piece of this.pieces) {
            if(piece.isWhite === isWhite) {
                counter++;
            }
        }
        return counter;
    }

    teamCanMove(isWhite) {
        for (const piece of this.pieces) {
            if(piece.isWhite === isWhite) {
                for (const move of piece.possibleMoves(this.pieces, false)) {
                    if(move.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getMoves(x, y, overrideKeepEating = false) {
        let output = [];
        //get possible moves for piece
        let piece = this.getPiece(x, y);
        if(piece != undefined) {
            piece.possibleMoves(this.pieces, this.keepPieceEating !== undefined || overrideKeepEating).forEach(move => {
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