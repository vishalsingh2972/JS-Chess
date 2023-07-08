const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector("#info-display");
let playerGo = 'black'; 

playerDisplay.textContent = 'black';

const width = 8;
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook,
];

function createBoard(){
    startPieces.forEach((startPiece, index) => { 
      const square = document.createElement('div');
      square.classList.add('square'); 
      square.innerHTML = startPiece;

      square.firstChild?.setAttribute('draggable', true);

      square.setAttribute('square-id', index); 

      const row = Math.floor((63 - index) / 8) + 1; 
      if(row % 2 === 0){
        square.classList.add(index % 2 === 0 ? 'beige' : 'green');
      }
      else{
        square.classList.add(index % 2 === 0 ? 'green' : 'beige');
      }

      if(index <= 15){
        square.firstElementChild.firstElementChild.classList.add('black');
      }

      if(index >= 48){
        square.firstElementChild.firstElementChild.classList.add('white');
      }
      gameBoard.append(square);                       
    })
}
createBoard();

const allSquares = document.querySelectorAll("#gameboard .square"); 

allSquares.forEach(SQUARE => {
  SQUARE.addEventListener('dragstart', dragStart); 
  SQUARE.addEventListener('dragover', dragOver);  
  SQUARE.addEventListener('drop', dragDrop);       
  });

  let startPositionId;
  let draggedElement; 

function dragStart(e){
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement =  e.target;   
}

function dragOver(e){
  e.preventDefault(); 
}

function dragDrop(e){ 
    e.stopPropagation();
    const correctGo = draggedElement.firstElementChild.classList.contains(playerGo); 
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstElementChild?.classList.contains(opponentGo);
  
    if(correctGo){
     
      if(takenByOpponent && valid){
        e.target.parentNode.append(draggedElement); 
        e.target.remove(); 
        checkForWin();
        changePlayer();
        return; 
      }
      
      if(taken && !takenByOpponent){
        infoDisplay.textContent = "bhai apne walo ko hi marega kya?"
        setTimeout(() => infoDisplay.textContent = " ", 500);
        return; 
      }
      
      if(valid){
        e.target.append(draggedElement);  
        checkForWin();
        changePlayer();
        return; 
      }
    }
}

function checkIfValid(target){ 
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    
    const startId = Number(startPositionId); 

    const piece = draggedElement.id;

    console.log('piece', piece); 
    console.log('startId', startId); 
    console.log('targetId', targetId); 

    switch(piece){
        case 'pawn' : 
            const starterRow = [8,9,10,11,12,13,14,15];
          if(starterRow.includes(startId) && startId + width * 2 === targetId || 
               startId + width === targetId ||
               startId + width - 1 === targetId && document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
               startId + width + 1 === targetId && document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild
          )   { 
              return true; 
              }
        break; 

        case 'rook' :
            if(
              startId + width === targetId ||
              startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
              startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild || 
              startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild ||
              startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild ||
              startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild ||
              startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`).firstChild || 
              // -- 
              startId - width === targetId ||
              startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
              startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild || 
              startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild ||
              startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild ||
              startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild ||
              startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`).firstChild ||
              // -- 
              startId + 1 === targetId ||
              startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
              startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild || 
              startId + 4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild ||
              startId + 5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild ||
              startId + 6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild ||
              startId + 7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild ||
              // -- 
              startId - 1 === targetId ||
              startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
              startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild || 
              startId - 4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild ||
              startId - 5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild ||
              startId - 6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild ||
              startId - 7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild 
            ) {
              return true;
              }
        break;

        case 'knight' :
           if(
              startId + width * 2 + 1 === targetId ||
              startId + width * 2 - 1 === targetId ||
              startId + width - 2 === targetId ||
              startId + width + 2 === targetId ||

              startId - width * 2 + 1 === targetId ||
              startId - width * 2 - 1 === targetId ||
              startId - width - 2 === targetId ||
              startId - width + 2 === targetId 
           )  {
              return true;
              }
        break;

        case 'bishop' :
           if(
              startId + width + 1 === targetId ||
              startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
              startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild ||
              startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild ||
              startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild ||
              startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild ||
              startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 6 + 6}"]`).firstChild ||
              // --
              startId - width - 1 === targetId ||
              startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild ||
              startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild ||
              startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
              startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
              startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
              startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild ||
              // --
              startId - width + 1 === targetId ||
              startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild ||
              startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild ||
              startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild ||
              startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild ||
              startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild ||
              startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6}"]`).firstChild ||
              // --
              startId + width - 1 === targetId ||
              startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
              startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild ||
              startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
              startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
              startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
              startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild 
           )  {
              return true;
              }
        break;

        case 'queen' :
           if(
              startId + width + 1 === targetId ||
              startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
              startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild ||
              startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild ||
              startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild ||
              startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild ||
              startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 2 + 2}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 3 + 3}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 4 + 4}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 5 + 5}"]`).firstChild && document.querySelector(`[square-id = "${startId + width * 6 + 6}"]`).firstChild ||
              // --
              startId - width - 1 === targetId ||
              startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild ||
              startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild ||
              startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
              startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
              startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
              startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild ||
              // --
              startId - width + 1 === targetId ||
              startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild ||
              startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild ||
              startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild ||
              startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild ||
              startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild ||
              startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6}"]`).firstChild ||
              // --
              startId + width - 1 === targetId ||
              startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
              startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild ||
              startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild ||
              startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild ||
              startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild ||
              startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6}"]`).firstChild ||
              // --
              // --
              startId + width === targetId ||
              startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
              startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild || 
              startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild ||
              startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild ||
              startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild ||
              startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`).firstChild || 
              // -- 
              startId - width === targetId ||
              startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
              startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild || 
              startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild ||
              startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild ||
              startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild ||
              startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`).firstChild ||
              // -- 
              startId + 1 === targetId ||
              startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
              startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild || 
              startId + 4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild ||
              startId + 5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild ||
              startId + 6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild ||
              startId + 7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild ||
              // -- 
              startId - 1 === targetId ||
              startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
              startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild || 
              startId - 4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild ||
              startId - 5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild ||
              startId - 6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild ||
              startId - 7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild 
           ) {
              return true;
             }
        break;  
        
        case 'king' :
           if(
              startId + 1 === targetId ||
              startId - 1 === targetId ||
              startId + width === targetId ||
              startId - width === targetId ||
              startId + width - 1 === targetId ||
              startId + width + 1 === targetId ||
              startId - width - 1 === targetId ||
              startId - width + 1 === targetId 
           ) {
              return true;
             }
    }
}

function changePlayer(){ 
  if(playerGo === 'black'){
    reverseIds();
    playerGo = 'white';
    playerDisplay.textContent = 'white';
  }
  else{ 
    revertIds();
    playerGo = 'black';
    playerDisplay.textContent = 'black';
  }
}

function reverseIds(){ 
  const allSquares = document.querySelectorAll(".square"); 

  allSquares.forEach((Square, index) => {
    Square.setAttribute('square-id', (width * width - 1) - index); 
  });                                                      
}

function revertIds(){ 
  const allSquares = document.querySelectorAll(".square");

  allSquares.forEach((square, index) => 
    square.setAttribute('square-id', index));
}

function checkForWin(){
  const kings = Array.from(document.querySelectorAll("#king"));
  console.log(kings);
  if (!kings.some(king => king.firstElementChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Black player WINS!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some(king => king.firstElementChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "White player WINS!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}
