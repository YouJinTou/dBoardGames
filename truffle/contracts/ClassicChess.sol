pragma solidity ^0.4.18;

contract ClassicChess {
    enum Side { White, Black }
    
    struct Player {
        address addr;
        Side side;
    }
    
    Player private playerOne;
    Player private playerTwo;
    uint private prizePool;
    uint private durationPerMove;

    modifier bettable(uint bet) {
        require(msg.value > 0);
        require(msg.value == bet);
        _;
    }
    
    function ClassicChess(uint bet, uint _durationPerMove) payable public bettable(bet) {
        prizePool = bet;
        durationPerMove = _durationPerMove;
        playerOne = Player({ addr: msg.sender, side: getHostSide() });
    }

    function getPlayerOne() public view returns (Side) {
        return playerOne.side;
    }

    function getPrizePool() public view returns (uint) {
        return prizePool;
    }

    function getDurationPerMove() public view returns (uint) {
        return durationPerMove;
    }

    function getHostSide() view private returns (Side) {
        uint side = uint(block.blockhash(block.number-1)) % 2;

        return Side(side);
    }
}
