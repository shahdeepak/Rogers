/**
 * @type {string}
 */


//var START_URL = 'http://cf-techm-app.cfapps.io', 
    var START_URL = 'http://10.10.22.125:9905',
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
    SEND_EMAIL = START_URL + '/api/sendEmail',
    GET_CART = START_URL + '/api/getCart/',
    GET_PURCHASE_REF = START_URL + '/api/getPurchaseData/',
    //GET_PURCHASE_DETAIL = START_URL + '/api/getPurchaseData/',
    GET_HISTORY = START_URL + '/api/getHistory/',
    UPDATE_CART = START_URL + '/api/updateCart',
    GET_SINGLE_USER = START_URL + '/api/getSingleUser/',
    GET_PHONE = START_URL + '/api/getPhone',
    EN_JSON_PATH = START_URL+'/api/getI18eng',
    FR_JSON_PATH = START_URL+'/api/getI18fr',
    REMOVE_ITEM = START_URL + '/api/removeProduct',
    GET_PRODUCTS = START_URL + '/api/getProduct/',
    ADD_PRODUCT = START_URL + '/api/addProduct',
    UPDATE_FR = START_URL + '/api/updateI18fr',
    ADD_FR = START_URL + '/api/setI18fr',
    DELETE_FR = START_URL + '/api/deleteI18fr',
    UPDATE_EN = START_URL + '/api/updateI18eng',
    ADD_EN = START_URL + '/api/setI18eng',
    DELETE_EN = START_URL + '/api/deleteI18eng',
    UPDATE_PRODUCT = START_URL + '/api/updateProduct',
    REMOVE_SINGLE_CART = START_URL + '/api/removeSingleCart'
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