const gameBoard = document.querySelector("#gameboard");
const player = document.querySelector('#player');
const infoDisplay = document.querySelector("#info-display");

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
                                      //'square' for setting dimensions of small squares
      square.innerHTML = startPiece;
  
      square.setAttribute('square-id', index) //like document.createElement allows us to create html elements dynamically via js similarly .setAttribute helps us change the properties or basically make changes inside html elements via js //The setAttribute() method can be used to modify the attributes of any HTML element, whether it was created dynamically using document.createElement() or obtained from the DOM using methods like document.querySelector() //When I mention "obtained from the DOM," it means accessing HTML elements in JavaScript and treating them as objects
                                              //so here we have set a 'square-id' for each element as it loops thorugh the array and the value of that 'square-id' for each element is its index value

      const row = Math.floor((63 - index) / 8) + 1; //index startion from 0 to 63
      if(row % 2 === 0){
        square.classList.add(index % 2 === 0 ? "beige" : "green");
      }
      else{
        square.classList.add(index % 2 === 0 ? "green" : "beige");
      }

      if(index <= 15){
        square.firstElementChild.firstElementChild.classList.add('black');//square class first child is piece class, piece class first child is svg
      }

      if(index >= 48){
        square.firstElementChild.firstElementChild.classList.add('brown');
      }
      gameBoard.append(square);//at each loop we are putting these small squares onto out gameBoar                           
    })
}
    createBoard();
