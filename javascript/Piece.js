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
    //TODO: change the cell check so if you find an enemy cell search the one behind and if not put move spot
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
                    //TODO: mark the eatable piece like this probably?:
                    // if(!canEat) {
                    //     this.pushPos(markedPos, x_move, y_move);
                    // }
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
            // console.log((this.x + x_move) + " " + (this.y + y_move) + " position out of bounds");
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

    getNeighborMovesInDirection(x_multiplier, y_multiplier, pieces, movesPos, eatPos) {
        //x,y multipliers => -1 = move negative | 0 = dont move | 1 = move positive
        //if there's an eatable piece:
        if(this.detectionHandler(pieces, movesPos, eatPos, false , x_multiplier, y_multiplier) === 1) {
            //place an eatPos behind it if possible
            this.detectionHandler(pieces, movesPos, eatPos, true, x_multiplier + 1 * x_multiplier, y_multiplier + 1 * y_multiplier);
        }
    }

    getFullMovesInDirection(loop_length, x_multiplier, y_multiplier, pieces, movesPos, eatPos) {
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

    getPawnsPosMoves(pieces, movesPos, eatPos) {
        if(this.isWhite) {
            // -x -y (diag up left)
            this.getNeighborMovesInDirection(-1, -1, pieces, movesPos, eatPos);
            // -x -y (diag up right)
            this.getNeighborMovesInDirection(1, -1, pieces, movesPos, eatPos);
        } else {
            // +x +y (diag down right)
            this.getNeighborMovesInDirection(1, 1, pieces, movesPos, eatPos);
            // -x +y (diag down left)
            this.getNeighborMovesInDirection(-1, 1, pieces, movesPos, eatPos);
        }
    }

    getQueenPosMoves(pieces, movesPos, eatPos) {
        if(this.y < 7 && this.x < 7) {
            // +x +y (diag down right)
            this.getFullMovesInDirection(Math.min(8 - this.x, 8 - this.y), 1, 1, pieces, movesPos, eatPos);
        }
        if(this.y < 7 && this.x > 0) {
            // -x +y (diag down left)
            this.getFullMovesInDirection(Math.min(this.x, 8 - (this.y+1)) + 1, -1, 1, pieces, movesPos, eatPos);
        }
        if(this.y > 0 && this.x > 0) {
            // -x -y (diag up left)
            this.getFullMovesInDirection(Math.min(this.x, this.y) + 1, -1, -1, pieces, movesPos, eatPos);
        }
        if(this.y > 0 && this.x < 7) {
            // -x -y (diag up right)
            this.getFullMovesInDirection(Math.min(8 - this.x, this.y+1), 1, -1, pieces, movesPos, eatPos);
        }
    }
}
