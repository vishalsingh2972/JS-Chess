const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector("#info-display");
let playerGo = 'black'; //playerTurn //starting game with black's turn

//console.log(playerDisplay.textContent);
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
    startPieces.forEach((startPiece, index) => { //startPiece is parameter for accessing each element of startPieces array 
      const square = document.createElement('div');  //document.createElement('tagname') property ---> here writing document.createElement('div') in js creates a new div in the connected html file
      square.classList.add('square'); //classList.add() method is used to add a CSS class to an element, allowing you to apply styles and make changes to the element using CSS //and here 'square' is the class name that is used as selector in CSS to apply styles to the element. 
                                      //'square' for setting dimensions of all small squares
      square.innerHTML = startPiece;

      // console.log(square.firstElementChild);
      // console.log(square.firstChild);

//if square has first child i.e if piece present in square make it draggable
      //square.firstChild && square.firstChild.setAttribute('draggable', true); //if left falsy then right won't get evaluated - short circuit
      square.firstChild?.setAttribute('draggable', true); //shorter form for above wala

      square.setAttribute('square-id', index); //like document.createElement allows us to create html elements dynamically via js similarly .setAttribute helps us change the properties or basically make changes inside html elements via js //The setAttribute() method can be used to modify the attributes of any HTML element, whether it was created dynamically using document.createElement() or obtained from the DOM using methods like document.querySelector() //When I mention "obtained from the DOM," it means accessing HTML elements in JavaScript and treating them as objects
                                              //so here we have set a 'square-id' for each element as it loops thorugh the array and the value of that 'square-id' for each element is set to its index value

      const row = Math.floor((63 - index) / 8) + 1; //index startion from 0 to 63
      if(row % 2 === 0){
        square.classList.add(index % 2 === 0 ? 'beige' : 'green');
      }
      else{
        square.classList.add(index % 2 === 0 ? 'green' : 'beige');
      }

      if(index <= 15){
        square.firstElementChild.firstElementChild.classList.add('black');//square class first child is piece class, piece class first child is svg
      }

      if(index >= 48){
        square.firstElementChild.firstElementChild.classList.add('white');
      }
      gameBoard.append(square);//at each loop we are putting these small squares onto out gameBoard                           
    })
}
createBoard();

//Grab every square
const allSquares = document.querySelectorAll("#gameboard .square"); //document.querySelectorAll("#gameboard .square") - so what this does is look in the document for an element with the id gameboard and then inside gameboard grab every element with the class name square // In JS, the document object represents the entire webpage 
//const allSquares = document.querySelectorAll(".square"); //you can also do this directly - grab every element with the class name "square"

//console.log(allSquares);

allSquares.forEach(SQUARE => {
  SQUARE.addEventListener('dragstart', dragStart) //triggers/comes to action when the user starts dragging an element or text selection 
  SQUARE.addEventListener('dragover', dragOver)   //triggers/comes to action when an element or text selection is being dragged over another element
  SQUARE.addEventListener('drop', dragDrop)       //triggers/comes to action when the user drops an element or text selection on another element
  });

  let startPositionId;
  let draggedElement; 

function dragStart(e){//here e will store data of the piece that is being dragged
   //e.preventDefault(); //will prevent default behavior of dragstart or disable dragging of the element (default behaviour of dragstart is to enable dragging of the element)

    //console.log(e); //will print all data of the dragged piece
    
    //console.log(e.srcElement); //deprecated not good practise to use
    //console.log(e.target); //recommended 
    //console.log(e.target.parentNode);
//getAttribute is used to retrieve the value of a specific HTML attribute of an element
       //console.log(e.target.getAttribute('id')); //"piece that we are picking"
       //console.log(e.target.parentNode.getAttribute('square-id'));

       startPositionId = e.target.parentNode.getAttribute('square-id');
       //console.log(startPositionId);
       draggedElement =  e.target;
      //  console.log(e.target);
      //  console.log(draggedElement);
       
}

function dragOver(e){
  e.preventDefault(); //When you call e.preventDefault() , it instructs the browser to override the default behavior and allow the drop operation. This allows the element to become a valid drop target for the dragged content.
                      //default behaviour - In the context of the dragover, the default behavior typically involves disallowing the dropping of content onto an element. By default, most elements do not allow dropping content on them.

}

function dragDrop(e){ //can drop directly into empty squares but for filled squares we don't want to drop in the "piece" class or the svg or the path etc, our aim here is to drop it in the square class itself
   e.stopPropagation(); //e.stopPropagation() method is used to stop the further propagation of the current event //once a piece is dropped stop this particular event and avoid funky behavior(If the e.stopPropagation() method is not called, then the parent element (parent of piece = square class) will also go with the "piece" class when it is dragged and dropped. This is because the drag and drop event will be propagated to the parent element)

   //console.log(e.target.getAttribute('id')); //"target piece"
// console.log(e);
// console.log(e.target);
// console.log(e.target.parentNode);
   //console.log(e.target.parentNode.getAttribute('square-id'));

   //e.target.parentNode.append(draggedElement); //drop the element that we are dragging i.e the "draggedElement" onto the new square class //but this is only possible when some piece exists in that "square" class because for empty squares it will not have a parentNode it will just have one "square" class(basically no parent class exists for empty squares)
   
   //e.target.append(draggedElement); //in case when we are dropping in an empty square, will just have one "square" class(basically no parent class exists for empty squares)

    //console.log('playerGo - ', playerGo);  //will work same as  console.log('playerGo ' + playerGo); 
    //console.log('piece picked - ', draggedElement); //jis piece ko hum uthare wo
    const correctGo = draggedElement.firstElementChild.classList.contains(playerGo); // console.log(draggedElement.firstElementChild.classList.contains(playerGo));
    //console.log('picked correct color as per turn/go - ', correctGo);
    const taken = e.target.classList.contains('piece');
    //console.log('square contains piece -', taken); //true if piece present at drop location and false if empty square at drop location

    //console.log(' ');

    const valid = checkIfValid(e.target);

    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    //console.log('opponentGo - ', opponentGo);
    //console.log('piece on which dropped', e.target); //jis piece ke upar hum rakhre wo 
    const takenByOpponent = e.target.firstElementChild?.classList.contains(opponentGo);
    // console.log('did we drop on opponent color - ', takenByOpponent);
    // console.log(!takenByOpponent);

    if(correctGo){
      //must check this first
      if(takenByOpponent && valid){ //this will only happen if there is a piece present (i.e ""target piece") on the drop location/square and that "target piece" is the opponent's piece (takenByOpponent is true)
        e.target.parentNode.append(draggedElement); //putting draggedElement on the square class 
        e.target.remove(); //remove the existing piece as we place a new piece over it
        checkForWin();
        changePlayer();
        return; //causes to exit dragOver(e) function
      }
      //then check this 
      if(taken && !takenByOpponent){ //if piece present and it is not opponent piece, basically when we are targetting our own piece condititon //opponent piece present or not is already checked before this only in if(takenByOpponent) so here we do nothing
        infoDisplay.textContent = "bhai apne walo ko hi marega kya?"
        //infoDisplay resets itself to empty string after 5 sec
        setTimeout(() => infoDisplay.textContent = " ", 500);
        return; //causes to exit dragOver(e) function
      }
      //last if valid basically if dropping in empty square condition
      if(valid){ //this is the case when the target square is empty and we simply drop our dragged element into the empty square
        e.target.append(draggedElement); //putting draggedElement on the square class 
        checkForWin();
        changePlayer();
        return; //causes to exit dragOver(e) function
      }
    }
}

function checkIfValid(target){ //here in target parameter we passed e.target
    //console.log(target); 
    //const targetId = target.getAttribute('square-id') || target.parentNode.getAttribute('square-id'); //targetId is square-id in square class //here for empty squares || for squares with pieces
    // console.log(targetId);
    // console.log(typeof targetId); //string
//in order to perform calculations we convert value of targetId to a number
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    //console.log(targetId);
    //console.log(typeof targetId); //number

    //console.log(typeof startPositionId); //string
    //const startId = startPositionId
    const startId = Number(startPositionId); //converting string to number

    const piece = draggedElement.id;

    console.log('piece', piece); //piece picked
    console.log('startId', startId); //picked piece 'square-id'
    console.log('targetId', targetId); //drop piece 'square-id' 

    switch(piece){
        case 'pawn' : 
            const starterRow = [8,9,10,11,12,13,14,15];
          if(starterRow.includes(startId) && startId + width * 2 === targetId || 
               startId + width === targetId ||
               startId + width - 1 === targetId && document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
               startId + width + 1 === targetId && document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild
          )   {  //pawn valid moves
              return true; //pawn valid moves so valid returns true
              }
        break; //putting break to avoid unnecessary check of further cases //after break; will exit switch case statement 

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
        //break; //redundant //last case so no need to put break
    }
}

function changePlayer(){ //for taking turns between 2 for each move
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

//we use reverseIds() and revertIds() alternatively throughout the game

function reverseIds(){ //shift board to opposite players perspective/view
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

function checkForWin(){
  const kings = Array.from(document.querySelectorAll('#king'));
  console.log(kings);

  if(!kings.some(king => king.firstElementChild?.classList.contains('white'))){
    infoDisplay.innerHTML = "Black player WINS !"
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
  }

  if(!kings.some(king => king.firstElementChild?.classList.contains('black'))){
    infoDisplay.innerHTML = "White player WINS !"
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
  }
}