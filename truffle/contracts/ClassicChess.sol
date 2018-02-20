pragma solidity ^0.4.18;

contract ClassicChess {
    enum Side { White, Black }
    
    struct Player {
        address addr;
        Side side;
    }

    event OnGameCreated(address, uint, uint);
    event OnPlayerJoined(address, Side, Side);
    event OnMoveMade(address, string, uint);
    event OnGameEnded(address, uint);
    
    address private host;
    Player private playerOne;
    Player private playerTwo;
    uint private prizePool;
    uint private durationPerMove;
    bool gameStarted;
    bool gameEnded;
    address toMove;
    mapping(uint => string) halfMoves;
    uint currentHalfMove;

    modifier bettable(uint bet) {
        require(msg.value > 0);
        require(msg.value == bet);
        _;
    }

    modifier joinable(uint bet) {
        require(msg.value == bet);
        require(msg.value == prizePool);
        require(!gameStarted);
        require(!gameEnded);
        _;
    }

    modifier movable() {
        require(gameStarted);
        require(!gameEnded);
        require(msg.sender == toMove);
        _;
    }

    modifier resignable() {
        require(gameStarted);
        require(!gameEnded);
        require(msg.sender == toMove);
        _;
    }
    
    function ClassicChess(uint bet, uint _durationPerMove) payable public bettable(bet) {
        host = msg.sender;
        prizePool = bet;
        durationPerMove = _durationPerMove;
        currentHalfMove = 1;

        OnGameCreated(host, prizePool, durationPerMove);
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

    function getDurationPerMove() public view returns (uint) {
        return durationPerMove;
    }

    function playerToMove() public view returns (address) {
        return toMove;
    }

    function getHalfMove(uint halfMove) public view returns (string) {
        return halfMoves[halfMove];
    }

    function joinGame(uint bet) public payable joinable(bet) {
        initializePlayers();
        
        prizePool += bet;
        gameStarted = true;

        OnPlayerJoined(msg.sender, playerOne.side, playerTwo.side);
    }

    function makeMove(string move) public movable {
        halfMoves[currentHalfMove] = move;

        toMove = (toMove == playerOne.addr) ? playerTwo.addr : playerOne.addr;

        OnMoveMade(msg.sender, move, currentHalfMove);

        currentHalfMove++;
    }

    function resignGame() public resignable {
        address winner = (toMove == playerOne.addr) ? playerTwo.addr : playerOne.addr;

        winner.transfer(prizePool);

        gameEnded = true;

        OnGameEnded(msg.sender, currentHalfMove);
    }

    function initializePlayers() private {
        playerOne = Player({ addr: host, side: getHostSide() });
        Side playerTwoSide;

        if (playerOne.side == Side.White) {
            playerTwoSide = Side.Black;
            toMove = host;
        } else {
            playerTwoSide = Side.White;
            toMove = msg.sender;
        }

        playerTwo = Player({ addr: msg.sender, side: playerTwoSide });
    }

    function getHostSide() view private returns (Side) {
        uint side = uint(block.blockhash(block.number-1)) % 2;

        return Side(side);
    }
}
