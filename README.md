# dBoardGames
Decentralized board games at http://dboardgames.herokuapp.com/

The app currently supports playing chess over the Ropsten test network and requires MetaMask. It is geared towards correspondence chess as engine use is unavoidable.

Each game is a smart contract, and each move is a transaction whose recipient is the contract.

Players may join, create, or observe games. Special attention must be paid to the time per move parameter as the other player can force a win if the opponent hasn't moved in the allotted time.
