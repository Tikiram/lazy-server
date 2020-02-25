var express = require('express');
var axios  = require('axios');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;

const settingsStorage = new LocalStorage("./settings");
function getBaseUrl() {
    const BASE_URL_KEY = 'baseUrl';
    // const DEFAULT_URL = 'https://jsonplaceholder.typicode.com';
    const DEFAULT_URL = 'http://localhost:3000';
    const url = settingsStorage.getItem(BASE_URL_KEY);
    if (url === null) {
        settingsStorage.setItem(BASE_URL_KEY, DEFAULT_URL);
    }
    return url || DEFAULT_URL;
}
function getIsCacheOn() {
    const IS_CACHE_ON_KEY = 'isCacheOn';
    const IS_CACHE_ON_DEFAULT_VALUE = true;
    const isCacheOnText = settingsStorage.getItem(IS_CACHE_ON_KEY);
    if (isCacheOnText !== null) {
        return JSON.parse(isCacheOnText);
    }
    settingsStorage.setItem(IS_CACHE_ON_KEY, IS_CACHE_ON_DEFAULT_VALUE);
    return IS_CACHE_ON_DEFAULT_VALUE;
}



const localStorage = new LocalStorage('./storage/something');


router.get('/', function( { originalUrl } , res, next) {

    const isCacheOn = getIsCacheOn();
    const storedValue = localStorage.getItem(originalUrl);

    if (isCacheOn && storedValue) {
        console.log(`Cache value used: ${originalUrl}` );
        res.send(storedValue);
        return;
    }

    const baseUrl = getBaseUrl();

    (async () => {
        try {
            const { data } = await axios.get(`${baseUrl}${originalUrl}`, {transformResponse: data => data});

            if (isCacheOn) {
                console.log(`Cache-on: ${isCacheOn}, Saved: ${originalUrl}`);
                localStorage.setItem(originalUrl, data);
                res.send(data);
            }
            else {
                console.log(`Cache-on: ${isCacheOn}, Served: ${originalUrl}`);
                res.send(data);
            }
        }
        catch (e) {
            console.log(e);
            console.error('Error:', e.response.config.url);
            console.error('Status:', e.response.status);
            console.error('StatusText:', e.response.statusText);
            console.error('Data:'),
            console.log("\x1b[33m", e.response.data);
            res.status(500).send(originalUrl + " " + "bad request");
        }
    })();
});

router.post('/', function( { body, originalUrl } , res, next) {


    const isCacheOn = getIsCacheOn();
    const storedValue = localStorage.getItem(originalUrl);

    if (isCacheOn && storedValue) {
        console.log(`Cache value used: ${originalUrl}` );
        res.send(storedValue);
        return;
    }

    const baseUrl = getBaseUrl();

    (async () => {
        try {
            const { data } = await axios.post(`${baseUrl}${originalUrl}`, body, {transformResponse: data => data});

            if (isCacheOn) {
                console.log(`Cache-on: ${isCacheOn}, Saved: ${originalUrl}`);
                localStorage.setItem(originalUrl, data);
                res.send(data);
            }
            else {
                console.log(`Cache-on: ${isCacheOn}, Served: ${originalUrl}`);
                res.send(data);
            }
        }
        catch (e) {
            console.log(e);
            console.error('Error:', e.response.config.url);
            console.error('Status:', e.response.status);
            console.error('StatusText:', e.response.statusText);
            console.error('Data:'),
            console.log("\x1b[33m", e.response.data);
            res.status(500).send(originalUrl + " " + "bad request");
        }
    })();
});

module.exports = router;
