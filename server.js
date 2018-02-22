const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index', {
    title: 'dBoardGames'
}));

app.listen(3000, () => console.log('Running on port 3000.'));

