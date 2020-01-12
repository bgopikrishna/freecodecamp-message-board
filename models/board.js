const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    text: String,
    created_on: {
        type: Date,
        default: Date.now
    },
    delete_password: {
        type: String
    },
    reported: {
        type: Boolean,
        default: false
    }
});

const threadSchema = new mongoose.Schema({
    text: {
        type: String
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    bumped_on: {
        type: Date,
        default: Date.now
    },
    reported: {
        type: Boolean,
        default: false
    },
    delete_password: {
        type: String
    },
    replies: {
        type: [replySchema],
        default:[]
    }
});

const boardSchema = new  mongoose.Schema({
    name: String,
    threads: [threadSchema]
})

const Board = new mongoose.model('message boards', boardSchema);


exports.Board = Board
