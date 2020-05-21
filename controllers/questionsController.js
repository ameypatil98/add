const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const questions = mongoose.model('questions');

router.get('/', (req, res) => {
    res.render("questions/create", {
        viewTitle: "Create Quiz"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
    insertRecord(req, res);
    else
    updateRecord(req, res);

});


function insertRecord(req, res) {
    var question1 = new questions();
    question1.question = req.body.question;
    question1.a = req.body.a;
    question1.b = req.body.b;
    question1.answer=req.body.answer;
   
    question1.save((err, doc) => {
        if (!err)
            res.redirect('questions/qlist');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("questions/create", {
                    viewTitle: "Create Quiz",
                    questions: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    questions.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('questions/qlist'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("questions/create", {
                    viewTitle: 'Update Question',
                    questions: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/qlist', (req, res) => {
    questions.find((err, docs) => {
        if (!err) {
            res.render("questions/qlist", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving question list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'question':
                body['questionError'] = err.errors[field].message;
                break;
            case 'a':
                body['aError'] = err.errors[field].message;
                break;
            case 'b':
                body['bError'] = err.errors[field].message;
                break;
            case 'answer':
                body['answerError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    questions.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("questions/create", {
                viewTitle: "Update Question",
                questions: doc
            });
        }
    });
});
router.get('/delete/:id', (req, res) => {
    questions.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/questions/qlist');
        }
        else { console.log('Error in question delete :' + err); }
    });
});

module.exports = router;