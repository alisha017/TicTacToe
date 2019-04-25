// TIC-TAC-TOE GAME

//the game begins from here 
function gameState(){
    console.log("\n\t\tWELCOME TO TIC-TAC-TOE GAME")
    console.log("\nDo you want to \n1. Start a new game \n2. Resume the previous game\n3. Quit the game");
    let choice = readline.question("Enter your choice: ")
    if(!quitGame(choice)){
        switch(choice){
            case '1': console.log("\n\n\t\tNEW GAME\n\n");
                console.log("Note: Press Q anytime to quit\n\n");
                newGame();
                break;
            case '2': console.log("\n\n\t\tRESUME GAME\n\n");
                console.log("Note: Press Q anytime to quit\n\n");
                let fileName = readline.question("Enter file name: (No need to enter extension): "); 
                let count = 0;
                while(count<3){
                    if(!fs.existsSync(`${fileName}.json`)){  //referenced from https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
                        console.log("No such file exists. Please enter again.") 
                        fileName = readline.question("Enter file name:(No need to enter extension): ") ;  
                        count++;
                    } else{
                        break;
                    }
                    if(count ===3){
                        console.log("No such file found!");
                        errorMessage();
                    }
                }
                resumeGame(fileName); 
                break;
            case '3': console.log("Quitting the game. Bye!");
                break;
            default: console.log("Wrong input. Enter again");
                gameState();
        }
    
    }
}
// to display any error message and exit the game
function errorMessage(){
    console.log("Exiting the game.")
    process.exit();
}

//to take the number of players from the user
function noOfPlayers(){
    let players = readline.question("Enter the number of players (max 26): ");
    if(!quitGame(players)){
        players = parseInt(players);
        if(isNaN(players)){
            console.log("Number of players must be a number.");
            players = noOfPlayers();
        } else if(players<=26 && players>1){
            saveJSONToFile.noOfPlayers = players;
        } else{
            console.log("Wrong input. Maximum 26 players allowed.")
            console.log("Please enter again.");
            players = noOfPlayers(); // correct code
        }
        return players;
    }
}

//to take the size of board from the user
function sizeOfBoard(noOfPlayers){
    
    let boardSize = readline.question("Enter size of the board (max 999 and min 1 greater than the number of players): ");
    if(!quitGame(boardSize)){
        boardSize = parseInt(boardSize);
        if(isNaN(boardSize)){
            console.log("Board Size must be a number.")
            boardSize = sizeOfBoard(noOfPlayers);
        }else if(boardSize<=999 && boardSize>=3 && boardSize > noOfPlayers){
            saveJSONToFile.boardSize = boardSize;
        } else{
            console.log("Wrong input. Board size should be \na. >=3 and <=999 \nb. > number of players. ")
            console.log("Please enter again");
            boardSize = sizeOfBoard(noOfPlayers);
        }
        return boardSize;

    }
    
}

//to take the winning sequence from the user
function winSequence(boardSize){
    let winSeq = readline.question("Enter win sequence:");

    if(!quitGame(winSeq)){
        winSeq = parseInt(winSeq);

        if(winSeq<=boardSize && winSeq>=3){
            saveJSONToFile.winSeq = winSeq;
        } else if(isNaN(winSeq)){
            console.log("Win sequence must be a number");
            winSeq = winSequence(boardSize);
        }else{
            console.log("Win sequence cannot be greater than the board Size or lesser than 3");
            winSeq = winSequence(boardSize);
        }
        return winSeq;
    }    
    
}

//to assign the symbols to the players in the current game
function assignSymbol(noOfPlayers){
    let playerSymbols = "XOABCDEFGHIJKLMNPQRSTUVWYZ";
    let playerSign = [];
    for(let i=0; i< noOfPlayers; i++){
        playerSign.push(playerSymbols[i]);
    }
    return playerSign;
}

//creates the game board
function gameBoard(boardSize){
    let grid=[];
    let row=column= 1;
    for( let j=0; j<=2*(boardSize-1)+1; j++){
        let count = 0;
        let gridRow = [];

        if(j===0){
            gridRow.push("  ")
            for(let k=0; k<2*(2*boardSize+1); k++){
                if(k===row*4-2){
                    if(row===100){
                        gridRow.pop()
                    }

                    gridRow.push(String(row));
                    k += String(row).length-1;
                    row+=1;
                    
                } else{
                    gridRow.push(" ");
                }
            }
        } else {
            for (let i=0; i<=2*(2*boardSize-1)+1; i++){
                if(i===0){
                    if(j%2!==0){
                        if(String(column).length < 3){
                            let noOfSpace = 3 -String(column).length;
                            gridRow.push(String(column));
                            for(let i=0; i<noOfSpace; i++){
                                gridRow.push(" ")
                            }
                            
                        }
                        ;
                        column+=1;
                    } else{
                        gridRow.push("   ");
                    }
                } else if(j%2!==0){
                    if(count<3){
                        gridRow.push(" ");
                        count+=1;
                    } else{
                        gridRow.push("|");
                        count=0;
                    }
                } else{
                    if(count<3){
                        gridRow.push("-");
                        count+=1;
                    } else{
                        gridRow.push("+");
                        count=0;
                    }
                }

            }
        }

        grid[j] = gridRow;
    }
    displayGrid(grid);
    return grid;
}

//displays the game board
function displayGrid(grid){
    for(i=0;i<grid.length;i++){
        let gridRow = grid[i].join("");
        console.log(gridRow);
    }
}

//created to dictionary - {user input: position on the grid}
function namingPosition(boardSize){
    let positionDictionary = {};

    for(let xPos=1; xPos<=boardSize; xPos++){
        for(let yPos=1; yPos<=boardSize; yPos++){
            let flag = 0;
            let pos = String(xPos)+" "+String(yPos);
            for(let j=0; j<=2*(boardSize-1)+1; j++){
                if (j===xPos*2-1){
                    for(let i=0; i<=2*(2*boardSize-1)+2; i++){
                        if(i===2*(2*yPos-1)+2){
                            flag=1;
                            positionDictionary[pos]=[i,j]
                            break;
                        }
                    }
                    if(flag===1)
                        break;
                }
            }
        }
    }
    saveJSONToFile.positionDictionary = positionDictionary;
    return positionDictionary;
}

//checks if the last move of the player is the winning move. returns a boolean value
function winCondition(lastMove, winSeq, k, noOfTwosForThatPlayer){

    let winCount = winSeq - 2;

    moveMatrix[k].push([lastMove,0,0,0,0]);
    saveJSONToFile.moveMatrix = moveMatrix;

    let matrix = moveMatrix[k];
    let len = matrix.length-1;
 
    let x = lastMove[0];
    let y = lastMove[1];

    //creates a matrix corresponding to all the moves of that particular player.
    //[[move], vertical neighbourhood count, horizontal neighbourhood count, diagonal neighboarhood count, other diagonal neighbourhood count]
    //checks if there is any move in the neighbourhood of the last move, if yes, updates the matrix accordingly
    //noOdTwos defines if there is any move surrounded by 2 moves of the same player in the same fashion. eg. x-x-x horizontally
    //the logic is there are always two moves with only 1 move in the neighbourhood and the rest have 2 moves in the neighbourhood.
    //This condition is checked based on the no of twos in the matrix and winning condition is truw id noOfTwos = winSeq-2
    if(matrix!==[]){
        for(let move=0; move< len; move++){
            let xMove = matrix[move][0][0];
            let yMove = matrix[move][0][1];
            
            if(x===xMove && (y===yMove+1 || y===yMove-1)){
                matrix[move][1]+=1;
                matrix[len][1]+=1;
                saveJSONToFile.moveMatrix = moveMatrix;
                if(matrix[move][1]===2 || matrix[len][1]===2){
                    noOfTwosForThatPlayer[0]+=1;
                    if(matrix[move][0]===2 && matrix[len][0]==2){
                        noOfTwosForThatPlayer[0]+=1;
                    }
                    if(matrix[move][1]===2 && matrix[len][1]==2){
                        noOfTwosForThatPlayer[0]+=1;
                    }
                    saveJSONToFile.noOfTwos[k] = noOfTwosForThatPlayer;
                    if(noOfTwosForThatPlayer[0] === winCount){
                        return true;
                    }
                }
            }
            if((x===xMove+1 || x===xMove-1) && y===yMove){
                matrix[move][2]+=1;
                matrix[len][2]+=1;
                saveJSONToFile.moveMatrix = moveMatrix;
                if(matrix[move][2]===2 || matrix[len][2]===2){
                    noOfTwosForThatPlayer[1]+=1;
                    if(matrix[move][2]===2 && matrix[len][2]==2){
                        noOfTwosForThatPlayer[1]+=1;
                    }
                    saveJSONToFile.noOfTwos[k] = noOfTwosForThatPlayer;
                    if(noOfTwosForThatPlayer[1] === winCount){
                       return true;
                    }
                }
            }
            if((x===xMove+1 && y===yMove+1) || (x===xMove-1 && y===yMove-1)){
                matrix[move][3]+=1;
                matrix[len][3]+=1;
                saveJSONToFile.moveMatrix = moveMatrix;
                if(matrix[move][3]===2 || matrix[len][3]===2){
                    noOfTwosForThatPlayer[2]+=1;
                    if(matrix[move][3]===2 && matrix[len][3]===2){
                        noOfTwosForThatPlayer[2]+=1;
                    }
                    saveJSONToFile.noOfTwos[k] = noOfTwosForThatPlayer;
                    if(noOfTwosForThatPlayer[2] === winCount){
                        return true;
                    }    
                }
            }
            if((x===xMove+1 && y===yMove-1) || (x===xMove-1 && y===yMove+1)){
                matrix[move][4]+=1;
                matrix[len][4]+=1;
                saveJSONToFile.moveMatrix = moveMatrix;
                if(matrix[move][4]===2 || matrix[len][4]===2){
                    noOfTwosForThatPlayer[3]+=1;
                    if(matrix[move][2]===2 && matrix[len][2]==2){
                        noOfTwosForThatPlayer[3]+=1;
                    }
                    saveJSONToFile.noOfTwos[k] = noOfTwosForThatPlayer;
                    if(noOfTwosForThatPlayer[3] === winCount){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//takes the move from the user. 
function inputTurn(count, sign, positionDictionary, grid){
    let position = readline.question("Player "+ count+":- \nEnter the position in x(single space)y format:");
    if(!quitGame(position)){
        let key = positionDictionary[position]; 

        if(key === undefined){
            console.log("Wrong input. No such position on the board.\nPlease Enter again");
            position = inputTurn(count, sign, positionDictionary, grid);
        } else {
            let xPos = key[1];
            let yPos = key[0];
            if(grid[xPos][yPos]!==" "){
                console.log("Position already filled.");
                position = inputTurn(count, sign, positionDictionary, grid);
            } else{
                grid[xPos][yPos] = sign;
                displayGrid(grid);
            }
        }
        return position;
    }
}

//if the user selects new game, everything starts from the scratch. 
function newGame(){

    players = noOfPlayers();
    boardSize = sizeOfBoard(players);
    winSeq = winSequence(boardSize);
    board = gameBoard(boardSize);
    positionDictionary = namingPosition(boardSize);
    playerSymbols = assignSymbol(players);
    let gameState = [1,''];
    let turn = 0;
    let totalTurns = boardSize*boardSize;
   
    for(let i=0; i<players; i++){
        saveJSONToFile.noOfTwos.push([0,0,0,0]);
        noOfTwos.push([0,0,0,0]);
        moveMatrix.push([]);
    } 

    playGame(players, boardSize, winSeq, board, positionDictionary, playerSymbols, noOfTwos, turn, totalTurns, gameState);
    
}

//after everything is defined, this function is called for playing the game on the board
function playGame(players, boardSize, winSeq, board, positionDictionary, playerSymbols, noOfTwos, turn, totalTurns, gameState){

    saveJSONToFile.noOfPlayers= players;
    saveJSONToFile.boardSize = boardSize;
    saveJSONToFile.winSeq = winSeq;
    saveJSONToFile.positionDictionary = positionDictionary;

    let flag = 0;
    while(turn!==totalTurns){
        for(let i=0; i<players; i++){
            saveJSONToFile.lastPlayer = i;
            let lastMove = inputTurn(i+1, playerSymbols[i], positionDictionary, board).split(" ");
            for(let pos in lastMove){
                lastMove[pos] = parseInt(lastMove[pos]);
            }
            turn++;
            saveJSONToFile.turns = turn;
            saveJSONToFile.noOfTwos = noOfTwos;
            if(winCondition(lastMove, winSeq, i, noOfTwos[i])){
                console.log("Congratulations! Player ",i+1," won!!!");
                flag = 1;
            } else if(turn === totalTurns){
                console.log("It is a tie.");
                flag = 1;
            }

            //if the game was resumed and the game gets over, the JSON file is deleted from the memory
            if(flag === 1){
                if(gameState[0] == -1){
                    fs.unlinkSync(`${gameState[1]}.json`);  //referenced from https://stackoverflow.com/questions/5315138/node-js-remove-file
                }
                process.exit();
            }
        }
    } 
}

//if the user selects resume game, the data is retrieved from the JSON file and is set to the data
function resumeGame(fileName){
    var resumedData = JSON.parse(fs.readFileSync(`${fileName}.json`, 'utf8'));

    players = resumedData.noOfPlayers;
    boardSize = resumedData.boardSize;
    winSeq = resumedData.winSeq;
    board = gameBoard(boardSize);
    positionDictionary = resumedData.positionDictionary;
    playerSymbols = assignSymbol(players);
    let gameState = [-1, fileName];
    let flag = 0;

    noOfTwos=resumedData.noOfTwos;
    let turn = resumedData.turns;
    moveMatrix = resumedData.moveMatrix;
    let totalTurns = boardSize*boardSize;

    saveJSONToFile.noOfPlayers = players;
    saveJSONToFile.boardSize = boardSize;
    saveJSONToFile.winSeq = winSeq;
    saveJSONToFile.positionDictionary = positionDictionary
    saveJSONToFile.noOfTwos = noOfTwos;

    //resume the board state
    resumeOldGameBoard(board, playerSymbols, positionDictionary);

    //for the previous set of turns (if left in the middle of that set of turns, eg: in a game of 4 players, 2nd player quits)
    //therefore, to start the game from that state
    for(let i=resumedData.lastPlayer; i<players; i++){
        saveJSONToFile.lastPlayer = i;
        let lastMove = inputTurn(i+1, playerSymbols[i], positionDictionary, board).split(" ");
        for(let pos in lastMove){
            lastMove[pos] = parseInt(lastMove[pos]);
        }
        turn++;
        saveJSONToFile.turns = turn;
    
        if(winCondition(lastMove, winSeq, i, noOfTwos[i])){
            console.log("Congratulations! Player ",i+1," won!!!");
            flag = 1;
        } else if(turn === totalTurns){
            console.log("It is a tie.");
            flag = 1;
        }
        //delete the JSON file after the game is over
        if(flag === 1){  
            fs.unlinkSync(`${fileName}.json`);   //referenced from https://stackoverflow.com/questions/5315138/node-js-remove-file
            process.exit();
        }
    }
    playGame(players, boardSize, winSeq, board, positionDictionary, playerSymbols,noOfTwos, turn, totalTurns, gameState);
}

//when the game is resumed, the old board state is retrieved back
function resumeOldGameBoard(board, playerSymbols, positionDictionary){
    for(let player in moveMatrix){
        for(let move of moveMatrix[player]){
            move[0][0] = String(move[0][0]);
            move[0][1] = String(move[0][1]);
            move[0] = move[0].join(" ");

            let key = positionDictionary[move[0]];
            let xPos = key[1];
            let yPos = key[0];
            board[xPos][yPos] = playerSymbols[player];

            move[0]= move[0].split(" ");
            move[0][0] = parseInt(move[0][0]);
            move[0][1] = parseInt(move[0][1])

        }
    }
    displayGrid(board);
}

//if the user chooses to quit the game, this function is called
function quitGame(playerInput){
    if(playerInput === "Q" || playerInput === "q"){
        let confirm =readline.question("Do you want to quit the game(Y/N): ");
        while(true){
            if(confirm !== "y" && confirm !== "Y" && confirm !== "n" && confirm !== "N"){
                confirm = readline.question("Wrong input. Please enter again:");
            } else {
                break;
            }
        }

        if(confirm === "Y" || confirm === "y"){
            let save = readline.question("Do you want to save the game?(Y/N): ");
            while(true){
                if(save !== "y" && save !== "Y" && save !== "n" && save !== "N"){
                    save = readline.question("Wrong input. Please enter again:");
                } else {
                    break;
                }
            }

            if(save === "Y" || save === "y"){
                let fileName = readline.question("Enter filename:");
                saveGame(fileName);
            } 
            process.exit();
        } else if(confirm === "N" || confirm === "n"){
            return false;
        }
    }

}

//if the user chooses to save the game, this function is called
function saveGame(fileName){ 
    //referenced from https://stackabuse.com/reading-and-writing-json-files-with-node-js/
    fs.writeFileSync(`${fileName}.json`, JSON.stringify(saveJSONToFile,null,4),'utf8', (err) => {  
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
}

//main function

//the object to save into the JSON file while saving the game
let saveJSONToFile = {
    noOfPlayers : 0,
    boardSize : 0,
    winSeq : 0,
    turns: 0,
    moveMatrix : [],
    noOfTwos: [],
    lastPlayer: -1,
    positionDictionary: {}
};

const readline = require("readline-sync");
let fs = require("fs");
let moveMatrix = [];
let players = 0;
let boardSize = 0;
let winSeq = 0;
let board = [], positionDictionary={}, playerSymbols=[];
let noOfTwos=[];

gameState();

