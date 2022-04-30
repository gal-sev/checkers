class BoardData {
    constructor(isWhiteFirst) {
        this.pieces = [];
        this.selected = [];
        this.placePieces();
        this.isWhiteTurn = isWhiteFirst;
        this.winner = false;
    }

    placePieces() {
        //TODO: push pieces into the pieces array
    }
}