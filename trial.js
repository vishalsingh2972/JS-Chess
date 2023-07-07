const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector("#info-display");
let playerGo = 'black'; 

playerDisplay.textContent = 'black'

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
  SQUARE.addEventListener('dragstart', dragStart) //triggers/comes to action when the user starts dragging an element or text selection 
  SQUARE.addEventListener('dragover', dragOver)   //triggers/comes to action when an element or text selection is being dragged over another element
  SQUARE.addEventListener('drop', dragDrop)       //triggers/comes to action when the user drops an element or text selection on another element
  });

  let startPositionId;
  let draggedElement; 

function dragStart(e){/

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
   
    const valid = CheckIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstElementChild?.classList.contains(opponentGo);
    
    if(correctGo){
      //must check this first
      if(takenByOpponent && valid){ 
        e.target.parentNode.append(draggedElement);
        e.target.remove(); 
        changePlayer();
        return;
      }
      //then check this 
      if(taken && !takenByOpponent){ 
        infoDisplay.textContent = "bhai apne walo ko hi marega kya?"
        setTimeout(() => infoDisplay.textContent = " ", 500);
        return;
      }
      //last if valid basically if dropping in empty square condition
      if(valid){
        e.target.append(draggedElement);
        changePlayer();
        return;
      }
    }
}

function CheckIfValid(target){ 
  const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
  
  const startId = Number(startPositionId); 

  const piece = draggedElement.id;

  console.log('targetId', targetId);
  console.log('startId', startId);
  console.log('piece', piece);
  
}

function changePlayer(){ 
  if(playerGo === 'black'){
    reverseIds();
    playerGo = 'white';
    playerDisplay.textContent = 'white';
  }
  else{ //playerGo === 'white' case
    revertIds();
    playerGo = 'black';
    playerDisplay.textContent = 'black';
  }
}

function reverseIds(){ 
  const allSquares = document.querySelectorAll(".square"); //grab all squares directly 

  allSquares.forEach((Square, index) => {
    Square.setAttribute('square-id', (width * width - 1) - index) //overriding square-id with its reverse or opposite side square-id //so here inside brackets we are telling to replace existing 'square-id' value with  (width * width - 1) - index //(width * width - 1) - index cool shortway to reverse = here  (8 * 8 - 1) - index = 63 - index
  });                                                      
}

function revertIds(){ //shift board back to your own perspective/view
  const allSquares = document.querySelectorAll(".square"); //grabbing all squares directly again  

  allSquares.forEach((square, index) => 
    square.setAttribute('square-id', index));
}

  
  



