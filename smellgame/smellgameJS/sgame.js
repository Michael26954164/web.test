const App = {
    //All of our selected HTML elements
    $:{
        menu: document.querySelector('[data-id="menu"]'),
        menuItem: document.querySelector('[data-id="menu-items"]'),
        restBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),            
        modalText:document.querySelector('[data-id="modal-text"]'),  
        modalBtn:document.querySelector('[data-id="modal-btn"]'),  
        turn: document.querySelector('[data-id="turn"]'),
    },

    state: { 
        currentPlayer: 1,
        moves:[],
    },

    getGameStatus(moves) {

        const p1Moves = moves.filter(move => move.playerid ===1).map((move)=>+move.squareId);
        const p2Moves = moves.filter(move => move.playerid ===2).map((move)=>+move.squareId);


        const winningPatterns = [
            [1,2,3] ,           
            [1,5,9] ,           
            [1,4,7] ,           
            [2,5,8] ,               
            [3,5,7] ,                       
            [3,6,9] ,                               
            [4,5,6] ,       
            [7,8,9] ,       
        ];

        let winner = null

        winningPatterns.forEach(pattern => {
            const p1Wins = pattern.every(v => p1Moves.includes(v))
            const p2Wins = pattern.every(v => p2Moves.includes(v))

            if(p1Wins) winner = 1
            if(p2Wins) winner = 2
        })

        return{
            status : moves.length === 9 || winner != null ? 'complete' : 'in-progress' , //in-progress | complete
            winner  // 1 | 2 | null
        }
    },

    init(){
        App.registerEventListeners()
    },

registerEventListeners(){
    console.log(App.$.squares);

    App.$.menu.addEventListener("click",(event) =>{
    App.$.menuItem.classList.toggle("hidden");
});

    App.$.restBtn.addEventListener("click",(event) =>{
    console.log('Reset the game');
});

    App.$.newRoundBtn.addEventListener("click",(event) =>{
    console.log('Add a new round');
});

    App.$.modalBtn.addEventListener('click',event=>{
        App.state.moves = []
        App.$.squares.forEach(square=> square.replaceChildren())
        App.$.modal.classList.add('hidden')
    })

    App.$.squares.forEach((square) =>{
        square.addEventListener("click",(event)=>{
        console.log(`Suqares with id ${event.target.id} was clicked`);

        // Check if there is already a play , if so , return early
        const hasMove = (squareId)=>{
            const existingMove = App.state.moves.find(
                move => move.squareId === squareId
                );
            return existingMove !== undefined
        }
        if(hasMove(+square.id)){
            return;
        }

        //Determine which player icon to add the square
        // const currentPlayer = App.state.currentPlayer
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerid) => (playerid === 1? 2 : 1);
        const currentPlayer = 
            App.state.moves.length === 0
                ? 1
                : getOppositePlayer(lastMove.playerid);
        const nextPlayer = getOppositePlayer(currentPlayer);   
        
        const squareicon = document.createElement("i");
        const turnicon = document.createElement("i");
        const turnLable = document.createElement('p');
        turnLable.innerText = `Player${nextPlayer}, you are up!`
      

        if(currentPlayer === 1 ){
            squareicon.classList.add("fa-solid" , "fa-x" , "yellow");
            turnicon.classList.add("fa-solid" , "fa-o" , "turquoise");
            turnLable.classList = 'turquoise';
        }else{
            squareicon.classList.add("fa-solid" , "fa-o" , "turquoise");
            turnicon.classList.add("fa-solid" , "fa-x" , "yellow");
            turnLable.classList = 'yellow';
        }
        App.state.moves.push({
            squareId: +square.id,
            playerid: currentPlayer
        });

        App.$.turn.replaceChildren(turnicon,turnLable);
        
        square.replaceChildren(squareicon);
        // check if there is a winner or tie game

        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete"){
            App.$.modal.classList.remove("hidden");

            let message ="";

            if(game.winner){
                
                message = `Player ${game.winner} wins!`;

            }else{
                message = "Tie game!";
            }
            App.$.modalText.textContent = message;
        }
    });
});
}
};

window.addEventListener("load",App.init);