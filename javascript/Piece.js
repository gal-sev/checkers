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
    
    pushPos(arr, x_move, y_move) {
        arr.push(this.x + x_move);
        arr.push(this.y + y_move);
    }

    //checks if the position is empty or contains anything
    posContainsPiece(pieces, x, y) {
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

    possibleMoves(pieces, isContinuousMove) {
        let movesPos = [];
        let eatPos = [];
        //the if here is so the queen will be able to eat only nearby pieces on continuous turns
        if(this.isQueen && !isContinuousMove) {
            this.getQueenPosMoves(pieces, movesPos, eatPos);
        } else {
            this.getPawnsPosMoves(pieces, movesPos, eatPos, isContinuousMove);
        }

        //if there is an eat spot: empty the possible moves so the player could only eat
        if(eatPos.length > 0) {
            movesPos = []; 
        }

        return [movesPos, eatPos];
    }

    detectionHandler(pieces, movesPos, eatPos, canEat, x_move, y_move) {
        //if in bounds of board:
        if(this.x + x_move >= 0 && this.x + x_move < 8 && this.y + y_move >= 0 && this.y + y_move < 8) {
            switch (this.posContainsPiece(pieces, this.x + x_move, this.y + y_move)) {
                case 0:
                    //pos is empty so if we passed something to eat(canEat): push eat pos, else push move pos
                    if(canEat) {
                        this.pushPos(eatPos, x_move, y_move);
                    } else {
                        this.pushPos(movesPos, x_move, y_move);
                    }
                    return 0;
                case 1:
                    //returns 1 because its an eatable piece
                    return 1;
                case 2:
                    //returns 2 because its the same color, does nothing
                    return 2;
                default:
                    console.log('posContainsPiece out of bounds');
                    return 2;
            }
        } else {
            return 2;
        }
    }

    getMovesInDirection(loop_length, x_multiplier, y_multiplier, pieces, movesPos, eatPos) {
        //x,y multipliers => -1 is move negative | 0 is dont move | 1 is move positive
        for (let i = 1; i < loop_length; i++) {
            const detection = this.detectionHandler(pieces, movesPos, eatPos, false , i * x_multiplier, i * y_multiplier);
            if(detection === 2) { 
                //out of bounds or same color
                break;
            } else if(detection === 0 && !this.isQueen) { 
                //if its not a queen and its a move spot
                break;
            } else if(detection === 1) {
                //if it detected enemy piece, check the cell behind it
                this.detectionHandler(pieces, movesPos, eatPos, true, i * x_multiplier + 1 * x_multiplier, i * y_multiplier + 1 * y_multiplier);
                break;
            }
        }
    }

    getPawnsPosMoves(pieces, movesPos, eatPos, isContinuous) {
        if(isContinuous) {
            // -x -y (diag up left)
            this.getMovesInDirection(2, -1, -1, pieces, movesPos, eatPos);
            // -x -y (diag up right)
            this.getMovesInDirection(2, 1, -1, pieces, movesPos, eatPos);
            // +x +y (diag down right)
            this.getMovesInDirection(2, 1, 1, pieces, movesPos, eatPos);
            // -x +y (diag down left)
            this.getMovesInDirection(2, -1, 1, pieces, movesPos, eatPos);
        } else if(this.isWhite) {
            // -x -y (diag up left)
            this.getMovesInDirection(2, -1, -1, pieces, movesPos, eatPos);
            // -x -y (diag up right)
            this.getMovesInDirection(2, 1, -1, pieces, movesPos, eatPos);
        } else {
            // +x +y (diag down right)
            this.getMovesInDirection(2, 1, 1, pieces, movesPos, eatPos);
            // -x +y (diag down left)
            this.getMovesInDirection(2, -1, 1, pieces, movesPos, eatPos);
        }
    }

    getQueenPosMoves(pieces, movesPos, eatPos) {
        //leaving ifs here for performance but it will work without them too (checks if its in bound)
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
