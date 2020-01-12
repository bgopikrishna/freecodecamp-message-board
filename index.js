require('dotenv').config();
const express = require('express');
const cors = require('cors');
const board = require('./routes/board');
const helmet = require('helmet');
const mongoose = require('mongoose');
const url = require('url');

const app = express();

app.set('trust proxy', true);

mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('Connected to mongoDB');
    })
    .catch(err => {
        console.log('Error mongodb', err);
    });

app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());

app.use(express.json());
app.use(express.urlencoded());

app.use(cors({ optionSuccessStatus: 200 }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/b/', board);

app.all('/api/threads/:board', async (req, res, next) => {
    res.redirect(307, `../b/${req.params.board}`);
    next();
});

app.post('/api/replies/:board', (req, res, next) => {
    res.redirect(
        307,
        `../b/${req.params.board}/${req.body.thread_id}`
    );

    next()
});
app.get('/api/replies/:board', (req, res, next) => {
    res.redirect(
        307,
        `../b/${req.params.board}/${req.query.thread_id}`
    );

    next()
});

app.delete('/api/replies/:board', (req, res, next) => {
    res.redirect(
        307,
        `../b/${req.params.board}/${req.body.thread_id}`
    );

    next()
});



const port = process.env.PORT || 8000;
const listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});

function handleRedirectForThreads() {
    return async (req, res) =>
        res.redirect(
            url.format({
                path: `../b/${req.params}`,
                query: req.query
            })
        );
}

function handleRedirectForReplies() {
    return async (req, res) =>
        res.redirect(
            url.format({
                path: `../b/${req.params}/${req.body.thread_id}`,
                query: req.query
            })
        );
}
