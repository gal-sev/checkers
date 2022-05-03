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
    
    changeTurn() {
        this.isWhiteTurn = !this.isWhiteTurn;
    }

    setWinner() {
        this.winner = true;
    }

    setSelected(x, y) {
        this.selected[0] = x;
        this.selected[1] = y;
    }

    //returns general direction between two positions on the same plane
    calcDirection(lastSelectedPiece, x, y) {
        return [this.calcAxisGeneralDir(lastSelectedPiece.x, x), this.calcAxisGeneralDir(lastSelectedPiece.y, y)];
    }

    //returns the general direction between two positions on the same axis
    calcAxisGeneralDir(prevX, x) {
        if(prevX - x > 0) {
            return 1;
        } else if(prevX - x < 0) {
            return -1;
        } else {
            return 0;
        }
    }

    eatPiece(prevSelectedPiece, x, y) {
        //remove the eaten piece
        const directionToEat = this.calcDirection(prevSelectedPiece, x, y);
        this.removePiece(this.getPiece(x + directionToEat[0], y + directionToEat[1]));
        //move the current piece
        this.movePiece(prevSelectedPiece, x, y);
        //change the keep eating status
        this.keepPieceEating = this.canKeepEating(prevSelectedPiece);
    }

    canKeepEating(prevSelectedPiece) {
        //check if there are possible eat spots, if yes then change keepPieceEating
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
        //check every piece of by color if it has any possible moves
        for (const piece of this.pieces) {
            if(piece.isWhite === isWhite) {
                for (const move of piece.possibleMoves(this.pieces, false)) {
                    //if there are any possible moves, return true
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

    //checks if array contains the pos as a move or eat spot (based on isMove)
    isMoveOrEatSpot(x, y, isMove, MovesArr) {
        //isMove = true to check for move spots, false to check for eat spots
        for (let i = 0; i < MovesArr[isMove ? 0 : 1].length; i+=2) {
            if(MovesArr[isMove ? 0 : 1][i] === x && MovesArr[isMove ? 0 : 1][i+1] === y) {
                return true;
            }
        }
        return false;
    }
}