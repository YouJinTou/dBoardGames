pragma solidity ^0.4.18;

contract ClassicChess {
    enum Side { White, Black }
    
    struct Player {
        address addr;
        Side side;
    }

    event OnGameCreated(address, uint, uint, uint);
    event OnPlayerJoined(address, Side, Side);
    event OnMoveMade(address, string, uint, uint);
    event OnGameEnded(address, uint, uint);

    modifier bettable(uint _durationPerMove) {
        require(msg.value > 0);
        require(!gameStarted);
        require(!gameEnded);
        require(_durationPerMove >= 30 minutes);
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

    modifier enforceable() {
        require(msg.sender == organizer);
        require(gameStarted);
        require(!gameEnded);
        _;
    }

    uint private constant PERCENT_FEE = 2;

    address private organizer;
    address private host;
    Player private playerOne;
    Player private playerTwo;
    uint private prizePool;
    uint private durationPerMove;
    bool private gameStarted;
    bool private gameEnded;
    address private toMove;
    mapping(uint => string) private halfMoves;
    uint private currentHalfMove;
    uint private lastMoveTimestamp;
    
    function ClassicChess(uint _durationPerMove) payable public bettable(_durationPerMove) {
        organizer = 0xCa411557A6E7f84269FAc1e1d397671aA18A2364;
        host = msg.sender;
        prizePool = msg.value;
        durationPerMove = _durationPerMove;
        currentHalfMove = 1;

        OnGameCreated(host, prizePool, durationPerMove, now);
    }

    function getGameStarted() public view returns (bool) {
        return gameStarted;
    }

    function getGameEnded() public view returns (bool) {
        return gameEnded;
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

    function getFee() public view returns (uint) {
        return (prizePool * PERCENT_FEE) / 100;
    }

    function getDurationPerMove() public view returns (uint) {
        return durationPerMove;
    }

    function playerToMove() public view returns (address) {
        return toMove;
    }

    function getHalfMovesCount() public view returns (uint) {
        return currentHalfMove;
    }

    function getHalfMove(uint halfMove) public view returns (string) {
        return halfMoves[halfMove];
    }

    function tryClaimWinOnTime() public claimable {
        gameEnded = true;

        msg.sender.transfer(prizePool);

        OnGameEnded(msg.sender, currentHalfMove, now);
    }

    function joinGame() public payable joinable {
        gameStarted = true;
        
        initializePlayers();
        
        prizePool += msg.value;
        lastMoveTimestamp = now;

        payOrganizer();

        OnPlayerJoined(msg.sender, playerOne.side, playerTwo.side);
    }

    function makeMove(string move) public movable {
        halfMoves[currentHalfMove] = move;

        toMove = getOtherPlayer();
        lastMoveTimestamp = now;

        OnMoveMade(msg.sender, move, currentHalfMove, now);

        currentHalfMove++;
    }

    function resignGame() public resignable {
        gameEnded = true;

        getOtherPlayer().transfer(prizePool);

        OnGameEnded(msg.sender, currentHalfMove, now);
    }

    function enforceCheckmate() public enforceable {
        gameEnded = true;

        getOtherPlayer().transfer(prizePool);

        OnGameEnded(msg.sender, currentHalfMove - 1, now);
    }

    function enforceDraw() public enforceable {
        gameEnded = true;
        uint returnableBet = prizePool / 2;

        playerOne.addr.transfer(returnableBet);

        playerTwo.addr.transfer(returnableBet);

        OnGameEnded(msg.sender, currentHalfMove - 1, now);
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

    function payOrganizer() private {
        uint fee = (prizePool * PERCENT_FEE) / 100;
        prizePool -= fee;

        organizer.transfer(fee);
    }

    function getOtherPlayer() private view returns (address) {
        return (toMove == playerOne.addr) ? playerTwo.addr : playerOne.addr;
    }
}
