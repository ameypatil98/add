const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const users = mongoose.model('users');

router.get('/', (req, res) => {
    res.render("users/register", {
        viewTitle: "Register Here"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
    insertRecord(req, res);
    else
    updateRecord(req, res);

});


function insertRecord(req, res) {
    var user1 = new users();
    user1.firstname = req.body.firstname;
    user1.lastname = req.body.lastname;
    user1.email = req.body.email;
    user1.save((err, doc) => {
        if (!err)
            res.redirect('users/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("users/register", {
                    viewTitle: "Register Here",
                    users: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    users.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('users/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("users/register", {
                    viewTitle: 'Update User',
                    users: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    users.find((err, docs) => {
        if (!err) {
            res.render("users/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstname':
                body['firstnameError'] = err.errors[field].message;
                break;
            case 'lastname':
                body['lastnameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    users.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("users/register", {
                viewTitle: "Update User",
                users: doc
            });
        }
    });
});
router.get('/delete/:id', (req, res) => {
    users.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/users/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;