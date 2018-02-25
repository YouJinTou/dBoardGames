$(document).ready(() => {
    var currentMove = 0;

    $('#btn-list').on('click', async function () {
        
    });

    $('#btn-search').on('click', async function () {
        var address = $('#search-row').find('#game-address').val();

        if (/^(0x)?[0-9A-Fa-f]{40}$/.test(address)) {
            service.addGame(address);

            await populateList();
        } else {
            bootbox.alert('This does not appear to be a valid address.');
        }
    })

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
        await service.joinGame(initializer.account, $(this).data('game-address'));

        bootbox.alert('Please refresh the game.');
    });

    $(document).on('click', '.btn-viewable', async function () {
        await setGame($(this).data('game-address'));

        $('#to-move').text(await service.getPlayerToMove($(this).data('game-address')));

        showBoardBox($(this).data('game-address'));
    });

    $(document).on('click', '.btn-readonly', async function () {
        await setGame($(this).data('game-address'));

        $('#to-move').text('Game ended.');

        $('#btn-hide-board')
            .attr('data-game-address', $(this).data('game-address'))
            .show();
        $('#btn-resign,#btn-claim-win').hide();

        $(document).find('#board-box').show();
    });

    $(document).on('click', '#btn-prev', async function () {
        if (currentMove === -1) {
            return;
        }

        currentMove--;
        var engine = new Engine($(this).data('game-address'));
        var moves = JSON.parse(sessionStorage['game-' + $(this).data('game-address')]);

        engine.goToMove(currentMove, moves);
    });

    $(document).on('click', '#btn-next', async function () {
        currentMove++;
        var moves = JSON.parse(sessionStorage['game-' + $(this).data('game-address')]);
        
        if (moves.length > currentMove) {
            var engine = new Engine($(this).data('game-address'));

            engine.goToMove(currentMove, moves);
        } else {
            currentMove--;
        }
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

    async function populateList() {
        var games = service.getGames();

        if (!games.length) {
            return;
        }

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

            if (game.gameEnded) {
                $div.addClass('btn-readonly');
                $div.addClass('short-end-holder');
            } else if (game.gameStarted) {
                $div.addClass('btn-viewable');
                $div.addClass('short-view-holder');
            }
            else {
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
    }

    function showBoardBox(gameAddress) {
        $('#btn-resign,#btn-claim-win,#btn-hide-board,#btn-prev,#btn-next')
            .attr('data-game-address', gameAddress)
            .show();

        $(document).find('#board-box').show();
    }

    async function setGame(gameAddress) {
        var gameMoves = await service.getGameMoves(gameAddress);
        sessionStorage['game-' + gameAddress] = JSON.stringify(gameMoves);
        var engine = new Engine(gameAddress);
        currentMove = gameMoves.length - 1;

        engine.setGame(gameMoves);
    }
})
