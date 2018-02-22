const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '/app')));
app.use(express.static(path.join(__dirname, '/contracts')));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/app/index.html')));

app.listen(3000, () => console.log('Running on port 3000.'));

