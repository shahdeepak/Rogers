/**
 * @author Deepak shah
 * @since 18-03-2016
 * @ngdoc factory
 * @name  rogersWeb.service:randomString
 * @requires $window
 * @description This factory is used to generate random alphanumeric number, default 8 char
 * @description You can also provide length to generate random alphanumeric number. EX. 32 
 */
rogersWeb.factory("randomString", function($window) {
    'use strict';
    return {
        randomString: function(length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var Math = $window.Math;
            length = length || 8;
            var string = '',
                rnd;
            while (length > 0) {
                rnd = Math.floor(Math.random() * chars.length);
                string += chars.charAt(rnd);
                length--;
            }
            return string;
        }
    };
});
rogersWeb.factory("encryption", function() {
    'use strict';
    return {
        toEncodeString: function(password) {
            var ostr = password.toString().replace(/\s+/g, '');
            var x, nstr = '',
                len = ostr.length;
            for (x = 0; x < len; ++x) {
                nstr += (255 - ostr.charCodeAt(x)).toString(36).toUpperCase();
            };
            return nstr;
        },
        fromEncodedString: function(password) {
            var ostr = password.toString();
            var x, nstr = '',
                len = ostr.length;
            for (x = 0; x < len; x += 2) {
                nstr += String.fromCharCode(255 - parseInt(ostr.substr(x, 2), 36));
            };
            return nstr;
        }
    };
});