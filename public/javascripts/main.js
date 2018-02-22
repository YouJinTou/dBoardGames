function createGame() {
    var wager = web3.toWei(document.getElementById('wager').value, 'ether');
    var durationPerMove = document.getElementById('move-duration').value;

    classicChess.createGame(initializer.account, wager, durationPerMove);
}