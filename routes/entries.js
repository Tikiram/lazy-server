var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./scratch');

function getEntryKeys(){
    const entries = [];
    for (var i = 0; i < localStorage.length; i++){
        entries.push(localStorage.key(i));
    }
    return entries;
}

router.get('/', function(req, res, next) {
    const keys = getEntryKeys();
    res.send({keys});
});

module.exports = router;
