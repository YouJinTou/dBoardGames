const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const validator = require('./validator.js');
const web3 = require('./web3.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index', {
    title: 'dBoardGames'
}));

app.post('/enforce', (req, res) => {
    if (!req.body.contract) {
        res.status(400).send();
    }

    validator.getGameCondition(req.body.contract).then((condition) => {
        switch (condition) {
            case 'checkmate':
            case 'draw':
                web3.enforceGameEnd(req.body.contract, condition);
    
                res.status(200).send();
    
                break;
            case 'continue':
            default:
                res.status(400);
        }
    });
});

app.listen(3000, () => console.log('Running on port 3000.'));

