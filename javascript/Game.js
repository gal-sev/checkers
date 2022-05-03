class Game {
    constructor(isWhiteFirst) {
        this.boardData = new BoardData(isWhiteFirst);
    }

    createTable(numOfRows, numOfColumns) {
        const body = document.body;
        const table = document.createElement('table');
        table.id = "checkers_table";
    
        body.appendChild(table);
        for (let i = 0; i < numOfRows; i++) {
            const tr = table.insertRow(i);
    
            for (let j = 0; j < numOfColumns; j++) {
                const td = tr.insertCell(j);
                if(i == 0) { //(first row - a to h)
                    const positionElement = document.createElement('h6');
                    positionElement.innerText = String.fromCharCode(65 + j); //65 is A in ascii
                    positionElement.classList.add('positionElementLetter');
                    td.appendChild(positionElement);
                }
                if(j == 0) { //(first column - 1 to 8)
                    const positionElement = document.createElement('h6');
                    positionElement.innerText = i + 1;
                    positionElement.classList.add('positionElementNumber');
                    td.appendChild(positionElement);
                }
                
                if ((j + i) % 2 != 0) {
                    td.className = "darkSquare";
                    td.onclick = (e) => {clickedTD(e, j, i)};
                } else {
                    td.className = "lightSquare";
                }
            }
        }
        //place the pieces pictures and update the turn display based on who's first
        this.placePictures();
        this.updateTurnDisplay();
    }

    repaintBoard() {
        const table = document.getElementById("checkers_table");

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                table.rows[y].cells[x].classList.remove('selected');
                table.rows[y].cells[x].classList.remove('moveSpot');
                table.rows[y].cells[x].classList.remove('eatSpot');
                table.rows[y].cells[x].classList.remove('dangerSpot');
                table.rows[y].cells[x].style.backgroundImage = "";
            }
        }

        this.placePictures();
    }

    placePictures() {
        const table = document.getElementById("checkers_table");
        this.boardData.pieces.forEach(piece => {
            table.rows[piece.y].cells[piece.x].style.backgroundImage = "url(assets/" + piece.getImg() + ".png)";
        });
    }

    showMoves(x, y) {
        let posMoves = this.boardData.getMoves(x,y);
        const table = document.getElementById("checkers_table");
        //if there are moves, paint them on the board
        if(posMoves.length > 0) {
            //possible moves
            for (let i = 0; i < posMoves[0].length; i+=2) {
                table.rows[posMoves[0][i + 1]].cells[posMoves[0][i]].classList.add('moveSpot');
            }
            
            //eat moves
            for (let i = 0; i < posMoves[1].length; i+=2) {
                table.rows[posMoves[1][i + 1]].cells[posMoves[1][i]].classList.add('eatSpot');
                //calc direction from click to move pos to mark the spot between
                const directionToEat = this.boardData.calcDirection(this.boardData.getPiece(x, y), posMoves[1][i], posMoves[1][i + 1]);
                table.rows[posMoves[1][i + 1] + directionToEat[1]].cells[posMoves[1][i] + directionToEat[0]].classList.add('dangerSpot');
            }
        }
    }

    finishFrame(currentTarget, paintSelected, x, y) {
        //repaint the whole board and update the turn display
        this.repaintBoard();
        this.updateTurnDisplay();

        if(paintSelected) {
            //color the current selected pixel
            currentTarget.classList.add('selected');
                
            //paint possible moves for selected piece
            this.showMoves(x, y);
        }
    }

    finishGame(isWhiteWinner) {
        const table = document.getElementById("checkers_table");
        const winnerPopup = document.createElement('div');
        table.appendChild(winnerPopup);
        winnerPopup.classList.add("winnerPopup");

        if(isWhiteWinner) { 
            winnerPopup.innerText = "White is the winner!";
            winnerPopup.style.color = "white";
        } else {
            winnerPopup.innerText = "Black is the winner!";
            winnerPopup.style.color = "black";
        }
        this.animateTable(this, 0, 0, 7, 7);
    }

    animateTable(game, x, y, x2, y2) {
        //repaint the whole board
        game.repaintBoard();
        
        const table = document.getElementById("checkers_table");
        table.rows[y].cells[x].classList.add('selected');
        table.rows[y2].cells[x2].classList.add('selected');

        //reset the selectors when at end of board
        if(x === 7 && y === 7) {
            x2 = 7;
            y2 = 7;
            x = 0;
            y = 0;
        }
        //continue in x direction
        if(x < 7) { 
            x2--;
            x++;
        } else { //continue in y direction, reset x
            x2 = 7;
            x = 0;
            y++;
            y2--;
        }

        //call the same function with a timeout
        setTimeout(() => {this.animateTable(game, x, y, x2, y2);}, 80);
    }

    updateTurnDisplay() {
        const turnDisplay = document.getElementById("turn_display");
        if(this.boardData.keepPieceEating !== undefined) {
            //if player can keep eating and its white turn (it will be the extra move):
            if(this.boardData.isWhiteTurn) {
                turnDisplay.innerText = "Black's Extra Move";
                turnDisplay.classList.add('blackTurnDisplay');
                turnDisplay.classList.remove('whiteTurnDisplay');
            } else {
                turnDisplay.innerText = "White's Extra Move";
                turnDisplay.classList.add('whiteTurnDisplay');
                turnDisplay.classList.remove('blackTurnDisplay');
            }
        } else {
            if(!this.boardData.isWhiteTurn) {
                turnDisplay.innerText = "Black's Move";
                turnDisplay.classList.add('blackTurnDisplay');
                turnDisplay.classList.remove('whiteTurnDisplay');
            } else {
                turnDisplay.innerText = "White's Move";
                turnDisplay.classList.add('whiteTurnDisplay');
                turnDisplay.classList.remove('blackTurnDisplay');
            }
        }
    }
}