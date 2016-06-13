var START_URL = 'http://10.10.20.209:9006';
var LANG_ENG = 'en';
var LANG_FR = 'fr';
var ADD_USER = START_URL + '/api/adduser';
var ADD_HOBBY = START_URL + '/api/addhobby';
var GET_HOBBY = START_URL + '/api/getHobby/';
var GET_USER = START_URL + '/api/getUser';
var ADD_TO_CART = START_URL + '/api/addCart';
var UPDATE_USER = START_URL + '/api/updateUser';
var UPDATE_HOBBY = START_URL + '/api/updateHobby';
var GET_HISTORY = START_URL + '/api/getCartHistory/';
var USER_HOBBY = START_URL + '/api/getUserHobby';
var GET_SINGLE_USER = START_URL + '/api/getSingleUser/';
var GET_PHONE = START_URL + '/api/getPhone';
var GET_SERVICE = START_URL + '/api/getService/';
var GET_CART = START_URL + '/api/getCart/';
var ADD_TO_CHAT=START_URL+'/api/setChat';
var GET_TO_CHAT=START_URL+'/api/getChat/';
var PAY_PAL_URL = 'https://api.sandbox.paypal.com/v1/oauth2/token?client_id=AXR6P33TrKtjYsCjWaa5NJp8sPaEUv-VO0Gu-vO79j9fZcakstpSNSjMnbScY5ITjYeGw-fOSbdrxDcs&secret=EEjidf7Mya6ZI4esX0-WYgXChHlkGtUtlc1GPGCJILUYB_E3qHbYfbaccbOcW_dGkbRI188lgIMdBhAB&grant_type=client_credentials';
var PHONE_JSON_PATH = '/phone/phones.json';
var REMOVE_FROM_CART = START_URL + '/api/removeCart';
var REMOVE_HOBBY = START_URL + '/api/deleteHobby';
var EN_JSON_PATH = './i18n/en.json';
var FR_JSON_PATH = './i18n/fr.json';
var DELETE_CART = START_URL + '/api/deleteCart';
var CONFIG = {
        async: true,
        crossDomain: true,
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
        }
    },
    PAY_PAL_CONFIG = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.sandbox.paypal.com/v1/oauth2/token?client_id=AXR6P33TrKtjYsCjWaa5NJp8sPaEUv-VO0Gu-vO79j9fZcakstpSNSjMnbScY5ITjYeGw-fOSbdrxDcs&secret=EEjidf7Mya6ZI4esX0-WYgXChHlkGtUtlc1GPGCJILUYB_E3qHbYfbaccbOcW_dGkbRI188lgIMdBhAB&grant_type=client_credentials",
        "method": "POST",
        "headers": {
            "authorization": "Basic QVhSNlAzM1RyS3RqWXNDaldhYTVOSnA4c1BhRVV2LVZPMEd1LXZPNzlqOWZaY2Frc3RwU05Tak1uYlNjWTVJVGpZZUd3LWZPU2JkcnhEY3M6RUVqaWRmN015YTZaSTRlc1gwLVdZZ1hDaEhsa0d0VXRsYzFHUEdDSklMVVlCX0UzcUhiWWZiYWNjYk9jV19kR2tiUkkxODhsZ0lNZEJoQUI=",
            "cache-control": "no-cache",
            "postman-token": "e3cd2bc5-eb52-9546-88d1-18dfcf766f8b"
        }
    };