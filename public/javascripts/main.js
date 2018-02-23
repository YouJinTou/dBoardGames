async function getGames() {
    var games = service.getGames();
    var $gamesList = $('#games-list');

    $gamesList.empty();

    for (var g = 0; g < games.length; g++) {
        var game = await service.getGame(games[g]);
        var li = $('<li/>').text(game.durationPerMove);
        var joinGameButton = $('<button/>').text('Join game');

        li.append(joinGameButton);
        li.appendTo($gamesList);
    }
}


function createGame() {
    var wager = web3.toWei($('#wager').val(), 'ether');
    var durationPerMove = $('#move-duration').val();

    classicChess.createGame(initializer.account, wager, durationPerMove);
}

function joinGame() {
    classicChess.joinGame(initializer.account, '0xad1234cf3851e9bd071fa88a6e709f63d8675395');
}