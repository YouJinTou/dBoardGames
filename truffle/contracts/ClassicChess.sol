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

    modifier bettable() {
        require(msg.value > 0);
        require(!gameStarted);
        require(!gameEnded);
        _;
    }

    modifier joinable() {
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

    modifier claimable() {
        require(msg.sender == getOtherPlayer());
        require(gameStarted);
        require(!gameEnded);
        require(now > lastMoveTimestamp + durationPerMove);
        _;
    }

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
    uint lastMoveTimestamp;
    
    function ClassicChess(uint _durationPerMove) payable public bettable() {
        host = msg.sender;
        prizePool = msg.value;
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

    function tryClaimWinOnTime() public claimable {
        gameEnded = true;

        msg.sender.transfer(prizePool);

        OnGameEnded(msg.sender, currentHalfMove);
    }

    function joinGame() public payable joinable() {
        initializePlayers();
        
        gameStarted = true;
        prizePool += msg.value;
        lastMoveTimestamp = now;

        OnPlayerJoined(msg.sender, playerOne.side, playerTwo.side);
    }

    function makeMove(string move) public movable {
        halfMoves[currentHalfMove] = move;

        toMove = getOtherPlayer();
        lastMoveTimestamp = now;

        OnMoveMade(msg.sender, move, currentHalfMove);

        currentHalfMove++;
    }

    function resignGame() public resignable {
        getOtherPlayer().transfer(prizePool);

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

    function getHostSide() private view returns (Side) {
        uint side = uint(block.blockhash(block.number-1)) % 2;

        return Side(side);
    }

    function getOtherPlayer() private view returns (address) {
        return (toMove == playerOne.addr) ? playerTwo.addr : playerOne.addr;
    }
}
