const express = require('express');
const { Board } = require('../models/board');

const router = express.Router();

router.post('/:boardName', async (req, res) => {
    console.log(`In Board Route`, req.params, req.body);
    const { boardName } = req.params;
    const { text, delete_password } = req.body;

    const board = await Board.findOneAndUpdate(
        { name: boardName },
        {
            $push: { threads: { text, delete_password } }
        },
        { upsert: true, new: true, useFindAndModify: true }
    );

    res.send(board);
});

router.get('/:boardName', async (req, res) => {
    const { boardName } = req.params;

    try {
        const board = await Board.findOne({
            name: boardName
        });

        const { threads } = board;

        const recentThreads = threads
            .toObject()
            .sort((a, b) => {
                a = new Date(a.bumped_on);
                b = new Date(b.bumped_on);
                return a > b ? -1 : a < b ? 1 : 0;
            })
            .slice(0, 10)
            .map(thread => {
                return {
                    created_on: thread.created_on,
                    _id: thread._id,
                    text: thread.text,
                    replies: thread.replies,
                    bumped_on: thread.bumped_on
                };
            });

        const recentThreadsWithReplies = recentThreads.map(thread => {
            let { replies } = thread;
            replies = replies
                .sort((a, b) => {
                    a = new Date(a.created_on);
                    b = new Date(b.created_on);
                    return a > b ? -1 : a < b ? 1 : 0;
                })
                .slice(0, 3)
                .map(reply => {
                    return {
                        created_on: reply.created_on,
                        _id: reply._id,
                        text: reply.text
                    };
                });
            console.log(replies);
            thread.replies = replies;
            return thread;
        });

        res.send(recentThreadsWithReplies);
    } catch (err) {
        res.send(err.message);
    }
});

router.delete('/:boardName', async (req, res) => {
    const { thread_id, delete_password } = req.body;
    const { boardName } = req.params;

    try {
        const board = await Board.findOne({ name: boardName });
        const thread = await board.threads.id(thread_id);

        if (thread.delete_password === delete_password) {
            await board.threads.pull(thread_id);
            await board.save();
            res.send('success');
        } else {
            res.send('incorrect password');
        }
    } catch (error) {
        res.send(error.message);
    }
});

router.put('/:boardName', async (req, res) => {
    const { thread_id } = req.body;
    const { boardName } = req.params;

    try {
        const board = await Board.findOne({ name: boardName });
        const thread = await board.threads.id(thread_id);

        if (thread) {
            thread.reported = true;
            await board.save();
            res.send('success');
        } else {
            res.send('No thread found');
        }
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/:boardName/:threadId', async (req, res) => {
    const { boardName, threadId } = req.params;

    const { text, delete_password } = req.body;

    // parent.children.id(_id)

    const board = await Board.findOne({ name: boardName });
    const thread = await board.threads.id(threadId);

    thread.replies.push({ text, delete_password });
    thread.bumped_on = Date.now();

    await board.save();

    res.send(thread);
});

router.get('/:boardName/:threadId', async (req, res) => {
    const { boardName, threadId } = req.params;

    // parent.children.id(_id)

    try {
        const board = await Board.findOne({ name: boardName });
        let thread = await board.threads.id(threadId);
        thread = thread.toObject();
        const replies = thread.replies.map(reply => {
            return {
                created_on: reply.created_on,
                _id: reply._id,
                text: reply.text
            };
        });

        const { _id, text, created_on, bumped_on } = thread;

        const resObj = { _id, text, created_on, bumped_on, replies };

        res.send(resObj);
    } catch (error) {
        res.send(error.message);
    }
});

router.delete('/:boardName/:threadId', async (req, res) => {
    const { thread_id, delete_password, reply_id } = req.body;
    const { boardName } = req.params;

    try {
        const board = await Board.findOne({ name: boardName });
        const thread = board.threads.id(thread_id);
        const reply = thread.replies.id(reply_id);

        if (reply && delete_password === reply.delete_password) {
            reply.text = '[deleted]';

            await board.save();

            res.send('success');
        } else {
            res.send('incorrect password');
        }
    } catch (error) {
        res.send(error.message);
    }
});

router.put('/:boardName/:threadId', async (req, res) => {
    const { thread_id ,reply_id} = req.body;
    const { boardName } = req.params;

    try {
        const board = await Board.findOne({ name: boardName });
        const thread =  board.threads.id(thread_id);
        const reply = thread.replies.id(reply_id)

        if (reply) {
            reply.reported = true;
            await board.save();
            res.send('success');
        } else {
            res.send('No reply found');
        }
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
