/**
 * @type {string}
 */


//var START_URL = 'http://cf-techm-app.cfapps.io', 
    var START_URL = 'http://10.10.20.209:9005',
    ADD_USER = START_URL + '/api/adduser',
    LANG_ENG = 'en',
    LANG_FR = 'fr',
    ADD_SHIPPING = START_URL + '/api/addShippingAddress',
    GET_SHIPPING = START_URL + '/api/getShippingAddress/',
    GET_PURCHASE = START_URL + '/api/getPurchase/',
    UPDATE_SHIPPING = START_URL + '/api/updateShippingAddress',
    UPDATE_USER = START_URL + '/api/updateUser',
    ADD_CART = START_URL + '/api/addCart',
    REMOVE_CART = START_URL + '/api/removeCart',
    GET_CART = START_URL + '/api/getCart/',
    GET_HISTORY = START_URL + '/api/getHistory/',
    UPDATE_CART = START_URL + '/api/updateCart',
    GET_SINGLE_USER = START_URL + '/api/getSingleUser/',
    GET_PHONE = START_URL + '/api/getPhone',
    EN_JSON_PATH = './i18n/en.json',
    FR_JSON_PATH = './i18n/fr.json',
    REMOVE_ITEM = START_URL + '/api/removeProduct',
    PHONE_JSON_PATH = START_URL + '/api/getProduct/',
    ADD_PRODUCT = START_URL + '/api/addProduct',
    UPDATE_PRODUCT = START_URL + '/api/updateProduct'
    CONFIG = {
        header: {
            "Content-Type": "application/json;"
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