'use strict';

const ClassicChess = artifacts.require('ClassicChess');
const bet = 10000000000000;
const oneDay = 24 * 60 * 60;

var instance = null;

beforeEach('Setup.', async () => {
    instance = await ClassicChess.new(bet, oneDay);

    instance.send(bet);
});

it('Should allocate the bet towards the prize pool.', async () => {
    assert.equal(
        await instance.getPrizePool(),
        bet,
        'Invalid prize pool at startup.');
});

it('Should set the duration per move.', async () => {
    assert.equal(
        await instance.getDurationPerMove(),
        oneDay,
        'Invalid duration per move at startup.');
});