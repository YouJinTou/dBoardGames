pragma solidity ^0.4.18;

contract ClassicChess {
    enum Side { White, Black }
    
    struct Player {
        address addr;
        Side side;
    }

    event OnGameCreated(address, uint, uint);
    event OnPlayerJoined(address, Side, Side);
    
    address private host;
    Player private playerOne;
    Player private playerTwo;
    uint private prizePool;
    uint private durationPerMove;
    bool gameStarted;

    modifier bettable(uint bet) {
        require(msg.value > 0);
        require(msg.value == bet);
        _;
    }

    modifier joinable(uint bet) {
        require(msg.value == bet);
        require(msg.value == prizePool);
        assert(!gameStarted);
        _;
    }
    
    function ClassicChess(uint bet, uint _durationPerMove) payable public bettable(bet) {
        host = msg.sender;
        prizePool = bet;
        durationPerMove = _durationPerMove;

        OnGameCreated(host, prizePool, durationPerMove);
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

    function getDurationPerMove() public view returns (uint) {
        return durationPerMove;
    }

    function joinGame(uint bet) public payable joinable(bet) {
        initializePlayers();
        
        prizePool += bet;
        gameStarted = true;

        OnPlayerJoined(msg.sender, playerOne.side, playerTwo.side);
    }

    function initializePlayers() private {
        playerOne = Player({ addr: host, side: getHostSide() });
        Side playerTwoSide;

        if (playerOne.side == Side.White) {
            playerTwoSide = Side.Black;
        } else {
            playerTwoSide = Side.White;
        }

        playerTwo = Player({ addr: msg.sender, side: playerTwoSide });
    }

    function getHostSide() view private returns (Side) {
        uint side = uint(block.blockhash(block.number-1)) % 2;

        return Side(side);
    }
}
