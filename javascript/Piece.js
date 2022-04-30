class Piece {
    constructor(x, y, isQueen, isWhite) {
        this.x = x;
        this.y = y;
        this.isQueen = isQueen;
        this.isWhite = isWhite;
    }

    getImg() {
        let output = "";
        if(this.isQueen) {
            output = "q";
        } else {
            output = "p";
        }
        if(this.isWhite) {
            return output + "w";
        } else {
            return output + "b";
        }
    }

    //TODO: make the moves checkers like so you can press the cell behind the piece to eat it instead of the chess way
    possibleMoves(pieces) {
        let movesPos = [];
        let eatPos = [];
        if(this.isQueen) {
            this.getQueenPosMoves(pieces, movesPos, eatPos);
        } else {
            this.getPawnsPosMoves(pieces, movesPos, eatPos);
        }

        return [movesPos, eatPos];
    }

    pushPos(arr, x_move, y_move) {
        arr.push(this.x + x_move);
        arr.push(this.y + y_move);
    }

    detectionHandler(pieces, movesPos, eatPos, x_move, y_move) {
        switch (this.isEmpty(pieces, this.x + x_move, this.y + y_move)) {
            case 0:
                this.pushPos(movesPos, x_move, y_move);
                return false;
            case 1:
                this.pushPos(eatPos, x_move, y_move);
                return true;
            case 2:
                //nothing because its the same color
                return true;
            default:
                console.log('isEmpty out of bounds');
                return true;
        }
    }

    isEmpty(pieces, x, y) {
        for (const piece of pieces) {
            if(piece.x == x && piece.y == y) {
                if (piece.isWhite == this.isWhite) {
                    return 2; //same color
                }
                return 1; //other color piece
            }
        }
        return 0; //empty
    }

    getMovesInDirection(loop_length, x_multiplier, y_multiplier, pieces, movesPos, eatPos) {
        //x,y multipliers => -1 = move negative | 0 = dont move | 1 = move positive
        for (let i = 1; i < loop_length; i++) { 
            if(this.detectionHandler(pieces, movesPos, eatPos, i * x_multiplier, i * y_multiplier)) {
                break;
            } 
        }
    }

    getPawnsPosMoves(pieces, movesPos, eatPos) {
        if(this.isWhite) {
            if(this.y > 0 && this.x > 0) {
                // -x -y (diag up left)
                this.getMovesInDirection(2, -1, -1, pieces, movesPos, eatPos);
            }
            if(this.y > 0 && this.x < 7) {
                // -x -y (diag up right)
                this.getMovesInDirection(2, 1, -1, pieces, movesPos, eatPos);
            }
        } else {
            if(this.y < 7 && this.x < 7) {
                // +x +y (diag down right)
                this.getMovesInDirection(2, 1, 1, pieces, movesPos, eatPos);
            }
            if(this.y < 7 && this.x > 0) {
                // -x +y (diag down left)
                this.getMovesInDirection(2, -1, 1, pieces, movesPos, eatPos);
            }
        }
    }

    getQueenPosMoves(pieces, movesPos, eatPos) {
        if(this.y < 7 && this.x < 7) {
            // +x +y (diag down right)
            this.getMovesInDirection(Math.min(8 - this.x, 8 - this.y), 1, 1, pieces, movesPos, eatPos);
        }
        if(this.y < 7 && this.x > 0) {
            // -x +y (diag down left)
            this.getMovesInDirection(Math.min(this.x, 8 - (this.y+1)) + 1, -1, 1, pieces, movesPos, eatPos);
        }
        if(this.y > 0 && this.x > 0) {
            // -x -y (diag up left)
            this.getMovesInDirection(Math.min(this.x, this.y) + 1, -1, -1, pieces, movesPos, eatPos);
        }
        if(this.y > 0 && this.x < 7) {
            // -x -y (diag up right)
            this.getMovesInDirection(Math.min(8 - this.x, this.y+1), 1, -1, pieces, movesPos, eatPos);
        }
    }
}
