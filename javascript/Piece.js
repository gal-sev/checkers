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

    possibleMoves(pieces, isContinuous) {
        let movesPos = [];
        let eatPos = [];
        //if here is so queen will be able to eat only nearby on continuous turns
        if(this.isQueen && !isContinuous) {
            this.getQueenPosMoves(pieces, movesPos, eatPos);
        } else {
            this.getPawnsPosMoves(pieces, movesPos, eatPos, isContinuous);
        }

        if(eatPos.length > 0) {
            movesPos = []; //empty the possible moves so the player could only eat
        }

        return [movesPos, eatPos];
    }

    pushPos(arr, x_move, y_move) {
        arr.push(this.x + x_move);
        arr.push(this.y + y_move);
    }

    detectionHandler(pieces, movesPos, eatPos, canEat, x_move, y_move) {
        if(this.x + x_move >= 0 && this.x + x_move < 8 && this.y + y_move >= 0 && this.y + y_move < 8) {
            switch (this.isEmpty(pieces, this.x + x_move, this.y + y_move)) {
                case 0:
                    if(canEat) { //adds the on eat pos only when passed something to eat
                        this.pushPos(eatPos, x_move, y_move);
                    } else {
                        this.pushPos(movesPos, x_move, y_move);
                    }
                    return 0;
                case 1:
                    //returns 1 because its an eatable piece
                    return 1;
                case 2:
                    //nothing because its the same color
                    return 2;
                default:
                    console.log('isEmpty out of bounds');
                    return 2;
            }
        } else {
            return 2;
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
        let foundFood = false;
        for (let i = 1; i < loop_length; i++) {
            const detection = this.detectionHandler(pieces, movesPos, eatPos, foundFood , i * x_multiplier, i * y_multiplier);
            if(detection === 2) {
                break;
            } else if(detection === 0 && !this.isQueen) { //if its not a queen its a move spot
                break;
            } else if(detection === 1 && !foundFood) {
                foundFood = true;
                this.detectionHandler(pieces, movesPos, eatPos, foundFood, i * x_multiplier + 1 * x_multiplier, i * y_multiplier + 1 * y_multiplier);
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
        //leaving ifs here for performance but it will work without them too
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
