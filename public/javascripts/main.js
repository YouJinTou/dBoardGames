$('#btn-list').on('click', async function () {
    var games = service.getGames();
    var $gamesList = $('#games-list');

    $gamesList.empty();

    for (var g = 0; g < games.length; g++) {
        var game = await service.getGame(games[g]);

        if (!game) {
            continue;
        }

        var li = $('<li/>').text(game.durationPerMove);

        if (game.gameStarted) {
            var viewGameButton = $('<button />')
                .addClass('btn-viewable')
                .attr('data-game-address', games[g])
                .text('View game');

            li.append(viewGameButton);
        } else {
            var joinGameButton = $('<button />')
            .addClass('btn-joinable')
            .attr('data-game-address', games[g])
            .text('Join game');

            li.append(joinGameButton);
        }

        li.appendTo($gamesList);
    }
});

$('#btn-create').on('click', async function () {
    var wager = web3.toWei($('#wager').val(), 'ether');
    var durationPerMove = $('#move-duration').val();

    await classicChess.createGame(initializer.account, wager, durationPerMove);
});

$(document).on('click', '.btn-joinable', async function () {
    await classicChess.joinGame(initializer.account, $(this).data('game-address'));
});

$(document).on('click', '.btn-viewable', async function () {
    var gameMoves = await service.getGameMoves($(this).data('game-address'));
    var engine = new Engine($(this).data('game-address'));

    engine.setGame(gameMoves);
});
