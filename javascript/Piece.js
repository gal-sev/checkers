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
    
    pushPos(arr, xMove, yMove) {
        arr.push(this.x + xMove);
        arr.push(this.y + yMove);
    }

    // Checks if the position is empty or contains anything
    posContainsPiece(pieces, x, y) {
        for (const piece of pieces) {
            if(piece.x == x && piece.y == y) {
                if (piece.isWhite == this.isWhite) {
                    return 2; // Same color
                }
                return 1; // Other color piece
            }
        }
        return 0; // Empty
    }

    possibleMoves(pieces, isContinuousMove) {
        let movesPos = [];
        let eatPos = [];
        // The if here is so the queen will be able to eat only nearby pieces on continuous turns
        if(this.isQueen && !isContinuousMove) {
            this.getQueenPosMoves(pieces, movesPos, eatPos);
        } else {
            this.getPawnsPosMoves(pieces, movesPos, eatPos, isContinuousMove);
        }

        // If there is an eat spot: empty the possible moves so the player could only eat
        if(eatPos.length > 0) {
            movesPos = []; 
        }

        return [movesPos, eatPos];
    }

    detectionHandler(pieces, movesPos, eatPos, canEat, xMove, yMove) {
        // If in bounds of board:
        if(this.x + xMove >= 0 && this.x + xMove < 8 && this.y + yMove >= 0 && this.y + yMove < 8) {
            switch (this.posContainsPiece(pieces, this.x + xMove, this.y + yMove)) {
                case 0:
                    // Pos is empty so if we passed something to eat(canEat): push eat pos, else push move pos
                    if(canEat) {
                        this.pushPos(eatPos, xMove, yMove);
                    } else {
                        this.pushPos(movesPos, xMove, yMove);
                    }
                    return 0;
                case 1:
                    // Return 1 because its an eatable piece
                    return 1;
                case 2:
                    // Return 2 because its the same color, does nothing
                    return 2;
                default:
                    console.log('posContainsPiece out of bounds');
                    return 2;
            }
        } else {
            return 2;
        }
    }

    getMovesInDirection(loopLength, xMultiplier, yMultiplier, pieces, movesPos, eatPos) {
        // x,y multipliers => -1 is move negative | 0 is dont move | 1 is move positive
        for (let i = 1; i < loopLength; i++) {
            const detection = this.detectionHandler(pieces, movesPos, eatPos, false , i * xMultiplier, i * yMultiplier);
            if(detection === 2) { 
                // Out of bounds or same color
                break;
            } else if(detection === 0 && !this.isQueen) { 
                // Not a queen and its a move spot
                break;
            } else if(detection === 1) {
                // Detected enemy piece, check the cell behind it
                this.detectionHandler(pieces, movesPos, eatPos, true, i * xMultiplier + 1 * xMultiplier, i * yMultiplier + 1 * yMultiplier);
                break;
            }
        }
    }

    getPawnsPosMoves(pieces, movesPos, eatPos, isContinuous) {
        // Array directions: [up left, up right, down right, down left]
        let posDirections = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        for (let i = 0; i < posDirections.length; i++) {
            if(!this.isWhite && i == 0 && !isContinuous) {
                i = 2;
            } else if (this.isWhite && i == 2 && !isContinuous) {
                break;
            }
            this.getMovesInDirection(2, posDirections[i][0], posDirections[i][1], pieces, movesPos, eatPos);
        }
    }

    getQueenPosMoves(pieces, movesPos, eatPos) {
        // Leaving ifs here for performance but it will work without them too (checks if its in bound)
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
