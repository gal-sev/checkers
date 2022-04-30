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
                td.onclick = (e) => {clickedTD(e, j, i)};
                if ((j + i) % 2 != 0) {
                    td.className = "darkSquare";
                } else {
                    td.className = "lightSquare";
                }
            }
        }

        //place pieces pictures on the table
        this.placePictures();
    }

    repaintBoard() {
        const table = document.getElementById("checkers_table");

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                table.rows[y].cells[x].classList.remove('selected');
                table.rows[y].cells[x].classList.remove('moveSpot');
                table.rows[y].cells[x].classList.remove('eatSpot');
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
}