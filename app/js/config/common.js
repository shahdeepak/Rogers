/**
 * @author Deepak shah
 * @since 18-03-2016
 * @ngdoc service
 * @name  rogersWeb.service:isLoggedIn
 */
rogersWeb.factory('isLoggedIn', function() {
    return {
        /**
         * @ngdoc method
         * @name rogersWeb.service:isLoggedIn#getMobileDetal
         * @methodOf rogersWeb.service:isLoggedIn
         * @description return logged in.
         */
        isLoggedIn: function(isLogged) {
            if (isLogged !== null) {
                return true;
            } else {
                return false;
            }
        }
    };
});