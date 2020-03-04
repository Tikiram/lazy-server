var express = require('express');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;

const localStorage = new LocalStorage('./settings');

function getEntryKeys(){
    const entries = [];
    for (var i = 0; i < localStorage.length; i++){
        entries.push(localStorage.key(i));
    }
    return entries;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	const keys = getEntryKeys();
	const vs = keys.map(k => {
    	const v = localStorage.getItem(k);
    	return { k, v };
    });
  	
  	res.send(vs);
});

module.exports = router;
