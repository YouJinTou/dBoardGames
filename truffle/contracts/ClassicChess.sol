pragma solidity ^0.4.18;

contract ClassicChess {
    enum Side { White, Black }
    
    struct Player {
        address addr;
        Side color;
    }
    
    Player private playerOne;
    Player private playerTwo;
    uint private prizePool;
    uint private durationPerMove;

    modifier bettable(uint bet) {
        require(msg.value == bet);
        _;
    }
    
    function ClassicChess(uint bet, uint _durationPerMove) payable public bettable(bet) {
        prizePool = bet;
        durationPerMove = _durationPerMove;
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

     function getDurationPerMove() public view returns (uint) {
        return durationPerMove;
    }
}
