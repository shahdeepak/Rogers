/**
 * @author Deepak shah
 * @since 18-03-2016
 * @ngdoc service
 * @name  rogersWeb.service:homeService
 */
rogersWeb.factory('homeService', function(backendFactory) {
    return {
        /**
         * @ngdoc method
         * @name rogersWeb.service:homeService#getMobileDetal
         * @methodOf rogersWeb.service:homeService
         * @param {Function} successCallback  - Success
         * @param {Function} failureCallback    - Error
         * @description Gets all mobile data.
         */
        getMobileDetal: function(successCallback, failureCallback) {
            var urlRoot = PHONE_JSON_PATH;
            var promise = backendFactory.getHttpCall(urlRoot).then(function(obj) {
                var productList = new APP.Models.ProductList(obj.data);
                productList.setProducts(obj.data);
                successCallback(productList);
            }, function(obj) {});
        }
    };
});