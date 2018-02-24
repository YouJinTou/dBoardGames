$('#btn-list').on('click', async function () {
    var games = service.getGames();
    var $gamesList = $('#games-list');
    var $template = $('.game-template').first();

    $gamesList.empty();

    for (var g = 0; g < games.length; g++) {
        var game = await service.getGame(games[g]);

        if (!game) {
            continue;
        }

        var pot = web3.fromWei(game.prizePool, 'ether') + ' ether';
        var duration = game.durationPerMove / 3600 + ' h';
        var $li = $('<li/>');
        var $current = $template.clone();
        var $potLabel = $('<h5 />').addClass('short').text('Pot');
        var $pot = $('<h6 />').addClass('short').text(pot);
        var $durationLabel = $('<h5 />').addClass('short').text('Time per move');
        var $duration = $('<h6 />').addClass('short').text(duration)
        var $div = $('<div />')
            .addClass('btn-actionable')
            .attr('data-game-address', games[g])
            .append($potLabel)
            .append($pot)
            .append($durationLabel)
            .append($duration);

        if (game.gameStarted) {
            $div.addClass('btn-viewable');
            $div.addClass('short-view-holder');
        } else {
            $div.addClass('btn-joinable');
            $div.addClass('short-join-holder');
        }

        $li.append($div);

        $current.find('.address').text(game.address);
        $current.find('.move').text(game.currentMove);
        $current.find('.move-duration').text(duration);
        $current.find('.in-play').text(pot);
        $current.find('.ended').text(game.gameEnded ? 'Yes' : 'No');

        $li.append($current);
        $li.appendTo($gamesList);
    }
});

$('#btn-create').on('click', async function () {
    if (!/^(\d+(\.\d{1,18})?){1}$/.test($('#wager').val())) {
        bootbox.alert('Ether amount must be a number with up to 18 decimal places.');

        return;
    }

    var wager = web3.toWei($('#wager').val(), 'ether');
    var durationPerMove = $('#move-duration').val();

    await service.createGame(initializer.account, wager, durationPerMove);
});

$(document).on('click', '.btn-actionable', function () {
    $(document).find('.game-template').hide();

    $(this).parent().find('.game-template').show();
});

$(document).on('click', '.btn-joinable', async function () {
    var engine = new Engine($(this).data('game-address'));

    engine.setGame();

    showBoardBox($(this).data('game-address'));

    $('.board-controls .btn:not(#btn-hide-board)').hide();

    await service.joinGame(initializer.account, $(this).data('game-address'));
});

$(document).on('click', '.btn-viewable', async function () {
    var gameMoves = await service.getGameMoves($(this).data('game-address'));
    var engine = new Engine($(this).data('game-address'));

    engine.setGame(gameMoves);

    $('#to-move').text(await service.getPlayerToMove($(this).data('game-address')));

    showBoardBox($(this).data('game-address'));
});

$(document).on('click', '#btn-resign', async function () {
    await service.resignGame($(this).data('game-address'));
});

$(document).on('click', '#btn-claim-win', async function () {
    await service.tryClaimWinOnTime($(this).data('game-address'));
});

$(document).on('click', '#btn-hide-board', function () {
    $(document).find('#board-box').hide();

    $(document).find('.game-template').hide();
});

function showBoardBox(gameAddress) {
    $('#btn-resign,#btn-claim-win,#btn-hide-board')
        .attr('data-game-address', gameAddress)
        .show();

    $(document).find('#board-box').show();
}
