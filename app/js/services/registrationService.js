/*Created by Deepak.Shah on 18-03-2016. */
/**
 * @ngdoc  object
 * @name  rogersWeb.service:registrationService
 * @requires globalService
 * @description service for registration Service.
 */
rogersWeb.service('registrationService', function(backendFactory) {
    'use strict';
    return {
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#store user details into local storage
         * @methodOf rogersWeb.service:registrationService
         * @description Insert data into data base
         */
        saveRegistrationDetails: function(newUserDetail, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(ADD_USER, newUserDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#saveShippingDetails
         * @methodOf rogersWeb.service:registrationService
         * @description Insert data into data base
         */
        saveShippingDetails: function(shippingDetail, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(ADD_SHIPPING, shippingDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#updateShippingDetails
         * @methodOf rogersWeb.service:registrationService
         * @description Update data into data base
         */
        updateShippingDetails: function(shippingDetail, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(UPDATE_SHIPPING, shippingDetail, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#store user details into local storage
         * @methodOf rogersWeb.service:registrationService
         * @description Insert data into data base
         */
        getShippingDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SHIPPING + email).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#deleteCartDetail
         * @methodOf rogersWeb.service:registrationService
         * @description delete cart details
         */
        deleteCartDetail: function(email, successCallback, cacheUpdateService) {
            var promise = backendFactory.postHttpCall(REMOVE_CART, email, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#deleteCartDetail
         * @methodOf rogersWeb.service:registrationService
         * @description delete cart details
         */
        removeItem: function(id, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(REMOVE_ITEM, id, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#getLoginDetails
         * @methodOf rogersWeb.service:registrationService
         * @description get login details from data base
         */
        getLoginDetails: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_SINGLE_USER + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#addProductToCart
         * @methodOf rogersWeb.service:registrationService
         * @description add product/item into data base
         */
        addProductToCart: function(userDetail, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(ADD_CART, userDetail, CONFIG).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#updateProductToCart
         * @methodOf rogersWeb.service:registrationService
         * @description update product into database
         */
        updateProductToCart: function(id, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(UPDATE_CART, id, CONFIG).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#getProduct
         * @methodOf rogersWeb.service:registrationService
         * @description get Product list from data base
         */
        getProduct: function(successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(PHONE_JSON_PATH).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#addProduct
         * @methodOf rogersWeb.service:registrationService
         * @description inser Product list into data base
         */
        addProduct: function(productDetails, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(ADD_PRODUCT, productDetails, CONFIG).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#updateProduct
         * @methodOf rogersWeb.service:registrationService
         * @description update product into database
         */
        updateProduct: function(productDetails, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(UPDATE_PRODUCT, productDetails, CONFIG).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#removeProduct
         * @methodOf rogersWeb.service:registrationService
         * @description delete remove Product details
         */
        removeProduct: function(id, successCallback, errorCallback) {
            var promise = backendFactory.postHttpCall(REMOVE_ITEM, id, CONFIG).then(function(obj) {
                successCallback(obj);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#store user details into local storage
         * @methodOf rogersWeb.service:registrationService
         * @description get data from data base
         */
        getProductCount: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_CART + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
         /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#store user details into local storage
         * @methodOf rogersWeb.service:registrationService
         * @description Insert data into data base
         */
        getPurchase: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_PURCHASE+ email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        },
        /**
         * @ngdoc method
         * @name rogersWeb.service:registrationService#store user details into local storage
         * @methodOf rogersWeb.service:registrationService
         * @description get data from data base
         */
        getHistory: function(email, successCallback, errorCallback) {
            var promise = backendFactory.getHttpCall(GET_HISTORY + email).then(function(obj) {
                successCallback(obj.data);
            }, function(obj) {
                errorCallback(obj);
            });
        }
    };
});