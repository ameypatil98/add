const mongoose = require('mongoose');

var questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: 'This field is required.'
    },
    a: {
        type: String,
        required: 'This field is required.'
    },
    b: {
        type: String,
        required: 'This field is required.'
    },
    answer: {
        type: String,
        required: 'This field is required.'
    }

});

mongoose.model('questions', questionsSchema);